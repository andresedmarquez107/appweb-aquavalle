from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta, timezone, date
from database import get_db
from auth import verify_password, get_password_hash, create_access_token, get_current_admin
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/admin", tags=["admin"])

# Models
class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin_email: str

class ReservationUpdate(BaseModel):
    status: Optional[str] = None
    check_in_date: Optional[str] = None
    check_out_date: Optional[str] = None
    num_guests: Optional[int] = None
    notes: Optional[str] = None
    # Client data updates
    client_name: Optional[str] = None
    client_phone: Optional[str] = None

class DashboardStats(BaseModel):
    total_reservations: int
    pending_reservations: int
    confirmed_reservations: int
    cancelled_reservations: int
    total_revenue: float
    fullday_bookings: int
    hospedaje_bookings: int
    upcoming_checkins: int
    # Monthly breakdown
    month_label: Optional[str] = None

# Availability Block Models
class BlockCreate(BaseModel):
    room_id: Optional[str] = None  # None = all rooms
    start_date: str
    end_date: str
    block_type: str  # maintenance, private_event, other
    reason: Optional[str] = None
    blocks_fullday: bool = False  # Also block Full Day service

class BlockResponse(BaseModel):
    id: str
    room_id: Optional[str]
    room_name: Optional[str]
    start_date: str
    end_date: str
    block_type: str
    reason: Optional[str]
    blocks_fullday: bool
    created_at: str


# Endpoints
@router.post("/login", response_model=AdminLoginResponse)
async def admin_login(credentials: AdminLogin):
    """Login for admin users"""
    db = get_db()
    
    if not db:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database not configured"
        )
    
    try:
        # Find admin by email
        result = db.table('admin_users').select('*').eq('email', credentials.email).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas"
            )
        
        admin = result.data[0]
        
        # Verify password
        if not verify_password(credentials.password, admin['password_hash']):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas"
            )
        
        # Create access token
        access_token = create_access_token(
            data={"sub": admin['email'], "admin_id": admin['id']}
        )
        
        return AdminLoginResponse(
            access_token=access_token,
            admin_email=admin['email']
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error en el servidor"
        )

@router.get("/me")
async def get_current_admin_info(admin: dict = Depends(get_current_admin)):
    """Get current admin info"""
    return admin

@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    month: Optional[int] = Query(None, ge=1, le=12),
    year: Optional[int] = Query(None, ge=2020, le=2100),
    admin: dict = Depends(get_current_admin)
):
    """Get dashboard statistics, optionally filtered by month/year"""
    db = get_db()
    
    try:
        # Get all reservations
        reservations = db.table('reservations').select('*').execute()
        all_res = reservations.data
        
        # Filter by month/year if provided
        month_label = None
        if month and year:
            month_names = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
            month_label = f"{month_names[month]} {year}"
            
            filtered_res = []
            for r in all_res:
                if r['check_in_date']:
                    res_date = datetime.fromisoformat(r['check_in_date']).date()
                    if res_date.month == month and res_date.year == year:
                        filtered_res.append(r)
            all_res = filtered_res
        
        # Calculate stats
        total = len(all_res)
        pending = len([r for r in all_res if r['status'] == 'pending'])
        confirmed = len([r for r in all_res if r['status'] == 'confirmed'])
        cancelled = len([r for r in all_res if r['status'] == 'cancelled'])
        
        # Only count revenue from confirmed and completed reservations
        total_revenue = sum(
            float(r['total_price'] or 0) 
            for r in all_res 
            if r['status'] in ['confirmed', 'completed']
        )
        
        fullday = len([r for r in all_res if r['reservation_type'] == 'fullday'])
        hospedaje = len([r for r in all_res if r['reservation_type'] == 'hospedaje'])
        
        # Upcoming check-ins (next 7 days)
        today = datetime.now(timezone.utc).date()
        week_later = today + timedelta(days=7)
        upcoming = len([r for r in all_res 
                       if r['status'] in ['pending', 'confirmed'] 
                       and r['check_in_date'] 
                       and today <= datetime.fromisoformat(r['check_in_date']).date() <= week_later])
        
        return DashboardStats(
            total_reservations=total,
            pending_reservations=pending,
            confirmed_reservations=confirmed,
            cancelled_reservations=cancelled,
            total_revenue=total_revenue,
            fullday_bookings=fullday,
            hospedaje_bookings=hospedaje,
            upcoming_checkins=upcoming,
            month_label=month_label
        )
        
    except Exception as e:
        logger.error(f"Error getting stats: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error obteniendo estadísticas"
        )

@router.get("/reservations")
async def get_all_reservations(
    status_filter: Optional[str] = None,
    reservation_type: Optional[str] = None,
    month: Optional[int] = Query(None, ge=1, le=12),
    year: Optional[int] = Query(None, ge=2020, le=2100),
    admin: dict = Depends(get_current_admin)
):
    """Get all reservations with optional filters"""
    db = get_db()
    
    try:
        query = db.table('reservations').select(
            '*, clients(*), reservation_rooms(rooms(*))'
        ).order('created_at', desc=True)
        
        if status_filter:
            query = query.eq('status', status_filter)
        
        if reservation_type:
            query = query.eq('reservation_type', reservation_type)
        
        result = query.execute()
        
        # Format response
        reservations = []
        for data in result.data:
            # Filter by month/year if provided
            if month and year and data['check_in_date']:
                res_date = datetime.fromisoformat(data['check_in_date']).date()
                if res_date.month != month or res_date.year != year:
                    continue
            
            room_names = []
            if 'reservation_rooms' in data and data['reservation_rooms']:
                room_names = [rr['rooms']['name'] for rr in data['reservation_rooms'] if rr.get('rooms')]
            
            reservations.append({
                "id": data['id'],
                "reservation_type": data['reservation_type'],
                "check_in_date": data['check_in_date'],
                "check_out_date": data['check_out_date'],
                "num_guests": data['num_guests'],
                "total_price": data['total_price'],
                "status": data['status'],
                "notes": data.get('notes'),
                "client": {
                    "id": data['clients']['id'] if data.get('clients') else None,
                    "name": data['clients']['full_name'] if data.get('clients') else 'N/A',
                    "phone": data['clients']['phone'] if data.get('clients') else 'N/A',
                    "email": data['clients'].get('email') if data.get('clients') else None,
                    "document": data['clients'].get('id_document') if data.get('clients') else 'N/A'
                },
                "rooms": room_names,
                "created_at": data['created_at']
            })
        
        return reservations
        
    except Exception as e:
        logger.error(f"Error getting reservations: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error obteniendo reservaciones"
        )

@router.put("/reservations/{reservation_id}")
async def update_reservation(
    reservation_id: str,
    update_data: ReservationUpdate,
    admin: dict = Depends(get_current_admin)
):
    """Update a reservation and optionally client data"""
    db = get_db()
    
    try:
        # First, get the reservation to find client_id and type
        reservation = db.table('reservations').select('*, clients(*)').eq('id', reservation_id).execute()
        
        if not reservation.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Reservación no encontrada"
            )
        
        res_data = reservation.data[0]
        client_id = res_data.get('client_id')
        reservation_type = res_data.get('reservation_type')
        
        # Build update dict for reservation
        update_dict = {}
        if update_data.status is not None:
            update_dict['status'] = update_data.status
        if update_data.check_in_date is not None:
            update_dict['check_in_date'] = update_data.check_in_date
        if update_data.check_out_date is not None:
            update_dict['check_out_date'] = update_data.check_out_date
        if update_data.notes is not None:
            update_dict['notes'] = update_data.notes
        
        # Only allow changing num_guests for fullday reservations
        if update_data.num_guests is not None and reservation_type == 'fullday':
            update_dict['num_guests'] = update_data.num_guests
            # Recalculate total price for fullday (€5 per person)
            from config import settings
            update_dict['total_price'] = update_data.num_guests * settings.FULLDAY_PRICE
        
        # Update reservation if there are changes
        if update_dict:
            update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
            result = db.table('reservations').update(update_dict).eq('id', reservation_id).execute()
            logger.info(f"Reservation update result: {result.data}")
        
        # Update client data if provided
        client_update = {}
        if update_data.client_name is not None:
            client_update['full_name'] = update_data.client_name
        if update_data.client_phone is not None:
            client_update['phone'] = update_data.client_phone
        
        if client_update and client_id:
            client_update['updated_at'] = datetime.now(timezone.utc).isoformat()
            client_result = db.table('clients').update(client_update).eq('id', client_id).execute()
            logger.info(f"Client update result: {client_result.data}")
        
        return {"message": "Reservación actualizada", "success": True}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating reservation: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error actualizando reservación: {str(e)}"
        )

@router.delete("/reservations/{reservation_id}")
async def cancel_reservation(
    reservation_id: str,
    admin: dict = Depends(get_current_admin)
):
    """Cancel (soft delete) a reservation"""
    db = get_db()
    
    try:
        result = db.table('reservations').update({
            'status': 'cancelled',
            'updated_at': datetime.now(timezone.utc).isoformat()
        }).eq('id', reservation_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Reservación no encontrada"
            )
        
        return {"message": "Reservación cancelada", "data": result.data[0]}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error cancelling reservation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error cancelando reservación"
        )


# =====================================================
# AVAILABILITY BLOCKS ENDPOINTS
# =====================================================

@router.get("/blocks")
async def get_all_blocks(admin: dict = Depends(get_current_admin)):
    """Get all availability blocks"""
    db = get_db()
    
    try:
        result = db.table('availability_blocks').select(
            '*, rooms(name)'
        ).order('start_date', desc=False).execute()
        
        blocks = []
        for block in result.data:
            blocks.append({
                "id": block['id'],
                "room_id": block.get('room_id'),
                "room_name": block['rooms']['name'] if block.get('rooms') else "Todas las habitaciones",
                "start_date": block['start_date'],
                "end_date": block['end_date'],
                "block_type": block['block_type'],
                "reason": block.get('reason'),
                "blocks_fullday": block.get('blocks_fullday', False),
                "created_at": block['created_at']
            })
        
        return blocks
        
    except Exception as e:
        logger.error(f"Error getting blocks: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error obteniendo bloqueos"
        )


@router.post("/blocks")
async def create_block(
    block_data: BlockCreate,
    admin: dict = Depends(get_current_admin)
):
    """Create a new availability block"""
    db = get_db()
    
    try:
        # Validate dates
        start = datetime.strptime(block_data.start_date, '%Y-%m-%d').date()
        end = datetime.strptime(block_data.end_date, '%Y-%m-%d').date()
        
        if end < start:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La fecha de fin debe ser igual o posterior a la fecha de inicio"
            )
        
        # Create block
        block_insert = {
            'room_id': block_data.room_id if block_data.room_id else None,
            'start_date': block_data.start_date,
            'end_date': block_data.end_date,
            'block_type': block_data.block_type,
            'reason': block_data.reason,
            'created_by': admin.get('admin_id')
        }
        
        result = db.table('availability_blocks').insert(block_insert).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error creando bloqueo"
            )
        
        return {"message": "Bloqueo creado exitosamente", "data": result.data[0]}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating block: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creando bloqueo: {str(e)}"
        )


@router.delete("/blocks/{block_id}")
async def delete_block(
    block_id: str,
    admin: dict = Depends(get_current_admin)
):
    """Delete an availability block"""
    db = get_db()
    
    try:
        result = db.table('availability_blocks').delete().eq('id', block_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Bloqueo no encontrado"
            )
        
        return {"message": "Bloqueo eliminado exitosamente"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting block: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error eliminando bloqueo"
        )

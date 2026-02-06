from typing import List, Optional
from datetime import date, datetime
from models import (
    ReservationCreate, Reservation, ReservationResponse,
    ReservationType, ReservationStatus, Client, Room
)
from database import get_db
from config import settings
import logging

logger = logging.getLogger(__name__)

class ReservationService:
    @staticmethod
    async def create_reservation(reservation_data: ReservationCreate) -> ReservationResponse:
        """Create a new reservation"""
        db = get_db()
        
        if not db:
            raise Exception('Database not configured')
        
        try:
            # 1. Check availability
            if reservation_data.reservation_type == ReservationType.FULLDAY:
                available = await ReservationService.check_fullday_availability(
                    reservation_data.check_in_date,
                    reservation_data.num_guests
                )
                if not available:
                    raise Exception('Full day capacity exceeded for this date')
            else:
                for room_id in reservation_data.room_ids:
                    available = await ReservationService.check_room_availability(
                        room_id,
                        reservation_data.check_in_date,
                        reservation_data.check_out_date
                    )
                    if not available:
                        raise Exception(f'Room not available for selected dates')
            
            # 2. Get or create client
            client_data = {
                'full_name': reservation_data.client_name,
                'id_document': reservation_data.client_document,
                'email': reservation_data.client_email,
                'phone': reservation_data.client_phone
            }
            
            # Check if client exists with this document
            existing_client = db.table('clients').select('*').eq('id_document', reservation_data.client_document).execute()
            
            if existing_client.data:
                existing = existing_client.data[0]
                # Normalize names for comparison (lowercase, strip extra spaces)
                existing_name = ' '.join(existing['full_name'].lower().split())
                new_name = ' '.join(reservation_data.client_name.lower().split())
                
                # If document exists but name is different, reject
                if existing_name != new_name:
                    raise Exception(f'El documento {reservation_data.client_document} ya está registrado con otro nombre ({existing["full_name"]}). Si eres el mismo cliente, usa el nombre registrado.')
                
                client_id = existing['id']
                # Update client info (email and phone can be updated)
                db.table('clients').update({
                    'email': reservation_data.client_email,
                    'phone': reservation_data.client_phone
                }).eq('id', client_id).execute()
            else:
                # Create new client
                new_client = db.table('clients').insert(client_data).execute()
                client_id = new_client.data[0]['id']
            
            # 3. Calculate total price
            total_price = 0
            if reservation_data.reservation_type == ReservationType.FULLDAY:
                total_price = reservation_data.num_guests * settings.FULLDAY_PRICE
            else:
                # Get room prices
                rooms_response = db.table('rooms').select('price_per_night').in_('id', reservation_data.room_ids).execute()
                room_prices = sum(room['price_per_night'] for room in rooms_response.data)
                
                # Calculate nights
                nights = (reservation_data.check_out_date - reservation_data.check_in_date).days
                total_price = room_prices * nights
            
            # 4. Create reservation
            reservation_insert = {
                'client_id': client_id,
                'reservation_type': reservation_data.reservation_type.value,
                'check_in_date': reservation_data.check_in_date.isoformat(),
                'check_out_date': reservation_data.check_out_date.isoformat() if reservation_data.check_out_date else None,
                'num_guests': reservation_data.num_guests,
                'total_price': total_price,
                'status': ReservationStatus.PENDING.value,
                'notes': reservation_data.notes,
                'whatsapp_confirmation_sent': False,
                'email_confirmation_sent': False
            }
            
            new_reservation = db.table('reservations').insert(reservation_insert).execute()
            reservation_id = new_reservation.data[0]['id']
            
            # 5. Link rooms for hospedaje
            if reservation_data.reservation_type == ReservationType.HOSPEDAJE:
                room_links = [
                    {'reservation_id': reservation_id, 'room_id': room_id}
                    for room_id in reservation_data.room_ids
                ]
                db.table('reservation_rooms').insert(room_links).execute()
            
            # 6. Get complete reservation data
            reservation = await ReservationService.get_reservation(reservation_id)
            
            return reservation
            
        except Exception as e:
            logger.error(f'Error creating reservation: {str(e)}')
            raise
    
    @staticmethod
    async def get_reservation(reservation_id: str) -> ReservationResponse:
        """Get reservation by ID"""
        db = get_db()
        
        # Get reservation with client data
        reservation = db.table('reservations').select(
            '*, clients(*), reservation_rooms(rooms(*))'
        ).eq('id', reservation_id).single().execute()
        
        data = reservation.data
        
        # Extract room names
        room_names = []
        if 'reservation_rooms' in data and data['reservation_rooms']:
            room_names = [rr['rooms']['name'] for rr in data['reservation_rooms'] if 'rooms' in rr]
        
        return ReservationResponse(
            id=data['id'],
            reservation_type=data['reservation_type'],
            check_in_date=datetime.fromisoformat(data['check_in_date']).date(),
            check_out_date=datetime.fromisoformat(data['check_out_date']).date() if data['check_out_date'] else None,
            num_guests=data['num_guests'],
            total_price=data['total_price'],
            status=data['status'],
            client_name=data['clients']['full_name'],
            client_phone=data['clients']['phone'],
            client_email=data['clients'].get('email'),
            rooms=room_names,
            created_at=datetime.fromisoformat(data['created_at'])
        )
    
    @staticmethod
    async def get_reservations(skip: int = 0, limit: int = 100) -> List[ReservationResponse]:
        """Get all reservations"""
        db = get_db()
        
        response = db.table('reservations').select(
            '*, clients(*), reservation_rooms(rooms(*))'
        ).order('created_at', desc=True).range(skip, skip + limit - 1).execute()
        
        reservations = []
        for data in response.data:
            room_names = []
            if 'reservation_rooms' in data and data['reservation_rooms']:
                room_names = [rr['rooms']['name'] for rr in data['reservation_rooms'] if 'rooms' in rr]
            
            reservations.append(ReservationResponse(
                id=data['id'],
                reservation_type=data['reservation_type'],
                check_in_date=datetime.fromisoformat(data['check_in_date']).date(),
                check_out_date=datetime.fromisoformat(data['check_out_date']).date() if data['check_out_date'] else None,
                num_guests=data['num_guests'],
                total_price=data['total_price'],
                status=data['status'],
                client_name=data['clients']['full_name'],
                client_phone=data['clients']['phone'],
                client_email=data['clients'].get('email'),
                rooms=room_names,
                created_at=datetime.fromisoformat(data['created_at'])
            ))
        
        return reservations
    
    @staticmethod
    async def check_fullday_availability(date: date, num_guests: int) -> bool:
        """Check if full day has capacity for num_guests on given date"""
        db = get_db()
        
        # Get current bookings for the date
        response = db.table('reservations').select('num_guests').eq(
            'reservation_type', 'fullday'
        ).eq('check_in_date', date.isoformat()).in_(
            'status', ['confirmed', 'pending']
        ).execute()
        
        current_capacity = sum(r['num_guests'] for r in response.data)
        
        return (current_capacity + num_guests) <= settings.MAX_FULLDAY_CAPACITY
    
    @staticmethod
    async def check_room_availability(room_id: str, check_in: date, check_out: date) -> bool:
        """Check if room is available for given date range"""
        db = get_db()
        
        # First, check for availability blocks
        blocks_response = db.table('availability_blocks').select('*').execute()
        
        for block in blocks_response.data:
            # Check if block applies to this room (room_id is null = applies to all rooms)
            if block['room_id'] is not None and block['room_id'] != room_id:
                continue
            
            block_start = datetime.fromisoformat(block['start_date']).date() if isinstance(block['start_date'], str) else block['start_date']
            block_end = datetime.fromisoformat(block['end_date']).date() if isinstance(block['end_date'], str) else block['end_date']
            
            # Check for overlap with block
            no_overlap = (check_in > block_end) or (check_out <= block_start)
            
            if not no_overlap:
                logger.info(f"❌ Room blocked from {block_start} to {block_end} ({block['block_type']})")
                return False
        
        # Check for overlapping reservations
        response = db.table('reservation_rooms').select(
            'reservations!inner(check_in_date, check_out_date, status)'
        ).eq('room_id', room_id).execute()
        
        logger.info(f"Checking availability for room {room_id} from {check_in} to {check_out}")
        logger.info(f"Found {len(response.data)} reservation records")
        
        for rr in response.data:
            res = rr['reservations']
            if res['status'] not in ['confirmed', 'pending']:
                continue
            
            res_check_in = datetime.fromisoformat(res['check_in_date']).date()
            res_check_out = datetime.fromisoformat(res['check_out_date']).date() if res['check_out_date'] else res_check_in
            
            logger.info(f"Existing reservation: {res_check_in} to {res_check_out} (status: {res['status']})")
            logger.info(f"Checking overlap: new range {check_in} to {check_out}")
            
            # Check for overlap
            # No overlap if one of these is true:
            # 1. New check-in is on or after existing check-out (same day checkout/checkin allowed)
            # 2. New check-out is on or before existing check-in
            no_overlap = (check_in >= res_check_out) or (check_out <= res_check_in)
            
            logger.info(f"  - check_in >= res_check_out: {check_in} >= {res_check_out} = {check_in >= res_check_out}")
            logger.info(f"  - check_out <= res_check_in: {check_out} <= {res_check_in} = {check_out <= res_check_in}")
            logger.info(f"  - No overlap: {no_overlap}")
            
            if not no_overlap:
                logger.info(f"❌ Overlap detected! Room not available.")
                return False
        
        logger.info(f"Room is available!")
        return True


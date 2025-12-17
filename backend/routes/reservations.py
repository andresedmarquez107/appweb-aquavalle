from fastapi import APIRouter, HTTPException, status
from typing import List
from models import ReservationCreate, ReservationResponse, AvailabilityCheck, AvailabilityResponse
from services.reservation_service import ReservationService
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/reservations", tags=["reservations"])

@router.post("/", response_model=ReservationResponse, status_code=status.HTTP_201_CREATED)
async def create_reservation(reservation: ReservationCreate):
    """Create a new reservation"""
    try:
        return await ReservationService.create_reservation(reservation)
    except Exception as e:
        logger.error(f"Error creating reservation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/", response_model=List[ReservationResponse])
async def get_reservations(skip: int = 0, limit: int = 100):
    """Get all reservations"""
    try:
        return await ReservationService.get_reservations(skip, limit)
    except Exception as e:
        logger.error(f"Error getting reservations: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching reservations"
        )

@router.get("/{reservation_id}", response_model=ReservationResponse)
async def get_reservation(reservation_id: str):
    """Get reservation by ID"""
    try:
        return await ReservationService.get_reservation(reservation_id)
    except Exception as e:
        logger.error(f"Error getting reservation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reservation not found"
        )

@router.post("/check-availability", response_model=AvailabilityResponse)
async def check_availability(check: AvailabilityCheck):
    """Check availability for a date/room"""
    try:
        if check.reservation_type.value == 'fullday':
            available = await ReservationService.check_fullday_availability(
                check.date, check.num_guests
            )
            
            if available:
                # Get current capacity
                from database import get_db
                from config import settings
                db = get_db()
                response = db.table('reservations').select('num_guests').eq(
                    'reservation_type', 'fullday'
                ).eq('check_in_date', check.date.isoformat()).in_(
                    'status', ['confirmed', 'pending']
                ).execute()
                
                current_capacity = sum(r['num_guests'] for r in response.data)
                available_capacity = settings.MAX_FULLDAY_CAPACITY - current_capacity
                
                return AvailabilityResponse(
                    available=True,
                    message=f"Available! {available_capacity} spots remaining",
                    available_capacity=available_capacity
                )
            else:
                return AvailabilityResponse(
                    available=False,
                    message="Full day capacity exceeded for this date",
                    available_capacity=0
                )
        else:
            # Check room availability
            available_rooms = []
            for room_id in check.room_ids:
                is_available = await ReservationService.check_room_availability(
                    room_id, check.date, check.date
                )
                if is_available:
                    available_rooms.append(room_id)
            
            if available_rooms:
                return AvailabilityResponse(
                    available=True,
                    message="Rooms available",
                    available_rooms=available_rooms
                )
            else:
                return AvailabilityResponse(
                    available=False,
                    message="No rooms available for selected dates",
                    available_rooms=[]
                )
    except Exception as e:
        logger.error(f"Error checking availability: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error checking availability"
        )

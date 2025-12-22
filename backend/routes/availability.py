from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional
from datetime import date, timedelta, datetime
from models import Room
from services.room_service import RoomService
from services.reservation_service import ReservationService
from database import get_db
from config import settings
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/availability", tags=["availability"])

@router.get("/rooms/{room_id}")
async def get_room_availability(
    room_id: str,
    start_date: date = Query(...),
    end_date: date = Query(...)
):
    """Get available dates for a specific room"""
    try:
        # Get room to verify it exists
        room = await RoomService.get_room(room_id)
        
        available_dates = []
        unavailable_dates = []
        
        # Check each date in range
        current_date = start_date
        while current_date <= end_date:
            next_date = current_date + timedelta(days=1)
            is_available = await ReservationService.check_room_availability(
                room_id, current_date, next_date
            )
            
            if is_available:
                available_dates.append(current_date.isoformat())
            else:
                unavailable_dates.append(current_date.isoformat())
            
            current_date = next_date
        
        return {
            "room_id": room_id,
            "room_name": room.name,
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "available_dates": available_dates,
            "unavailable_dates": unavailable_dates
        }
    except Exception as e:
        logger.error(f"Error checking availability: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/rooms")
async def get_all_rooms_availability(
    start_date: date = Query(...),
    end_date: date = Query(...)
):
    """Get availability for all rooms in date range"""
    try:
        rooms = await RoomService.get_rooms()
        
        result = []
        for room in rooms:
            available_dates = []
            current_date = start_date
            
            while current_date <= end_date:
                next_date = current_date + timedelta(days=1)
                is_available = await ReservationService.check_room_availability(
                    room.id, current_date, next_date
                )
                
                if is_available:
                    available_dates.append(current_date.isoformat())
                
                current_date = next_date
            
            result.append({
                "room_id": room.id,
                "room_name": room.name,
                "available_dates": available_dates
            })
        
        return result
    except Exception as e:
        logger.error(f"Error checking availability: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/fullday")
async def get_fullday_availability(
    start_date: date = Query(...),
    end_date: date = Query(...),
    num_guests: int = Query(..., ge=1, le=20)
):
    """Get available dates for Full Day based on requested number of guests"""
    db = get_db()
    
    try:
        available_dates = []
        unavailable_dates = []
        
        # Get all fullday reservations in the date range
        reservations = db.table('reservations').select('*').eq(
            'reservation_type', 'fullday'
        ).in_('status', ['pending', 'confirmed']).execute()
        
        # Get all blocks
        blocks = db.table('availability_blocks').select('*').execute()
        
        # Build a map of date -> total guests booked
        guests_per_date = {}
        for res in reservations.data:
            res_date = res['check_in_date']
            if res_date not in guests_per_date:
                guests_per_date[res_date] = 0
            guests_per_date[res_date] += res['num_guests'] or 0
        
        # Build a set of blocked dates for fullday
        blocked_dates = set()
        for block in blocks.data:
            # Consider blocks that explicitly block fullday OR blocks for all rooms (room_id is null)
            blocks_fullday = block.get('blocks_fullday', False)
            is_all_rooms = block['room_id'] is None
            
            # Block fullday if: blocks_fullday is True OR it's a block for all rooms
            if not blocks_fullday and not is_all_rooms:
                continue
                
            block_start = datetime.fromisoformat(block['start_date']).date() if isinstance(block['start_date'], str) else block['start_date']
            block_end = datetime.fromisoformat(block['end_date']).date() if isinstance(block['end_date'], str) else block['end_date']
            current = block_start
            while current <= block_end:
                blocked_dates.add(current.isoformat())
                current += timedelta(days=1)
        
        # Check each date
        current_date = start_date
        while current_date <= end_date:
            date_str = current_date.isoformat()
            
            # Check if date is blocked
            if date_str in blocked_dates:
                unavailable_dates.append(date_str)
            else:
                # Check capacity
                current_guests = guests_per_date.get(date_str, 0)
                remaining_capacity = settings.MAX_FULLDAY_CAPACITY - current_guests
                
                if remaining_capacity >= num_guests:
                    available_dates.append(date_str)
                else:
                    unavailable_dates.append(date_str)
            
            current_date += timedelta(days=1)
        
        return {
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "num_guests": num_guests,
            "max_capacity": settings.MAX_FULLDAY_CAPACITY,
            "available_dates": available_dates,
            "unavailable_dates": unavailable_dates
        }
        
    except Exception as e:
        logger.error(f"Error checking fullday availability: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


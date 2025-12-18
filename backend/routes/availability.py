from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional
from datetime import date, timedelta
from models import Room
from services.room_service import RoomService
from services.reservation_service import ReservationService
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

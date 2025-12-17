from fastapi import APIRouter, HTTPException, status
from typing import List
from models import Room
from services.room_service import RoomService
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/rooms", tags=["rooms"])

@router.get("/", response_model=List[Room])
async def get_rooms():
    """Get all active rooms"""
    try:
        return await RoomService.get_rooms()
    except Exception as e:
        logger.error(f"Error getting rooms: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching rooms"
        )

@router.get("/{room_id}", response_model=Room)
async def get_room(room_id: str):
    """Get room by ID"""
    try:
        return await RoomService.get_room(room_id)
    except Exception as e:
        logger.error(f"Error getting room: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Room not found"
        )

from typing import List
from models import Room
from database import get_db
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class RoomService:
    @staticmethod
    async def get_rooms() -> List[Room]:
        """Get all active rooms"""
        db = get_db()
        
        if not db:
            # Return mock data if DB not configured
            return [
                Room(
                    id='1',
                    name='Pacho',
                    capacity=7,
                    price_per_night=70.0,
                    description='Habitación acogedora con capacidad para 7 personas',
                    features=['Cocina equipada', 'Agua caliente', 'TV', 'WiFi', 'Parrillera'],
                    images=['https://customer-assets.emergentagent.com/job_valley-cabins/artifacts/x2asbc54_WhatsApp%20Image%202025-12-09%20at%208.00.00%20PM%20%283%29.jpeg'],
                    is_active=True,
                    created_at=datetime.now(),
                    updated_at=datetime.now()
                ),
                Room(
                    id='2',
                    name="D'Jesus",
                    capacity=8,
                    price_per_night=80.0,
                    description='Habitación espaciosa con capacidad para 8 personas',
                    features=['Cocina equipada', 'Agua caliente', 'TV', 'WiFi', 'Parrillera'],
                    images=['https://customer-assets.emergentagent.com/job_valley-cabins/artifacts/x2asbc54_WhatsApp%20Image%202025-12-09%20at%208.00.00%20PM%20%283%29.jpeg'],
                    is_active=True,
                    created_at=datetime.now(),
                    updated_at=datetime.now()
                )
            ]
        
        response = db.table('rooms').select('*').eq('is_active', True).execute()
        
        rooms = []
        for data in response.data:
            rooms.append(Room(
                id=data['id'],
                name=data['name'],
                capacity=data['capacity'],
                price_per_night=data['price_per_night'],
                description=data.get('description'),
                features=data.get('features', []),
                images=data.get('images', []),
                is_active=data['is_active'],
                created_at=datetime.fromisoformat(data['created_at']),
                updated_at=datetime.fromisoformat(data['updated_at'])
            ))
        
        return rooms
    
    @staticmethod
    async def get_room(room_id: str) -> Room:
        """Get room by ID"""
        db = get_db()
        
        response = db.table('rooms').select('*').eq('id', room_id).single().execute()
        data = response.data
        
        return Room(
            id=data['id'],
            name=data['name'],
            capacity=data['capacity'],
            price_per_night=data['price_per_night'],
            description=data.get('description'),
            features=data.get('features', []),
            images=data.get('images', []),
            is_active=data['is_active'],
            created_at=datetime.fromisoformat(data['created_at']),
            updated_at=datetime.fromisoformat(data['updated_at'])
        )

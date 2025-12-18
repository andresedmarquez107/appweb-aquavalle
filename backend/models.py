from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import date, datetime
from enum import Enum

class ReservationType(str, Enum):
    FULLDAY = 'fullday'
    HOSPEDAJE = 'hospedaje'

class ReservationStatus(str, Enum):
    PENDING = 'pending'
    CONFIRMED = 'confirmed'
    CANCELLED = 'cancelled'
    COMPLETED = 'completed'

# Client Models
class ClientBase(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=100)
    id_document: str = Field(..., min_length=1, max_length=50)
    email: Optional[EmailStr] = None
    phone: str = Field(..., min_length=1, max_length=20)

class ClientCreate(ClientBase):
    pass

class Client(ClientBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Room Models
class RoomBase(BaseModel):
    name: str
    capacity: int
    price_per_night: float
    description: Optional[str] = None
    features: List[str] = []
    images: List[str] = []

class Room(RoomBase):
    id: str
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Reservation Models
class ReservationCreate(BaseModel):
    # Client info
    client_name: str = Field(..., min_length=1)
    client_document: str = Field(..., min_length=1)
    client_email: Optional[EmailStr] = None
    client_phone: str = Field(..., min_length=1)
    
    # Reservation info
    reservation_type: ReservationType
    check_in_date: date
    check_out_date: Optional[date] = None
    num_guests: int = Field(..., gt=0)
    
    # For hospedaje
    room_ids: Optional[List[str]] = []
    
    notes: Optional[str] = None

    @validator('check_out_date')
    def validate_checkout(cls, v, values):
        if 'reservation_type' not in values:
            return v
            
        if values['reservation_type'] == ReservationType.HOSPEDAJE:
            if not v:
                raise ValueError('check_out_date is required for hospedaje')
            if 'check_in_date' in values and v <= values['check_in_date']:
                raise ValueError('check_out_date must be after check_in_date')
        elif values['reservation_type'] == ReservationType.FULLDAY:
            # For fullday, check_out_date should be None
            pass
            
        return v

    @validator('num_guests')
    def validate_guests(cls, v, values):
        if 'reservation_type' in values:
            if values['reservation_type'] == ReservationType.FULLDAY and v > 20:
                raise ValueError('Full day capacity is maximum 20 people')
        return v

    @validator('room_ids')
    def validate_rooms(cls, v, values):
        if 'reservation_type' in values:
            if values['reservation_type'] == ReservationType.HOSPEDAJE:
                if not v or len(v) == 0:
                    raise ValueError('At least one room is required for hospedaje')
        return v if v else []

class Reservation(BaseModel):
    id: str
    client_id: str
    reservation_type: ReservationType
    check_in_date: date
    check_out_date: Optional[date]
    num_guests: int
    total_price: float
    status: ReservationStatus
    notes: Optional[str]
    whatsapp_confirmation_sent: bool
    email_confirmation_sent: bool
    created_at: datetime
    updated_at: datetime
    
    # Related data
    client: Optional[Client] = None
    rooms: List[Room] = []

    class Config:
        from_attributes = True

class ReservationResponse(BaseModel):
    id: str
    reservation_type: ReservationType
    check_in_date: date
    check_out_date: Optional[date]
    num_guests: int
    total_price: float
    status: ReservationStatus
    client_name: str
    client_phone: str
    client_email: Optional[str]
    rooms: List[str] = []  # Room names
    created_at: datetime

# Availability Models
class AvailabilityCheck(BaseModel):
    date: date
    reservation_type: ReservationType
    num_guests: Optional[int] = None
    room_ids: Optional[List[str]] = None

class AvailabilityResponse(BaseModel):
    available: bool
    message: str
    available_capacity: Optional[int] = None
    available_rooms: List[str] = []

# Dashboard Stats
class DashboardStats(BaseModel):
    total_reservations: int
    pending_reservations: int
    confirmed_reservations: int
    total_revenue: float
    fullday_bookings: int
    hospedaje_bookings: int

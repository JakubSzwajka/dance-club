from ninja import Schema
from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from classes.schemas.location import LocationSchema


class CreateLocationSchema(Schema):
    name: str
    address: str
    latitude: float
    longitude: float
    google_place_id: str
    url: str

class CreateSpecialEventSchema(Schema):
    name: str
    description: str
    datetime: datetime
    capacity: int
    price: Decimal
    location: CreateLocationSchema
    instructor_id: str


class SpecialEventSchema(CreateSpecialEventSchema):
    id: str
    instructor_name: str
    current_capacity: int
    location: LocationSchema
    created_at: datetime
    updated_at: datetime
from ninja import Schema
from datetime import datetime
from decimal import Decimal
from classes.schemas.user_schema import UserPublicSchema
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


class SpecialEventSchema(CreateSpecialEventSchema):
    id: str
    current_capacity: int
    location: LocationSchema
    instructor: UserPublicSchema
    created_at: datetime
    updated_at: datetime

from datetime import date as Date
from datetime import datetime
from decimal import Decimal
from typing import Optional
from ninja import Schema
from classes.schemas.user_schema import InstructorPublicSchema
from classes.schemas.location import LocationSchema


class CreateDanceClassSchema(Schema):
    name: str
    description: str
    level: str
    price: Decimal
    start_date: Date
    end_date: Date
    location: Optional[LocationSchema]
    style: str


class DanceClassSchema(CreateDanceClassSchema):
    id: str
    instructor_id: str
    created_at: datetime
    updated_at: datetime
    instructor: Optional[InstructorPublicSchema]
    location: Optional[LocationSchema]
    duration: int

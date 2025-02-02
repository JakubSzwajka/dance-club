from datetime import date as Date
from datetime import datetime, time
from decimal import Decimal
from typing import List, Optional
from ninja import Schema
from classes.schemas.user_schema import UserPublicSchema, InstructorPublicSchema
from classes.schemas.location import LocationSchema

class CreateDanceClassSchema(Schema):
    name: str
    description: str
    level: str
    max_capacity: int
    price: Decimal
    start_date: Date
    end_date: Date
    location: Optional[LocationSchema]
    style: str

class DanceClassSchema(CreateDanceClassSchema):
    id: str
    instructor_id: str
    current_capacity: int
    created_at: datetime
    updated_at: datetime
    instructor: Optional[InstructorPublicSchema]

class PrivateDanceClassSchema(DanceClassSchema):
    pass
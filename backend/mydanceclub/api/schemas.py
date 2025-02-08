from datetime import date as Date
from datetime import datetime, time
from decimal import Decimal
from typing import Optional
from ninja import Schema
from classes.schemas.location import LocationSchema


class SignupSchema(Schema):
    email: str
    password: str
    role: str


class LoginSchema(Schema):
    email: str
    password: str


class TokenResponse(Schema):
    access: str
    email: str


class ScheduleSchema(Schema):
    id: str
    dance_class_id: str
    day_of_week: int
    start_time: time
    end_time: time
    is_recurring: bool
    start_date: datetime
    end_date: Optional[datetime]
    status: str
    created_at: datetime
    updated_at: datetime


class CreateScheduleSchema(Schema):
    day_of_week: int
    start_time: time
    end_time: time
    is_recurring: bool
    start_date: datetime
    end_date: Optional[datetime]


class CreateDanceClassSchema(Schema):
    name: str
    description: str
    level: str
    max_capacity: int
    price: Decimal
    start_date: Date
    end_date: Date
    location: Optional[LocationSchema] = None


class CreateRecurringScheduleSchema(Schema):
    day_of_week: int
    start_time: time
    end_time: time


class RecurringScheduleSchema(CreateRecurringScheduleSchema):
    id: str
    dance_class_id: str
    status: str
    created_at: datetime
    updated_at: datetime


class CreateSpecialScheduleSchema(Schema):
    date: Date
    start_time: time
    end_time: time
    status: str = "scheduled"
    replaced_schedule_id: Optional[int] = None
    replaced_schedule_date: Optional[Date] = None
    note: Optional[str] = None


class SpecialScheduleSchema(CreateSpecialScheduleSchema):
    id: str
    dance_class_id: str
    created_at: datetime
    updated_at: datetime


class DanceClassSchema(CreateDanceClassSchema):
    id: str
    instructor_id: str
    current_capacity: int
    created_at: datetime
    updated_at: datetime


class ReviewSchema(Schema):
    id: str
    dance_class_id: str
    student_id: str
    instruction_rating: int
    facility_rating: int
    overall_rating: int
    comment: str
    created_at: datetime
    moderation_status: str
    is_verified: bool


class ReviewResponseSchema(Schema):
    id: str
    review_id: str
    instructor_id: str
    response_text: str
    created_at: datetime

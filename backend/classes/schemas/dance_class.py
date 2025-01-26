from datetime import date as Date
from datetime import datetime, time
from decimal import Decimal
from typing import List, Optional
from ninja import Schema
from classes.schemas.user_schema import UserPublicSchema
from classes.schemas.location import LocationSchema

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



class CreateRecurringScheduleSchema(Schema):
    day_of_week: int
    start_time: time
    end_time: time


class RecurringScheduleSchema(CreateRecurringScheduleSchema):
    id: str
    status: str
    created_at: datetime
    updated_at: datetime
    day_of_week_display: str


class CreateSpecialScheduleSchema(Schema):
    date: Date
    start_time: time
    end_time: time
    status: str = 'scheduled'
    replaced_schedule_id: Optional[str] = None
    replaced_schedule_date: Optional[Date] = None
    note: Optional[str] = None


class SpecialScheduleSchema(CreateSpecialScheduleSchema):
    id: str
    created_at: datetime
    updated_at: datetime


class CreateDanceClassSchema(Schema):
    name: str
    description: str
    level: str
    max_capacity: int
    price: Decimal
    start_date: Date
    end_date: Date
    location: Optional[LocationSchema] = None
    style: str


class DanceClassSchema(CreateDanceClassSchema):
    id: str
    instructor_id: str
    current_capacity: int
    created_at: datetime
    updated_at: datetime
    instructor: UserPublicSchema
    schedule: List[RecurringScheduleSchema]


class PrivateDanceClassSchema(DanceClassSchema):
    schedule_changes: List[SpecialScheduleSchema]
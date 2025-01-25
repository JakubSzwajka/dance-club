from datetime import timedelta
from typing import List, cast

from accounts.models import User
from classes.models import DanceClass, RecurringSchedule, SpecialSchedule
from django.core.exceptions import PermissionDenied
from django.http import HttpRequest, HttpResponse
from django.shortcuts import get_object_or_404
from ninja import Router

from .schemas import (
    CreateRecurringScheduleSchema,
    CreateSpecialScheduleSchema,
    RecurringScheduleSchema,
    SpecialScheduleSchema,
)
from .types import AuthenticatedRequest

router = Router()


@router.get('/classes/{class_id}/recurring-schedules', response=List[RecurringScheduleSchema])
def list_recurring_schedules(request: AuthenticatedRequest, class_id: int) -> List[RecurringScheduleSchema]:
    dance_class = get_object_or_404(DanceClass, id=class_id)
    return [
        RecurringScheduleSchema(
            id=schedule.id,
            dance_class_id=schedule.dance_class.id,
            day_of_week=schedule.day_of_week,
            start_time=schedule.start_time,
            end_time=schedule.end_time,
            status=schedule.status,
            created_at=schedule.created_at,
            updated_at=schedule.updated_at,
        )
        for schedule in RecurringSchedule.objects.filter(dance_class=dance_class)
    ]


@router.get('/classes/{class_id}/special-schedules', response=List[SpecialScheduleSchema])
def list_special_schedules(request: AuthenticatedRequest, class_id: int) -> List[SpecialScheduleSchema]:
    dance_class = get_object_or_404(DanceClass, id=class_id)
    return [
        SpecialScheduleSchema(
            id=schedule.id,
            dance_class_id=schedule.dance_class.id,
            date=schedule.date,
            start_time=schedule.start_time,
            end_time=schedule.end_time,
            status=schedule.status,
            replaced_schedule_id=schedule.replaced_schedule.id if schedule.replaced_schedule else None,
            replaced_schedule_date=schedule.replaced_schedule_date,
            note=schedule.note,
            created_at=schedule.created_at,
            updated_at=schedule.updated_at,
        )
        for schedule in SpecialSchedule.objects.filter(dance_class=dance_class)
    ]


@router.post('/classes/{class_id}/recurring-schedules', response=RecurringScheduleSchema)
def create_recurring_schedule(request: AuthenticatedRequest, class_id: int, data: CreateRecurringScheduleSchema) -> RecurringScheduleSchema:
    dance_class = get_object_or_404(DanceClass, id=class_id)
    if request.auth.id != dance_class.instructor.id:
        raise PermissionDenied('Only the class instructor can manage schedules')

    schedule = RecurringSchedule.objects.create(dance_class=dance_class, **data.dict())
    return RecurringScheduleSchema(
        id=schedule.id,
        dance_class_id=schedule.dance_class.id,
        day_of_week=schedule.day_of_week,
        start_time=schedule.start_time,
        end_time=schedule.end_time,
        status=schedule.status,
        created_at=schedule.created_at,
        updated_at=schedule.updated_at,
    )


@router.post('/classes/{class_id}/special-schedules', response=SpecialScheduleSchema)
def create_special_schedule(request: AuthenticatedRequest, class_id: int, data: CreateSpecialScheduleSchema) -> HttpResponse | SpecialScheduleSchema:
    dance_class = get_object_or_404(DanceClass, id=class_id)
    if request.auth.id != dance_class.instructor.id:
        raise PermissionDenied('Only the class instructor can manage schedules')

    # If this is replacing a recurring schedule, validate the date
    if data.replaced_schedule_id and data.replaced_schedule_date:
        schedule = get_object_or_404(RecurringSchedule, id=data.replaced_schedule_id, dance_class=dance_class)
        replaced_date = data.replaced_schedule_date
        # Verify this is a valid occurrence of the recurring schedule
        if replaced_date.weekday() != schedule.day_of_week:
            return HttpResponse(
                '{"detail": "The selected date is not a valid occurrence of this recurring schedule"}',
                status=400,
                content_type='application/json',
            )

        # Use the replaced schedule's times if not provided
        if not data.start_time:
            data.start_time = schedule.start_time
        if not data.end_time:
            data.end_time = schedule.end_time

    schedule = SpecialSchedule.objects.create(dance_class=dance_class, **data.dict())
    return SpecialScheduleSchema(
        id=schedule.id,
        dance_class_id=schedule.dance_class.id,
        date=schedule.date,
        start_time=schedule.start_time,
        end_time=schedule.end_time,
        status=schedule.status,
        replaced_schedule_id=schedule.replaced_schedule.id if schedule.replaced_schedule else None,
        replaced_schedule_date=schedule.replaced_schedule_date,
        note=schedule.note,
        created_at=schedule.created_at,
        updated_at=schedule.updated_at,
    )


@router.put('/recurring-schedules/{schedule_id}/status')
def update_recurring_schedule_status(request: AuthenticatedRequest, schedule_id: int, status: str) -> HttpResponse:
    schedule = get_object_or_404(RecurringSchedule, id=schedule_id)
    if request.auth.id != schedule.dance_class.instructor.id:
        raise PermissionDenied('Only the class instructor can manage schedules')

    if status not in dict(RecurringSchedule.STATUS_CHOICES):
        return HttpResponse('{"detail": "Invalid status"}', status=400, content_type='application/json')

    schedule.status = status
    schedule.save()
    return HttpResponse('{"success": true}', content_type='application/json')


@router.put('/special-schedules/{schedule_id}/status')
def update_special_schedule_status(request: AuthenticatedRequest, schedule_id: int, status: str) -> HttpResponse:
    schedule = get_object_or_404(SpecialSchedule, id=schedule_id)
    if request.auth.id != schedule.dance_class.instructor.id:
        raise PermissionDenied('Only the class instructor can manage schedules')

    if status not in dict(SpecialSchedule.STATUS_CHOICES):
        return HttpResponse('{"detail": "Invalid status"}', status=400, content_type='application/json')

    schedule.status = status
    schedule.save()
    return HttpResponse('{"success": true}', content_type='application/json')


@router.delete('/recurring-schedules/{schedule_id}')
def delete_recurring_schedule(request: AuthenticatedRequest, schedule_id: int) -> HttpResponse:
    schedule = get_object_or_404(RecurringSchedule, id=schedule_id)
    if request.auth.id != schedule.dance_class.instructor.id:
        raise PermissionDenied('Only the class instructor can manage schedules')

    schedule.delete()
    return HttpResponse('{"success": true}', content_type='application/json')


@router.delete('/special-schedules/{schedule_id}')
def delete_special_schedule(request: AuthenticatedRequest, schedule_id: int) -> HttpResponse:
    schedule = get_object_or_404(SpecialSchedule, id=schedule_id)
    if request.auth.id != schedule.dance_class.instructor.id:
        raise PermissionDenied('Only the class instructor can manage schedules')

    schedule.delete()
    return HttpResponse('{"success": true}', content_type='application/json')


@router.get('/classes/{class_id}/recurring-schedules/{schedule_id}/occurrences', response=List[str])
def get_recurring_schedule_occurrences(request: AuthenticatedRequest, class_id: int, schedule_id: int) -> List[str]:
    dance_class = get_object_or_404(DanceClass, id=class_id)
    schedule = get_object_or_404(RecurringSchedule, id=schedule_id, dance_class=dance_class)

    # Get all occurrences between class start and end date
    occurrences = []
    current_date = dance_class.start_date

    # Find the first occurrence of this schedule
    while current_date.weekday() != schedule.day_of_week:
        current_date += timedelta(days=1)

    # Add all occurrences until the end date
    while current_date <= dance_class.end_date:
        occurrences.append(current_date.isoformat())
        current_date += timedelta(days=7)

    return occurrences
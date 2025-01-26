from typing import List

from classes.services.class_search_engine import ClassSearchEngineService
from django.http import HttpResponse
from ninja import Router
from classes.services.class_manager import ClassManager
from classes.schemas.dance_class import CreateRecurringScheduleSchema, CreateSpecialScheduleSchema, DanceClassSchema, CreateDanceClassSchema, RecurringScheduleSchema, SpecialScheduleSchema
from .types import AuthenticatedRequest

router = Router()


@router.get('/', response=List[DanceClassSchema])
def list_classes(request: AuthenticatedRequest) -> List[DanceClassSchema]:
    class_search_engine = ClassSearchEngineService()
    return class_search_engine.get_classes_by_instructor(
        instructor_id=request.auth.id,
    )

@router.post('/', response=DanceClassSchema)
def create_class(request: AuthenticatedRequest, payload: CreateDanceClassSchema) -> HttpResponse | DanceClassSchema:
    class_manager = ClassManager()
    return class_manager.create_class(request.auth, payload)


@router.get('/{class_id}', response=DanceClassSchema)
def get_class(request: AuthenticatedRequest, class_id: str) -> DanceClassSchema:
    class_search_engine = ClassSearchEngineService()
    return class_search_engine.get_class_by_id(class_id)

@router.get('/{class_id}/recurring-schedules', response=List[RecurringScheduleSchema])
def get_class_recurring_schedules(request: AuthenticatedRequest, class_id: str) -> List[RecurringScheduleSchema]:
    class_search_engine = ClassSearchEngineService()
    return class_search_engine.get_class_recurring_schedules(class_id)

@router.get('/{class_id}/special-schedules', response=List[SpecialScheduleSchema])
def get_class_special_schedules(request: AuthenticatedRequest, class_id: str) -> List[SpecialScheduleSchema]:
    class_search_engine = ClassSearchEngineService()
    return class_search_engine.get_class_special_schedules(class_id)

@router.post('/{class_id}/recurring-schedules', response=RecurringScheduleSchema)
def create_class_recurring_schedule(request: AuthenticatedRequest, class_id: str, payload: CreateRecurringScheduleSchema) -> RecurringScheduleSchema:
    class_manager = ClassManager()
    return class_manager.create_recurring_schedule(request.auth, class_id, payload)

@router.post('/{class_id}/special-schedules', response=SpecialScheduleSchema)
def create_class_special_schedule(request: AuthenticatedRequest, class_id: str, payload: CreateSpecialScheduleSchema) -> SpecialScheduleSchema:
    class_manager = ClassManager()
    return class_manager.create_special_schedule(request.auth, class_id, payload)

@router.delete('/{class_id}/recurring-schedules/{schedule_id}')
def delete_class_recurring_schedule(request: AuthenticatedRequest, class_id: str, schedule_id: str) -> HttpResponse:
    class_manager = ClassManager()
    class_manager.delete_recurring_schedule(request.auth, schedule_id)
    return HttpResponse('{"success": true}', content_type='application/json')

@router.delete('/{class_id}/special-schedules/{schedule_id}')
def delete_class_special_schedule(request: AuthenticatedRequest, class_id: str, schedule_id: str) -> HttpResponse:
    class_manager = ClassManager()
    class_manager.delete_special_schedule(request.auth, schedule_id)
    return HttpResponse('{"success": true}', content_type='application/json')

@router.put('/{class_id}', response=DanceClassSchema)
def update_class(request: AuthenticatedRequest, class_id: str, payload: DanceClassSchema) -> HttpResponse | DanceClassSchema:
    class_manager = ClassManager()
    return class_manager.update_class(request.auth, class_id, payload)


@router.delete('/{class_id}')
def delete_class(request: AuthenticatedRequest, class_id: str) -> HttpResponse:
    class_manager = ClassManager()
    class_manager.delete_class(request.auth, class_id)
    return HttpResponse('{"success": true}', content_type='application/json')


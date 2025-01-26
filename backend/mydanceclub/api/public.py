from typing import List, Optional
from classes.services.location_search_engine import LocationSearchEngineService
from classes.schemas.location import LocationSchema
from classes.models import DanceClass
from classes.services.instructor_manager import InstructorManagerService
from classes.schemas.user_public_schema import InstructorPublicSchema, UserPublicSchema
from classes.schemas.dance_class import DanceClassSchema, RecurringScheduleSchema
from classes.services.class_search_engine import ClassSearchEngineService
from classes.schemas.event import SpecialEventSchema
from classes.services.events_search_engine import EventsSearchEngineService
from ninja import Router

from .types import AuthenticatedRequest

router = Router()

# ------------ PUBLIC EVENTS ------------

@router.get('/events', response=List[SpecialEventSchema], auth=None)
def list_special_events(request: AuthenticatedRequest, location_id: Optional[str] = None, instructor_id: Optional[str] = None, start_date: Optional[str] = None, end_date: Optional[str] = None, limit: int = 10) -> List[SpecialEventSchema]:
    return EventsSearchEngineService().get_events_with_filters(location_id, instructor_id, start_date, end_date, limit)

@router.get('/events/location', response=List[SpecialEventSchema], auth=None)
def list_special_events_near_location(request: AuthenticatedRequest, latitude: Optional[float] = None, longitude: Optional[float] = None, start_date: Optional[str] = None, end_date: Optional[str] = None, limit: int = 10) -> List[SpecialEventSchema]:
    return EventsSearchEngineService().get_events_near_location(latitude, longitude, start_date, end_date, limit)

@router.get('/events/{id}', response=SpecialEventSchema, auth=None)
def get_special_event(request: AuthenticatedRequest, id: str) -> SpecialEventSchema:
    return EventsSearchEngineService().get_event_by_id(id)


# ------------ PUBLIC CLASSES ------------

@router.get('/classes', response=List[DanceClassSchema], auth=None)
def get_classes(request: AuthenticatedRequest, instructor_id: Optional[str] = None, location_id: Optional[str] = None, style: Optional[str] = None, level: Optional[str] = None, start_date: Optional[str] = None, end_date: Optional[str] = None) -> List[DanceClassSchema]:
    return ClassSearchEngineService().get_classes_with_filters(instructor_id, location_id, style, level, start_date, end_date)

@router.get('/classes/location', response=List[DanceClassSchema], auth=None)
def get_classes_near_location(request: AuthenticatedRequest, latitude: float, longitude: float, start_date: str, end_date: str, limit: int = 10) -> List[DanceClassSchema]:
    return ClassSearchEngineService().get_classes_near_location(latitude, longitude, start_date, end_date, limit)

@router.get('/classes/{class_id}', response=DanceClassSchema, auth=None)
def get_class(request: AuthenticatedRequest, class_id: str) -> DanceClassSchema:
    return ClassSearchEngineService().get_class_by_id(class_id)

@router.get('/classes/{class_id}/schedule', response=List[RecurringScheduleSchema], auth=None)
def get_class_schedule(request: AuthenticatedRequest, class_id: str) -> List[RecurringScheduleSchema]:
    return ClassSearchEngineService().get_class_recurring_schedules(class_id)


# ------------ PUBLIC INSTRUCTORS ------------

@router.get('/instructors', response=List[InstructorPublicSchema], auth=None)
def get_instructors(request: AuthenticatedRequest) -> List[InstructorPublicSchema]:
    return InstructorManagerService().get_instructors()

@router.get('/instructors/{instructor_id}', response=InstructorPublicSchema, auth=None)
def get_instructor(request: AuthenticatedRequest, instructor_id: str) -> InstructorPublicSchema:
    return InstructorManagerService().get_instructor_by_id(instructor_id)

@router.get('/instructors/{instructor_id}/classes', response=List[DanceClassSchema], auth=None)
def get_classes_by_instructor(request: AuthenticatedRequest, instructor_id: str) -> List[DanceClassSchema]:
    return ClassSearchEngineService().get_classes_by_instructor(instructor_id)

@router.get('/instructors/{instructor_id}/events', response=List[SpecialEventSchema], auth=None)
def get_events_by_instructor(request: AuthenticatedRequest, instructor_id: str) -> List[SpecialEventSchema]:
    return EventsSearchEngineService().get_events_by_instructor(instructor_id)

# ------------- PUBLIC LOCATIONS -------------

@router.get('/locations', response=List[LocationSchema], auth=None)
def get_locations(request: AuthenticatedRequest) -> List[LocationSchema]:
    return LocationSearchEngineService().get_locations()

@router.get('/locations/{location_id}', response=LocationSchema, auth=None)
def get_location(request: AuthenticatedRequest, location_id: str) -> LocationSchema:
    return LocationSearchEngineService().get_location_by_id(location_id)

@router.get('/locations/{location_id}/classes', response=List[DanceClassSchema], auth=None)
def get_classes_by_location(request: AuthenticatedRequest, location_id: str) -> List[DanceClassSchema]:
    return ClassSearchEngineService().get_classes_by_location(location_id)

@router.get('/locations/{location_id}/events', response=List[SpecialEventSchema], auth=None)
def get_events_by_location(request: AuthenticatedRequest, location_id: str) -> List[SpecialEventSchema]:
    return EventsSearchEngineService().get_events_by_location(location_id)

# ------------- PUBLIC DANCE STYLES -------------

@router.get('/dance-styles', response=List[str], auth=None)
def get_dance_styles(request: AuthenticatedRequest) -> List[str]:
    return list(DanceClass.objects.values_list('style', flat=True).distinct())



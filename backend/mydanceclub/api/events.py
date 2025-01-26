from typing import List

from django.http import HttpResponse
from classes.services.events_manager import EventsManagerService
from classes.services.events_search_engine import EventsSearchEngineService
from classes.schemas.event import CreateSpecialEventSchema, SpecialEventSchema
from ninja import Router
from .private.types import AuthenticatedRequest

router = Router()


@router.get('/special', response=List[SpecialEventSchema])
def list_special_events(request: AuthenticatedRequest) -> List[SpecialEventSchema] | HttpResponse:
    return EventsSearchEngineService().get_events_by_instructor(request.auth.id)

@router.post('/special', response=SpecialEventSchema)
def create_special_event(request: AuthenticatedRequest, payload: CreateSpecialEventSchema) -> HttpResponse | SpecialEventSchema:
    return EventsManagerService().create_event(request.auth, payload)

@router.get('/special/{event_id}', response=SpecialEventSchema)
def get_special_event(request: AuthenticatedRequest, event_id: str) -> SpecialEventSchema:
    return EventsSearchEngineService().get_event_by_id(event_id)


@router.put('/special/{event_id}', response=SpecialEventSchema)
def update_special_event(request: AuthenticatedRequest, event_id: str, payload: CreateSpecialEventSchema) -> HttpResponse | SpecialEventSchema:
    return EventsManagerService().update_event(request.auth, event_id, payload)

@router.delete('/special/{event_id}')
def delete_special_event(request: AuthenticatedRequest, event_id: str) -> HttpResponse:
    EventsManagerService().delete_event(request.auth, event_id)
    return HttpResponse(status=204)

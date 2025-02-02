from typing import List
from ninja import Router
from classes.schemas.dance_class import DanceClassSchema
from classes.schemas.location import LocationSchema
from classes.services.location_search_engine import LocationSearchEngineService
from classes.services.class_search_engine import ClassSearchEngineService
from ..private.types import AuthenticatedRequest

router = Router()
location_search_engine = LocationSearchEngineService()
class_search_engine = ClassSearchEngineService()

@router.get('/locations', response=List[LocationSchema], auth=None)
def get_locations(
    request,
    has_active_classes: bool = True
) -> List[LocationSchema]:
    """Get locations, optionally filtered to those with active classes"""
    return location_search_engine.get_locations(
        has_active_classes=has_active_classes
    )

@router.get('/locations/{location_id}', response=LocationSchema, auth=None)
def get_location(request: AuthenticatedRequest, location_id: str) -> LocationSchema:
    return location_search_engine.get_location_by_id(location_id)

@router.get('/locations/{location_id}/classes', response=List[DanceClassSchema], auth=None)
def get_location_classes(request, location_id: str, include_past: bool = False) -> List[DanceClassSchema]:
    """Get all classes at a location"""
    return class_search_engine.get_classes_by_location(location_id, include_past)
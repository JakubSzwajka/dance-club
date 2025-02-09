from typing import List, Optional
from ninja import Router
from classes.schemas.dance_class import DanceClassSchema
from classes.schemas.location import LocationSchema
from classes.services.location_search_engine import LocationSearchEngineService
from classes.services.class_search_engine import ClassSearchEngineService
from reviews.schemas.response import ReviewAggregatedLocationStatsSchema
from reviews.services.stats_service import ReviewStatsService
from ..private.types import AuthenticatedRequest

router = Router()
location_search_engine = LocationSearchEngineService()
class_search_engine = ClassSearchEngineService()
review_stats_service = ReviewStatsService()


@router.get("/locations", response=List[LocationSchema], auth=None)
def get_locations(
    request,
    has_active_classes: bool = True,
    dance_style: Optional[str] = None,
    level: Optional[str] = None,
    min_classes: Optional[int] = None,
    min_rating: Optional[float] = None,
) -> List[LocationSchema]:
    """Get locations, optionally filtered to those with active classes"""
    return location_search_engine.get_locations_nearby(
        has_active_classes=has_active_classes,
        dance_style=dance_style,
        level=level,
        min_classes=min_classes,
        min_location_rating=min_rating,
    )

@router.get("/locations/nearby", response=List[LocationSchema], auth=None)
def get_locations_nearby(
    request,
    has_active_classes: bool = True,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    dance_style: Optional[str] = None,
    level: Optional[str] = None,
    min_classes: Optional[int] = None,
    min_location_rating: Optional[float] = None,
    min_instructor_rating: Optional[float] = None,
    min_class_rating: Optional[float] = None,
    radius_km: Optional[float] = None,
    facility: Optional[str] = None,
    sports_card: Optional[str] = None,
) -> List[LocationSchema]:
    """Get locations, optionally filtered to those with active classes"""
    return location_search_engine.get_locations_nearby(
        has_active_classes=has_active_classes,
        latitude=latitude,
        longitude=longitude,
        dance_style=dance_style,
        level=level,
        min_classes=min_classes,
        min_location_rating=min_location_rating,
        radius_km=radius_km,
        facility=facility,
        sports_card=sports_card,
    )


@router.get("/locations/{location_id}", response=LocationSchema, auth=None)
def get_location(request: AuthenticatedRequest, location_id: str) -> LocationSchema:
    return location_search_engine.get_location_by_id(location_id)


@router.get(
    "/locations/{location_id}/classes", response=List[DanceClassSchema], auth=None
)
def get_location_classes(
    request, location_id: str, include_past: bool = False
) -> List[DanceClassSchema]:
    """Get all classes at a location"""
    return class_search_engine.get_classes_by_location(location_id, include_past)


@router.get(
    "/locations/{location_id}/stats",
    response=ReviewAggregatedLocationStatsSchema,
    auth=None,
)
def get_location_stats(
    request, location_id: str
) -> ReviewAggregatedLocationStatsSchema:
    """Get stats for a location"""
    return review_stats_service.get_location_stats(location_id)

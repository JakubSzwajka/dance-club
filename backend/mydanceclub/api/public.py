from typing import List, Optional
from django.db.models import Avg
from reviews.models import MUSIC_GENRES, SPORTS_CARDS
from classes.services.location_search_engine import LocationSearchEngineService
from classes.schemas.location import LocationSchema
from classes.models import SKILL_LEVELS, DanceClass
from classes.services.instructor_public_manager import InstructorPublicManagerService
from classes.schemas.user_schema import InstructorPublicSchema
from classes.schemas.dance_class import DanceClassSchema
from classes.services.class_search_engine import ClassSearchEngineService
from reviews.services.review_manager import ReviewManagerService
from reviews.schemas.review import (
    ReviewSchema,
    ReviewStatsSchema,
    ReviewCreateSchema,
    ReviewListSchema,
)
from ninja import Router, Schema
from datetime import date, datetime

from .private.types import AuthenticatedRequest

router = Router()
class_search_engine = ClassSearchEngineService()
instructor_manager = InstructorPublicManagerService()

# ------------ RESPONSE SCHEMAS ------------

class DanceClassWithReviewsSchema(Schema):
    """Extended dance class schema with review information"""
    class_info: DanceClassSchema
    review_stats: ReviewStatsSchema
    latest_reviews: List[ReviewSchema]


# ------------ PUBLIC CLASSES ------------

@router.get('/classes', response=List[DanceClassSchema], auth=None)
def get_classes(
    request,
    instructor_id: Optional[str] = None,
    location_id: Optional[str] = None,
    style: Optional[str] = None,
    level: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    min_rating: Optional[float] = None,
    sort_by: Optional[str] = None
) -> List[DanceClassSchema]:
    """Get all classes with filters"""
    return class_search_engine.get_classes_with_filters(
        instructor_id=instructor_id,
        location_id=location_id,
        style=style,
        level=level,
        start_date=start_date,
        end_date=end_date,
        min_rating=min_rating,
        sort_by=sort_by
    )

@router.get('/classes/{class_id}', response=DanceClassSchema, auth=None)
def get_class(request, class_id: str) -> DanceClassSchema:
    """Get a class by ID"""
    return class_search_engine.get_class_by_id(class_id)

@router.get('/instructors', response=List[InstructorPublicSchema], auth=None)
def get_instructors(request) -> List[InstructorPublicSchema]:
    """Get all instructors"""
    return instructor_manager.get_instructors()

@router.get('/instructors/{instructor_id}', response=InstructorPublicSchema, auth=None)
def get_instructor(request, instructor_id: str) -> InstructorPublicSchema:
    """Get an instructor by ID"""
    return instructor_manager.get_instructor_by_id(instructor_id)

@router.get('/instructors/{instructor_id}/classes', response=List[DanceClassSchema], auth=None)
def get_instructor_classes(request, instructor_id: str, include_past: bool = False) -> List[DanceClassSchema]:
    """Get all classes by an instructor"""
    return class_search_engine.get_classes_by_instructor(instructor_id, include_past)

@router.get('/locations/{location_id}/classes', response=List[DanceClassSchema], auth=None)
def get_location_classes(request, location_id: str, include_past: bool = False) -> List[DanceClassSchema]:
    """Get all classes at a location"""
    return class_search_engine.get_classes_by_location(location_id, include_past)


# ------------ PUBLIC REVIEWS ------------

@router.get('/classes/{class_id}/reviews', response=ReviewListSchema, auth=None)
def get_class_reviews(
    request,
    class_id: str,
    page: int = 1,
    page_size: int = 10,
    sort_by: Optional[str] = None,  # options: date_desc, rating_desc, rating_asc
    verified_only: bool = False,
    min_rating: Optional[int] = None,
    max_rating: Optional[int] = None
) -> ReviewListSchema:
    """Get paginated reviews for a class with filters"""
    return ReviewManagerService().get_class_reviews_paginated(
        class_id=class_id,
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        verified_only=verified_only,
        min_rating=min_rating,
        max_rating=max_rating
    )

@router.post('/classes/{class_id}/reviews', response=ReviewSchema, auth=None)
def create_review(
    request,
    class_id: str,
    review_data: ReviewCreateSchema
) -> ReviewSchema:
    """Create a new review for a class"""
    return ReviewManagerService().create_review(
        class_id=class_id,
        review_data=review_data
    )


# ------------ PUBLIC LOCATIONS ------------

@router.get('/locations', response=List[LocationSchema], auth=None)
def get_locations(
    request,
    has_active_classes: bool = True
) -> List[LocationSchema]:
    """Get locations, optionally filtered to those with active classes"""
    return LocationSearchEngineService().get_locations(
        has_active_classes=has_active_classes
    )

@router.get('/locations/{location_id}', response=LocationSchema, auth=None)
def get_location(request: AuthenticatedRequest, location_id: str) -> LocationSchema:
    return LocationSearchEngineService().get_location_by_id(location_id)


# ------------ PUBLIC METADATA ------------

@router.get('/metadata', response=dict, auth=None)
def get_metadata(request) -> dict:
    """Get all metadata for the frontend"""
    return {
        'dance_styles': list(DanceClass.objects.values_list('style', flat=True).distinct()),
        'skill_levels': [level[0] for level in SKILL_LEVELS],
        'music_genres': [genre[0] for genre in MUSIC_GENRES],
        'sports_cards': [card[0] for card in SPORTS_CARDS],
    }



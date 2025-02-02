from typing import List, Optional, cast
from django.db.models import Avg
from accounts.models import User
from reviews.models import MUSIC_GENRES, SPORTS_CARDS
from classes.services.location_search_engine import LocationSearchEngineService
from classes.schemas.location import LocationSchema
from classes.models import SKILL_LEVELS, DanceClass
from classes.services.instructor_public_manager import InstructorPublicManagerService
from classes.schemas.user_schema import InstructorPublicSchema
from classes.schemas.dance_class import DanceClassSchema
from classes.services.class_search_engine import ClassSearchEngineService
from reviews.schemas.review import ReviewSchema
from reviews.services.review_manager import ReviewManagerService
from reviews.services.stats_service import ReviewStatsService
from reviews.schemas.response import (
    ReviewResponseSchema,
    ReviewStatsSchema,
    ReviewListSchema,
)
from reviews.schemas.create import ReviewCreateSchema
from reviews.schemas.metadata import ReviewMetadataSchema
from reviews.schemas.base import (
    TeachingApproachSchema,
    EnvironmentSchema,
    MusicSchema,
    FacilitiesSchema,
)
from ninja import Router, Schema
from datetime import date, datetime

from .private.types import AuthenticatedRequest

router = Router()
class_search_engine = ClassSearchEngineService()
instructor_manager = InstructorPublicManagerService()
review_manager = ReviewManagerService()
stats_service = ReviewStatsService()

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
    sort_by: Optional[str] = None,
    verified_only: bool = False,
    min_rating: Optional[int] = None,
    max_rating: Optional[int] = None,
    teaching_style_min: Optional[int] = None,
    teaching_style_max: Optional[int] = None,
    feedback_approach_min: Optional[int] = None,
    feedback_approach_max: Optional[int] = None,
    pace_min: Optional[int] = None,
    pace_max: Optional[int] = None,
    temperature: Optional[str] = None,
    music_genres: Optional[List[str]] = None,
    has_changing_room: Optional[bool] = None,
    has_waiting_area: Optional[bool] = None,
    accepted_cards: Optional[List[str]] = None,
) -> ReviewListSchema:
    """Get paginated reviews for a class with enhanced filters"""
    return review_manager.get_class_reviews_paginated(
        class_id=class_id,
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        verified_only=verified_only,
        min_rating=min_rating,
        max_rating=max_rating,
        teaching_style_min=teaching_style_min,
        teaching_style_max=teaching_style_max,
        feedback_approach_min=feedback_approach_min,
        feedback_approach_max=feedback_approach_max,
        pace_min=pace_min,
        pace_max=pace_max,
        temperature=temperature,
        music_genres=music_genres,
        has_changing_room=has_changing_room,
        has_waiting_area=has_waiting_area,
        accepted_cards=accepted_cards,
    )

@router.post('/classes/{class_id}/reviews', response=ReviewSchema, auth=None)
def create_review(
    request,
    class_id: str,
    review_data: ReviewCreateSchema
) -> ReviewResponseSchema:
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


# ------------ REVIEW COMPONENTS ------------

@router.get('/reviews/{review_id}/teaching', response=TeachingApproachSchema, auth=None)
def get_review_teaching(request, review_id: str) -> TeachingApproachSchema:
    """Get teaching approach component of a review"""
    return review_manager.get_review_teaching(review_id)

@router.get('/reviews/{review_id}/environment', response=EnvironmentSchema, auth=None)
def get_review_environment(request, review_id: str) -> EnvironmentSchema:
    """Get environment component of a review"""
    return review_manager.get_review_environment(review_id)

@router.get('/reviews/{review_id}/music', response=MusicSchema, auth=None)
def get_review_music(request, review_id: str) -> MusicSchema:
    """Get music component of a review"""
    return review_manager.get_review_music(review_id)

@router.get('/reviews/{review_id}/facilities', response=FacilitiesSchema, auth=None)
def get_review_facilities(request, review_id: str) -> FacilitiesSchema:
    """Get facilities component of a review"""
    return review_manager.get_review_facilities(review_id)

# ------------ REVIEW METADATA ------------

@router.get('/metadata/review', response=ReviewMetadataSchema, auth=None)
def get_review_metadata(request) -> ReviewMetadataSchema:
    """Get all metadata related to reviews"""
    return ReviewMetadataSchema()

# ------------ REVIEW STATISTICS ------------

@router.get('/classes/{class_id}/stats/teaching', response=dict, auth=None)
def get_class_teaching_stats(request, class_id: str) -> dict:
    """Get teaching statistics for a class"""
    return stats_service.get_class_stats(class_id)["teaching_stats"]

@router.get('/classes/{class_id}/stats/environment', response=dict, auth=None)
def get_class_environment_stats(request, class_id: str) -> dict:
    """Get environment statistics for a class"""
    return stats_service.get_class_stats(class_id)["environment_stats"]

@router.get('/classes/{class_id}/stats/music', response=dict, auth=None)
def get_class_music_stats(request, class_id: str) -> dict:
    """Get music statistics for a class"""
    return stats_service.get_class_stats(class_id)["music_stats"]

@router.get('/classes/{class_id}/stats/facilities', response=dict, auth=None)
def get_class_facilities_stats(request, class_id: str) -> dict:
    """Get facilities statistics for a class"""
    return stats_service.get_class_stats(class_id)["facilities_stats"]

# ------------ REVIEW VERIFICATION ------------

@router.post('/reviews/{review_id}/verify', response=ReviewResponseSchema)
def verify_review(
    request: AuthenticatedRequest,
    review_id: str,
    method: str,
    notes: Optional[str] = None
) -> ReviewResponseSchema:
    """Verify a review using specified method"""
    return review_manager.verify_review(
        review_id=review_id,
        verifier=cast(User, request.user),
        method=method,
        notes=notes
    )

@router.get('/reviews/verification-methods', response=List[str], auth=None)
def get_verification_methods(request) -> List[str]:
    """Get available review verification methods"""
    return review_manager.get_verification_methods()



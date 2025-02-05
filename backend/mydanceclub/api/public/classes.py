from typing import List, Optional
from datetime import date
from ninja import Router
from classes.schemas.dance_class import DanceClassSchema
from classes.services.class_search_engine import ClassSearchEngineService
from reviews.services.stats_service import ReviewStatsService
from reviews.schemas.response import ReviewDanceClassStatsSchema, ReviewListSchema
from reviews.services.review_manager import ReviewManagerService

router = Router()
class_search_engine = ClassSearchEngineService()
stats_service = ReviewStatsService()
review_manager = ReviewManagerService()

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

@router.get('/classes/{class_id}/stats', response=ReviewDanceClassStatsSchema, auth=None)
def get_class_stats(request, class_id: str) -> ReviewDanceClassStatsSchema:
    """Get comprehensive review statistics for a class"""
    return stats_service.get_dance_class_stats(class_id)

@router.get('/classes/{class_id}/reviews', response=ReviewListSchema, auth=None)
def get_class_reviews(
    request,
    class_id: str,
    page: int = 1,
    page_size: int = 10,
    sort_by: Optional[str] = None,  # Keep basic sorting for UI flexibility
) -> ReviewListSchema:
    """Get paginated reviews for a specific class"""
    return review_manager.get_class_reviews_paginated(
        class_id=class_id,
        page=page,
        page_size=page_size,
        sort_by=sort_by
    )

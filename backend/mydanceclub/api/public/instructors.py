from typing import List
from ninja import Router
from classes.schemas.dance_class import DanceClassSchema
from classes.schemas.user_schema import InstructorPublicSchema
from classes.services.instructor_public_manager import InstructorPublicManagerService
from classes.services.class_search_engine import ClassSearchEngineService
from reviews.schemas.response import ReviewInstructorStatsSchema
from reviews.services.stats_service import ReviewStatsService

router = Router()
instructor_manager = InstructorPublicManagerService()
class_search_engine = ClassSearchEngineService()
stats_service = ReviewStatsService()


@router.get("/instructors", response=List[InstructorPublicSchema], auth=None)
def get_instructors(request) -> List[InstructorPublicSchema]:
    """Get all instructors"""
    return instructor_manager.get_instructors()


@router.get("/instructors/{instructor_id}", response=InstructorPublicSchema, auth=None)
def get_instructor(request, instructor_id: str) -> InstructorPublicSchema:
    """Get an instructor by ID"""
    return instructor_manager.get_instructor_by_id(instructor_id)


@router.get(
    "/instructors/{instructor_id}/classes", response=List[DanceClassSchema], auth=None
)
def get_instructor_classes(
    request, instructor_id: str, include_past: bool = False
) -> List[DanceClassSchema]:
    """Get all classes by an instructor"""
    return class_search_engine.get_classes_by_instructor(instructor_id, include_past)


@router.get(
    "/instructors/{instructor_id}/stats",
    response=ReviewInstructorStatsSchema,
    auth=None,
)
def get_instructor_stats(request, instructor_id: str) -> ReviewInstructorStatsSchema:
    """Get stats for an instructor"""
    return stats_service.get_instructor_stats(instructor_id)

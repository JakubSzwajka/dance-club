from typing import List, Optional
from ninja import Router
from accounts.models import User
from reviews.services.review_manager import ReviewManagerService
from reviews.services.stats_service import ReviewStatsService
from reviews.schemas.response import ReviewResponseSchema
from reviews.schemas.metadata import ReviewMetadataSchema
from reviews.schemas.base import (
    TeachingApproachSchema,
    EnvironmentSchema,
    MusicSchema,
    FacilitiesSchema,
)
from ..private.types import AuthenticatedRequest

router = Router()
review_manager = ReviewManagerService()
stats_service = ReviewStatsService()

@router.get('/reviews/metadata', response=ReviewMetadataSchema, auth=None)
def get_review_metadata(request) -> ReviewMetadataSchema:
    """Get all metadata related to reviews"""
    return ReviewMetadataSchema()

from ninja import Router
from reviews.services.review_manager import ReviewManagerService
from reviews.services.stats_service import ReviewStatsService
from reviews.schemas.metadata import ReviewMetadataSchema

router = Router()
review_manager = ReviewManagerService()
stats_service = ReviewStatsService()


@router.get("/reviews/metadata", response=ReviewMetadataSchema, auth=None)
def get_review_metadata(request) -> ReviewMetadataSchema:
    """Get all metadata related to reviews"""
    return ReviewMetadataSchema()

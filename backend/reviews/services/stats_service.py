from decimal import Decimal
from django.db.models import Avg, Count, Q
from reviews.models import Review
from reviews.schemas.response import (
    ReviewDanceClassStatsSchema,
    ReviewFacilitiesStatsSchema,
    ReviewInstructorStatsSchema,
    AggregatedReviewStatsSchema,
)
from django.db.models import QuerySet

class ReviewStatsService:
    @staticmethod
    def get_class_stats(class_id: str) -> AggregatedReviewStatsSchema:
        """Get comprehensive review statistics for a class"""
        reviews = Review.objects.filter(dance_class_id=class_id)

        # Get basic stats
        basic_stats = reviews.aggregate(
            total=Count('id'),
            avg_rating=Avg('overall_rating'),
            verified_count=Count('id', filter=Q(is_verified=True))
        )

        return AggregatedReviewStatsSchema(
            total_reviews=basic_stats['total'],
            average_rating=basic_stats['avg_rating'] or Decimal(0.0),
            verified_reviews=basic_stats['verified_count'],
            instructor_stats=ReviewStatsService._calculate_instructor_stats(reviews),
            facilities_stats=ReviewStatsService._calculate_facilities_stats(reviews),
            dance_class_stats=ReviewStatsService._calculate_dance_class_stats(reviews)
        )

    @staticmethod
    def _calculate_instructor_stats(reviews: QuerySet[Review]) -> ReviewInstructorStatsSchema:
        return ReviewInstructorStatsSchema(
            move_breakdown=reviews.aggregate(Avg('instructor_stats__move_breakdown'))['instructor_stats__move_breakdown__avg'] or 0.0
        )

    @staticmethod
    def _calculate_facilities_stats(reviews: QuerySet[Review]) -> ReviewFacilitiesStatsSchema:
        return ReviewFacilitiesStatsSchema(
            cleanness=reviews.aggregate(Avg('facilities_stats__cleanness'))['facilities_stats__cleanness__avg'] or 0.0
        )

    @staticmethod
    def _calculate_dance_class_stats(reviews: QuerySet[Review]) -> ReviewDanceClassStatsSchema:
        stats = reviews.aggregate(
            group_size_avg=Avg('dance_class_stats__group_size'),
            level_avg=Avg('dance_class_stats__level'),
            engagement_avg=Avg('dance_class_stats__engagement'),
            teaching_pace_avg=Avg('dance_class_stats__teaching_pace')
        )
        return ReviewDanceClassStatsSchema(
            group_size=stats['group_size_avg'] or 0.0,
            level=stats['level_avg'] or 0.0,
            engagement=stats['engagement_avg'] or 0.0,
            teaching_pace=stats['teaching_pace_avg'] or 0.0
        )


from datetime import datetime
from decimal import Decimal
from typing import List, Optional, Dict
from ninja import Schema
from pydantic import Field

from .base import (
    TeachingApproachSchema,
    EnvironmentSchema,
    MusicSchema,
    FacilitiesSchema
)


class ReviewInstructorStatsSchema(Schema):
    move_breakdown: float

class ReviewDanceClassStatsSchema(Schema):
    group_size: float
    level: float
    engagement: float
    teaching_pace: float

class ReviewFacilitiesStatsSchema(Schema):
    cleanness: float


# ------------------------------------------------------------

class ReviewResponseSchema(Schema):
    id: str
    created_at: datetime
    updated_at: datetime
    overall_rating: int
    comment: str

    instructor_stats: ReviewInstructorStatsSchema
    facilities_stats: ReviewFacilitiesStatsSchema
    dance_class_stats: ReviewDanceClassStatsSchema

    author_name: Optional[str]
    verified: bool = Field(False)



    def get_relative_time(self) -> str:
        """Returns a human-readable relative time string"""
        now = datetime.now()
        delta = now - self.created_at

        if delta.days > 365:
            years = delta.days // 365
            return f"{years} year{'s' if years != 1 else ''} ago"
        elif delta.days > 30:
            months = delta.days // 30
            return f"{months} month{'s' if months != 1 else ''} ago"
        elif delta.days > 0:
            return f"{delta.days} day{'s' if delta.days != 1 else ''} ago"
        elif delta.seconds > 3600:
            hours = delta.seconds // 3600
            return f"{hours} hour{'s' if hours != 1 else ''} ago"
        elif delta.seconds > 60:
            minutes = delta.seconds // 60
            return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
        else:
            return "just now"


class ReviewListSchema(Schema):
    items: List[ReviewResponseSchema]
    total: int
    page: int
    pages: int
    has_next: bool
    has_prev: bool


class AggregatedReviewStatsSchema(Schema):
    total_reviews: int
    verified_reviews: int
    average_rating: Decimal

    instructor_stats: ReviewInstructorStatsSchema
    facilities_stats: ReviewFacilitiesStatsSchema
    dance_class_stats: ReviewDanceClassStatsSchema

from datetime import datetime
from typing import List, Optional, TypeVar
from ninja import Schema
from pydantic import Field


class ReviewLocationStatsSchema(Schema):
    cleanness: float
    general_look: float
    acustic_quality: float
    additional_facilities: float
    temperature: float
    lighting: float
    avg_rating: float


class ReviewDanceClassStatsSchema(Schema):
    group_size: float
    level: float
    engagement: float
    teaching_pace: float
    avg_rating: float


class ReviewInstructorStatsSchema(Schema):
    move_breakdown: float
    individual_approach: float
    posture_correction_ability: float
    communication_and_feedback: float
    patience_and_encouragement: float
    motivation_and_energy: float
    avg_rating: float



# ------------------------------------------------------------

class ReviewResponseSchema(Schema):
    id: str
    created_at: datetime
    updated_at: datetime
    overall_rating: int
    comment: str

    instructor_stats: ReviewInstructorStatsSchema
    location_stats: ReviewLocationStatsSchema
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

class ReviewListSchema[T](Schema):
    items: List[T]
    total: int
    page: int
    pages: int
    has_next: bool
    has_prev: bool


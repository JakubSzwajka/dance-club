from typing import List, Optional
from ninja import Schema
from datetime import datetime


class TeachingApproachSchema(Schema):
    teaching_style: int  # 0-100
    feedback_approach: int  # 0-100
    pace_of_teaching: int  # 0-100
    breakdown_quality: int  # 1-5


class EnvironmentSchema(Schema):
    floor_quality: int  # 1-5
    crowdedness: int  # 1-5
    ventilation: int  # 1-5
    temperature: str  # cool, moderate, warm


class MusicSchema(Schema):
    volume_level: int  # 1-5
    style: int  # 0-100 (classical to modern)
    genres: List[str]


class FacilitiesSchema(Schema):
    has_changing_room: bool
    changing_room_quality: Optional[int] = None  # 1-5
    changing_room_notes: Optional[str] = ""
    waiting_area_available: bool
    waiting_area_type: Optional[str] = None  # indoor, outdoor, both
    has_seating: bool
    waiting_area_notes: Optional[str] = ""
    accepted_cards: List[str]


class ReviewSchema(Schema):
    """Full review information returned to frontend"""

    id: str
    dance_class_id: str
    user_id: Optional[str]
    user_name: str  # Either user's name or anonymous_name
    overall_rating: int
    comment: str
    is_verified: bool
    created_at: datetime
    teaching_approach: TeachingApproachSchema
    environment: EnvironmentSchema
    music: MusicSchema
    facilities: FacilitiesSchema


class ReviewStatsSchema(Schema):
    """Aggregated review statistics"""

    average_rating: float
    total_reviews: int
    verified_reviews: int
    rating_distribution: dict  # {1: count, 2: count, ...}
    teaching_stats: dict  # Aggregated teaching approach stats
    environment_stats: dict  # Aggregated environment stats
    music_stats: dict  # Aggregated music stats
    facilities_stats: dict  # Aggregated facilities stats


class ReviewCreateSchema(Schema):
    """Schema for creating a new review"""

    user_id: Optional[str]
    anonymous_name: Optional[str]
    overall_rating: int
    comment: str
    teaching_approach: TeachingApproachSchema
    environment: EnvironmentSchema
    music: MusicSchema
    facilities: FacilitiesSchema


class ReviewListSchema(Schema):
    """Paginated list of reviews"""

    items: List[ReviewSchema]
    total: int
    page: int
    pages: int
    has_next: bool
    has_prev: bool

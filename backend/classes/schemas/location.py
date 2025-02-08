from ninja import Schema
from typing import Optional, List

from shared.const import Facilities, SportsCard


class LocationSchema(Schema):
    id: str
    name: str
    address: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    url: Optional[str] = None
    facilities: List[Facilities]
    sports_card: List[SportsCard]


class LocationStatsSchema(Schema):
    total_classes: int
    total_reviews: int
    avg_rating: float
    total_students: int
    total_hours: int

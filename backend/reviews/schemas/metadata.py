from typing import List
from ninja import Schema

from reviews.constants import (
    TEMPERATURE_OPTIONS,
    WAITING_AREA_OPTIONS,
    VERIFICATION_METHODS,
)
from shared.const import DanceStyle, MusicGenre, SkillLevel, SportsCard

class MetadataSchema(Schema):
    dance_styles: List[DanceStyle]
    skill_levels: List[SkillLevel]
    music_genres: List[MusicGenre]
    sports_cards: List[SportsCard]

class ReviewMetadataSchema(Schema):
    temperature_options: List[str] = TEMPERATURE_OPTIONS
    waiting_area_types: List[str] = WAITING_AREA_OPTIONS
    verification_methods: List[str] = VERIFICATION_METHODS
    rating_scale: dict = {
        "min": 1,
        "max": 5,
        "labels": {
            "1": "Poor",
            "2": "Fair",
            "3": "Good",
            "4": "Very Good",
            "5": "Excellent"
        }
    }
    teaching_style_scale: dict = {
        "min": 0,
        "max": 100,
        "labels": {
            "left": "Structured",
            "right": "Casual"
        }
    }
    feedback_approach_scale: dict = {
        "min": 0,
        "max": 100,
        "labels": {
            "left": "Verbal",
            "right": "Hands-on"
        }
    }
    pace_scale: dict = {
        "min": 0,
        "max": 100,
        "labels": {
            "left": "Methodical",
            "right": "Fast-paced"
        }
    }
    music_style_scale: dict = {
        "min": 0,
        "max": 100,
        "labels": {
            "left": "Classical",
            "right": "Modern"
        }
    }
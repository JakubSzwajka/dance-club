from typing import List, Optional
from pydantic import BaseModel, Field, field_validator, ValidationInfo
from typing_extensions import Annotated

from reviews.constants import (
    TEACHING_STYLE_MIN,
    TEACHING_STYLE_MAX,
    FEEDBACK_APPROACH_MIN,
    FEEDBACK_APPROACH_MAX,
    PACE_OF_TEACHING_MIN,
    PACE_OF_TEACHING_MAX,
    BREAKDOWN_QUALITY_MIN,
    BREAKDOWN_QUALITY_MAX,
    RATING_MIN,
    RATING_MAX,
    TEMPERATURE_OPTIONS,
    VOLUME_MIN,
    VOLUME_MAX,
    MUSIC_STYLE_MIN,
    MUSIC_STYLE_MAX,
    WAITING_AREA_OPTIONS,
)


class TeachingApproachSchema(BaseModel):
    teaching_style: Annotated[
        int,
        Field(
            ge=TEACHING_STYLE_MIN,
            le=TEACHING_STYLE_MAX,
            description="Balance between structured (0) and casual (100) teaching",
        ),
    ]
    feedback_approach: Annotated[
        int,
        Field(
            ge=FEEDBACK_APPROACH_MIN,
            le=FEEDBACK_APPROACH_MAX,
            description="Balance between verbal (0) and hands-on (100) feedback",
        ),
    ]
    pace_of_teaching: Annotated[
        int,
        Field(
            ge=PACE_OF_TEACHING_MIN,
            le=PACE_OF_TEACHING_MAX,
            description="Balance between methodical (0) and fast-paced (100)",
        ),
    ]
    breakdown_quality: Annotated[
        int,
        Field(
            ge=BREAKDOWN_QUALITY_MIN,
            le=BREAKDOWN_QUALITY_MAX,
            description="Quality of move breakdowns (1-5)",
        ),
    ]

    model_config = {"from_attributes": True}


class EnvironmentSchema(BaseModel):
    floor_quality: Annotated[
        int,
        Field(
            ge=RATING_MIN, le=RATING_MAX, description="Rating of floor quality (1-5)"
        ),
    ]
    crowdedness: Annotated[
        int,
        Field(
            ge=RATING_MIN,
            le=RATING_MAX,
            description="Rating of space comfort/crowdedness (1-5)",
        ),
    ]
    ventilation: Annotated[
        int,
        Field(
            ge=RATING_MIN,
            le=RATING_MAX,
            description="Rating of ventilation quality (1-5)",
        ),
    ]
    temperature: Annotated[str, Field(description="Temperature of the environment")]

    @field_validator("temperature")
    @classmethod
    def validate_temperature(cls, v: str) -> str:
        if v not in TEMPERATURE_OPTIONS:
            raise ValueError(
                f"Temperature must be one of: {', '.join(TEMPERATURE_OPTIONS)}"
            )
        return v

    model_config = {"from_attributes": True}


class MusicSchema(BaseModel):
    volume_level: Annotated[
        int,
        Field(ge=VOLUME_MIN, le=VOLUME_MAX, description="Rating of music volume (1-5)"),
    ]
    genres: Annotated[
        List[str],
        Field(min_length=1, description="List of music genres played in class"),
    ]
    style: Annotated[
        int,
        Field(
            ge=MUSIC_STYLE_MIN,
            le=MUSIC_STYLE_MAX,
            description="Balance between classical (0) and modern (100) music",
        ),
    ]

    model_config = {"from_attributes": True}


class ChangingRoomSchema(BaseModel):
    available: Annotated[bool, Field(description="Whether changing room is available")]
    quality: Annotated[
        Optional[int],
        Field(
            None,
            ge=RATING_MIN,
            le=RATING_MAX,
            description="Rating of changing room quality (1-5), if available",
        ),
    ]
    notes: Annotated[
        Optional[str],
        Field(
            None, max_length=500, description="Additional notes about the changing room"
        ),
    ]

    model_config = {"from_attributes": True}


class WaitingAreaSchema(BaseModel):
    available: Annotated[bool, Field(description="Whether waiting area is available")]
    type: Annotated[Optional[str], Field(None, description="Type of waiting area")]
    seating: Annotated[
        Optional[bool], Field(None, description="Whether seating is available")
    ]
    notes: Annotated[
        Optional[str],
        Field(
            None, max_length=500, description="Additional notes about the waiting area"
        ),
    ]

    @field_validator("type")
    @classmethod
    def validate_type(cls, v: Optional[str], info: ValidationInfo) -> Optional[str]:
        if info.data.get("available") and not v:
            raise ValueError("Type must be specified if waiting area is available")
        if v and v not in WAITING_AREA_OPTIONS:
            raise ValueError(f"Type must be one of: {', '.join(WAITING_AREA_OPTIONS)}")
        return v

    model_config = {"from_attributes": True}


class FacilitiesSchema(BaseModel):
    changing_room: ChangingRoomSchema
    waiting_area: WaitingAreaSchema
    accepted_cards: Annotated[
        List[str], Field(min_length=1, description="List of accepted sports cards")
    ]

    model_config = {"from_attributes": True}

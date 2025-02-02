from typing import Optional
from ninja import Schema
from pydantic import Field, validator

from .base import (
    TeachingApproachSchema,
    EnvironmentSchema,
    MusicSchema,
    FacilitiesSchema
)

class ReviewCreateSchema(Schema):
    overall_rating: int = Field(
        ...,
        ge=1,
        le=5,
        description="Overall rating for the class (1-5)"
    )
    comment: str = Field(
        ...,
        min_length=10,
        max_length=2000,
        description="Main review comment"
    )
    teaching: TeachingApproachSchema
    environment: EnvironmentSchema
    music: MusicSchema
    facilities: FacilitiesSchema
    anonymous: bool = Field(
        False,
        description="Whether to post the review anonymously"
    )

    @validator('comment')
    def validate_comment(cls, v):
        if len(v.strip()) < 10:
            raise ValueError("Comment must contain at least 10 non-whitespace characters")
        return v
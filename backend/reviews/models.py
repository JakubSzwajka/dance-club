from accounts.models import User
from classes.models import DanceClass
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from mydanceclub.models import BaseModel
from .schemas.response import ReviewDanceClassStatsSchema, ReviewFacilitiesStatsSchema, ReviewInstructorStatsSchema, ReviewResponseSchema


class DanceClassReview(BaseModel):
    group_size = models.FloatField(
        validators=[MinValueValidator(-10), MaxValueValidator(10)],
        help_text="Rating (-10 to 10) of the group size. Where -10 is the worst, 0 is perfect and 10 is too much"
    )
    level = models.FloatField(
        validators=[MinValueValidator(-10), MaxValueValidator(10)],
        help_text="Rating (-10 to 10) of the level of the class. Where -10 is the worst, 0 is perfect and 10 is too much"
    )
    engagement = models.FloatField(
        validators=[MinValueValidator(-10), MaxValueValidator(10)],
        help_text="Rating (-10 to 10) of the engagement of the class. Where -10 is the worst and 10 is the best"
    )
    teaching_pace = models.FloatField(
        validators=[MinValueValidator(-10), MaxValueValidator(10)],
        help_text="Rating (-10 to 10) of the teaching pace of the class. Where -10 is the worst, 0 is perfect and 10 is too much"
    )

    def to_schema(self) -> ReviewDanceClassStatsSchema:
        return ReviewDanceClassStatsSchema(
            group_size=self.group_size,
            level=self.level,
            engagement=self.engagement,
            teaching_pace=self.teaching_pace
        )


class InstructorReview(BaseModel):
    move_breakdown = models.FloatField(
        validators=[MinValueValidator(-10), MaxValueValidator(10)],
        help_text="Rating (-10 to 10) of the instructor's move breakdown. Where -10 is the worst, 0 is perfect and 10 is too much"
    )

    def to_schema(self) -> ReviewInstructorStatsSchema:
        return ReviewInstructorStatsSchema(
            move_breakdown=self.move_breakdown
        )

class FacilitiesReview(BaseModel):
    cleanness = models.FloatField(
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        help_text="Rating (1 to 10) of the facilities cleanliness. Where 1 is the worst and 10 is the best"
    )

    def to_schema(self) -> ReviewFacilitiesStatsSchema:
        return ReviewFacilitiesStatsSchema(
            cleanness=self.cleanness
        )


class Review(BaseModel):
    dance_class = models.ForeignKey(
        DanceClass,
        on_delete=models.CASCADE,
        related_name='reviews',
        help_text="The dance class being reviewed"
    )
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviews',
        help_text="The user submitting the review. Can be null for anonymous reviews"
    )
    anonymous_name = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        help_text="Display name for anonymous reviews. Required if user is not provided"
    )

    overall_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Overall rating (1-5) for the dance class experience"
    )
    comment = models.TextField(
        help_text="General comments and observations about the dance class experience"
    )

    is_verified = models.BooleanField(
        default=False,
        help_text="Indicates whether the review has been verified by staff"
    )

    instructor_stats = models.OneToOneField(
        InstructorReview,
        on_delete=models.CASCADE,
        related_name='+',
        help_text="Review of the instructor's teaching approach"
    )

    dance_class_stats = models.OneToOneField(
        DanceClassReview,
        on_delete=models.CASCADE,
        related_name='+',
        help_text="Review of the dance class experience"
    )

    facilities_stats = models.OneToOneField(
        FacilitiesReview,
        on_delete=models.CASCADE,
        related_name='+',
        help_text="Review of the supporting facilities and amenities"
    )


    def to_schema(self) -> ReviewResponseSchema:
        return ReviewResponseSchema(
            id=self.id,
            created_at=self.created_at,
            updated_at=self.updated_at,
            overall_rating=self.overall_rating,
            comment=self.comment,
            instructor_stats=self.instructor_stats.to_schema(),
            dance_class_stats=self.dance_class_stats.to_schema(),
            facilities_stats=self.facilities_stats.to_schema(),
            author_name=self.anonymous_name if self.anonymous_name else self.user.username if self.user else None,
            verified=self.is_verified
        )


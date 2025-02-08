from accounts.models import User
from classes.models import DanceClass, Location
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from mydanceclub.models import BaseModel
from .schemas.response import (
    ReviewDanceClassStatsSchema,
    ReviewInstructorStatsSchema,
    ReviewLocationStatsSchema,
)


class DanceClassReview(BaseModel):
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="dance_class_reviews",
        help_text="The user submitting the review. Can be null for anonymous reviews",
    )
    anonymous_name = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        help_text="Display name for anonymous reviews. Required if user is not provided",
    )

    is_verified = models.BooleanField(
        default=False,
        help_text="Indicates whether the review has been verified by staff",
    )

    # ------------------------------------------

    dance_class = models.ForeignKey(
        DanceClass,
        on_delete=models.CASCADE,
        related_name="reviews",
        help_text="The dance class being reviewed",
    )

    group_size = models.FloatField(
        validators=[MinValueValidator(-10), MaxValueValidator(10)],
        help_text="Rating (-10 to 10) of the group size. Where -10 is the worst, 0 is perfect and 10 is too much",
    )
    level = models.FloatField(
        validators=[MinValueValidator(-10), MaxValueValidator(10)],
        help_text="Rating (-10 to 10) of the level of the class. Where -10 is the worst, 0 is perfect and 10 is too much",
    )
    engagement = models.FloatField(
        validators=[MinValueValidator(-10), MaxValueValidator(10)],
        help_text="Rating (-10 to 10) of the engagement of the class. Where -10 is the worst and 10 is the best",
    )
    teaching_pace = models.FloatField(
        validators=[MinValueValidator(-10), MaxValueValidator(10)],
        help_text="Rating (-10 to 10) of the teaching pace of the class. Where -10 is the worst, 0 is perfect and 10 is too much",
    )

    overall_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Overall rating (1-5) for the dance class experience",
    )
    comment = models.TextField(
        help_text="General comments and observations about the dance class experience"
    )

    def get_author_name(self) -> str:
        if self.user:
            return self.user.first_name + " " + self.user.last_name
        return self.anonymous_name or "Unknown"

    def to_schema(self) -> ReviewDanceClassStatsSchema:
        return ReviewDanceClassStatsSchema(
            id=self.id,
            group_size=self.group_size,
            level=self.level,
            engagement=self.engagement,
            teaching_pace=self.teaching_pace,
            avg_rating=self.overall_rating,
            updated_at=self.updated_at,
            author_name=self.get_author_name(),
            comment=self.comment,
            created_at=self.created_at,
        )


class InstructorReview(BaseModel):
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="instructor_reviews",
        help_text="The user submitting the review. Can be null for anonymous reviews",
    )
    anonymous_name = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        help_text="Display name for anonymous reviews. Required if user is not provided",
    )

    is_verified = models.BooleanField(
        default=False,
        help_text="Indicates whether the review has been verified by staff",
    )

    # ------------------------------------------

    instructor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="reviews",
        help_text="The instructor being reviewed",
    )
    move_breakdown = models.FloatField(
        validators=[MinValueValidator(-10), MaxValueValidator(10)],
        help_text="Rating (-10 to 10) of the instructor's move breakdown. Where -10 is the worst, 0 is perfect and 10 is too much",
    )
    individual_approach = models.FloatField(
        validators=[MinValueValidator(-10), MaxValueValidator(10)],
        help_text="Rating (-10 to 10) of the instructor's individual approach. Where -10 is the worst, 0 is perfect and 10 is too much",
    )
    posture_correction_ability = models.FloatField(
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        help_text="Rating (1 to 10) of the instructor's posture correction ability. Where 1 is the worst and 10 is the best",
    )
    communication_and_feedback = models.FloatField(
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        help_text="Rating (1 to 10) of the instructor's communication and feedback. Where 1 is the worst and 10 is the best",
    )
    patience_and_encouragement = models.FloatField(
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        help_text="Rating (1 to 10) of the instructor's patience and encouragement. Where 1 is the worst and 10 is the best",
    )
    motivation_and_energy = models.FloatField(
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        help_text="Rating (1 to 10) of the instructor's motivation and energy. Where 1 is the worst and 10 is the best",
    )

    overall_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Overall rating (1-5) for the dance class experience",
    )
    comment = models.TextField(
        help_text="General comments and observations about the dance class experience"
    )

    def get_author_name(self) -> str:
        if self.user:
            return self.user.first_name + " " + self.user.last_name
        return self.anonymous_name or "Unknown"

    def to_schema(self) -> ReviewInstructorStatsSchema:
        return ReviewInstructorStatsSchema(
            id=self.id,
            author_name=self.get_author_name(),
            comment=self.comment,
            created_at=self.created_at,
            updated_at=self.updated_at,
            move_breakdown=self.move_breakdown,
            individual_approach=self.individual_approach,
            posture_correction_ability=self.posture_correction_ability,
            communication_and_feedback=self.communication_and_feedback,
            patience_and_encouragement=self.patience_and_encouragement,
            motivation_and_energy=self.motivation_and_energy,
            avg_rating=self.overall_rating,
        )


class LocationReview(BaseModel):
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="location_reviews",
        help_text="The user submitting the review. Can be null for anonymous reviews",
    )
    anonymous_name = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        help_text="Display name for anonymous reviews. Required if user is not provided",
    )

    is_verified = models.BooleanField(
        default=False,
        help_text="Indicates whether the review has been verified by staff",
    )
    # ------------------------------------------

    location = models.ForeignKey(
        Location,
        on_delete=models.CASCADE,
        related_name="reviews",
        help_text="The location being reviewed",
    )
    cleanness = models.FloatField(
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        help_text="Rating (1 to 10) of the facilities cleanliness. Where 1 is the worst and 10 is the best",
    )
    general_look = models.FloatField(
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        help_text="Rating (1 to 10) of the general look of the facilities. Where 1 is the worst and 10 is the best",
    )
    acustic_quality = models.FloatField(
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        help_text="Rating (1 to 10) of the acustic quality of the facilities. Where 1 is the worst and 10 is the best",
    )
    additional_facilities = models.FloatField(
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        help_text="Rating (1 to 10) of the additional facilities of the facilities. Where 1 is the worst and 10 is the best",
    )
    temperature = models.FloatField(
        validators=[MinValueValidator(-10), MaxValueValidator(10)],
        help_text="Rating (-10 to 10) of the temperature of the facilities. Where -10 is the worst and 10 is the best",
    )
    lighting = models.FloatField(
        validators=[MinValueValidator(-10), MaxValueValidator(10)],
        help_text="Rating (-10 to 10) of the lighting of the facilities. Where -10 is the worst and 10 is the best",
    )

    overall_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Overall rating (1-5) for the dance class experience",
    )
    comment = models.TextField(
        help_text="General comments and observations about the dance class experience"
    )

    def get_author_name(self) -> str:
        if self.user:
            return self.user.first_name + " " + self.user.last_name
        return self.anonymous_name or "Unknown"

    def to_schema(self) -> ReviewLocationStatsSchema:
        return ReviewLocationStatsSchema(
            id=self.id,
            author_name=self.get_author_name(),
            comment=self.comment,
            created_at=self.created_at,
            updated_at=self.updated_at,
            cleanness=self.cleanness,
            general_look=self.general_look,
            acustic_quality=self.acustic_quality,
            additional_facilities=self.additional_facilities,
            temperature=self.temperature,
            lighting=self.lighting,
            avg_rating=self.overall_rating,
        )

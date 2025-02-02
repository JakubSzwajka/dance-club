from accounts.models import User
from classes.models import DanceClass, Location
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from mydanceclub.models import BaseModel
from typing import TYPE_CHECKING
from .schemas.review import (
    TeachingApproachSchema,
    EnvironmentSchema,
    MusicSchema,
    FacilitiesSchema
)

if TYPE_CHECKING:
    from .schemas.review import ReviewSchema

# Common choices that can be easily localized
MUSIC_GENRES = [
    ('latin', 'Latin'),
    ('ballroom', 'Ballroom'),
    ('pop', 'Pop'),
    ('contemporary', 'Contemporary'),
    ('jazz', 'Jazz'),
    ('classical', 'Classical'),
    ('electronic', 'Electronic'),
    ('rock', 'Rock'),
    ('fusion', 'Fusion'),
]

SPORTS_CARDS = [
    ('multisport', 'MultiSport'),
    ('medicover', 'Medicover Sport'),
    ('ok_system', 'OK System'),
    ('benefit', 'Benefit Systems'),
    ('fitprofit', 'FitProfit'),
]


class TeachingApproachReview(BaseModel):
    """Detailed review of the teaching approach in a dance class.

    This model captures various aspects of the instructor's teaching methodology,
    including their teaching style, how they provide feedback, the pace of the class,
    and how well they break down complex moves.
    """
    teaching_style = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Slider position indicating teaching style: 0 represents a highly structured approach with "
                 "set routines and patterns, while 100 represents a more casual, freestyle approach"
    )
    feedback_approach = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Slider position indicating feedback style: 0 represents primarily verbal instructions and "
                 "corrections, while 100 represents hands-on adjustments and demonstrations"
    )
    pace_of_teaching = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Slider position indicating teaching pace: 0 represents a methodical, step-by-step approach, "
                 "while 100 represents a faster-paced, intensive learning style"
    )
    breakdown_quality = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating (1-5) for how effectively the instructor breaks down and explains complex dance moves"
    )

    def __str__(self):
        style_desc = "Casual" if self.teaching_style > 50 else "Structured"
        feedback_desc = "Hands-on" if self.feedback_approach > 50 else "Verbal"
        pace_desc = "Fast-paced" if self.pace_of_teaching > 50 else "Methodical"
        return f"{style_desc} teaching ({self.breakdown_quality}/5), {feedback_desc} feedback, {pace_desc} pace"

    def to_schema(self) -> TeachingApproachSchema:
        return TeachingApproachSchema(
            teaching_style=self.teaching_style,
            feedback_approach=self.feedback_approach,
            pace_of_teaching=self.pace_of_teaching,
            breakdown_quality=self.breakdown_quality
        )


class EnvironmentReview(BaseModel):
    """Review of the dance class environment and physical conditions.

    This model evaluates the physical aspects of the dance space that affect
    the learning experience, including floor quality, space utilization,
    and climate control.
    """
    TEMPERATURE_CHOICES = [
        ('cool', 'Cool'),
        ('moderate', 'Moderate'),
        ('warm', 'Warm'),
    ]

    floor_quality = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating (1-5) of the dance floor quality, considering factors like grip, "
                 "smoothness, and maintenance"
    )
    crowdedness = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating (1-5) of space availability per student, where 1 indicates very "
                 "crowded and 5 indicates optimal space"
    )
    ventilation = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating (1-5) of air circulation and freshness in the dance space"
    )
    temperature = models.CharField(
        max_length=20,
        choices=TEMPERATURE_CHOICES,
        default='moderate',
        help_text="General temperature condition of the dance space during class"
    )

    def __str__(self):
        return f"Floor: {self.floor_quality}/5, Space: {self.crowdedness}/5, Air: {self.ventilation}/5, Temp: {self.temperature}"

    def to_schema(self) -> EnvironmentSchema:
        return EnvironmentSchema(
            floor_quality=self.floor_quality,
            crowdedness=self.crowdedness,
            ventilation=self.ventilation,
            temperature=self.temperature
        )


class Genre(BaseModel):
    """Music genre model for standardizing and querying music preferences."""
    code = models.CharField(
        max_length=50,
        unique=True,
        help_text="Unique identifier for the genre"
    )
    name = models.CharField(
        max_length=100,
        help_text="Display name of the genre"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this genre is currently in use"
    )

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['is_active', 'name']),
        ]


class MusicReview(BaseModel):
    """Review of the musical aspects of the dance class.

    This model captures the audio experience during class, including volume
    management, music style preferences, and the variety of genres used.
    Genres are managed through a many-to-many relationship with the Genre model
    for better querying and data consistency.
    """
    volume_level = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating (1-5) of the music volume appropriateness, where 3 is optimal"
    )
    style = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Slider position indicating music style: 0 represents traditional/classical dance music, "
                 "while 100 represents modern/contemporary interpretations"
    )
    genres = models.ManyToManyField(
        Genre,
        related_name='music_reviews',
        help_text="Music genres used in class"
    )

    def __str__(self):
        genre_list = ", ".join(g.name for g in self.genres.all()[:2])
        if self.genres.count() > 2:
            genre_list += "..."
        style_desc = "Modern" if self.style > 50 else "Classical"
        return f"Volume: {self.volume_level}/5, Style: {style_desc}, Genres: {genre_list}"

    def set_genres(self, genre_codes):
        """Helper method to set genres by their codes.

        Args:
            genre_codes: List of genre codes to associate with this review
        """
        # Clear existing genres
        self.genres.clear()
        # Add new genres, ignoring invalid codes
        valid_genres = Genre.objects.filter(code__in=[code.lower() for code in genre_codes], is_active=True)
        self.genres.add(*valid_genres)

    def to_schema(self) -> MusicSchema:
        return MusicSchema(
            volume_level=self.volume_level,
            style=self.style,
            genres=[genre.code for genre in self.genres.all()]
        )


class FacilitiesReview(BaseModel):
    """Review of the dance studio facilities and amenities.

    This model evaluates the supporting facilities that enhance the overall
    dance class experience. It includes changing rooms, waiting areas, and
    accepted payment methods. The model implements conditional validation
    to ensure that related fields are only set when their parent facility
    is available.
    """
    # Changing Room
    has_changing_room = models.BooleanField(
        default=False,
        help_text="Indicates whether a dedicated changing room is available"
    )
    changing_room_quality = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        null=True,
        blank=True,
        help_text="Rating (1-5) of changing room facilities. Only applicable if changing room is available"
    )
    changing_room_notes = models.TextField(
        blank=True,
        help_text="Additional notes about changing room facilities (e.g., lockers, showers)"
    )

    # Waiting Area
    waiting_area_available = models.BooleanField(
        default=False,
        help_text="Indicates whether a dedicated waiting area is available"
    )
    WAITING_AREA_TYPE_CHOICES = [
        ('indoor', 'Indoor'),
        ('outdoor', 'Outdoor'),
        ('both', 'Both'),
    ]
    waiting_area_type = models.CharField(
        max_length=20,
        choices=WAITING_AREA_TYPE_CHOICES,
        null=True,
        blank=True,
        help_text="Type of waiting area provided. Only applicable if waiting area is available"
    )
    has_seating = models.BooleanField(
        default=False,
        help_text="Indicates whether seating is available in the waiting area"
    )
    waiting_area_notes = models.TextField(
        blank=True,
        help_text="Additional notes about waiting area amenities"
    )

    # Sports Cards
    accepted_cards = models.JSONField(
        help_text="List of accepted sports/benefits cards. Valid options are: " +
                 ", ".join(f"'{card[0]}' ({card[1]})" for card in SPORTS_CARDS),
        default=list
    )

    def __str__(self):
        facilities = []
        if self.has_changing_room:
            facilities.append(f"Changing room ({self.changing_room_quality}/5)")
        if self.waiting_area_available:
            facilities.append(f"Waiting area ({self.waiting_area_type})")
        if not facilities:
            facilities.append("No additional facilities")
        return ", ".join(facilities)

    def clean(self):
        """Validate the model based on conditional rules."""
        from django.core.exceptions import ValidationError

        errors = {}

        # Validate changing room fields
        if not self.has_changing_room:
            if self.changing_room_quality is not None:
                errors['changing_room_quality'] = 'Cannot set changing room quality when changing room is not available.'
            if self.changing_room_notes:
                errors['changing_room_notes'] = 'Cannot set changing room notes when changing room is not available.'

        # Validate waiting area fields
        if not self.waiting_area_available:
            if self.waiting_area_type:
                errors['waiting_area_type'] = 'Cannot set waiting area type when waiting area is not available.'
            if self.has_seating:
                errors['has_seating'] = 'Cannot set seating availability when waiting area is not available.'
            if self.waiting_area_notes:
                errors['waiting_area_notes'] = 'Cannot set waiting area notes when waiting area is not available.'

        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        """Override save to ensure clean is called"""
        self.full_clean()
        super().save(*args, **kwargs)

    def set_accepted_cards(self, card_list):
        """Helper method to validate and set accepted cards"""
        valid_cards = [card[0] for card in SPORTS_CARDS]
        self.accepted_cards = [card for card in card_list if card in valid_cards]

    def to_schema(self) -> FacilitiesSchema:
        return FacilitiesSchema(
            has_changing_room=self.has_changing_room,
            changing_room_quality=self.changing_room_quality,
            changing_room_notes=self.changing_room_notes,
            waiting_area_available=self.waiting_area_available,
            waiting_area_type=self.waiting_area_type,
            has_seating=self.has_seating,
            waiting_area_notes=self.waiting_area_notes,
            accepted_cards=self.accepted_cards
        )


class Review(BaseModel):
    """Main review model that connects all aspects of a dance class review.

    This model serves as the central point for a complete dance class review,
    connecting various component reviews (teaching, environment, music, facilities)
    and managing reviewer identity. It implements:

    1. Identity Management:
       - Reviews can be submitted by registered users or anonymously
       - Enforces unique reviews per user per class
       - Validates that either user or anonymous name is provided

    2. Component Integration:
       - Links to specialized review components via one-to-one relationships
       - Each component focuses on specific aspects of the dance class experience

    3. Verification System:
       - Tracks verified reviews for enhanced credibility
       - Links to verification details when applicable
    """
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
    teaching_approach = models.OneToOneField(
        TeachingApproachReview,
        on_delete=models.CASCADE,
        related_name='+',
        help_text="Detailed review of the teaching methodology"
    )
    environment = models.OneToOneField(
        EnvironmentReview,
        on_delete=models.CASCADE,
        related_name='+',
        help_text="Review of the physical dance environment"
    )
    music = models.OneToOneField(
        MusicReview,
        on_delete=models.CASCADE,
        related_name='+',
        help_text="Review of the music and audio experience"
    )
    facilities = models.OneToOneField(
        FacilitiesReview,
        on_delete=models.CASCADE,
        related_name='+',
        help_text="Review of the supporting facilities and amenities"
    )

    def clean(self):
        """Validate the model based on conditional rules."""
        from django.core.exceptions import ValidationError

        errors = {}

        # Validate reviewer identity
        if not self.user and not self.anonymous_name:
            errors['user'] = 'Either a user or an anonymous name must be provided.'
            errors['anonymous_name'] = 'Either a user or an anonymous name must be provided.'
        elif self.user and self.anonymous_name:
            errors['user'] = 'Cannot provide both user and anonymous name.'
            errors['anonymous_name'] = 'Cannot provide both user and anonymous name.'

        # Check for existing review by the same user for this class
        if self.user and not self._state.adding and Review.objects.exclude(pk=self.pk).filter(dance_class=self.dance_class, user=self.user).exists():
            errors['user'] = 'You have already submitted a review for this class.'

        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        """Override save to ensure clean is called"""
        self.full_clean()
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['dance_class', '-created_at']),
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['is_verified', '-created_at']),
            models.Index(fields=['overall_rating', '-created_at']),
            models.Index(fields=['dance_class', 'is_verified']),
            models.Index(fields=['dance_class', 'overall_rating']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['dance_class', 'user'],
                name='unique_user_review_per_class',
                condition=models.Q(user__isnull=False)  # Only apply constraint when user is not null
            )
        ]

    def __str__(self):
        return f"Review for {self.dance_class.name} by {self.user.email if self.user else self.anonymous_name}"

    def to_schema(self) -> 'ReviewSchema':
        """Convert the entire review with all its components to a schema"""
        from .schemas.review import ReviewSchema

        return ReviewSchema(
            id=str(self.id),
            dance_class_id=str(self.dance_class.id),
            user_id=str(self.user.id) if self.user else None,
            user_name=self.user.get_full_name() if self.user else self.anonymous_name or "Anonymous",
            overall_rating=self.overall_rating,
            comment=self.comment,
            is_verified=self.is_verified,
            created_at=self.created_at,
            teaching_approach=self.teaching_approach.to_schema(),
            environment=self.environment.to_schema(),
            music=self.music.to_schema(),
            facilities=self.facilities.to_schema()
        )


class ReviewVerification(BaseModel):
    """Track and manage the review verification process.

    This model maintains the audit trail of review verifications, including
    who verified the review, when it was verified, and the method used.
    Verification enhances review credibility and can be done through various
    methods such as class attendance records or purchase history.
    """
    VERIFICATION_METHODS = [
        ('attendance', 'Class Attendance'),
        ('purchase', 'Purchase History'),
        ('manual', 'Manual Verification'),
    ]

    review = models.OneToOneField(
        Review,
        on_delete=models.CASCADE,
        related_name='verification',
        verbose_name="Verified Review",
        help_text="The review being verified"
    )
    verified_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='verified_reviews',
        verbose_name="Verified By",
        help_text="Staff member who performed the verification"
    )
    verification_date = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Verification Date",
        help_text="Date and time when the review was verified"
    )
    verification_method = models.CharField(
        max_length=50,
        choices=VERIFICATION_METHODS,
        verbose_name="Verification Method",
        help_text="Method used to verify the review. 'Class Attendance' indicates verification through "
                 "attendance records, 'Purchase History' through payment records, and 'Manual Verification' "
                 "through staff investigation."
    )
    verification_notes = models.TextField(
        blank=True,
        verbose_name="Verification Notes",
        help_text="Additional notes about the verification process, including any specific checks performed "
                 "or reasons for the verification decision."
    )

    def __str__(self):
        method_dict = dict(self.VERIFICATION_METHODS)
        return f"Review #{self.review.id} verified by {self.verified_by.get_full_name() if self.verified_by else 'Unknown'} " \
               f"via {method_dict.get(self.verification_method, 'Unknown Method')}"

    class Meta:
        verbose_name = "Review Verification"
        verbose_name_plural = "Review Verifications"
        indexes = [
            models.Index(fields=['verification_method', '-verification_date']),
            models.Index(fields=['verified_by', '-verification_date']),
        ]


from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from accounts.models import User
from classes.models import DanceClass


class Review(models.Model):
    MODERATION_STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    dance_class = models.ForeignKey(
        DanceClass, on_delete=models.CASCADE, related_name="reviews"
    )
    student = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="submitted_reviews"
    )
    instruction_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    facility_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    overall_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    helpful_votes = models.ManyToManyField(
        User, related_name="helpful_reviews", blank=True
    )
    moderation_status = models.CharField(
        max_length=10, choices=MODERATION_STATUS_CHOICES, default="pending"
    )
    is_verified = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]


class ReviewResponse(models.Model):
    review = models.OneToOneField(
        Review, on_delete=models.CASCADE, related_name="instructor_response"
    )
    instructor = models.ForeignKey(User, on_delete=models.CASCADE)
    response_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

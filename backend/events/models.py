from django.db import models
from django.core.validators import MinValueValidator
from accounts.models import User
from mydanceclub.models import BaseModel

class Location(BaseModel):
    """Model for storing locations where events can take place"""
    google_place_id = models.CharField(max_length=255, null=True, blank=True, unique=True)
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=500)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    url = models.URLField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.address})"

class SpecialEvent(BaseModel):
    """Model for one-time special events and workshops"""
    name = models.CharField(max_length=255)
    description = models.TextField()
    datetime = models.DateTimeField()
    capacity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    location = models.ForeignKey(Location, on_delete=models.PROTECT)
    instructor = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        limit_choices_to={'role': 'instructor'}
    )
    image = models.ImageField(upload_to='event_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['datetime']

    def __str__(self):
        return f"{self.name} by {self.instructor.get_full_name()} on {self.datetime}"

    @property
    def current_capacity(self):
        return 0
        # return self.participants.count()

    @property
    def is_full(self):
        return self.current_capacity >= self.capacity

class EventParticipant(BaseModel):
    """Model for tracking event participants"""
    event = models.ForeignKey(SpecialEvent, related_name='participants', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='event_participations', on_delete=models.CASCADE)
    registered_at = models.DateTimeField(auto_now_add=True)
    attended = models.BooleanField(default=False)

    class Meta:
        unique_together = ['event', 'user']
        ordering = ['registered_at']

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.event.name}"

class SocialLink(BaseModel):
    """Model for storing social media links for events"""
    event = models.ForeignKey(SpecialEvent, related_name='social_links', on_delete=models.CASCADE)
    platform = models.CharField(max_length=50)  # e.g., Instagram, Facebook, etc.
    url = models.URLField()

    class Meta:
        unique_together = ['event', 'platform']

    def __str__(self):
        return f"{self.platform} link for {self.event.name}"

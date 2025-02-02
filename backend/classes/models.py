from enum import StrEnum
from accounts.models import User
from django.core.validators import MinValueValidator
from django.db import models
from mydanceclub.models import BaseModel
from classes.schemas.location import LocationSchema
from classes.schemas.dance_class import DanceClassSchema, PrivateDanceClassSchema
from shared.const import DanceStyle, SkillLevel

DANCE_STYLES = [
    (DanceStyle.BALLROOM, 'Ballroom'),
    (DanceStyle.LATIN, 'Latin'),
    (DanceStyle.SALSA, 'Salsa'),
    (DanceStyle.TANGO, 'Tango'),
    (DanceStyle.OTHER, 'Other'),
]


SKILL_LEVELS = [
    (SkillLevel.BEGINNER, 'Beginner'),
    (SkillLevel.INTERMEDIATE, 'Intermediate'),
    (SkillLevel.ADVANCED, 'Advanced'),
]

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

    def to_schema(self):
        return LocationSchema(
            id=self.id,
            name=self.name,
            address=self.address,
            latitude=float(self.latitude) if self.latitude else float(0),
            longitude=float(self.longitude) if self.longitude else float(0),
            url=self.url,
        )

class DanceClass(BaseModel):
    """Model for dance classes offered in the platform."""

    name = models.CharField(max_length=100)
    description = models.TextField()
    instructor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='classes')
    level = models.CharField(
        max_length=20,
        choices=SKILL_LEVELS,
    )

    style = models.CharField(max_length=100,
                             choices=DANCE_STYLES)

    max_capacity = models.IntegerField(validators=[MinValueValidator(1)])
    current_capacity = models.IntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateField()  # When the class starts overall
    end_date = models.DateField()  # When the class ends overall
    location = models.ForeignKey(Location, on_delete=models.PROTECT, null=True, blank=True, related_name='classes')

    class Meta:
        db_table = 'dance_classes'
        verbose_name = 'Dance Class'
        verbose_name_plural = 'Dance Classes'

    def __str__(self):
        return f'{self.name} - {self.level}'

    def to_schema(self) -> DanceClassSchema:
        return DanceClassSchema(
            id=self.id,
            name=self.name,
            description=self.description,
            instructor_id=self.instructor.id,
            level=self.level,
            max_capacity=self.max_capacity,
            current_capacity=self.current_capacity,
            price=self.price,
            start_date=self.start_date,
            end_date=self.end_date,
            location=self.location.to_schema() if self.location else None,
            created_at=self.created_at,
            updated_at=self.updated_at,
            style=self.style,
            instructor=self.instructor.to_instructor_schema(),
        )

    def to_private_schema(self) -> PrivateDanceClassSchema:
        public_schema = self.to_schema()
        return PrivateDanceClassSchema(
            **public_schema.model_dump(),
        )

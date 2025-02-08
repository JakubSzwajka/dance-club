from typing import List
from accounts.models import User
from django.db import models
from mydanceclub.models import BaseModel
from classes.schemas.location import LocationSchema
from classes.schemas.dance_class import DanceClassSchema
from shared.const import ClassType, DanceStyle, Facilities, SkillLevel, SportsCard


class Location(BaseModel):
    google_place_id = models.CharField(
        max_length=255, null=True, blank=True, unique=True
    )
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=500)
    latitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    longitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    url = models.URLField(null=True, blank=True)
    phone = models.CharField(max_length=255, null=True, blank=True)
    facilities = models.CharField(
        max_length=1000,
        choices=Facilities.choices,
        blank=True,
        null=True,
    )

    def set_facilities(self, facilities: List[Facilities]):
        self.facilities = ",".join(facilities)

    def get_facilities(self) -> List[Facilities]:
        return (
            [Facilities(facility) for facility in self.facilities.split(",")]
            if self.facilities
            else []
        )

    sports_card = models.CharField(
        max_length=1000,
        choices=SportsCard.choices,
        blank=True,
        null=True,
    )

    def set_sports_card(self, sports_cards: List[SportsCard]):
        self.sports_card = ",".join(sports_cards)

    def get_sports_card(self) -> List[SportsCard]:
        return (
            [SportsCard(card) for card in self.sports_card.split(",")]
            if self.sports_card
            else []
        )

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
            facilities=self.get_facilities(),
            sports_card=self.get_sports_card(),
        )


class DanceClass(BaseModel):
    """Model for dance classes offered in the platform."""

    name = models.CharField(max_length=100)
    description = models.TextField()
    instructor = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="classes"
    )

    level = models.CharField(
        max_length=20,
        choices=SkillLevel.choices,
    )

    style = models.CharField(
        max_length=100,
        choices=DanceStyle.choices,
    )
    formation_type = models.CharField(
        max_length=100,
        choices=ClassType.choices,
    )

    duration = models.IntegerField(help_text="Duration of the class in minutes")

    price = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateField()  # When the class starts overall
    end_date = models.DateField()  # When the class ends overall
    location = models.ForeignKey(
        Location,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="classes",
    )

    def __str__(self):
        return f"{self.name} - {self.level}"

    def to_schema(self) -> DanceClassSchema:
        return DanceClassSchema(
            id=self.id,
            name=self.name,
            description=self.description,
            instructor_id=self.instructor.id,
            level=self.level,
            price=self.price,
            duration=self.duration,
            start_date=self.start_date,
            end_date=self.end_date,
            location=self.location.to_schema() if self.location else None,
            created_at=self.created_at,
            updated_at=self.updated_at,
            style=self.style,
            instructor=self.instructor.to_instructor_schema(),
        )

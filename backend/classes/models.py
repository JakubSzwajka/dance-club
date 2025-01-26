from accounts.models import User
from django.core.validators import MinValueValidator
from django.db import models
from mydanceclub.models import BaseModel
from decimal import Decimal
from classes.schemas.event import SpecialEventSchema
from classes.schemas.location import LocationSchema
from classes.schemas.dance_class import DanceClassSchema, RecurringScheduleSchema, SpecialScheduleSchema



DANCE_STYLES = [
    ('ballroom', 'Ballroom'),
    ('latin', 'Latin'),
    ('salsa', 'Salsa'),
    ('tango', 'Tango'),
    ('other', 'Other'),
]

SKILL_LEVELS = [
    ('beginner', 'Beginner'),
    ('intermediate', 'Intermediate'),
    ('advanced', 'Advanced'),
]

WEEKDAYS = [
    (0, 'Monday'),
    (1, 'Tuesday'),
    (2, 'Wednesday'),
    (3, 'Thursday'),
    (4, 'Friday'),
    (5, 'Saturday'),
    (6, 'Sunday'),
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
            latitude=Decimal(self.latitude) if self.latitude else Decimal(0),
            longitude=Decimal(self.longitude) if self.longitude else Decimal(0),
            url=self.url,
        )

class RecurringSchedule(BaseModel):
    DAYS_OF_WEEK = WEEKDAYS
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('cancelled', 'Cancelled'),
    ]

    day_of_week = models.IntegerField(choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')


    class Meta:
        ordering = ['day_of_week', 'start_time']

    def __str__(self):
        return f'{self.get_day_of_week_display()} {self.start_time} - {self.end_time}'

    def get_day_of_week_display(self):
        days = [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
        ]
        return days[self.day_of_week]

    def to_schema(self) -> RecurringScheduleSchema:
        return RecurringScheduleSchema(
            id=self.id,
            day_of_week=self.day_of_week,
            start_time=self.start_time,
            end_time=self.end_time,
            status=self.status,
            created_at=self.created_at,
            updated_at=self.updated_at,
        )

class SpecialSchedule(BaseModel):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('rescheduled', 'Rescheduled'),
        ('cancelled', 'Cancelled'),
        ('extra', 'Extra Class'),
    ]

    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    replaced_schedule = models.ForeignKey(RecurringSchedule, null=True, blank=True, on_delete=models.SET_NULL)
    replaced_schedule_date = models.DateField(
        null=True,
        blank=True,
        help_text='The specific date of the recurring schedule being replaced',
    )
    note = models.TextField(
        blank=True,
        null=True,
        help_text='For explaining why this special schedule exists',
    )


    class Meta:
        ordering = ['date', 'start_time']

    def __str__(self):
        return f'Special Schedule: {self.date} {self.start_time} - {self.end_time}'

    def clean(self):
        from django.core.exceptions import ValidationError

        # If we have a replaced schedule, we must have a replaced schedule date
        if self.replaced_schedule and not self.replaced_schedule_date:
            raise ValidationError('When replacing a schedule, you must specify the date being replaced.')
        # If we have a replaced schedule date, we must have a replaced schedule
        if self.replaced_schedule_date and not self.replaced_schedule:
            raise ValidationError('Cannot specify a replaced schedule date without a replaced schedule.')

    def to_schema(self) -> SpecialScheduleSchema:
        return SpecialScheduleSchema(
            id=self.id,
            date=self.date,
            start_time=self.start_time,
            end_time=self.end_time,
            status=self.status,
            replaced_schedule_id=self.replaced_schedule.id if self.replaced_schedule else None,
            replaced_schedule_date=self.replaced_schedule_date,
            note=self.note,
            created_at=self.created_at,
            updated_at=self.updated_at,
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
    location = models.ForeignKey(Location, on_delete=models.PROTECT, null=True, blank=True)

    # Schedule relationships
    recurring_schedules = models.ManyToManyField(
        RecurringSchedule,
        related_name='dance_classes',
        blank=True
    )
    special_schedules = models.ManyToManyField(
        SpecialSchedule,
        related_name='dance_classes',
        blank=True
    )

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
            instructor=self.instructor.to_schema(),
            schedules=[schedule.to_schema() for schedule in self.recurring_schedules.all()],
        )

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

    def to_schema(self) -> SpecialEventSchema:
        return SpecialEventSchema(
            id=self.id,
            name=self.name,
            description=self.description,
            datetime=self.datetime,
            capacity=self.capacity,
            price=self.price,
            location=self.location.to_schema(),
            instructor_id=self.instructor.id,
            instructor_name=self.instructor.get_full_name(),
            current_capacity=self.current_capacity,
            created_at=self.created_at,
            updated_at=self.updated_at,
        )

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
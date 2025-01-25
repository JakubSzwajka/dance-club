from accounts.models import User
from django.core.validators import MinValueValidator
from django.db import models
from mydanceclub.models import BaseModel


class DanceClass(BaseModel):
    """Model for dance classes offered in the platform."""

    name = models.CharField(max_length=100)
    description = models.TextField()
    instructor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='classes')
    level = models.CharField(
        max_length=20,
        choices=[
            ('beginner', 'Beginner'),
            ('intermediate', 'Intermediate'),
            ('advanced', 'Advanced'),
        ],
    )
    max_capacity = models.IntegerField(validators=[MinValueValidator(1)])
    current_capacity = models.IntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateField()  # When the class starts overall
    end_date = models.DateField()  # When the class ends overall

    class Meta:
        db_table = 'dance_classes'
        verbose_name = 'Dance Class'
        verbose_name_plural = 'Dance Classes'

    def __str__(self):
        return f'{self.name} - {self.level}'


class RecurringSchedule(BaseModel):
    DAYS_OF_WEEK = [
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('cancelled', 'Cancelled'),
    ]

    dance_class = models.ForeignKey(DanceClass, related_name='recurring_schedules', on_delete=models.CASCADE)
    day_of_week = models.IntegerField(choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')

    class Meta:
        ordering = ['day_of_week', 'start_time']

    def __str__(self):
        return f'{self.dance_class.name} - {self.get_day_of_week_display()} {self.start_time}'

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


class SpecialSchedule(BaseModel):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('rescheduled', 'Rescheduled'),
        ('cancelled', 'Cancelled'),
        ('extra', 'Extra Class'),
    ]

    dance_class = models.ForeignKey(DanceClass, related_name='special_schedules', on_delete=models.CASCADE)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    replaced_schedule = models.ForeignKey('RecurringSchedule', null=True, blank=True, on_delete=models.SET_NULL)
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
        return f'{self.dance_class.name} - Special: {self.date} {self.start_time}'

    def clean(self):
        from django.core.exceptions import ValidationError

        # If we have a replaced schedule, we must have a replaced schedule date
        if self.replaced_schedule and not self.replaced_schedule_date:
            raise ValidationError('When replacing a schedule, you must specify the date being replaced.')
        # If we have a replaced schedule date, we must have a replaced schedule
        if self.replaced_schedule_date and not self.replaced_schedule:
            raise ValidationError('Cannot specify a replaced schedule date without a replaced schedule.')

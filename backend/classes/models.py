from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from accounts.models import User


class DanceClass(models.Model):
    """Model for dance classes offered in the platform."""

    name = models.CharField(max_length=100)
    description = models.TextField()
    instructor = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="classes"
    )
    level = models.CharField(
        max_length=20,
        choices=[
            ("beginner", "Beginner"),
            ("intermediate", "Intermediate"),
            ("advanced", "Advanced"),
        ],
    )
    max_capacity = models.IntegerField(validators=[MinValueValidator(1)])
    current_capacity = models.IntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "dance_classes"
        verbose_name = "Dance Class"
        verbose_name_plural = "Dance Classes"

    def __str__(self):
        return f"{self.name} - {self.level}"


class Schedule(models.Model):
    """Model for class schedules."""

    dance_class = models.ForeignKey(
        DanceClass, on_delete=models.CASCADE, related_name="schedules"
    )
    day_of_week = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(6)],
        help_text="0=Monday, 6=Sunday",
    )
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_recurring = models.BooleanField(default=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ("active", "Active"),
            ("cancelled", "Cancelled"),
            ("full", "Full"),
        ],
        default="active",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "class_schedules"
        verbose_name = "Class Schedule"
        verbose_name_plural = "Class Schedules"

    def __str__(self):
        return f"{self.dance_class.name} - {self.get_day_of_week_display()} {self.start_time}"

    def get_day_of_week_display(self):
        days = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ]
        return days[self.day_of_week]

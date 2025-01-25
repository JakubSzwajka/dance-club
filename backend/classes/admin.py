from django.contrib import admin
from .models import DanceClass, Schedule


@admin.register(DanceClass)
class DanceClassAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "instructor",
        "level",
        "price",
        "current_capacity",
        "max_capacity",
    )
    list_filter = ("level", "instructor")
    search_fields = ("name", "description")


@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ("dance_class", "day_of_week", "start_time", "end_time", "status")
    list_filter = ("day_of_week", "status", "is_recurring")
    search_fields = ("dance_class__name",)

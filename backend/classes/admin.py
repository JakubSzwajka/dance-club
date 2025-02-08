from django.contrib import admin
from django.utils.html import format_html
from unfold.admin import ModelAdmin

from .models import DanceClass, Location


@admin.register(DanceClass)
class DanceClassAdmin(ModelAdmin):
    list_display = (
        "name",
        "instructor",
        "level",
        "style",
        "formation_type",
        "duration",
        "price",
        "start_date",
        "end_date",
    )
    list_filter = ("level", "style", "formation_type", "instructor", "location")
    search_fields = ("name", "description", "instructor__email")
    date_hierarchy = "start_date"
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        (
            "Basic Information",
            {
                "fields": (
                    "name",
                    "description",
                    "instructor",
                    "level",
                    "style",
                    "formation_type",
                    "location",
                )
            },
        ),
        (
            "Class Details",
            {"fields": ("duration", "price")},
        ),
        ("Dates", {"fields": ("start_date", "end_date", "created_at", "updated_at")}),
    )


@admin.register(Location)
class LocationAdmin(ModelAdmin):
    list_display = ("name", "address", "facilities", "sports_card", "show_map_link")
    list_filter = ("facilities", "sports_card")
    search_fields = ("name", "address")
    ordering = ("name",)
    fieldsets = (
        ("Basic Information", {"fields": ("name", "address", "url")}),
        ("Coordinates", {"fields": ("latitude", "longitude")}),
        ("Features", {"fields": ("facilities", "sports_card")}),
    )

    def show_map_link(self, obj):
        if obj.latitude and obj.longitude:
            url = f"https://www.google.com/maps?q={obj.latitude},{obj.longitude}"
            return format_html('<a href="{}" target="_blank">View on Map</a>', url)
        return "No coordinates"

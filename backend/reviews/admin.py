from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import DanceClassReview, InstructorReview, LocationReview


@admin.register(DanceClassReview)
class DanceClassReviewAdmin(ModelAdmin):
    list_display = (
        "dance_class",
        "user",
        "anonymous_name",
        "is_verified",
        "group_size",
        "level",
        "engagement",
        "teaching_pace",
        "overall_rating",
    )
    list_filter = (
        "dance_class",
        "is_verified",
        "level",
        "engagement",
        "overall_rating",
    )
    search_fields = ("dance_class__name", "user__email", "anonymous_name", "comment")
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        ("Author Information", {"fields": ("user", "anonymous_name", "is_verified")}),
        (
            "Review Details",
            {
                "fields": (
                    "dance_class",
                    "group_size",
                    "level",
                    "engagement",
                    "teaching_pace",
                    "overall_rating",
                    "comment",
                )
            },
        ),
        ("Metadata", {"fields": ("created_at", "updated_at")}),
    )


@admin.register(InstructorReview)
class InstructorReviewAdmin(ModelAdmin):
    list_display = (
        "instructor",
        "user",
        "anonymous_name",
        "is_verified",
        "move_breakdown",
        "individual_approach",
        "posture_correction_ability",
        "communication_and_feedback",
        "overall_rating",
    )
    list_filter = (
        "instructor",
        "is_verified",
        "move_breakdown",
        "individual_approach",
        "posture_correction_ability",
        "communication_and_feedback",
        "overall_rating",
    )
    search_fields = (
        "instructor__email",
        "instructor__first_name",
        "instructor__last_name",
        "user__email",
        "anonymous_name",
        "comment",
    )
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        ("Author Information", {"fields": ("user", "anonymous_name", "is_verified")}),
        (
            "Review Details",
            {
                "fields": (
                    "instructor",
                    "move_breakdown",
                    "individual_approach",
                    "posture_correction_ability",
                    "communication_and_feedback",
                    "patience_and_encouragement",
                    "motivation_and_energy",
                    "overall_rating",
                    "comment",
                )
            },
        ),
        ("Metadata", {"fields": ("created_at", "updated_at")}),
    )


@admin.register(LocationReview)
class LocationReviewAdmin(ModelAdmin):
    list_display = (
        "location",
        "user",
        "anonymous_name",
        "is_verified",
        "cleanness",
        "general_look",
        "acustic_quality",
        "overall_rating",
    )
    list_filter = (
        "location",
        "is_verified",
        "cleanness",
        "general_look",
        "acustic_quality",
        "additional_facilities",
        "temperature",
        "lighting",
        "overall_rating",
    )
    search_fields = (
        "location__name",
        "location__address",
        "user__email",
        "anonymous_name",
        "comment",
    )
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        ("Author Information", {"fields": ("user", "anonymous_name", "is_verified")}),
        (
            "Review Details",
            {
                "fields": (
                    "location",
                    "cleanness",
                    "general_look",
                    "acustic_quality",
                    "additional_facilities",
                    "temperature",
                    "lighting",
                    "overall_rating",
                    "comment",
                )
            },
        ),
        ("Metadata", {"fields": ("created_at", "updated_at")}),
    )

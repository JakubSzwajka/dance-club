from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Review, DanceClassReview, InstructorReview, LocationReview


@admin.register(Review)
class ReviewAdmin(ModelAdmin):
    list_display = ("user", "anonymous_name", "is_verified", "created_at")
    list_filter = ("is_verified", "user")
    search_fields = ("anonymous_name", "user__email")
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        ("Basic Information", {"fields": ("user", "anonymous_name")}),
        ("Verification", {"fields": ("is_verified",)}),
        (
            "Component Reviews",
            {"fields": ("instructor_stats", "dance_class_stats", "facilities_stats")},
        ),
        ("Metadata", {"fields": ("created_at", "updated_at")}),
    )


@admin.register(DanceClassReview)
class DanceClassReviewAdmin(ModelAdmin):
    list_display = (
        "dance_class",
        "group_size",
        "level",
        "engagement",
        "teaching_pace",
        "overall_rating",
    )
    list_filter = ("dance_class", "level", "engagement", "overall_rating")
    search_fields = ("dance_class__name", "comment")
    readonly_fields = ("created_at", "updated_at")


@admin.register(InstructorReview)
class InstructorReviewAdmin(ModelAdmin):
    list_display = (
        "instructor",
        "move_breakdown",
        "individual_approach",
        "posture_correction_ability",
        "communication_and_feedback",
        "patience_and_encouragement",
        "motivation_and_energy",
        "overall_rating",
    )
    list_filter = (
        "instructor",
        "move_breakdown",
        "individual_approach",
        "posture_correction_ability",
        "communication_and_feedback",
        "patience_and_encouragement",
        "motivation_and_energy",
        "overall_rating",
    )
    search_fields = (
        "instructor__email",
        "instructor__first_name",
        "instructor__last_name",
        "comment",
    )
    readonly_fields = ("created_at", "updated_at")


@admin.register(LocationReview)
class FacilitiesReviewAdmin(ModelAdmin):
    list_display = (
        "location",
        "cleanness",
        "general_look",
        "acustic_quality",
        "additional_facilities",
        "temperature",
        "lighting",
        "overall_rating",
    )
    list_filter = (
        "location",
        "cleanness",
        "general_look",
        "acustic_quality",
        "additional_facilities",
        "temperature",
        "lighting",
        "overall_rating",
    )
    search_fields = ("location__name", "location__address", "comment")
    readonly_fields = ("created_at", "updated_at")

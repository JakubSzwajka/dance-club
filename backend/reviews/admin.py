from django.contrib import admin
from .models import Review, ReviewResponse


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = (
        "dance_class",
        "student",
        "overall_rating",
        "moderation_status",
        "created_at",
    )
    list_filter = ("moderation_status", "is_verified", "created_at")
    search_fields = ("comment", "dance_class__name", "student__username")


@admin.register(ReviewResponse)
class ReviewResponseAdmin(admin.ModelAdmin):
    list_display = ("review", "instructor", "created_at")
    list_filter = ("created_at",)
    search_fields = ("response_text", "review__comment", "instructor__username")

from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import (
    Review,
    DanceClassReview,
    InstructorReview,
    FacilitiesReview
)

@admin.register(Review)
class ReviewAdmin(ModelAdmin):
    list_display = (
        'dance_class',
        'user',
        'anonymous_name',
        'overall_rating',
        'is_verified',
        'created_at'
    )
    list_filter = ('is_verified', 'overall_rating', 'dance_class', 'user')
    search_fields = ('comment', 'anonymous_name', 'user__email', 'dance_class__name')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('dance_class', 'user', 'anonymous_name', 'overall_rating', 'comment')
        }),
        ('Verification', {
            'fields': ('is_verified',)
        }),
        ('Component Reviews', {
            'fields': ('instructor_stats', 'dance_class_stats', 'facilities_stats')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at')
        }),
    )

@admin.register(DanceClassReview)
class DanceClassReviewAdmin(ModelAdmin):
    list_display = ('group_size', 'level', 'engagement', 'teaching_pace')
    list_filter = ('level', 'engagement')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(InstructorReview)
class InstructorReviewAdmin(ModelAdmin):
    list_display = ('move_breakdown',)
    list_filter = ('move_breakdown',)
    readonly_fields = ('created_at', 'updated_at')

@admin.register(FacilitiesReview)
class FacilitiesReviewAdmin(ModelAdmin):
    list_display = ('cleanness',)
    list_filter = ('cleanness',)
    readonly_fields = ('created_at', 'updated_at')

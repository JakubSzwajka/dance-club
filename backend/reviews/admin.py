from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import (
    Review,
    TeachingApproachReview,
    EnvironmentReview,
    MusicReview,
    FacilitiesReview,
    ReviewVerification
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
            'fields': ('dance_class', 'user', 'anonymous_name', 'overall_rating', 'comment', 'is_verified')
        }),
        ('Component Reviews', {
            'fields': ('teaching_approach', 'environment', 'music', 'facilities')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at')
        }),
    )

@admin.register(TeachingApproachReview)
class TeachingApproachReviewAdmin(ModelAdmin):
    list_display = ('teaching_style', 'feedback_approach', 'pace_of_teaching', 'breakdown_quality')
    list_filter = ('breakdown_quality',)
    readonly_fields = ('created_at', 'updated_at')

@admin.register(EnvironmentReview)
class EnvironmentReviewAdmin(ModelAdmin):
    list_display = ('floor_quality', 'crowdedness', 'ventilation', 'temperature')
    list_filter = ('temperature', 'floor_quality')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(MusicReview)
class MusicReviewAdmin(ModelAdmin):
    list_display = ('volume_level', 'style')
    list_filter = ('volume_level',)
    readonly_fields = ('created_at', 'updated_at')

@admin.register(FacilitiesReview)
class FacilitiesReviewAdmin(ModelAdmin):
    list_display = (
        'has_changing_room',
        'changing_room_quality',
        'waiting_area_available',
        'waiting_area_type'
    )
    list_filter = ('has_changing_room', 'waiting_area_available', 'waiting_area_type')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(ReviewVerification)
class ReviewVerificationAdmin(ModelAdmin):
    list_display = ('review', 'verified_by', 'verification_date', 'verification_method')
    list_filter = ('verification_method', 'verification_date')
    search_fields = ('review__comment', 'verification_notes')
    readonly_fields = ('created_at', 'updated_at', 'verification_date')

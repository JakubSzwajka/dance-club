from django.contrib import admin
from .models import DanceClass, RecurringSchedule, SpecialSchedule


@admin.register(DanceClass)
class DanceClassAdmin(admin.ModelAdmin):
    list_display = ('name', 'instructor', 'level', 'current_capacity', 'max_capacity', 'price', 'start_date', 'end_date')
    list_filter = ('level', 'instructor')
    search_fields = ('name', 'description', 'instructor__email')
    date_hierarchy = 'start_date'
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'instructor', 'level')
        }),
        ('Capacity & Pricing', {
            'fields': ('max_capacity', 'current_capacity', 'price')
        }),
        ('Dates', {
            'fields': ('start_date', 'end_date', 'created_at', 'updated_at')
        }),
    )


@admin.register(RecurringSchedule)
class RecurringScheduleAdmin(admin.ModelAdmin):
    list_display = ('dance_class', 'day_of_week', 'start_time', 'end_time', 'status')
    list_filter = ('status', 'day_of_week', 'dance_class')
    search_fields = ('dance_class__name',)
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Class Information', {
            'fields': ('dance_class',)
        }),
        ('Schedule', {
            'fields': ('day_of_week', 'start_time', 'end_time', 'status')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(SpecialSchedule)
class SpecialScheduleAdmin(admin.ModelAdmin):
    list_display = ('dance_class', 'date', 'start_time', 'end_time', 'status', 'replaced_schedule')
    list_filter = ('status', 'date', 'dance_class')
    search_fields = ('dance_class__name', 'note')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Class Information', {
            'fields': ('dance_class',)
        }),
        ('Schedule', {
            'fields': ('date', 'start_time', 'end_time', 'status')
        }),
        ('Additional Information', {
            'fields': ('replaced_schedule', 'note')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at')
        }),
    )

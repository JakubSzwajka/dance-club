from django.contrib import admin
from django.utils.html import format_html

from .models import DanceClass, RecurringSchedule, SpecialSchedule
from .models import Location, SpecialEvent, EventParticipant


class RecurringScheduleInline(admin.TabularInline):
    model = DanceClass.recurring_schedules.through
    extra = 1
    verbose_name = "Recurring Schedule"
    verbose_name_plural = "Recurring Schedules"


class SpecialScheduleInline(admin.TabularInline):
    model = DanceClass.special_schedules.through
    extra = 1
    verbose_name = "Special Schedule"
    verbose_name_plural = "Special Schedules"


@admin.register(DanceClass)
class DanceClassAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'instructor',
        'level',
        'current_capacity',
        'max_capacity',
        'price',
        'start_date',
        'end_date',
    )
    list_filter = ('level', 'instructor', 'location')
    search_fields = ('name', 'description', 'instructor__email')
    date_hierarchy = 'start_date'
    readonly_fields = ('created_at', 'updated_at')
    inlines = [RecurringScheduleInline, SpecialScheduleInline]
    exclude = ('recurring_schedules', 'special_schedules')  # Hide these fields since we're using inlines
    fieldsets = (
        (
            'Basic Information',
            {'fields': ('name', 'description', 'instructor', 'level', 'location')},
        ),
        (
            'Capacity & Pricing',
            {'fields': ('max_capacity', 'current_capacity', 'price')},
        ),
        ('Dates', {'fields': ('start_date', 'end_date', 'created_at', 'updated_at')}),
    )


@admin.register(RecurringSchedule)
class RecurringScheduleAdmin(admin.ModelAdmin):
    list_display = ('get_classes', 'day_of_week', 'start_time', 'end_time', 'status')
    list_filter = ('status', 'day_of_week', 'dance_classes')
    search_fields = ('dance_classes__name',)
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Schedule', {'fields': ('day_of_week', 'start_time', 'end_time', 'status')}),
        ('Metadata', {'fields': ('created_at', 'updated_at')}),
    )

    def get_classes(self, obj):
        return ", ".join([dc.name for dc in obj.dance_classes.all()])
    get_classes.short_description = 'Dance Classes'


@admin.register(SpecialSchedule)
class SpecialScheduleAdmin(admin.ModelAdmin):
    list_display = (
        'get_classes',
        'date',
        'start_time',
        'end_time',
        'status',
        'replaced_schedule',
        'replaced_schedule_date',
    )
    list_filter = ('status', 'date', 'dance_classes')
    search_fields = ('dance_classes__name', 'note')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Schedule', {'fields': ('date', 'start_time', 'end_time', 'status')}),
        (
            'Additional Information',
            {'fields': ('replaced_schedule', 'replaced_schedule_date', 'note')},
        ),
        ('Metadata', {'fields': ('created_at', 'updated_at')}),
    )

    def get_classes(self, obj):
        return ", ".join([dc.name for dc in obj.dance_classes.all()])
    get_classes.short_description = 'Dance Classes'


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'show_map_link')
    search_fields = ('name', 'address')
    ordering = ('name',)

    def show_map_link(self, obj):
        if obj.latitude and obj.longitude:
            url = f"https://www.google.com/maps?q={obj.latitude},{obj.longitude}"
            return format_html('<a href="{}" target="_blank">View on Map</a>', url)
        return "No coordinates"
    show_map_link.short_description = 'Map'


class EventParticipantInline(admin.TabularInline):
    model = EventParticipant
    extra = 0
    readonly_fields = ('registered_at',)
    raw_id_fields = ('user',)


@admin.register(SpecialEvent)
class SpecialEventAdmin(admin.ModelAdmin):
    list_display = ('name', 'instructor', 'datetime', 'location', 'capacity', 'current_capacity', 'price', 'is_full')
    list_filter = ('instructor', 'location', 'datetime')
    search_fields = ('name', 'description', 'instructor__first_name', 'instructor__last_name')
    raw_id_fields = ('instructor', 'location')
    date_hierarchy = 'datetime'
    inlines = [EventParticipantInline]
    readonly_fields = ('created_at', 'updated_at', 'current_capacity', 'is_full')
    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'instructor')
        }),
        ('Event Details', {
            'fields': ('datetime', 'location', 'capacity', 'price', 'image')
        }),
        ('Status', {
            'fields': ('current_capacity', 'is_full'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(EventParticipant)
class EventParticipantAdmin(admin.ModelAdmin):
    list_display = ('user', 'event', 'registered_at', 'attended')
    list_filter = ('attended', 'registered_at', 'event')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'event__name')
    raw_id_fields = ('user', 'event')
    date_hierarchy = 'registered_at'
    readonly_fields = ('registered_at',)

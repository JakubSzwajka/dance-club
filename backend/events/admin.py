from django.contrib import admin
from django.utils.html import format_html
from .models import Location, SpecialEvent, EventParticipant, SocialLink


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


class SocialLinkInline(admin.TabularInline):
    model = SocialLink
    extra = 1


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
    inlines = [SocialLinkInline, EventParticipantInline]
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


@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    list_display = ('platform', 'url', 'event')
    list_filter = ('platform', 'event')
    search_fields = ('platform', 'url', 'event__name')
    raw_id_fields = ('event',)

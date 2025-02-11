from typing import List, Optional
from django.db import models
from django.db.models import Count, Avg
from classes.models import Location
from classes.schemas.location import LocationSchema
from math import cos, radians


class LocationSearchEngineService:
    def get_locations(
        self,
        has_active_classes: bool = True,
        dance_style: Optional[str] = None,
        level: Optional[str] = None,
        min_classes: Optional[int] = None,
        min_location_rating: Optional[float] = None,
        radius_km: Optional[float] = None,
        facility: Optional[str] = None,
        sports_card: Optional[str] = None,
    ) -> List[LocationSchema]:
        locations = self._get_filtered_locations(
            has_active_classes=has_active_classes,
            dance_style=dance_style,
            level=level,
            min_classes=min_classes,
            min_location_rating=min_location_rating,
            facility=facility,
            sports_card=sports_card,
        )
        return [location.to_schema() for location in locations]
    def get_locations_nearby(
        self,
        has_active_classes: bool = True,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        dance_style: Optional[str] = None,
        level: Optional[str] = None,
        min_classes: Optional[int] = None,
        min_location_rating: Optional[float] = None,
        radius_km: Optional[float] = None,
        facility: Optional[str] = None,
        sports_card: Optional[str] = None,
    ) -> List[LocationSchema]:
        locations = self._get_filtered_locations(
            has_active_classes=has_active_classes,
            dance_style=dance_style,
            level=level,
            min_classes=min_classes,
            min_location_rating=min_location_rating,
            facility=facility,
            sports_card=sports_card,
        )

        if latitude and longitude:
            # Convert kilometers to degrees (approximate)
            # 1 degree of latitude = ~111km
            # 1 degree of longitude = ~111km * cos(latitude)
            radius_km = radius_km or 10  # Default 10km radius, can be made configurable
            lat_degree_delta = radius_km / 111.0
            lng_degree_delta = radius_km / (111.0 * abs(cos(radians(latitude))))

            locations = locations.filter(
                latitude__isnull=False, longitude__isnull=False
            )
            locations = locations.filter(
                models.Q(latitude__lte=latitude + lat_degree_delta)
                & models.Q(latitude__gte=latitude - lat_degree_delta)
                & models.Q(longitude__lte=longitude + lng_degree_delta)
                & models.Q(longitude__gte=longitude - lng_degree_delta)
            )

        return [location.to_schema() for location in locations]

    def _get_filtered_locations(
        self,
        has_active_classes: bool = True,
        dance_style: Optional[str] = None,
        level: Optional[str] = None,
        min_classes: Optional[int] = None,
        min_location_rating: Optional[float] = None,
        facility: Optional[str] = None,
        sports_card: Optional[str] = None,
    ) -> models.QuerySet:
        locations = Location.objects.all()

        # Start with base filtering
        if has_active_classes:
            locations = locations.filter(classes__isnull=False).distinct()

        if dance_style:
            dance_styles = dance_style.split(',')
            locations = locations.filter(classes__style__in=dance_styles)
        if level:
            levels = level.split(',')
            locations = locations.filter(classes__level__in=levels)
        if facility:
            facilities = facility.split(',')
            locations = locations.filter(facilities__in=facilities)
        if sports_card:
            sports_cards = sports_card.split(',')
            locations = locations.filter(sports_card__in=sports_cards)

        # Add annotations for class count and average rating
        locations = locations.annotate(
            class_count=Count('classes', distinct=True),
            avg_rating=Avg('reviews__overall_rating'),
        )

        if min_classes:
            locations = locations.filter(class_count__gte=min_classes)
        if min_location_rating:
            locations = locations.filter(avg_rating__gte=min_location_rating)

        return locations

    def get_location_by_id(self, location_id: str) -> LocationSchema:
        location = Location.objects.get(id=location_id)
        return location.to_schema()

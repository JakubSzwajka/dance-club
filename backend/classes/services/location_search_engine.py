from typing import List, Optional
from django.db import models
from classes.models import Location
from classes.schemas.location import LocationSchema
from math import cos, radians

class LocationSearchEngineService:
    def get_locations(self, has_active_classes: bool = True, latitude: Optional[float] = None, longitude: Optional[float] = None) -> List[LocationSchema]:
        locations = Location.objects.all()
        if has_active_classes:
            locations = locations.filter(classes__isnull=False).distinct()
        if latitude and longitude:
            # Convert kilometers to degrees (approximate)
            # 1 degree of latitude = ~111km
            # 1 degree of longitude = ~111km * cos(latitude)
            radius_km = 10  # Default 10km radius, can be made configurable
            lat_degree_delta = radius_km / 111.0
            lng_degree_delta = radius_km / (111.0 * abs(cos(radians(latitude))))

            locations = locations.filter(latitude__isnull=False, longitude__isnull=False)
            locations = locations.filter(
                models.Q(latitude__lte=latitude + lat_degree_delta) &
                models.Q(latitude__gte=latitude - lat_degree_delta) &
                models.Q(longitude__lte=longitude + lng_degree_delta) &
                models.Q(longitude__gte=longitude - lng_degree_delta)
            )
        return [location.to_schema() for location in locations]

    def get_location_by_id(self, location_id: str) -> LocationSchema:
        location = Location.objects.get(id=location_id)
        return location.to_schema()

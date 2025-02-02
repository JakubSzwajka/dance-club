from typing import List
from classes.models import Location
from classes.schemas.location import LocationSchema


class LocationSearchEngineService:
    def get_locations(self, has_active_classes: bool = True) -> List[LocationSchema]:
        locations = Location.objects.all()
        if has_active_classes:
            locations = locations.filter(dance_classes__is_active=True)
        return [location.to_schema() for location in locations]

    def get_location_by_id(self, location_id: str) -> LocationSchema:
        location = Location.objects.get(id=location_id)
        return location.to_schema()

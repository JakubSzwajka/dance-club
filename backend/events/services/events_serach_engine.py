from datetime import datetime
from typing import List
from django.db.models import F, FloatField, Value
from django.db.models.functions import ACos, Cos, Radians, Sin, Cast
from django.shortcuts import get_object_or_404
from classes.models import SpecialEvent
from classes.schemas.event import SpecialEventSchema

class EventsSearchEngineService:
    def get_events_near_location(self, latitude: float, longitude: float, start_date: str, end_date: str, limit: int = 10) -> List[SpecialEventSchema]:
        user_lat_rad = Radians(Value(latitude, output_field=FloatField()))
        user_lon_rad = Radians(Value(longitude, output_field=FloatField()))

        events = SpecialEvent.objects.annotate(
            distance=Cast(
                ACos(
                    Sin(Radians(F('location__latitude'))) * Sin(user_lat_rad) +
                    Cos(Radians(F('location__latitude'))) * Cos(user_lat_rad) *
                    Cos(Radians(F('location__longitude')) - user_lon_rad)
                ) * Value(6371.0, output_field=FloatField()),
                output_field=FloatField()
            )
        ).order_by('distance')

        if start_date and end_date:
            events = events.filter(datetime__range=[start_date, end_date])

        events = events[:limit]

        return [event.to_schema() for event in events]

    def get_events_by_instructor(self, instructor_id: str, limit: int = 10) -> List[SpecialEventSchema]:
        events = SpecialEvent.objects.filter(instructor_id=instructor_id).order_by('-datetime')[:limit]
        return [event.to_schema() for event in events]

    def get_events_by_location(self, location_id: str, limit: int = 10) -> List[SpecialEventSchema]:
        events = SpecialEvent.objects.filter(location_id=location_id).order_by('-datetime')[:limit]
        return [event.to_schema() for event in events]

    def get_event_by_id(self, event_id: str) -> SpecialEventSchema:
        event = get_object_or_404(SpecialEvent, id=event_id)
        return event.to_schema()

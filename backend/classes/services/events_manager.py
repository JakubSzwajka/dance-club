from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied
from accounts.models import User
from classes.schemas.event import CreateSpecialEventSchema, SpecialEventSchema
from classes.models import Location, SpecialEvent


class EventsManagerService:

    def _get_or_create_location(self, event: CreateSpecialEventSchema) -> Location:
        return Location.objects.get_or_create(
            google_place_id=event.location.google_place_id,
            defaults={
                'name': event.location.name,
                'address': event.location.address,
                'latitude': event.location.latitude,
                'longitude': event.location.longitude,
                'url': event.location.url,
            }
        )[0]

    def create_event(self, instructor: User, event: CreateSpecialEventSchema) -> SpecialEventSchema:
        location = self._get_or_create_location(event)
        return SpecialEvent.objects.create(
            name=event.name,
            description=event.description,
            datetime=event.datetime,
            capacity=event.capacity,
            price=event.price,
            location=location,
            instructor=instructor,
        ).to_schema()


    def update_event(self, instructor: User, event_id: str, event: CreateSpecialEventSchema) -> SpecialEventSchema:
        obj = get_object_or_404(SpecialEvent, id=event_id)
        if instructor.id != obj.instructor.id:
            raise PermissionDenied("You are not allowed to update this event")

        location = self._get_or_create_location(event)
        obj.name = event.name
        obj.description = event.description
        obj.datetime = event.datetime
        obj.capacity = event.capacity
        obj.price = event.price
        obj.location = location
        obj.save()
        return obj.to_schema()

    def delete_event(self, instructor: User, event_id: str) -> None:
        obj = get_object_or_404(SpecialEvent, id=event_id)
        if instructor.id != obj.instructor.id:
            raise PermissionDenied("You are not allowed to delete this event")
        obj.delete()

from typing import List, cast

from accounts.models import User
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from events.models import Location, SpecialEvent, SocialLink
from ninja import Router

from .schemas import CreateSpecialEventSchema, LocationSchema, SocialLinkSchema, SpecialEventSchema
from .types import AuthenticatedRequest

router = Router()


@router.get('/special', response=List[SpecialEventSchema])
def list_special_events(request: AuthenticatedRequest) -> List[SpecialEventSchema]:
    events = SpecialEvent.objects.all()
    if request.auth.role == 'instructor':
        events = events.filter(instructor_id=request.auth.id)
    return [
        SpecialEventSchema(
            id=event.id,
            name=event.name,
            description=event.description,
            datetime=event.datetime,
            capacity=event.capacity,
            current_capacity=event.current_capacity,
            price=event.price,
            location=LocationSchema(
                id=event.location.id,
                name=event.location.name,
                address=event.location.address,
                latitude=float(event.location.latitude) if event.location.latitude else 0,
                longitude=float(event.location.longitude) if event.location.longitude else 0,
                url=event.location.url,
            ),
            instructor_id=event.instructor.id,
            instructor_name=event.instructor.get_full_name(),
            social_links=[
                SocialLinkSchema(
                    platform=link.platform,
                    url=link.url,
                )
                for link in event.social_links.all()
            ],
            created_at=event.created_at,
            updated_at=event.updated_at,
        )
        for event in events
    ]


@router.post('/special', response=SpecialEventSchema)
def create_special_event(request: AuthenticatedRequest, payload: CreateSpecialEventSchema) -> HttpResponse | SpecialEventSchema:
    if request.auth.role != 'instructor':
        return HttpResponse(
            '{"detail": "Only instructors can create special events"}',
            status=403,
            content_type='application/json',
        )

    location = Location.objects.get_or_create(
        google_place_id=payload.location.google_place_id,
        defaults={
            'name': payload.location.name,
            'address': payload.location.address,
            'latitude': payload.location.latitude,
            'longitude': payload.location.longitude,
            'url': payload.location.url,
        }
    )[0]

    event = SpecialEvent.objects.create(
        name=payload.name,
        description=payload.description,
        datetime=payload.datetime,
        capacity=payload.capacity,
        price=payload.price,
        location=location,
        instructor=cast(User, request.auth),
    )

    # Create social links
    social_links = [
        SocialLink.objects.create(
            event=event,
            platform=link.platform,
            url=link.url,
        )
        for link in payload.social_links
    ]

    return SpecialEventSchema(
        id=event.id,
        name=event.name,
        description=event.description,
        datetime=event.datetime,
        capacity=event.capacity,
        current_capacity=event.current_capacity,
        price=event.price,
        location=LocationSchema(
            id=location.id,
            name=location.name,
            address=location.address,
            latitude=float(location.latitude) if location.latitude else 0,
            longitude=float(location.longitude) if location.longitude else 0,
            url=location.url,
        ),
        instructor_id=event.instructor.id,
        instructor_name=event.instructor.get_full_name(),
        social_links=[
            SocialLinkSchema(
                platform=link.platform,
                url=link.url,
            )
            for link in social_links
        ],
        created_at=event.created_at,
        updated_at=event.updated_at,
    )


@router.get('/special/{event_id}', response=SpecialEventSchema)
def get_special_event(request: AuthenticatedRequest, event_id: str) -> SpecialEventSchema:
    event = get_object_or_404(SpecialEvent, id=event_id)
    return SpecialEventSchema(
        id=event.id,
        name=event.name,
        description=event.description,
        datetime=event.datetime,
        capacity=event.capacity,
        current_capacity=event.current_capacity,
        price=event.price,
        location=LocationSchema(
            id=event.location.id,
            name=event.location.name,
            address=event.location.address,
            latitude=float(event.location.latitude) if event.location.latitude else 0,
            longitude=float(event.location.longitude) if event.location.longitude else 0,
            url=event.location.url,
        ),
        instructor_id=event.instructor.id,
        instructor_name=event.instructor.get_full_name(),
        social_links=[
            SocialLinkSchema(
                platform=link.platform,
                url=link.url,
            )
            for link in event.social_links.all()
        ],
        created_at=event.created_at,
        updated_at=event.updated_at,
    )


@router.put('/special/{event_id}', response=SpecialEventSchema)
def update_special_event(request: AuthenticatedRequest, event_id: str, payload: CreateSpecialEventSchema) -> HttpResponse | SpecialEventSchema:
    event = get_object_or_404(SpecialEvent, id=event_id)
    if request.auth.role != 'instructor' or request.auth.id != event.instructor.id:
        return HttpResponse(
            '{"detail": "Only the instructor who created this event can update it"}',
            status=403,
            content_type='application/json',
        )

    location = Location.objects.get_or_create(
        google_place_id=payload.location.google_place_id,
        defaults={
            'name': payload.location.name,
            'address': payload.location.address,
            'latitude': payload.location.latitude,
            'longitude': payload.location.longitude,
            'url': payload.location.url,
        }
    )[0]

    # Update event fields
    event.name = payload.name
    event.description = payload.description
    event.datetime = payload.datetime
    event.capacity = payload.capacity
    event.price = payload.price
    event.location = location
    event.save()

    # Update social links
    event.social_links.all().delete()
    social_links = [
        SocialLink.objects.create(
            event=event,
            platform=link.platform,
            url=link.url,
        )
        for link in payload.social_links
    ]

    return SpecialEventSchema(
        id=event.id,
        name=event.name,
        description=event.description,
        datetime=event.datetime,
        capacity=event.capacity,
        current_capacity=event.current_capacity,
        price=event.price,
        location=LocationSchema(
            id=location.id,
            name=location.name,
            address=location.address,
            latitude=float(location.latitude) if location.latitude else 0,
            longitude=float(location.longitude) if location.longitude else 0,
            url=location.url,
        ),
        instructor_id=event.instructor.id,
        instructor_name=event.instructor.get_full_name(),
        social_links=[
            SocialLinkSchema(
                platform=link.platform,
                url=link.url,
            )
            for link in social_links
        ],
        created_at=event.created_at,
        updated_at=event.updated_at,
    )


@router.delete('/special/{event_id}')
def delete_special_event(request: AuthenticatedRequest, event_id: int) -> HttpResponse:
    event = get_object_or_404(SpecialEvent, id=event_id)
    if request.auth.role != 'instructor' or request.auth.id != event.instructor.id:
        return HttpResponse(
            '{"detail": "Only the instructor who created this event can delete it"}',
            status=403,
            content_type='application/json',
        )

    event.delete()
    return HttpResponse('{"success": true}', content_type='application/json')
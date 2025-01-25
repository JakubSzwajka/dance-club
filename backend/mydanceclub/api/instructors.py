


from typing import List

from events.models import Location, SpecialEvent
from ninja import Router

from .schemas import CreateSpecialEventSchema, LocationSchema, SocialLinkSchema, SpecialEventSchema
from .types import AuthenticatedRequest

router = Router()

@router.get('/{instructor_id}/events', response=List[SpecialEventSchema])
def get_instructor_events(request: AuthenticatedRequest, instructor_id: str) -> List[SpecialEventSchema]:
    events = SpecialEvent.objects.filter(instructor_id=instructor_id)
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

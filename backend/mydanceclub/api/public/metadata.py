from ninja import Router
from reviews.schemas.metadata import MetadataSchema
from classes.models import DanceStyle, SkillLevel, SportsCard

router = Router()


@router.get("/metadata", response=MetadataSchema, auth=None)
def get_metadata(request) -> MetadataSchema:
    """Get all metadata for the frontend"""
    return MetadataSchema(
        dance_styles=[style for style in DanceStyle],
        skill_levels=[level for level in SkillLevel],
        sports_cards=[card for card in SportsCard],
    )

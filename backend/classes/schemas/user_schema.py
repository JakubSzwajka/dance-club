from typing import Optional
from ninja import Schema


class UserPublicSchema(Schema):
    """Public user information"""

    id: str
    first_name: str
    last_name: str
    bio: Optional[str]
    profile_picture: Optional[str]


class UserPrivateSchema(UserPublicSchema):
    email: str
    role: str


class InstructorPublicSchema(UserPublicSchema):
    """Public instructor information with stats"""

    classes_count: int
    rating: float
    reviews_count: int

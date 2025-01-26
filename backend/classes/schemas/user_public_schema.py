


from typing import Optional
from ninja import Schema


class UserPublicSchema(Schema):
    id: str
    first_name: str
    last_name: str
    bio: str
    profile_picture: Optional[str]

class InstructorPublicSchema(UserPublicSchema):
    classes_count: int
    students_count: int

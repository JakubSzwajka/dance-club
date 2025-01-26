from typing import List
from accounts.models import User
from classes.services.class_search_engine import ClassSearchEngineService
from classes.schemas.user_public_schema import InstructorPublicSchema


class InstructorManagerService:
    def __init__(self):
        self.class_search_engine = ClassSearchEngineService()

    def _get_instructor_public_profile(self, instructor: User) -> InstructorPublicSchema:
        instructor_schema = instructor.to_schema()
        instructor_classes = self.class_search_engine.get_classes_by_instructor(instructor.id)
        return InstructorPublicSchema(
            id=instructor_schema.id,
            first_name=instructor_schema.first_name,
            last_name=instructor_schema.last_name,
            bio=instructor_schema.bio,
            profile_picture=instructor_schema.profile_picture,
            classes_count=len(instructor_classes),
            students_count=sum([class_.current_capacity for class_ in instructor_classes]),
        )

    def get_instructors(self)-> List[InstructorPublicSchema]:
        instructors: List[InstructorPublicSchema] = []
        instructors_profiles = User.objects.filter(role='instructor')

        for instructor in instructors_profiles:
            instructor_public_profile = self._get_instructor_public_profile(instructor)
            instructors.append(instructor_public_profile)
        return instructors

    def get_instructor_by_id(self, instructor_id: str) -> InstructorPublicSchema:
        instructor = User.objects.get(id=instructor_id)
        return self._get_instructor_public_profile(instructor)


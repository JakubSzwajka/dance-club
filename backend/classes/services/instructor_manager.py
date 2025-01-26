from accounts.models import User

class InstructorManagerService:
    def get_instructors(self):
        instructors = User.objects.filter(role='instructor')
        return [instructor.to_schema() for instructor in instructors]

    def get_instructor_by_id(self, instructor_id: str):
        instructor = User.objects.get(id=instructor_id)
        return instructor.to_schema()


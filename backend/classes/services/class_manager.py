from django.shortcuts import get_object_or_404
from classes.schemas.dance_class import CreateDanceClassSchema, DanceClassSchema
from accounts.models import User
from classes.models import DanceClass

class ClassManager:
    def create_class(self, user: User, class_data: CreateDanceClassSchema) -> DanceClassSchema:
        if user.role != 'instructor':
            raise ValueError('User is not an instructor')
        cls = DanceClass.objects.create(**class_data.dict(), instructor=user)
        return cls.to_schema()

    def update_class(self, user: User, class_id: str, class_data: CreateDanceClassSchema) -> DanceClassSchema:
        cls = get_object_or_404(DanceClass, id=class_id)
        if cls.instructor != user:
            raise ValueError('User is not the instructor of this class')
        for attr, value in class_data.dict().items():
            if attr not in ['id', 'created_at', 'updated_at', 'instructor']:
                setattr(cls, attr, value)
        cls.save()
        return cls.to_schema()

    def delete_class(self, user: User, class_id: str) -> None:
        cls = get_object_or_404(DanceClass, id=class_id)
        if cls.instructor != user:
            raise ValueError('User is not the instructor of this class')
        cls.delete()


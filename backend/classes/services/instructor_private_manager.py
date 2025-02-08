from typing import List
from classes.models import DanceClass
from classes.schemas.dance_class import CreateDanceClassSchema, DanceClassSchema
from classes.schemas.instructor import InstructorStatsSchema
from django.db.models import Sum, Avg


class InstructorPrivateManagerService:
    def get_classes_by_instructor(self, instructor_id: str) -> List[DanceClassSchema]:
        classes = DanceClass.objects.filter(instructor_id=instructor_id)
        return [class_.to_schema() for class_ in classes]

    def get_class_by_id(self, class_id: str) -> DanceClassSchema:
        class_ = DanceClass.objects.get(id=class_id)
        return class_.to_schema()

    def get_instructor_stats(self, instructor_id: str) -> InstructorStatsSchema:
        classes = DanceClass.objects.filter(instructor_id=instructor_id)
        return InstructorStatsSchema(
            total_classes=classes.count(),
            total_students=classes.aggregate(total_students=Sum("current_capacity"))[
                "total_students"
            ]
            or 0,
            average_capacity=classes.aggregate(
                average_capacity=Avg("current_capacity")
            )["average_capacity"]
            or 0,
        )

    def create_class(
        self, instructor_id: str, class_data: CreateDanceClassSchema
    ) -> DanceClassSchema:
        class_ = DanceClass.objects.create(
            instructor_id=instructor_id,
            name=class_data.name,
            description=class_data.description,
            level=class_data.level,
            price=class_data.price,
            start_date=class_data.start_date,
            end_date=class_data.end_date,
            location=class_data.location,
            style=class_data.style,
        )
        return class_.to_schema()

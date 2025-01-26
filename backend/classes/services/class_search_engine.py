
from typing import List, Optional

from django.shortcuts import get_object_or_404
from classes.models import DanceClass, RecurringSchedule, SpecialSchedule
from classes.schemas.dance_class import DanceClassSchema, RecurringScheduleSchema, SpecialScheduleSchema
from django.db.models import F, FloatField, Value
from django.db.models.functions import ACos, Cos, Radians, Sin, Cast

class ClassSearchEngineService:
    def get_classes_near_location(self, latitude: float, longitude: float, start_date: str, end_date: str, limit: int = 10) -> List[DanceClassSchema]:
        user_lat_rad = Radians(Value(latitude, output_field=FloatField()))
        user_lon_rad = Radians(Value(longitude, output_field=FloatField()))

        classes = DanceClass.objects.annotate(
            distance=Cast(
                ACos(
                    Sin(Radians(F('location__latitude'))) * Sin(user_lat_rad) +
                    Cos(Radians(F('location__latitude'))) * Cos(user_lat_rad) *
                    Cos(Radians(F('location__longitude')) - user_lon_rad)
                ) * Value(6371.0, output_field=FloatField()),
                output_field=FloatField()
            )
        ).order_by('distance')

        if start_date and end_date:
            classes = classes.filter(start_date__range=[start_date, end_date])

        classes = classes[:limit]

        return [event.to_schema() for event in classes]

    def get_classes_with_filters(self, instructor_id: Optional[str], location_id: Optional[str], style: Optional[str], level: Optional[str], start_date: Optional[str], end_date: Optional[str]) -> List[DanceClassSchema]:
        filters = {}
        if instructor_id is not None:
            filters['instructor_id'] = instructor_id
        if location_id is not None:
            filters['location_id'] = location_id
        if style is not None:
            filters['style'] = style
        if level is not None:
            filters['level'] = level
        if start_date is not None and end_date is not None:
            filters['start_date__range'] = [start_date, end_date]

        classes = DanceClass.objects.filter(**filters).order_by('-start_date')
        return [event.to_schema() for event in classes]


    def get_classes_by_instructor(self, instructor_id: str, limit: int = 10) -> List[DanceClassSchema]:
        classes = DanceClass.objects.filter(instructor_id=instructor_id).order_by('-start_date')[:limit]
        return [event.to_schema() for event in classes]

    def get_classes_by_location(self, location_id: str, limit: int = 10) -> List[DanceClassSchema]:
        classes = DanceClass.objects.filter(location_id=location_id).order_by('-start_date')[:limit]
        return [event.to_schema() for event in classes]

    def get_class_by_id(self, class_id: str) -> DanceClassSchema:
        event = get_object_or_404(DanceClass, id=class_id)
        return event.to_schema()

    def get_class_recurring_schedules(self, class_id: str) -> List[RecurringScheduleSchema]:
        class_ = get_object_or_404(DanceClass, id=class_id)
        return [schedule.to_schema() for schedule in class_.recurring_schedules.all()]

    def get_class_special_schedules(self, class_id: str) -> List[SpecialScheduleSchema]:
        class_ = get_object_or_404(DanceClass, id=class_id)
        return [schedule.to_schema() for schedule in class_.special_schedules.all()]

from django.shortcuts import get_object_or_404
from classes.schemas.dance_class import CreateDanceClassSchema, CreateRecurringScheduleSchema, CreateSpecialScheduleSchema, DanceClassSchema, RecurringScheduleSchema, SpecialScheduleSchema
from accounts.models import User
from classes.models import DanceClass, RecurringSchedule, SpecialSchedule

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

    def create_recurring_schedule(self, user: User, class_id: str, schedule_data: CreateRecurringScheduleSchema) -> RecurringScheduleSchema:
        cls = get_object_or_404(DanceClass, id=class_id)
        if cls.instructor != user:
            raise ValueError('User is not the instructor of this class')
        schedule = RecurringSchedule.objects.create(dance_class=cls, **schedule_data.dict())
        return schedule.to_schema()

    def create_special_schedule(self, user: User, class_id: str, schedule_data: CreateSpecialScheduleSchema) -> SpecialScheduleSchema:
        cls = get_object_or_404(DanceClass, id=class_id)
        if cls.instructor != user:
            raise ValueError('User is not the instructor of this class')

        if schedule_data.replaced_schedule_id and schedule_data.replaced_schedule_date:
            schedule = get_object_or_404(RecurringSchedule, id=schedule_data.replaced_schedule_id, dance_class=cls)
            replaced_date = schedule_data.replaced_schedule_date
            if replaced_date.weekday() != schedule.day_of_week:
                raise ValueError('The selected date is not a valid occurrence of this recurring schedule')

        schedule = SpecialSchedule.objects.create(dance_class=cls, **schedule_data.dict())
        return schedule.to_schema()

    def delete_recurring_schedule(self, user: User, schedule_id: str) -> None:
        schedule = get_object_or_404(RecurringSchedule, id=schedule_id)
        schedule.delete()

    def delete_special_schedule(self, user: User, schedule_id: str) -> None:
        schedule = get_object_or_404(SpecialSchedule, id=schedule_id)
        schedule.delete()


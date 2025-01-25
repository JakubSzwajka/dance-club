from datetime import date as Date
from datetime import datetime, time, timedelta
from typing import List, Optional
from uuid import UUID

from accounts.models import User
from classes.models import DanceClass, RecurringSchedule, SpecialSchedule
from django.contrib.auth import authenticate
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from ninja import NinjaAPI, Schema
from reviews.models import Review, ReviewResponse

from .auth import AuthBearer, create_token

api = NinjaAPI(auth=AuthBearer())


class SignupSchema(Schema):
    email: str
    password: str
    role: str


class LoginSchema(Schema):
    email: str
    password: str


class TokenResponse(Schema):
    access: str
    email: str


class UserSchema(Schema):
    id: UUID
    email: str
    role: str


class ScheduleSchema(Schema):
    id: UUID
    dance_class_id: UUID
    day_of_week: int
    start_time: time
    end_time: time
    is_recurring: bool
    start_date: datetime
    end_date: Optional[datetime]
    status: str
    created_at: datetime
    updated_at: datetime


class CreateScheduleSchema(Schema):
    day_of_week: int
    start_time: time
    end_time: time
    is_recurring: bool
    start_date: datetime
    end_date: Optional[datetime]


class CreateDanceClassSchema(Schema):
    name: str
    description: str
    level: str
    max_capacity: int
    price: float
    start_date: Date
    end_date: Date


class CreateRecurringScheduleSchema(Schema):
    day_of_week: int
    start_time: time
    end_time: time


class RecurringScheduleSchema(CreateRecurringScheduleSchema):
    id: UUID
    dance_class_id: UUID
    status: str
    created_at: datetime
    updated_at: datetime


class CreateSpecialScheduleSchema(Schema):
    date: Date
    start_time: time
    end_time: time
    status: str = 'scheduled'
    replaced_schedule_id: Optional[int] = None
    replaced_schedule_date: Optional[Date] = None
    note: Optional[str] = None


class SpecialScheduleSchema(CreateSpecialScheduleSchema):
    id: UUID
    dance_class_id: UUID
    created_at: datetime
    updated_at: datetime


class DanceClassSchema(CreateDanceClassSchema):
    id: UUID
    instructor_id: UUID
    current_capacity: int
    created_at: datetime
    updated_at: datetime


class ReviewSchema(Schema):
    id: UUID
    dance_class_id: UUID
    student_id: UUID
    instruction_rating: int
    facility_rating: int
    overall_rating: int
    comment: str
    created_at: datetime
    moderation_status: str
    is_verified: bool


class ReviewResponseSchema(Schema):
    id: UUID
    review_id: UUID
    instructor_id: UUID
    response_text: str
    created_at: datetime


@api.post('/auth/signup', response=TokenResponse, auth=None)
def signup(request, data: SignupSchema):
    if data.role not in ['student', 'instructor']:
        return api.create_response(
            request,
            {'detail': "Invalid role. Must be either 'student' or 'instructor'"},
            status=400,
        )

    if User.objects.filter(email=data.email).exists():
        return api.create_response(request, {'detail': 'Email already exists'}, status=400)

    user = User.objects.create_user(
        username=data.email,
        email=data.email,
        password=data.password,
        role=data.role,
    )

    token = create_token(user)
    return TokenResponse(access=token, email=user.email)


@api.post('/auth/login', response=TokenResponse, auth=None)
def login(request, data: LoginSchema):
    user = authenticate(request, username=data.email, password=data.password)
    if user is None:
        return api.create_response(request, {'detail': 'Invalid credentials'}, status=401)

    token = create_token(user)
    return TokenResponse(access=token, email=user.email)


@api.get('/auth/me', response=UserSchema)
def me(request):
    return UserSchema(id=request.auth.id, email=request.auth.email, role=request.auth.role)


@api.get('/classes/{class_id}/reviews', response=List[ReviewSchema])
def list_class_reviews(request, class_id: int):
    dance_class = get_object_or_404(DanceClass, id=class_id)
    reviews = dance_class.reviews.all()
    return [
        ReviewSchema(
            id=review.id,
            dance_class_id=review.dance_class.id,
            student_id=review.student.id,
            instruction_rating=review.instruction_rating,
            facility_rating=review.facility_rating,
            overall_rating=review.overall_rating,
            comment=review.comment,
            created_at=review.created_at,
            moderation_status=review.moderation_status,
            is_verified=review.is_verified,
        )
        for review in reviews
    ]


@api.post('/classes/{class_id}/reviews', response=ReviewSchema)
def create_review(request, class_id: int, payload: ReviewSchema):
    dance_class = get_object_or_404(DanceClass, id=class_id)
    review = Review.objects.create(
        dance_class=dance_class,
        student=request.auth,
        instruction_rating=payload.instruction_rating,
        facility_rating=payload.facility_rating,
        overall_rating=payload.overall_rating,
        comment=payload.comment,
    )
    return ReviewSchema(
        id=review.id,
        dance_class_id=review.dance_class.id,
        student_id=review.student.id,
        instruction_rating=review.instruction_rating,
        facility_rating=review.facility_rating,
        overall_rating=review.overall_rating,
        comment=review.comment,
        created_at=review.created_at,
        moderation_status=review.moderation_status,
        is_verified=review.is_verified,
    )


@api.post('/reviews/{review_id}/vote')
def vote_review(request, review_id: int):
    review = get_object_or_404(Review, id=review_id)
    review.helpful_votes.add(request.auth.id)
    return {'success': True}


@api.post('/reviews/{review_id}/response', response=ReviewResponseSchema)
def create_review_response(request, review_id: int, payload: ReviewResponseSchema):
    review = get_object_or_404(Review, id=review_id)
    if request.auth.role != 'instructor':
        return api.create_response(request, {'detail': 'Only instructors can respond to reviews'}, status=403)
    response = ReviewResponse.objects.create(
        review=review,
        instructor=request.auth,
        response_text=payload.response_text,
    )
    return ReviewResponseSchema(
        id=response.id,
        review_id=response.review.id,
        instructor_id=response.instructor.id,
        response_text=response.response_text,
        created_at=response.created_at,
    )


@api.put('/reviews/{review_id}/moderate')
def moderate_review(request, review_id: int, status: str):
    review = get_object_or_404(Review, id=review_id)
    if request.auth.role != 'admin':
        return api.create_response(request, {'detail': 'Only admins can moderate reviews'}, status=403)
    review.moderation_status = status
    review.save()
    return {'success': True}


@api.get('/classes', response=List[DanceClassSchema])
def list_classes(request):
    classes = DanceClass.objects.all()
    if request.auth.role == 'instructor':
        classes = classes.filter(instructor_id=request.auth.id)
    return [
        DanceClassSchema(
            id=dance_class.id,
            name=dance_class.name,
            description=dance_class.description,
            instructor_id=dance_class.instructor.id,
            level=dance_class.level,
            max_capacity=dance_class.max_capacity,
            current_capacity=dance_class.current_capacity,
            price=float(dance_class.price),
            start_date=dance_class.start_date,
            end_date=dance_class.end_date,
            created_at=dance_class.created_at,
            updated_at=dance_class.updated_at,
        )
        for dance_class in classes
    ]


@api.post('/classes', response=DanceClassSchema)
def create_class(request, payload: CreateDanceClassSchema):
    if request.auth.role != 'instructor':
        return api.create_response(request, {'detail': 'Only instructors can create classes'}, status=403)
    dance_class = DanceClass.objects.create(
        name=payload.name,
        description=payload.description,
        instructor=request.auth,
        level=payload.level,
        max_capacity=payload.max_capacity,
        price=payload.price,
        start_date=payload.start_date,
        end_date=payload.end_date,
    )
    return DanceClassSchema(
        id=dance_class.id,
        name=dance_class.name,
        description=dance_class.description,
        instructor_id=dance_class.instructor.id,
        level=dance_class.level,
        max_capacity=dance_class.max_capacity,
        current_capacity=dance_class.current_capacity,
        price=float(dance_class.price),
        start_date=dance_class.start_date,
        end_date=dance_class.end_date,
        created_at=dance_class.created_at,
        updated_at=dance_class.updated_at,
    )


@api.get('/classes/{class_id}', response=DanceClassSchema)
def get_class(request, class_id: int):
    dance_class = get_object_or_404(DanceClass, id=class_id)
    return DanceClassSchema(
        id=dance_class.id,
        name=dance_class.name,
        description=dance_class.description,
        instructor_id=dance_class.instructor.id,
        level=dance_class.level,
        max_capacity=dance_class.max_capacity,
        current_capacity=dance_class.current_capacity,
        price=float(dance_class.price),
        start_date=dance_class.start_date,
        end_date=dance_class.end_date,
        created_at=dance_class.created_at,
        updated_at=dance_class.updated_at,
    )


@api.put('/classes/{class_id}', response=DanceClassSchema)
def update_class(request, class_id: int, payload: DanceClassSchema):
    dance_class = get_object_or_404(DanceClass, id=class_id)
    if request.auth.role != 'instructor' or request.auth.id != dance_class.instructor.id:
        return api.create_response(
            request,
            {'detail': 'Only the instructor who created this class can update it'},
            status=403,
        )
    for attr, value in payload.dict().items():
        if attr not in ['id', 'created_at', 'updated_at']:
            setattr(dance_class, attr, value)
    dance_class.save()
    return DanceClassSchema(
        id=dance_class.id,
        name=dance_class.name,
        description=dance_class.description,
        instructor_id=dance_class.instructor.id,
        level=dance_class.level,
        max_capacity=dance_class.max_capacity,
        current_capacity=dance_class.current_capacity,
        price=float(dance_class.price),
        start_date=dance_class.start_date,
        end_date=dance_class.end_date,
        created_at=dance_class.created_at,
        updated_at=dance_class.updated_at,
    )


@api.delete('/classes/{class_id}')
def delete_class(request, class_id: UUID):
    dance_class = get_object_or_404(DanceClass, id=class_id)
    if request.auth.role != 'instructor' or request.auth.id != dance_class.instructor.id:
        return api.create_response(
            request,
            {'detail': 'Only the instructor who created this class can delete it'},
            status=403,
        )
    dance_class.delete()
    return {'success': True}


@api.get('/classes/{class_id}/recurring-schedules', response=List[RecurringScheduleSchema])
def list_recurring_schedules(request, class_id: int):
    dance_class = get_object_or_404(DanceClass, id=class_id)
    return dance_class.recurring_schedules.all()


@api.get('/classes/{class_id}/special-schedules', response=List[SpecialScheduleSchema])
def list_special_schedules(request, class_id: int):
    dance_class = get_object_or_404(DanceClass, id=class_id)
    return dance_class.special_schedules.all()


@api.post('/classes/{class_id}/recurring-schedules', response=RecurringScheduleSchema)
def create_recurring_schedule(request, class_id: int, data: CreateRecurringScheduleSchema):
    dance_class = get_object_or_404(DanceClass, id=class_id)
    if request.auth.id != dance_class.instructor.id:
        raise PermissionDenied('Only the class instructor can manage schedules')

    schedule = RecurringSchedule.objects.create(dance_class=dance_class, **data.dict())
    return schedule


@api.post('/classes/{class_id}/special-schedules', response=SpecialScheduleSchema)
def create_special_schedule(request, class_id: int, data: CreateSpecialScheduleSchema):
    print('data', data)
    dance_class = get_object_or_404(DanceClass, id=class_id)
    if request.auth.id != dance_class.instructor.id:
        raise PermissionDenied('Only the class instructor can manage schedules')

    # If this is replacing a recurring schedule, validate the date
    if data.replaced_schedule_id and data.replaced_schedule_date:
        schedule = get_object_or_404(RecurringSchedule, id=data.replaced_schedule_id, dance_class=dance_class)
        # replaced_date = datetime.strptime(data.replaced_schedule_date, '%Y-%m-%d').date()
        replaced_date = data.replaced_schedule_date
        # Verify this is a valid occurrence of the recurring schedule
        if replaced_date.weekday() != schedule.day_of_week:
            return api.create_response(
                request,
                {'detail': 'The selected date is not a valid occurrence of this recurring schedule'},
                status=400,
            )

        # Use the replaced schedule's times if not provided
        if not data.start_time:
            data.start_time = schedule.start_time
        if not data.end_time:
            data.end_time = schedule.end_time

    schedule = SpecialSchedule.objects.create(dance_class=dance_class, **data.dict())
    return schedule


@api.put('/recurring-schedules/{schedule_id}/status')
def update_recurring_schedule_status(request, schedule_id: int, status: str):
    schedule = get_object_or_404(RecurringSchedule, id=schedule_id)
    if request.auth.id != schedule.dance_class.instructor.id:
        raise PermissionDenied('Only the class instructor can manage schedules')

    if status not in dict(RecurringSchedule.STATUS_CHOICES):
        return api.create_response(request, {'detail': 'Invalid status'}, status=400)

    schedule.status = status
    schedule.save()
    return {'success': True}


@api.put('/special-schedules/{schedule_id}/status')
def update_special_schedule_status(request, schedule_id: int, status: str):
    schedule = get_object_or_404(SpecialSchedule, id=schedule_id)
    if request.auth.id != schedule.dance_class.instructor.id:
        raise PermissionDenied('Only the class instructor can manage schedules')

    if status not in dict(SpecialSchedule.STATUS_CHOICES):
        return api.create_response(request, {'detail': 'Invalid status'}, status=400)

    schedule.status = status
    schedule.save()
    return {'success': True}


@api.delete('/recurring-schedules/{schedule_id}')
def delete_recurring_schedule(request, schedule_id: int):
    schedule = get_object_or_404(RecurringSchedule, id=schedule_id)
    if request.auth.id != schedule.dance_class.instructor.id:
        raise PermissionDenied('Only the class instructor can manage schedules')

    schedule.delete()
    return {'success': True}


@api.delete('/special-schedules/{schedule_id}')
def delete_special_schedule(request, schedule_id: int):
    schedule = get_object_or_404(SpecialSchedule, id=schedule_id)
    if request.auth.id != schedule.dance_class.instructor.id:
        raise PermissionDenied('Only the class instructor can manage schedules')

    schedule.delete()
    return {'success': True}


@api.get(
    '/classes/{class_id}/recurring-schedules/{schedule_id}/occurrences',
    response=List[str],
)
def get_recurring_schedule_occurrences(request, class_id: int, schedule_id: int):
    dance_class = get_object_or_404(DanceClass, id=class_id)
    schedule = get_object_or_404(RecurringSchedule, id=schedule_id, dance_class=dance_class)

    # Get all occurrences between class start and end date
    occurrences = []
    current_date = dance_class.start_date

    # Find the first occurrence of this schedule
    while current_date.weekday() != schedule.day_of_week:
        current_date += timedelta(days=1)

    # Add all occurrences until the end date
    while current_date <= dance_class.end_date:
        occurrences.append(current_date.isoformat())
        current_date += timedelta(days=7)

    return occurrences

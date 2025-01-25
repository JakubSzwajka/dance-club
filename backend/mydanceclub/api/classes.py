from typing import List, cast

from accounts.models import User
from classes.models import DanceClass
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from ninja import Router

from .schemas import CreateDanceClassSchema, DanceClassSchema
from .types import AuthenticatedRequest

router = Router()


@router.get('/', response=List[DanceClassSchema])
def list_classes(request: AuthenticatedRequest) -> List[DanceClassSchema]:
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


@router.post('/', response=DanceClassSchema)
def create_class(request: AuthenticatedRequest, payload: CreateDanceClassSchema) -> HttpResponse | DanceClassSchema:
    if request.auth.role != 'instructor':
        return HttpResponse(
            '{"detail": "Only instructors can create classes"}',
            status=403,
            content_type='application/json',
        )
    dance_class = DanceClass.objects.create(
        name=payload.name,
        description=payload.description,
        instructor=cast(User, request.auth),
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


@router.get('/{class_id}', response=DanceClassSchema)
def get_class(request: AuthenticatedRequest, class_id: int) -> DanceClassSchema:
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


@router.put('/{class_id}', response=DanceClassSchema)
def update_class(request: AuthenticatedRequest, class_id: int, payload: DanceClassSchema) -> HttpResponse | DanceClassSchema:
    dance_class = get_object_or_404(DanceClass, id=class_id)
    if request.auth.role != 'instructor' or request.auth.id != dance_class.instructor.id:
        return HttpResponse(
            '{"detail": "Only the instructor who created this class can update it"}',
            status=403,
            content_type='application/json',
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


@router.delete('/{class_id}')
def delete_class(request: AuthenticatedRequest, class_id: str) -> HttpResponse:
    dance_class = get_object_or_404(DanceClass, id=class_id)
    if request.auth.role != 'instructor' or request.auth.id != dance_class.instructor.id:
        return HttpResponse(
            '{"detail": "Only the instructor who created this class can delete it"}',
            status=403,
            content_type='application/json',
        )
    dance_class.delete()
    return HttpResponse('{"success": true}', content_type='application/json')
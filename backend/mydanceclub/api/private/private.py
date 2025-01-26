
from typing import List
from ninja import Router

from classes.services.instructor_private_manager import InstructorPrivateManagerService
from mydanceclub.api.private.types import AuthenticatedRequest
from classes.schemas.dance_class import CreateDanceClassSchema, DanceClassSchema, PrivateDanceClassSchema
from classes.schemas.instructor import InstructorStatsSchema

router = Router()

@router.get('/instructors/{instructor_id}/classes', response=List[PrivateDanceClassSchema])
def get_classes_by_instructor(request: AuthenticatedRequest, instructor_id: str) -> List[PrivateDanceClassSchema]:
    return InstructorPrivateManagerService().get_classes_by_instructor(instructor_id)

@router.get('/instructors/{instructor_id}/classes/{class_id}', response=PrivateDanceClassSchema)
def get_class_by_id(request: AuthenticatedRequest, instructor_id: str, class_id: str) -> PrivateDanceClassSchema:
    return InstructorPrivateManagerService().get_class_by_id(class_id)

@router.get('/instructors/{instructor_id}/stats', response=InstructorStatsSchema)
def get_instructor_stats(request: AuthenticatedRequest, instructor_id: str) -> InstructorStatsSchema:
    return InstructorPrivateManagerService().get_instructor_stats(instructor_id)

@router.post('/instructors/{instructor_id}/classes', response=PrivateDanceClassSchema)
def create_class(request: AuthenticatedRequest, instructor_id: str, class_data: CreateDanceClassSchema) -> PrivateDanceClassSchema:
    return InstructorPrivateManagerService().create_class(instructor_id, class_data)


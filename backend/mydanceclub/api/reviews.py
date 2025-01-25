from typing import List, cast

from accounts.models import User
from classes.models import DanceClass
from django.http import HttpRequest, HttpResponse
from django.shortcuts import get_object_or_404
from ninja import Router
from reviews.models import Review, ReviewResponse

from .schemas import ReviewResponseSchema, ReviewSchema
from .types import AuthenticatedRequest

router = Router()


@router.get('/classes/{class_id}/reviews', response=List[ReviewSchema])
def list_class_reviews(request: AuthenticatedRequest, class_id: int) -> List[ReviewSchema]:
    dance_class = get_object_or_404(DanceClass, id=class_id)
    reviews = Review.objects.filter(dance_class=dance_class)
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


@router.post('/classes/{class_id}/reviews', response=ReviewSchema)
def create_review(request: AuthenticatedRequest, class_id: int, payload: ReviewSchema) -> ReviewSchema:
    dance_class = get_object_or_404(DanceClass, id=class_id)
    review = Review.objects.create(
        dance_class=dance_class,
        student=cast(User, request.auth),
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


@router.post('/{review_id}/vote')
def vote_review(request: AuthenticatedRequest, review_id: int) -> HttpResponse:
    review = get_object_or_404(Review, id=review_id)
    review.helpful_votes.add(request.auth.id)
    return HttpResponse('{"success": true}', content_type='application/json')


@router.post('/{review_id}/response', response=ReviewResponseSchema)
def create_review_response(request: AuthenticatedRequest, review_id: int, payload: ReviewResponseSchema) -> HttpResponse | ReviewResponseSchema:
    review = get_object_or_404(Review, id=review_id)
    if request.auth.role != 'instructor':
        return HttpResponse(
            '{"detail": "Only instructors can respond to reviews"}',
            status=403,
            content_type='application/json',
        )
    response = ReviewResponse.objects.create(
        review=review,
        instructor=cast(User, request.auth),
        response_text=payload.response_text,
    )
    return ReviewResponseSchema(
        id=response.id,
        review_id=response.review.id,
        instructor_id=response.instructor.id,
        response_text=response.response_text,
        created_at=response.created_at,
    )


@router.put('/{review_id}/moderate')
def moderate_review(request: AuthenticatedRequest, review_id: int, status: str) -> HttpResponse:
    review = get_object_or_404(Review, id=review_id)
    if request.auth.role != 'admin':
        return HttpResponse(
            '{"detail": "Only admins can moderate reviews"}',
            status=403,
            content_type='application/json',
        )
    review.moderation_status = status
    review.save()
    return HttpResponse('{"success": true}', content_type='application/json')
from datetime import datetime
from typing import List
from ninja import NinjaAPI, Schema
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from classes.models import DanceClass
from reviews.models import Review, ReviewResponse
from accounts.models import User
from .auth import create_token, AuthBearer

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
    id: int
    email: str
    role: str

class DanceClassSchema(Schema):
    id: int
    name: str
    description: str
    instructor_id: int
    level: str
    max_capacity: int
    current_capacity: int
    price: float
    created_at: datetime
    updated_at: datetime

class CreateDanceClassSchema(Schema):
    name: str
    description: str
    level: str
    max_capacity: int
    price: float

class ReviewSchema(Schema):
    id: int
    dance_class_id: int
    student_id: int
    instruction_rating: int
    facility_rating: int
    overall_rating: int
    comment: str
    created_at: datetime
    moderation_status: str
    is_verified: bool

class ReviewResponseSchema(Schema):
    id: int
    review_id: int
    instructor_id: int
    response_text: str
    created_at: datetime

@api.post("/auth/signup", response=TokenResponse, auth=None)
def signup(request, data: SignupSchema):
    if data.role not in ["student", "instructor"]:
        return api.create_response(
            request,
            {"detail": "Invalid role. Must be either 'student' or 'instructor'"},
            status=400,
        )

    if User.objects.filter(email=data.email).exists():
        return api.create_response(
            request, {"detail": "Email already exists"}, status=400
        )

    user = User.objects.create_user(
        email=data.email,
        password=data.password,
        role=data.role,
    )

    token = create_token(user)
    return TokenResponse(access=token, email=user.email)

@api.post("/auth/login", response=TokenResponse, auth=None)
def login(request, data: LoginSchema):
    user = authenticate(
        request,
        username=data.email,
        password=data.password
    )
    if user is None:
        return api.create_response(
            request, {"detail": "Invalid credentials"}, status=401
        )

    token = create_token(user)
    return TokenResponse(access=token, email=user.email)

@api.get("/auth/me", response=UserSchema)
def me(request):
    return UserSchema(
        id=request.auth.id,
        email=request.auth.email,
        role=request.auth.role
    )

@api.get("/classes/{class_id}/reviews", response=List[ReviewSchema])
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

@api.post("/classes/{class_id}/reviews", response=ReviewSchema)
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

@api.post("/reviews/{review_id}/vote")
def vote_review(request, review_id: int):
    review = get_object_or_404(Review, id=review_id)
    review.helpful_votes.add(request.auth.id)
    return {"success": True}

@api.post("/reviews/{review_id}/response", response=ReviewResponseSchema)
def create_review_response(
    request,
    review_id: int,
    payload: ReviewResponseSchema
):
    review = get_object_or_404(Review, id=review_id)
    if request.auth.role != 'instructor':
        return api.create_response(
            request, {"detail": "Only instructors can respond to reviews"}, status=403
        )
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

@api.put("/reviews/{review_id}/moderate")
def moderate_review(request, review_id: int, status: str):
    review = get_object_or_404(Review, id=review_id)
    if request.auth.role != 'admin':
        return api.create_response(
            request, {"detail": "Only admins can moderate reviews"}, status=403
        )
    review.moderation_status = status
    review.save()
    return {"success": True}

@api.get("/classes", response=List[DanceClassSchema])
def list_classes(request):
    classes = DanceClass.objects.all()
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
            created_at=dance_class.created_at,
            updated_at=dance_class.updated_at,
        )
        for dance_class in classes
    ]

@api.post("/classes", response=DanceClassSchema)
def create_class(request, payload: CreateDanceClassSchema):
    if request.auth.role != 'instructor':
        return api.create_response(
            request, {"detail": "Only instructors can create classes"}, status=403
        )
    dance_class = DanceClass.objects.create(
        name=payload.name,
        description=payload.description,
        instructor=request.auth,
        level=payload.level,
        max_capacity=payload.max_capacity,
        price=payload.price,
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
        created_at=dance_class.created_at,
        updated_at=dance_class.updated_at,
    )

@api.get("/classes/{class_id}", response=DanceClassSchema)
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
        created_at=dance_class.created_at,
        updated_at=dance_class.updated_at,
    )

@api.put("/classes/{class_id}", response=DanceClassSchema)
def update_class(request, class_id: int, payload: DanceClassSchema):
    dance_class = get_object_or_404(DanceClass, id=class_id)
    if request.auth.role != 'instructor' or request.auth.id != dance_class.instructor_id:
        return api.create_response(
            request, {"detail": "Only the instructor who created this class can update it"}, status=403
        )
    for attr, value in payload.dict().items():
        if attr not in ["id", "created_at", "updated_at"]:
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
        created_at=dance_class.created_at,
        updated_at=dance_class.updated_at,
    )

@api.delete("/classes/{class_id}")
def delete_class(request, class_id: int):
    dance_class = get_object_or_404(DanceClass, id=class_id)
    if request.auth.role != 'instructor' or request.auth.id != dance_class.instructor_id:
        return api.create_response(
            request, {"detail": "Only the instructor who created this class can delete it"}, status=403
        )
    dance_class.delete()
    return {"success": True}

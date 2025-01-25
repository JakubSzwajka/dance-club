from typing import cast

from accounts.models import User
from django.contrib.auth import authenticate
from django.http import HttpRequest, HttpResponse
from ninja import Router

from ..auth import create_token
from .schemas import LoginSchema, SignupSchema, TokenResponse, UserSchema
from .types import AuthenticatedRequest

router = Router()


@router.post('/signup', response=TokenResponse, auth=None)
def signup(request: HttpRequest, data: SignupSchema) -> HttpResponse | TokenResponse:
    if data.role not in ['student', 'instructor']:
        return HttpResponse(
            '{"detail": "Invalid role. Must be either \'student\' or \'instructor\'"}',
            status=400,
            content_type='application/json',
        )

    if User.objects.filter(email=data.email).exists():
        return HttpResponse(
            '{"detail": "Email already exists"}',
            status=400,
            content_type='application/json',
        )

    user = User.objects.create_user(
        username=data.email,
        email=data.email,
        password=data.password,
        role=data.role,
    )

    token = create_token(user)
    return TokenResponse(access=token, email=user.email)


@router.post('/login', response=TokenResponse, auth=None)
def login(request: HttpRequest, data: LoginSchema) -> HttpResponse | TokenResponse:
    user = authenticate(request, username=data.email, password=data.password)
    if user is None:
        return HttpResponse(
            '{"detail": "Invalid credentials"}',
            status=401,
            content_type='application/json',
        )

    token = create_token(user)
    return TokenResponse(access=token, email=user.email)


@router.get('/me', response=UserSchema)
def me(request: AuthenticatedRequest) -> UserSchema:
    return UserSchema(id=request.auth.id, email=request.auth.email, role=request.auth.role)
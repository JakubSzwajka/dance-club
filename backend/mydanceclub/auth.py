from datetime import UTC, datetime
from typing import Optional

import jwt
from accounts.models import User
from django.conf import settings
from ninja.security import HttpBearer


def create_token(user: User) -> str:
    """Create a JWT token for a user."""
    payload = {
        'user_id': user.id,
        'email': user.email,
        'role': user.role,
        'exp': datetime.now(UTC) + settings.JWT_LIFETIME,
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm='HS256')


def get_user_from_token(token: str) -> Optional[User]:
    """Get user from JWT token."""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=['HS256'])
        user = User.objects.get(id=payload['user_id'])
        return user
    except (jwt.InvalidTokenError, User.DoesNotExist):
        return None


class AuthBearer(HttpBearer):
    def authenticate(self, request, token: str) -> Optional[User]:
        user = get_user_from_token(token)
        if user:
            request.user = user
        return user

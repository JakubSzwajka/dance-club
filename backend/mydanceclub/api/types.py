from typing import TypedDict

from accounts.models import User
from django.http import HttpRequest


class AuthDict(TypedDict):
    auth: User


class AuthenticatedRequest(HttpRequest):
    auth: User
from datetime import timedelta
from typing import List, cast

from accounts.models import User
from classes.models import DanceClass, RecurringSchedule, SpecialSchedule
from django.core.exceptions import PermissionDenied
from django.http import HttpRequest, HttpResponse
from django.shortcuts import get_object_or_404
from ninja import Router

from .schemas import (
    CreateRecurringScheduleSchema,
    CreateSpecialScheduleSchema,
    RecurringScheduleSchema,
    SpecialScheduleSchema,
)
from .private.types import AuthenticatedRequest

router = Router()


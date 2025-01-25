from ninja import NinjaAPI

from ..auth import AuthBearer
from .auth import router as auth_router
from .classes import router as classes_router
from .events import router as events_router
from .reviews import router as reviews_router
from .schedules import router as schedules_router
from .instructors import router as instructors_router

api = NinjaAPI(auth=AuthBearer())

api.add_router("/auth", auth_router)
api.add_router("/classes", classes_router)
api.add_router("/events", events_router)
api.add_router("/reviews", reviews_router)
api.add_router("/schedules", schedules_router)
api.add_router("/instructors", instructors_router)
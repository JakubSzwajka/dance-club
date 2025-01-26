from ninja import NinjaAPI

from ..auth import AuthBearer
from .private.auth import router as auth_router
from .classes import router as classes_router
from .events import router as events_router
from .public import router as public_router
from .private.private import router as private_router

api = NinjaAPI(auth=AuthBearer())

api.add_router("/auth", auth_router)
api.add_router("/classes", classes_router)
api.add_router("/events", events_router)
api.add_router("/public", public_router)
api.add_router("/private", private_router)

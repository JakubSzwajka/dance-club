from ninja import Router
from .classes import router as classes_router
from .instructors import router as instructors_router
from .locations import router as locations_router
from .reviews import router as reviews_router
from .metadata import router as metadata_router

router = Router()
router.add_router('/', classes_router)
router.add_router('/', instructors_router)
router.add_router('/', locations_router)
router.add_router('/', reviews_router)
router.add_router('/', metadata_router)
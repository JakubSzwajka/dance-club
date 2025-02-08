from typing import List, Optional
from django.db.models import Avg, Count
from accounts.models import User
from classes.services.class_search_engine import ClassSearchEngineService
from classes.schemas.user_schema import InstructorPublicSchema


class InstructorPublicManagerService:
    def __init__(self):
        self.class_search_engine = ClassSearchEngineService()

    def _get_instructor_public_profile(
        self, instructor: User
    ) -> InstructorPublicSchema:
        instructor_schema = instructor.to_schema()
        instructor_classes = self.class_search_engine.get_classes_by_instructor(
            instructor.id
        )
        return InstructorPublicSchema(
            id=instructor_schema.id,
            first_name=instructor_schema.first_name,
            last_name=instructor_schema.last_name,
            bio=instructor_schema.bio,
            profile_picture=instructor_schema.profile_picture,
            classes_count=len(instructor_classes),
            rating=0,
            reviews_count=0,
        )

    def get_instructors(
        self,
        min_rating: Optional[float] = None,
        style: Optional[str] = None,
        sort_by: Optional[str] = None,
    ) -> List[InstructorPublicSchema]:
        """Get instructors with optional filters and sorting"""
        # Base query with aggregated stats
        instructors = User.objects.filter(role="instructor").annotate(
            # Get average rating from reviews that reference this instructor through instructor_stats
            avg_rating=Avg("instructor_reviews__overall_rating"),
            classes_count=Count("classes", distinct=True),
            total_reviews=Count("instructor_reviews", distinct=True),
        )

        # Apply filters
        if min_rating:
            instructors = instructors.filter(avg_rating__gte=min_rating)
        if style:
            instructors = instructors.filter(classes__style=style)

        # Apply sorting
        if sort_by == "rating_desc":
            instructors = instructors.order_by("-avg_rating", "-total_reviews")
        elif sort_by == "classes_count_desc":
            instructors = instructors.order_by("-classes_count", "-avg_rating")
        else:
            instructors = instructors.order_by("-avg_rating", "-classes_count")

        return [
            self._get_instructor_public_profile(instructor)
            for instructor in instructors.distinct()
        ]

    def get_instructor_by_id(self, instructor_id: str) -> InstructorPublicSchema:
        """Get instructor details with aggregated stats"""
        instructor = (
            User.objects.filter(role="instructor")
            .annotate(
                # Get average rating from reviews that reference this instructor through instructor_stats
                avg_rating=Avg("instructor_reviews__overall_rating"),
                classes_count=Count("classes", distinct=True),
                total_reviews=Count("instructor_reviews", distinct=True),
            )
            .get(id=instructor_id)
        )

        return self._get_instructor_public_profile(instructor)

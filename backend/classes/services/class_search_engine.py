from typing import List, Optional
from django.db.models import Avg, F, Count, FloatField
from classes.models import DanceClass
from classes.schemas.dance_class import DanceClassSchema
from django.db.models.functions import ACos, Cos, Radians, Sin, Cast
from datetime import date


class ClassSearchEngineService:
    def get_classes_near_location(
        self,
        latitude: float,
        longitude: float,
        start_date: date,
        end_date: date,
        limit: int = 10,
    ) -> List[DanceClassSchema]:
        user_lat_rad = Radians(F("location__latitude"))
        user_lon_rad = Radians(F("location__longitude"))

        classes = (
            DanceClass.objects.annotate(
                distance=Cast(
                    ACos(
                        Sin(Radians(F("location__latitude"))) * Sin(user_lat_rad)
                        + Cos(Radians(F("location__latitude")))
                        * Cos(user_lat_rad)
                        * Cos(Radians(F("location__longitude")) - user_lon_rad)
                    )
                    * 6371.0,
                    output_field=FloatField(),
                )
            )
            .filter(end_date__gte=start_date, start_date__lte=end_date)
            .annotate(avg_rating=Avg("reviews__overall_rating"))
            .order_by("-avg_rating")[:limit]
        )

        return [cls.to_schema() for cls in classes]

    def get_classes_with_filters(
        self,
        instructor_id: Optional[str] = None,
        location_id: Optional[str] = None,
        style: Optional[str] = None,
        level: Optional[str] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        min_rating: Optional[float] = None,
        sort_by: Optional[str] = None,
    ) -> List[DanceClassSchema]:
        """Get classes with filters and sorting"""
        # Base query with review stats
        classes = DanceClass.objects.annotate(
            avg_rating=Avg("reviews__overall_rating"),
            review_count=Count("reviews__review"),
        )

        # Apply filters
        if instructor_id:
            classes = classes.filter(instructor_id=instructor_id)
        if location_id:
            classes = classes.filter(location_id=location_id)
        if style:
            classes = classes.filter(style=style)
        if level:
            classes = classes.filter(level=level)
        if start_date:
            classes = classes.filter(end_date__gte=start_date)
        if end_date:
            classes = classes.filter(start_date__lte=end_date)
        if min_rating:
            classes = classes.filter(avg_rating__gte=min_rating)

        # Apply sorting
        if sort_by == "rating_desc":
            classes = classes.order_by("-avg_rating", "-review_count", "-created_at")
        elif sort_by == "price_asc":
            classes = classes.order_by("price", "-avg_rating")
        elif sort_by == "price_desc":
            classes = classes.order_by("-price", "-avg_rating")
        elif sort_by == "date_desc":
            classes = classes.order_by("-start_date", "-avg_rating")
        else:
            classes = classes.order_by("-avg_rating", "-created_at")

        return [cls.to_schema() for cls in classes]

    def get_classes_by_instructor(
        self, instructor_id: str, include_past: bool = False
    ) -> List[DanceClassSchema]:
        """Get classes by instructor"""
        classes = DanceClass.objects.filter(instructor_id=instructor_id)
        if not include_past:
            today = date.today()
            classes = classes.filter(end_date__gte=today)

        return [cls.to_schema() for cls in classes]

    def get_classes_by_location(
        self, location_id: str, include_past: bool = False
    ) -> List[DanceClassSchema]:
        """Get classes at a location"""
        classes = DanceClass.objects.filter(location_id=location_id)
        if not include_past:
            today = date.today()
            classes = classes.filter(end_date__gte=today)

        return [cls.to_schema() for cls in classes]

    def get_class_by_id(self, class_id: str) -> DanceClassSchema:
        """Get a single class by ID"""
        dance_class = DanceClass.objects.get(id=class_id)
        return dance_class.to_schema()

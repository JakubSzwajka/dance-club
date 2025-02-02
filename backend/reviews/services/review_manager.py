from typing import List, Optional
from django.db.models import Avg, Count, Q
from django.core.paginator import Paginator
from reviews.models import (
    Review,
)
from reviews.schemas.response import (
    ReviewListSchema
)
class ReviewManagerService:
    def get_class_reviews_paginated(
        self,
        class_id: str,
        page: int = 1,
        page_size: int = 10,
        sort_by: Optional[str] = None,
    ) -> ReviewListSchema:
        """Get paginated reviews for a class with enhanced filters"""
        queryset = Review.objects.filter(dance_class_id=class_id)

        # Apply sorting
        if sort_by:
            if sort_by == 'date_desc':
                queryset = queryset.order_by('-created_at')
            elif sort_by == 'date_asc':
                queryset = queryset.order_by('created_at')
            elif sort_by == 'rating_desc':
                queryset = queryset.order_by('-overall_rating')
            elif sort_by == 'rating_asc':
                queryset = queryset.order_by('overall_rating')

        # Calculate pagination
        total = queryset.count()
        total_pages = (total + page_size - 1) // page_size
        start = (page - 1) * page_size
        end = start + page_size

        reviews = list(queryset[start:end])
        response_items = [review.to_schema() for review in reviews]

        return ReviewListSchema(
            items=response_items,
            total=total,
            page=page,
            pages=total_pages,
            has_next=page < total_pages,
            has_prev=page > 1
        )

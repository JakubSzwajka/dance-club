from typing import List, Optional, Dict
from django.db.models import Avg, Count, Q
from django.core.paginator import Paginator
from reviews.models import Review, TeachingApproachReview, EnvironmentReview, MusicReview, FacilitiesReview
from reviews.schemas.review import ReviewSchema, ReviewStatsSchema, ReviewCreateSchema, ReviewListSchema
from classes.models import DanceClass
from accounts.models import User


class ReviewManagerService:
    def get_class_reviews_paginated(
        self,
        class_id: str,
        page: int = 1,
        page_size: int = 10,
        sort_by: Optional[str] = None,
        verified_only: bool = False,
        min_rating: Optional[int] = None,
        max_rating: Optional[int] = None
    ) -> ReviewListSchema:
        """Get paginated reviews for a class with filters"""
        # Base query
        reviews = Review.objects.filter(dance_class_id=class_id)

        # Apply filters
        if verified_only:
            reviews = reviews.filter(is_verified=True)
        if min_rating is not None:
            reviews = reviews.filter(overall_rating__gte=min_rating)
        if max_rating is not None:
            reviews = reviews.filter(overall_rating__lte=max_rating)

        # Apply sorting
        if sort_by == 'date_desc':
            reviews = reviews.order_by('-created_at')
        elif sort_by == 'rating_desc':
            reviews = reviews.order_by('-overall_rating', '-created_at')
        elif sort_by == 'rating_asc':
            reviews = reviews.order_by('overall_rating', '-created_at')
        else:
            reviews = reviews.order_by('-created_at')  # Default sorting

        # Paginate results
        paginator = Paginator(reviews, page_size)
        page_obj = paginator.get_page(page)

        return ReviewListSchema(
            items=[review.to_schema() for review in page_obj],
            total=paginator.count,
            page=page,
            pages=paginator.num_pages,
            has_next=page_obj.has_next(),
            has_prev=page_obj.has_previous()
        )

    def get_class_reviews(
        self,
        class_id: str,
        limit: int = 3,
        sort_by: str = 'date_desc'
    ) -> List[ReviewSchema]:
        """Get a limited number of reviews for a class"""
        reviews = Review.objects.filter(dance_class_id=class_id)

        if sort_by == 'date_desc':
            reviews = reviews.order_by('-created_at')
        elif sort_by == 'rating_desc':
            reviews = reviews.order_by('-overall_rating', '-created_at')

        reviews = reviews[:limit]
        return [review.to_schema() for review in reviews]

    def get_class_review_stats(self, class_id: str) -> ReviewStatsSchema:
        """Get aggregated review statistics for a class"""
        reviews = Review.objects.filter(dance_class_id=class_id)

        # Basic stats
        total_reviews = reviews.count()
        verified_reviews = reviews.filter(is_verified=True).count()
        avg_rating = reviews.aggregate(Avg('overall_rating'))['overall_rating__avg'] or 0.0

        # Rating distribution
        rating_distribution = dict(reviews.values('overall_rating')
                                 .annotate(count=Count('id'))
                                 .values_list('overall_rating', 'count'))

        # Teaching approach stats
        teaching_stats = TeachingApproachReview.objects.filter(review__dance_class_id=class_id).aggregate(
            avg_teaching_style=Avg('teaching_style'),
            avg_feedback_approach=Avg('feedback_approach'),
            avg_pace_of_teaching=Avg('pace_of_teaching'),
            avg_breakdown_quality=Avg('breakdown_quality')
        )

        # Environment stats
        environment_stats = EnvironmentReview.objects.filter(review__dance_class_id=class_id).aggregate(
            avg_floor_quality=Avg('floor_quality'),
            avg_crowdedness=Avg('crowdedness'),
            avg_ventilation=Avg('ventilation')
        )
        # Add temperature distribution
        temp_dist = dict(EnvironmentReview.objects.filter(review__dance_class_id=class_id)
                        .values('temperature')
                        .annotate(count=Count('id'))
                        .values_list('temperature', 'count'))
        environment_stats['temperature_distribution'] = temp_dist

        # Music stats
        music_stats = MusicReview.objects.filter(review__dance_class_id=class_id).aggregate(
            avg_volume_level=Avg('volume_level'),
            avg_style=Avg('style')
        )
        # Add genre distribution
        music_reviews = MusicReview.objects.filter(review__dance_class_id=class_id)
        genre_dist = {}
        for review in music_reviews:
            for genre in review.genres:
                genre_dist[genre] = genre_dist.get(genre, 0) + 1
        music_stats['genre_distribution'] = genre_dist

        # Facilities stats
        facilities_reviews = FacilitiesReview.objects.filter(review__dance_class_id=class_id)
        facilities_stats = {
            'changing_room_available': facilities_reviews.filter(has_changing_room=True).count(),
            'avg_changing_room_quality': facilities_reviews.filter(has_changing_room=True).aggregate(Avg('changing_room_quality'))['changing_room_quality__avg'],
            'waiting_area_available': facilities_reviews.filter(has_waiting_area=True).count(),
            'seating_available': facilities_reviews.filter(has_seating=True).count()
        }
        # Add sports cards distribution
        cards_dist = {}
        for review in facilities_reviews:
            for card in review.accepted_cards:
                cards_dist[card] = cards_dist.get(card, 0) + 1
        facilities_stats['accepted_cards_distribution'] = cards_dist

        return ReviewStatsSchema(
            average_rating=round(avg_rating, 1),
            total_reviews=total_reviews,
            verified_reviews=verified_reviews,
            rating_distribution=rating_distribution,
            teaching_stats=teaching_stats,
            environment_stats=environment_stats,
            music_stats=music_stats,
            facilities_stats=facilities_stats
        )

    def create_review(self, class_id: str, review_data: ReviewCreateSchema) -> ReviewSchema:
        """Create a new review with all related components"""
        # Validate class exists
        dance_class = DanceClass.objects.get(id=class_id)

        # Create main review
        review = Review.objects.create(
            dance_class=dance_class,
            user_id=review_data.user_id,
            anonymous_name=review_data.anonymous_name,
            overall_rating=review_data.overall_rating,
            comment=review_data.comment,
            is_verified=False  # Will be verified through a separate process
        )

        # Create teaching approach review
        TeachingApproachReview.objects.create(
            review=review,
            **review_data.teaching_approach.dict()
        )

        # Create environment review
        EnvironmentReview.objects.create(
            review=review,
            **review_data.environment.dict()
        )

        # Create music review
        music_review = MusicReview.objects.create(
            review=review,
            volume_level=review_data.music.volume_level,
            style=review_data.music.style
        )
        music_review.set_genres(review_data.music.genres)
        music_review.save()

        # Create facilities review
        facilities_review = FacilitiesReview.objects.create(
            review=review,
            **{k: v for k, v in review_data.facilities.dict().items() if k != 'accepted_cards'}
        )
        facilities_review.set_accepted_cards(review_data.facilities.accepted_cards)
        facilities_review.save()

        return review.to_schema()
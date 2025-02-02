from typing import List, Optional
from django.db.models import Avg, Count, Q
from django.core.paginator import Paginator
from reviews.models import (
    Review,
    TeachingApproachReview,
    EnvironmentReview,
    MusicReview,
    FacilitiesReview,
    ReviewVerification
)
from reviews.constants import VERIFICATION_METHODS
from reviews.schemas.base import (
    TeachingApproachSchema,
    EnvironmentSchema,
    MusicSchema,
    FacilitiesSchema
)
from reviews.schemas.response import (
    ReviewResponseSchema,
    ReviewStatsSchema,
    ReviewListSchema
)
from reviews.schemas.create import ReviewCreateSchema
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
        max_rating: Optional[int] = None,
        teaching_style_min: Optional[int] = None,
        teaching_style_max: Optional[int] = None,
        feedback_approach_min: Optional[int] = None,
        feedback_approach_max: Optional[int] = None,
        pace_min: Optional[int] = None,
        pace_max: Optional[int] = None,
        temperature: Optional[str] = None,
        music_genres: Optional[List[str]] = None,
        has_changing_room: Optional[bool] = None,
        has_waiting_area: Optional[bool] = None,
        accepted_cards: Optional[List[str]] = None,
    ) -> ReviewListSchema:
        """Get paginated reviews for a class with enhanced filters"""
        queryset = Review.objects.filter(dance_class_id=class_id)

        # Apply filters
        if verified_only:
            queryset = queryset.filter(is_verified=True)

        if min_rating is not None:
            queryset = queryset.filter(overall_rating__gte=min_rating)

        if max_rating is not None:
            queryset = queryset.filter(overall_rating__lte=max_rating)

        # Teaching approach filters
        if teaching_style_min is not None:
            queryset = queryset.filter(teaching_approach__teaching_style__gte=teaching_style_min)

        if teaching_style_max is not None:
            queryset = queryset.filter(teaching_approach__teaching_style__lte=teaching_style_max)

        if feedback_approach_min is not None:
            queryset = queryset.filter(teaching_approach__feedback_approach__gte=feedback_approach_min)

        if feedback_approach_max is not None:
            queryset = queryset.filter(teaching_approach__feedback_approach__lte=feedback_approach_max)

        if pace_min is not None:
            queryset = queryset.filter(teaching_approach__pace_of_teaching__gte=pace_min)

        if pace_max is not None:
            queryset = queryset.filter(teaching_approach__pace_of_teaching__lte=pace_max)

        # Environment filters
        if temperature is not None:
            queryset = queryset.filter(environment__temperature=temperature)

        # Music filters
        if music_genres:
            genre_q = Q()
            for genre in music_genres:
                genre_q |= Q(music__genres__contains=genre)
            queryset = queryset.filter(genre_q)

        # Facilities filters
        if has_changing_room is not None:
            queryset = queryset.filter(facilities__changing_room__available=has_changing_room)

        if has_waiting_area is not None:
            queryset = queryset.filter(facilities__waiting_area__available=has_waiting_area)

        if accepted_cards:
            cards_q = Q()
            for card in accepted_cards:
                cards_q |= Q(facilities__accepted_cards__contains=card)
            queryset = queryset.filter(cards_q)

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
        response_items = [ReviewResponseSchema.from_orm(review) for review in reviews]

        return ReviewListSchema(
            items=response_items,
            total=total,
            page=page,
            pages=total_pages,
            has_next=page < total_pages,
            has_prev=page > 1
        )

    def get_class_reviews(
        self,
        class_id: str,
        limit: int = 3,
        sort_by: str = 'date_desc'
    ) -> List[ReviewResponseSchema]:
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
            teaching_stats=teaching_stats,
            environment_stats=environment_stats,
            music_stats=music_stats,
            facilities_stats=facilities_stats
        )

    def create_review(self, class_id: str, review_data: ReviewCreateSchema) -> ReviewResponseSchema:
        """Create a new review with all related components"""
        # Validate class exists
        dance_class = DanceClass.objects.get(id=class_id)

        # Create main review
        review = Review.objects.create(
            dance_class=dance_class,
            overall_rating=review_data.overall_rating,
            comment=review_data.comment,
            is_verified=False  # Will be verified through a separate process
        )

        # Create teaching approach review
        TeachingApproachReview.objects.create(
            review=review,
            **review_data.teaching.dict()
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
        music_review.genres = review_data.music.genres
        music_review.save()

        # Create facilities review
        facilities_review = FacilitiesReview.objects.create(
            review=review,
            changing_room=review_data.facilities.changing_room.dict(),
            waiting_area=review_data.facilities.waiting_area.dict(),
        )
        facilities_review.accepted_cards = review_data.facilities.accepted_cards
        facilities_review.save()

        return ReviewResponseSchema.from_orm(review)

    def get_review_teaching(self, review_id: str) -> TeachingApproachSchema:
        """Get teaching approach component of a review"""
        review = Review.objects.get(id=review_id)
        return TeachingApproachSchema.from_orm(review.teaching_approach)

    def get_review_environment(self, review_id: str) -> EnvironmentSchema:
        """Get environment component of a review"""
        review = Review.objects.get(id=review_id)
        return EnvironmentSchema.from_orm(review.environment)

    def get_review_music(self, review_id: str) -> MusicSchema:
        """Get music component of a review"""
        review = Review.objects.get(id=review_id)
        return MusicSchema.from_orm(review.music)

    def get_review_facilities(self, review_id: str) -> FacilitiesSchema:
        """Get facilities component of a review"""
        review = Review.objects.get(id=review_id)
        return FacilitiesSchema.from_orm(review.facilities)

    def verify_review(
        self,
        review_id: str,
        verifier: User,
        method: str,
        notes: Optional[str] = None
    ) -> ReviewResponseSchema:
        """Verify a review using specified method"""
        if method not in VERIFICATION_METHODS:
            raise ValueError(f"Invalid verification method. Must be one of: {', '.join(VERIFICATION_METHODS)}")


        review = Review.objects.get(id=review_id)
        # Create verification record
        verification = ReviewVerification.objects.create(
            verified_by=verifier,
            verification_method=method,
            verification_notes=notes
        ).save()

        # Link verification to review
        review.verification = verification
        review.is_verified = True
        review.save()

        return ReviewResponseSchema.from_orm(review)

    def get_verification_methods(self) -> List[str]:
        """Get available review verification methods"""
        return VERIFICATION_METHODS
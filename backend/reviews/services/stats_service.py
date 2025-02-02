from django.db.models import Avg, Count, Q
from reviews.models import Review

class ReviewStatsService:
    @staticmethod
    def get_class_stats(class_id: str) -> dict:
        """Get comprehensive review statistics for a class"""
        reviews = Review.objects.filter(dance_class_id=class_id)

        return {
            "total_reviews": reviews.count(),
            "average_rating": reviews.aggregate(Avg('overall_rating'))['overall_rating__avg'] or 0.0,
            "verified_reviews": reviews.filter(verified=True).count(),
            "teaching_stats": {
                "avg_teaching_style": reviews.aggregate(Avg('teaching__teaching_style'))['teaching__teaching_style__avg'] or 0,
                "avg_feedback_approach": reviews.aggregate(Avg('teaching__feedback_approach'))['teaching__feedback_approach__avg'] or 0,
                "avg_pace": reviews.aggregate(Avg('teaching__pace_of_teaching'))['teaching__pace_of_teaching__avg'] or 0,
                "avg_breakdown_quality": reviews.aggregate(Avg('teaching__breakdown_quality'))['teaching__breakdown_quality__avg'] or 0,
            },
            "environment_stats": {
                "avg_floor_quality": reviews.aggregate(Avg('environment__floor_quality'))['environment__floor_quality__avg'] or 0,
                "avg_crowdedness": reviews.aggregate(Avg('environment__crowdedness'))['environment__crowdedness__avg'] or 0,
                "avg_ventilation": reviews.aggregate(Avg('environment__ventilation'))['environment__ventilation__avg'] or 0,
                "temperature_distribution": ReviewStatsService._get_temperature_distribution(reviews),
            },
            "music_stats": {
                "avg_volume": reviews.aggregate(Avg('music__volume_level'))['music__volume_level__avg'] or 0,
                "avg_style": reviews.aggregate(Avg('music__style'))['music__style__avg'] or 0,
                "genre_distribution": ReviewStatsService._get_genre_distribution(reviews),
            },
            "facilities_stats": {
                "changing_room_availability": reviews.filter(facilities__changing_room__available=True).count() / reviews.count() if reviews.count() > 0 else 0,
                "avg_changing_room_quality": reviews.filter(facilities__changing_room__available=True).aggregate(Avg('facilities__changing_room__quality'))['facilities__changing_room__quality__avg'] or 0,
                "waiting_area_availability": reviews.filter(facilities__waiting_area__available=True).count() / reviews.count() if reviews.count() > 0 else 0,
                "accepted_cards_distribution": ReviewStatsService._get_cards_distribution(reviews),
            }
        }

    @staticmethod
    def _get_temperature_distribution(reviews) -> dict:
        """Get distribution of temperature ratings"""
        distribution = reviews.values('environment__temperature').annotate(
            count=Count('environment__temperature')
        )
        return {item['environment__temperature']: item['count'] for item in distribution}

    @staticmethod
    def _get_genre_distribution(reviews) -> dict:
        """Get distribution of music genres"""
        genres = {}
        for review in reviews:
            for genre in review.music.genres:
                genres[genre] = genres.get(genre, 0) + 1
        return genres

    @staticmethod
    def _get_cards_distribution(reviews) -> dict:
        """Get distribution of accepted cards"""
        cards = {}
        for review in reviews:
            for card in review.facilities.accepted_cards:
                cards[card] = cards.get(card, 0) + 1
        return cards
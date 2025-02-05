from django.db.models import Avg
from reviews.models import Review, InstructorReview, DanceClassReview, LocationReview
from reviews.schemas.response import (
    ReviewDanceClassStatsSchema,
    ReviewInstructorStatsSchema,
    ReviewLocationStatsSchema,
)

class ReviewStatsService:
    def get_location_stats(self, location_id: str) -> ReviewLocationStatsSchema:
        location_reviews = LocationReview.objects.filter(location_id=location_id)
        return ReviewLocationStatsSchema(
            cleanness=location_reviews.aggregate(Avg('cleanness'))['cleanness__avg'] or 0.0,
            general_look=location_reviews.aggregate(Avg('general_look'))['general_look__avg'] or 0.0,
            acustic_quality=location_reviews.aggregate(Avg('acustic_quality'))['acustic_quality__avg'] or 0.0,
            additional_facilities=location_reviews.aggregate(Avg('additional_facilities'))['additional_facilities__avg'] or 0.0,
            temperature=location_reviews.aggregate(Avg('temperature'))['temperature__avg'] or 0.0,
            lighting=location_reviews.aggregate(Avg('lighting'))['lighting__avg'] or 0.0,
            avg_rating=location_reviews.aggregate(Avg('overall_rating'))['overall_rating__avg'] or 0.0
        )

    def get_dance_class_stats(self, dance_class_id: str) -> ReviewDanceClassStatsSchema:
        dance_class_reviews = DanceClassReview.objects.filter(dance_class_id=dance_class_id)
        return ReviewDanceClassStatsSchema(
            group_size=dance_class_reviews.aggregate(Avg('group_size'))['group_size__avg'] or 0.0,
            level=dance_class_reviews.aggregate(Avg('level'))['level__avg'] or 0.0,
            engagement=dance_class_reviews.aggregate(Avg('engagement'))['engagement__avg'] or 0.0,
            teaching_pace=dance_class_reviews.aggregate(Avg('teaching_pace'))['teaching_pace__avg'] or 0.0,
            avg_rating=dance_class_reviews.aggregate(Avg('overall_rating'))['overall_rating__avg'] or 0.0
        )

    def get_instructor_stats(self, instructor_id: str) -> ReviewInstructorStatsSchema:
        instructor_reviews = InstructorReview.objects.filter(instructor_id=instructor_id)
        return ReviewInstructorStatsSchema(
            move_breakdown=instructor_reviews.aggregate(Avg('move_breakdown'))['move_breakdown__avg'] or 0.0,
            individual_approach=instructor_reviews.aggregate(Avg('individual_approach'))['individual_approach__avg'] or 0.0,
            posture_correction_ability=instructor_reviews.aggregate(Avg('posture_correction_ability'))['posture_correction_ability__avg'] or 0.0,
            communication_and_feedback=instructor_reviews.aggregate(Avg('communication_and_feedback'))['communication_and_feedback__avg'] or 0.0,
            patience_and_encouragement=instructor_reviews.aggregate(Avg('patience_and_encouragement'))['patience_and_encouragement__avg'] or 0.0,
            motivation_and_energy=instructor_reviews.aggregate(Avg('motivation_and_energy'))['motivation_and_energy__avg'] or 0.0,
            avg_rating=instructor_reviews.aggregate(Avg('overall_rating'))['overall_rating__avg'] or 0.0
        )

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StarIcon } from '@heroicons/react/24/solid'
import { cn } from '@/lib/utils'
import { useClassReviews } from '@/lib/api/public/classes'
import { components } from '@/lib/api/schema'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <StarIcon
          key={star}
          className={cn('h-5 w-5', star <= rating ? 'text-yellow-400' : 'text-muted')}
        />
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: components['schemas']['ReviewResponseSchema'] }) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium">{review.author_name}</div>
              <div className="text-sm text-muted-foreground">{review.created_at}</div>
            </div>
            <StarRating rating={review.overall_rating} />
          </div>
          <p className="text-sm">{review.comment}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function ReviewsTab({ classId }: { classId: string }) {
  const { data: reviews } = useClassReviews(classId, 1, 1000)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Student Reviews</h2>
        <Button>Write a Review</Button>
      </div>

      <div className="grid gap-6">
        {reviews?.items.map(review => <ReviewCard key={review.id} review={review} />)}
      </div>
    </div>
  )
}

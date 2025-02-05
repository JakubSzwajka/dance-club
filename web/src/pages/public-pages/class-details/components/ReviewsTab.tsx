import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StarIcon } from "@heroicons/react/24/solid"
import { Badge } from "@/components/ui/badge"
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useClassReviews } from "@/lib/api/public/classes"
import { components } from "@/lib/api/schema"

interface ReviewData {
  id: number
  userName: string
  date: string
  overallRating: number
  teachingStyle: number
  feedbackApproach: number
  paceOfTeaching: number
  breakdownQuality: number
  environment: {
    floorQuality: number
    crowdedness: number
    ventilation: number
    temperature: 'cool' | 'moderate' | 'warm'
  }
  music: {
    volumeLevel: number
    genres: string[]
    style: number
  }
  facilities: {
    changingRoom: {
      available: boolean
      quality?: number // 1-5 rating, optional if not available
      notes?: string
    }
    waitingArea: {
      available: boolean
      type?: 'indoor' | 'outdoor' | 'both'
      seating?: boolean
      notes?: string
    }
    acceptedCards: string[] // e.g., ['MultiSport', 'Medicover Sport', 'OK System']
  }
  comment: string
}

const mockReviews: ReviewData[] = [
  {
    id: 1,
    userName: "Sarah M.",
    date: "2 months ago",
    overallRating: 5,
    teachingStyle: 80,
    feedbackApproach: 60,
    paceOfTeaching: 70,
    breakdownQuality: 5,
    environment: {
      floorQuality: 4,
      crowdedness: 3,
      ventilation: 4,
      temperature: 'moderate'
    },
    music: {
      volumeLevel: 4,
      genres: ['Latin', 'Pop'],
      style: 75
    },
    facilities: {
      changingRoom: {
        available: true,
        quality: 4,
        notes: "Clean and spacious with lockers"
      },
      waitingArea: {
        available: true,
        type: 'indoor',
        seating: true,
        notes: "Comfortable seating area with water dispenser"
      },
      acceptedCards: ['MultiSport', 'Medicover Sport']
    },
    comment: "Amazing class! The instructor takes time to break down complex moves and the atmosphere is perfect for learning. Music selection keeps you energized throughout."
  },
  {
    id: 2,
    userName: "Mike R.",
    date: "1 month ago",
    overallRating: 4,
    teachingStyle: 60,
    feedbackApproach: 40,
    paceOfTeaching: 50,
    breakdownQuality: 4,
    environment: {
      floorQuality: 5,
      crowdedness: 4,
      ventilation: 5,
      temperature: 'cool'
    },
    music: {
      volumeLevel: 3,
      genres: ['Contemporary', 'Pop'],
      style: 60
    },
    facilities: {
      changingRoom: {
        available: true,
        quality: 3,
        notes: "Basic but functional"
      },
      waitingArea: {
        available: true,
        type: 'both',
        seating: true,
        notes: "Nice outdoor benches and indoor chairs"
      },
      acceptedCards: ['MultiSport', 'OK System']
    },
    comment: "Great structured approach to teaching. The studio is well-maintained and spacious. Would prefer slightly more upbeat music."
  }
]

function Slider({ value, leftLabel, rightLabel }: { 
  value: number, 
  leftLabel: string, 
  rightLabel: string
}) {
  return (
    <div className="space-y-2">
      <div className="h-2 bg-muted rounded-full relative">
        <div 
          className="absolute top-0 left-0 h-full bg-primary rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon 
          key={star} 
          className={cn(
            "h-5 w-5",
            star <= rating ? "text-yellow-400" : "text-muted"
          )}
        />
      ))}
    </div>
  )
}

function FacilityInfo({ label, available, children }: { 
  label: string
  available: boolean
  children?: React.ReactNode 
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm">{label}</span>
        <Badge variant={available ? "secondary" : "outline"}>
          {available ? "Available" : "Not Available"}
        </Badge>
      </div>
      {available && children && (
        <div className="pl-4 border-l-2 border-muted">
          {children}
        </div>
      )}
    </div>
  )
}

function ReviewCard({ review }: { review: components["schemas"]["ReviewResponseSchema"] }) {

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
        {reviews?.items.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  )
} 
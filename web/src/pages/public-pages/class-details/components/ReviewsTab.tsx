import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StarIcon } from "@heroicons/react/24/solid"
import { Badge } from "@/components/ui/badge"
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import { cn } from "@/lib/utils"

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

function ReviewCard({ review }: { review: ReviewData }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card>
      <CardContent className="py-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium">{review.userName}</div>
              <div className="text-sm text-muted-foreground">{review.date}</div>
            </div>
            <StarRating rating={review.overallRating} />
          </div>

          {/* Main Comment */}
          <p className="text-sm">{review.comment}</p>

          {/* Expand/Collapse Button */}
          <Button
            variant="ghost"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <span>Show less</span>
                <ChevronUpIcon className="h-4 w-4" />
              </>
            ) : (
              <>
                <span>Show detailed review</span>
                <ChevronDownIcon className="h-4 w-4" />
              </>
            )}
          </Button>

          {/* Detailed Review */}
          {isExpanded && (
            <div className="space-y-6 pt-4 border-t">
              {/* Teaching Approach */}
              <div className="space-y-4">
                <h4 className="font-medium">Teaching Approach</h4>
                <div className="space-y-4">
                  <Slider 
                    value={review.teachingStyle}
                    leftLabel="Structured"
                    rightLabel="Casual"
                  />
                  <Slider 
                    value={review.feedbackApproach}
                    leftLabel="Verbal"
                    rightLabel="Hands-on"
                  />
                  <Slider 
                    value={review.paceOfTeaching}
                    leftLabel="Methodical"
                    rightLabel="Fast-paced"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Move Breakdown</span>
                    <StarRating rating={review.breakdownQuality} />
                  </div>
                </div>
              </div>

              {/* Environment */}
              <div className="space-y-4">
                <h4 className="font-medium">Environment</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Floor Quality</span>
                    <StarRating rating={review.environment.floorQuality} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Space Comfort</span>
                    <StarRating rating={review.environment.crowdedness} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ventilation</span>
                    <StarRating rating={review.environment.ventilation} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Temperature</span>
                    <Badge variant="secondary" className="capitalize">
                      {review.environment.temperature}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Music */}
              <div className="space-y-4">
                <h4 className="font-medium">Music</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Volume Level</span>
                    <StarRating rating={review.music.volumeLevel} />
                  </div>
                  <Slider 
                    value={review.music.style}
                    leftLabel="Classical"
                    rightLabel="Modern"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Genres</span>
                    <div className="flex gap-2">
                      {review.music.genres.map((genre) => (
                        <Badge key={genre} variant="secondary">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* New Facilities section */}
              <div className="space-y-4">
                <h4 className="font-medium">Facilities</h4>
                <div className="space-y-4">
                  <FacilityInfo label="Changing Room" available={review.facilities.changingRoom.available}>
                    {review.facilities.changingRoom.quality && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Quality</span>
                          <StarRating rating={review.facilities.changingRoom.quality} />
                        </div>
                        {review.facilities.changingRoom.notes && (
                          <p className="text-sm text-muted-foreground">
                            {review.facilities.changingRoom.notes}
                          </p>
                        )}
                      </div>
                    )}
                  </FacilityInfo>

                  <FacilityInfo label="Waiting Area" available={review.facilities.waitingArea.available}>
                    {review.facilities.waitingArea.type && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Location</span>
                          <Badge variant="secondary" className="capitalize">
                            {review.facilities.waitingArea.type}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Seating</span>
                          <Badge variant={review.facilities.waitingArea.seating ? "secondary" : "outline"}>
                            {review.facilities.waitingArea.seating ? "Available" : "Not Available"}
                          </Badge>
                        </div>
                        {review.facilities.waitingArea.notes && (
                          <p className="text-sm text-muted-foreground">
                            {review.facilities.waitingArea.notes}
                          </p>
                        )}
                      </div>
                    )}
                  </FacilityInfo>

                  <div className="space-y-2">
                    <span className="text-sm font-medium">Accepted Sports Cards</span>
                    <div className="flex flex-wrap gap-2">
                      {review.facilities.acceptedCards.map((card) => (
                        <Badge key={card} variant="secondary">
                          {card}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function ReviewsTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Student Reviews</h2>
        <Button>Write a Review</Button>
      </div>

      <div className="grid gap-6">
        {mockReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  )
} 
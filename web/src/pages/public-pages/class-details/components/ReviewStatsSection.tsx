import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarIcon } from "@heroicons/react/24/solid"
import { cn } from "@/lib/utils"
import { 
  ChartBarIcon,
} from "@heroicons/react/24/outline"
import { useClassReviews, useClassStats, usePublicInstructorStats, usePublicLocationStats } from "@/lib/api/public/index"

function Slider({ value, leftLabel, rightLabel, middleLabel, className, label }: { 
  value: number, 
  label: string,
  leftLabel: string, 
  rightLabel: string,
  middleLabel: string,
  className?: string
}) {
  // By design values here should be between -10 and 10. Where 0 is a sweet spot.
  // Color of the slider should be green for values close to 0 and red for values further away from 0.
  // Slider should be 0% for value -10 and 100% for value 10.
  const normalizedValue = ((value + 10) / 20) * 100 
  
  // Calculate color based on distance from 0
  const absValue = Math.abs(value)
  const color = absValue <= 2 ? 'bg-green-500' : 
                absValue <= 5 ? 'bg-yellow-500' : 
                'bg-red-500'

  return (
    <div className={cn("space-y-2", className)}>
      <div className="text-sm font-medium mb-2">{label}</div>
      <div className="h-2 bg-muted rounded-full relative">
        <div 
          className={cn("absolute top-0 left-0 h-full rounded-full", color)}
          style={{ width: `${normalizedValue}%` }}
        />
        <div 
          className={cn("absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-background", color)}
          style={{ left: `${normalizedValue}%`, transform: `translateX(-50%) translateY(-50%)` }}
        />
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{leftLabel}</span>
        <span>{middleLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  )
}

function StarRating({ rating, label }: { rating: number, label: string }) {
  return (
    <div className="flex items-center gap-4 justify-between">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <StarIcon 
            key={i}
            className={cn(
              "h-4 w-4",
              i < rating ? "text-yellow-500" : "text-muted"
            )}
          />
        ))}
      </div>
    </div>
  )
}

export function ReviewStatsSection({ classId, instructorId, locationId }:{ classId: string, instructorId: string, locationId: string }) {

  const { data: reviews } = useClassReviews(classId)
  const { data: classStats } = useClassStats(classId)
  const { data: instructorStats } = usePublicInstructorStats(instructorId)
  const { data: locationStats } = usePublicLocationStats(locationId)

  return (
    <div className="py-8 border-t">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Class Experience <StarRating rating={classStats?.avg_rating || 0} label="Average rating" /></h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-normal">
            Based on {reviews?.items.length} reviews
          </Badge>
          <Badge variant="secondary" className="font-normal">
            Last updated {reviews?.items[0]?.updated_at ? new Date(reviews.items[0].updated_at).toLocaleDateString() : 'N/A'}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Instructor Stats Card */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-lg font-medium">👩‍🏫 Teaching Approach</h3>
            <div className="space-y-6">
              <Slider
                label="Move breakdown quality"
                value={instructorStats?.move_breakdown || 0}
                leftLabel="Not at all"
                middleLabel="Good"
                rightLabel="Too much details"
              />
              <Slider
                label="Individual approach"
                value={instructorStats?.individual_approach || 0}
                leftLabel="Not at all"
                middleLabel="Good"
                rightLabel="Too much details"
              />
              <StarRating rating={instructorStats?.posture_correction_ability || 0} label="Posture correction ability" />
              <StarRating rating={instructorStats?.communication_and_feedback || 0} label="Communication and feedback" />
              <StarRating rating={instructorStats?.patience_and_encouragement || 0} label="Patience and encouragement" />
              <StarRating rating={instructorStats?.motivation_and_energy || 0} label="Motivation and energy" />
            </div>
          </CardContent>
        </Card>

        {/* Dance Class Stats Card */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-medium">🧑‍🎓 Class</h3>
            <div className="space-y-4">
                <Slider
                  label="Group size"
                  value={classStats?.group_size || 0}
                  leftLabel="Too small"
                  middleLabel="Perfect"
                  rightLabel="Too big"
                />
                <Slider
                  label="Level"
                  value={classStats?.level || 0}
                  leftLabel="Too easy"
                  middleLabel="Perfect"
                  rightLabel="Too hard"
                />
                <Slider
                  label="Engagement"
                  value={classStats?.engagement || 0}
                  leftLabel="Not engaged"
                  middleLabel="Perfect"
                  rightLabel="Too engaged"
                />
                <Slider
                  label="Teaching pace"
                  value={classStats?.teaching_pace || 0}
                  leftLabel="Too slow"
                  middleLabel="Perfect"
                  rightLabel="Too fast"
                />
            </div> 
          </CardContent>
        </Card>

        {/* Location Stats Card */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-lg font-medium">🏢 Location</h3>
            <div className="space-y-6">
              <StarRating rating={locationStats?.cleanness || 0} label="Cleanness" />
              <StarRating rating={locationStats?.general_look || 0} label="General look" />
              <StarRating rating={locationStats?.acustic_quality || 0} label="Acustic quality" />
              <StarRating rating={locationStats?.additional_facilities || 0} label="Additional facilities" />
              <Slider
                label="Temperature"
                value={locationStats?.temperature || 0}
                leftLabel="Too cold"
                middleLabel="Perfect"
                rightLabel="Too hot"
              />
              <Slider
                label="Lighting"
                value={locationStats?.lighting || 0}
                leftLabel="Too dark"
                middleLabel="Perfect"
                rightLabel="Too bright"
              />
            </div>
          </CardContent>
        </Card> 

        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-lg font-medium">🧬 DNA</h3>
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
              <div className="p-3 bg-muted rounded-full">
                <ChartBarIcon className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="max-w-sm">
                <p className="text-sm text-muted-foreground">
                  More reviews are needed to generate detailed dance DNA insights for this class. Check back later!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
} 
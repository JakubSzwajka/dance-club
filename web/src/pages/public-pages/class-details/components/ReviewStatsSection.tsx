import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarIcon } from "@heroicons/react/24/solid"
import { cn } from "@/lib/utils"
import { 
  UserGroupIcon, 
  ClockIcon,
  ChartBarIcon,
  UserIcon
} from "@heroicons/react/24/outline"
import { useClassReviews, useClassStats } from "@/lib/api/public/index"
import { PolarAngleAxis, PolarGrid, Radar } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { RadarChart } from "recharts"
import { ChartTooltipContent } from "@/components/ui/chart"
import { useEffect, useState } from "react"


function DistributionBadges({ distribution }: { distribution: Record<string, number> }) {
  const totalVotes = Object.values(distribution).reduce((acc, value) => acc + value, 0)
  
  function getPercentage(value: number) {
    return Math.round((value / totalVotes) * 100)
  }

  return (
    <div className="flex flex-wrap gap-4">
      {Object.entries(distribution).map(([key, value]) => (
        <div key={key} className="min-w-[120px] flex-1 basis-[calc(33.333%-1rem)]">
          <div className="flex items-center justify-between">
            <span className="font-medium truncate mr-2">{key}</span>
            <Badge variant="secondary" className="shrink-0">{getPercentage(value)}%</Badge>
          </div>
          <div className="h-2 bg-muted rounded-full mt-2">
            <div 
              className="h-full bg-primary rounded-full"
              style={{ width: `${getPercentage(value)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
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

function MetricWithIcon({ icon: Icon, label, value }: { 
  icon: React.ComponentType<{ className?: string }>,
  label: string, 
  value: string | number,
}) {
 
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-muted rounded-lg">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  )
}

const chartConfig = {
  property: {
    label: "Property",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface ChartData {
  property: string
  absoluteValue: number
}

export function ReviewStatsSection({ classId }:{ classId: string }) {

  const { data: reviews } = useClassReviews(classId)
  const { data: stats } = useClassStats(classId)
  const [chartData, setChartData] = useState<ChartData[]>([])

  const instructorStats = stats?.instructor_stats
  const facilitiesStats = stats?.facilities_stats
  const danceClassStats = stats?.dance_class_stats

  useEffect(() => {
    if (stats) {
      setChartData([
        { property: "Move breakdown quality", absoluteValue: stats.instructor_stats.move_breakdown },
        { property: "Group size", absoluteValue: stats.dance_class_stats.group_size },
        { property: "Level", absoluteValue: stats.dance_class_stats.level },
        { property: "Engagement", absoluteValue: stats.dance_class_stats.engagement },
        { property: "Teaching pace", absoluteValue: stats.dance_class_stats.teaching_pace },
        { property: "Cleanness", absoluteValue: stats.facilities_stats.cleanness },
      ])
    }
  }, [stats])

  return (
    <div className="py-8 border-t">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Class Experience</h2>
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
            <h3 className="text-lg font-medium">Teaching Approach</h3>
            <div className="space-y-6">
              <Slider
                label="Move breakdown quality"
                value={instructorStats?.move_breakdown || 0}
                leftLabel="Not at all"
                middleLabel="Good"
                rightLabel="Too much details"
              />
              {/* <Slider 
                value={teachingStats?.avg_feedback_approach || 0}
                leftLabel="Verbal Guidance"
                rightLabel="Hands-on Corrections"
              />
              <Slider 
                value={teachingStats?.avg_pace || 0}
                leftLabel="Methodical"
                rightLabel="Fast-paced"
              />
              <StarRating rating={teachingStats?.avg_breakdown_quality || 0} label="Move Breakdown Quality" /> */}
            </div>
          </CardContent>
        </Card>

        {/* Dance Class Stats Card */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-medium">Dance Class</h3>
            <div className="space-y-4">
                <Slider
                  label="Group size"
                  value={danceClassStats?.group_size || 0}
                  leftLabel="Too small"
                  middleLabel="Perfect"
                  rightLabel="Too big"
                />
                <Slider
                  label="Level"
                  value={danceClassStats?.level || 0}
                  leftLabel="Too easy"
                  middleLabel="Perfect"
                  rightLabel="Too hard"
                />
                <Slider
                  label="Engagement"
                  value={danceClassStats?.engagement || 0}
                  leftLabel="Not engaged"
                  middleLabel="Perfect"
                  rightLabel="Too engaged"
                />
                <Slider
                  label="Teaching pace"
                  value={danceClassStats?.teaching_pace || 0}
                  leftLabel="Too slow"
                  middleLabel="Perfect"
                  rightLabel="Too fast"
                />
            </div> 
          </CardContent>
        </Card>

        {/* Facilities Stats Card */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-lg font-medium">Facilities</h3>
            <div className="space-y-6">
              <StarRating rating={facilitiesStats?.cleanness || 0} label="Cleanness" />
            </div>
          </CardContent>
        </Card> 

        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-lg font-medium">Class DNA</h3>
            <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >

            <RadarChart
              data={chartData}
              className="w-full h-64"
              >
              <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <PolarAngleAxis dataKey="property" />
            <PolarGrid radialLines={false} />
            <Radar
              dataKey="absoluteValue"
              fill="var(--color-property)"
              fillOpacity={0}
              stroke="var(--color-property)"
              strokeWidth={2}
              />
            </RadarChart>
              </ChartContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  )
} 
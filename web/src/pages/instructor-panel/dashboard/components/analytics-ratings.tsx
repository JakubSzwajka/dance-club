import * as React from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StarIcon } from "@heroicons/react/24/solid"

// Mock data - in real app this would come from API
const chartData = [
  { date: "2024-04-01", rating: 4.7, totalReviews: 15 },
  { date: "2024-04-08", rating: 4.8, totalReviews: 12 },
  { date: "2024-04-15", rating: 4.6, totalReviews: 18 },
  { date: "2024-04-22", rating: 4.9, totalReviews: 14 },
  { date: "2024-04-29", rating: 4.7, totalReviews: 20 },
  { date: "2024-05-06", rating: 4.8, totalReviews: 16 },
  { date: "2024-05-13", rating: 5.0, totalReviews: 13 },
  { date: "2024-05-20", rating: 4.9, totalReviews: 17 },
  { date: "2024-05-27", rating: 4.8, totalReviews: 19 },
  { date: "2024-06-03", rating: 4.7, totalReviews: 15 },
  { date: "2024-06-10", rating: 4.9, totalReviews: 21 },
  { date: "2024-06-17", rating: 4.8, totalReviews: 18 },
]

const chartConfig = {
  rating: {
    label: "Average Rating",
    color: "hsl(var(--warning))",
  },
} satisfies ChartConfig

export function AnalyticsRatings() {
  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  // Calculate current average rating
  const currentRating = filteredData[filteredData.length - 1]?.rating || 0
  const totalReviews = filteredData.reduce((sum, item) => sum + item.totalReviews, 0)

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Class Ratings</CardTitle>
          <CardDescription>
            Average rating trend over time
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select time range"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="grid gap-4 pt-4 sm:grid-cols-[1fr,2fr]">
        {/* Current Rating Display */}
        <div className="flex flex-col items-center justify-center space-y-2 rounded-xl border p-6 sm:p-8">
          <div className="text-muted-foreground">Current Rating</div>
          <div className="flex items-center gap-2">
            <div className="text-4xl font-bold">{currentRating.toFixed(1)}</div>
            <StarIcon className="h-8 w-8 text-yellow-500" />
          </div>
          <div className="text-sm text-muted-foreground">
            Based on {totalReviews} reviews
          </div>
        </div>

        {/* Rating Trend Chart */}
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[200px] w-full"
        >
          <LineChart data={filteredData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 5]}
              ticks={[0, 1, 2, 3, 4, 5]}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric"
                    })
                  }}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="rating"
              stroke="hsl(var(--warning))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--warning))" }}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
} 
import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Mock data - in real app this would come from API
const chartData = [
  { date: '2024-04-01', confirmed: 15, pending: 5, cancelled: 2 },
  { date: '2024-04-08', confirmed: 18, pending: 3, cancelled: 1 },
  { date: '2024-04-15', confirmed: 12, pending: 4, cancelled: 3 },
  { date: '2024-04-22', confirmed: 20, pending: 6, cancelled: 2 },
  { date: '2024-04-29', confirmed: 25, pending: 4, cancelled: 1 },
  { date: '2024-05-06', confirmed: 22, pending: 5, cancelled: 4 },
  { date: '2024-05-13', confirmed: 19, pending: 3, cancelled: 2 },
  { date: '2024-05-20', confirmed: 24, pending: 7, cancelled: 3 },
  { date: '2024-05-27', confirmed: 28, pending: 4, cancelled: 2 },
  { date: '2024-06-03', confirmed: 21, pending: 6, cancelled: 3 },
  { date: '2024-06-10', confirmed: 26, pending: 5, cancelled: 2 },
  { date: '2024-06-17', confirmed: 23, pending: 4, cancelled: 1 },
].map(item => ({
  ...item,
  total: item.confirmed + item.pending + item.cancelled,
}))

const chartConfig = {
  total: {
    label: 'Total Reservations',
    color: 'hsl(var(--chart-1))',
  },
  confirmed: {
    label: 'Confirmed',
    color: 'hsl(var(--success))',
  },
  pending: {
    label: 'Pending',
    color: 'hsl(var(--warning))',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'hsl(var(--destructive))',
  },
} satisfies ChartConfig

export function AnalyticsReservations() {
  const [timeRange, setTimeRange] = React.useState('90d')

  const filteredData = chartData.filter(item => {
    const date = new Date(item.date)
    const referenceDate = new Date('2024-06-30')
    let daysToSubtract = 90
    if (timeRange === '30d') {
      daysToSubtract = 30
    } else if (timeRange === '7d') {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Reservations Overview</CardTitle>
          <CardDescription>Showing reservation trends and status distribution</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select time range">
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
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillConfirmed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillPending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillCancelled" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={value => {
                const date = new Date(value)
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={value => `${value}`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={value => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  }}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="cancelled"
              stackId="1"
              stroke="hsl(var(--destructive))"
              fill="url(#fillCancelled)"
            />
            <Area
              type="monotone"
              dataKey="pending"
              stackId="1"
              stroke="hsl(var(--warning))"
              fill="url(#fillPending)"
            />
            <Area
              type="monotone"
              dataKey="confirmed"
              stackId="1"
              stroke="hsl(var(--success))"
              fill="url(#fillConfirmed)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

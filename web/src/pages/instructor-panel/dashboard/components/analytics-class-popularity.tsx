import * as React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Mock data - in real app this would come from API
const classData = [
  {
    name: 'Salsa Beginners',
    totalReservations: 145,
    averageRating: 4.8,
    totalReviews: 89,
  },
  {
    name: 'Bachata Intermediate',
    totalReservations: 98,
    averageRating: 4.9,
    totalReviews: 62,
  },
  {
    name: 'Salsa Advanced',
    totalReservations: 76,
    averageRating: 4.7,
    totalReviews: 45,
  },
  {
    name: 'Bachata Beginners',
    totalReservations: 132,
    averageRating: 4.6,
    totalReviews: 78,
  },
  {
    name: 'Kizomba Beginners',
    totalReservations: 65,
    averageRating: 4.5,
    totalReviews: 34,
  },
  {
    name: 'Salsa Intermediate',
    totalReservations: 112,
    averageRating: 4.8,
    totalReviews: 67,
  },
]

export function AnalyticsClassPopularity() {
  const [sortBy, setSortBy] = React.useState('reservations')

  // Sort data based on selected criteria
  const sortedData = React.useMemo(() => {
    const data = [...classData]
    if (sortBy === 'reservations') {
      return data.sort((a, b) => b.totalReservations - a.totalReservations)
    } else if (sortBy === 'rating') {
      return data.sort((a, b) => b.averageRating - a.averageRating)
    }
    return data
  }, [sortBy])

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Class Popularity</CardTitle>
          <CardDescription>Comparing performance across different class types</CardDescription>
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Sort by">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="reservations">By Reservations</SelectItem>
            <SelectItem value="rating">By Rating</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              barSize={32}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis
                yAxisId="reservations"
                tickLine={false}
                axisLine={false}
                tickFormatter={value => `${value}`}
              />
              <YAxis
                yAxisId="rating"
                orientation="right"
                domain={[0, 5]}
                tickLine={false}
                axisLine={false}
                tickFormatter={value => `${value}★`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-sm">
                        <div className="font-medium">{label}</div>
                        <div className="mt-2 flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <span className="text-sm text-muted-foreground">
                              {payload[0].value} reservations
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-yellow-500" />
                            <span className="text-sm text-muted-foreground">
                              {payload[1].value} rating (
                              {sortedData.find(d => d.name === label)?.totalReviews} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar
                dataKey="totalReservations"
                fill="hsl(var(--primary))"
                yAxisId="reservations"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="averageRating"
                fill="hsl(var(--warning))"
                yAxisId="rating"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

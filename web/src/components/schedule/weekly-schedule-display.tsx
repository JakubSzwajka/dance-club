import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { ScheduleItem } from "./schedule-selector"

type WeeklyScheduleDisplayProps = {
  schedule: ScheduleItem[]
  startDate: Date
  endDate: Date
}

export function WeeklyScheduleDisplay({
  schedule,
  startDate,
  endDate,
}: WeeklyScheduleDisplayProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Start Date: {formatDate(startDate)}</span>
            <span>End Date: {formatDate(endDate)}</span>
          </div>

          <div className="grid grid-cols-7 gap-4">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div
                key={day}
                className="text-center font-medium text-sm p-2 bg-muted rounded-t-md"
              >
                {day}
              </div>
            ))}

            {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map(
              (day) => (
                <div
                  key={day}
                  className="min-h-[100px] p-2 border rounded-md bg-card"
                >
                  {schedule
                    .filter((item) => item.day === day)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="text-xs p-1 mb-1 bg-primary/10 rounded"
                      >
                        {formatTime(item.startTime)} - {formatTime(item.endTime)}
                      </div>
                    ))}
                </div>
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
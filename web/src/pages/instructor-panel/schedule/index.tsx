import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ScheduleHeader } from "./components/schedule-header"
import { CalendarHeader } from "./components/calendar/calendar-header"
import { MonthView } from "./components/calendar/month-view"

export function SchedulePage() {
  const [currentDate, setCurrentDate] = React.useState(new Date())

  return (
    <div className="space-y-6">
      <ScheduleHeader />

      <Card>
        <CardContent className="pt-6">
          <CalendarHeader
            currentDate={currentDate}
            onDateChange={setCurrentDate}
          />
          <MonthView currentDate={currentDate} />
        </CardContent>
      </Card>
    </div>
  )
}

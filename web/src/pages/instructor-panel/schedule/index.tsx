import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarHeader } from "./components/calendar/calendar-header"
import { MonthView } from "./components/calendar/month-view"
import { WeekView } from "./components/calendar/week-view"
import { addMonths, subMonths } from "date-fns"

type CalendarView = "month" | "week"

export function SchedulePage() {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [view, setView] = React.useState<CalendarView>("month")

  const handlePrevious = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const handleNext = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  return (
      <Card className="flex-1 mt-6">
        <CalendarHeader
          currentDate={currentDate}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onToday={handleToday}
          view={view}
          onViewChange={setView}
        />
        {/* max-h-[calc(100vh-theme(spacing.16))] overflow-scroll */}
        <CardContent className="flex-1 max-h-[calc(100vh-200px)] overflow-scroll">
            {view === "month" ? (
              <MonthView currentDate={currentDate} />
            ) : (
              <WeekView currentDate={currentDate} />
            )}
        </CardContent>
      </Card>
  )
}

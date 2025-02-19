import * as React from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { format, addMonths, subMonths } from "date-fns"

type CalendarHeaderProps = {
  currentDate: Date
  onDateChange: (date: Date) => void
}

export function CalendarHeader({ currentDate, onDateChange }: CalendarHeaderProps) {
  const goToPreviousMonth = () => {
    onDateChange(subMonths(currentDate, 1))
  }

  const goToNextMonth = () => {
    onDateChange(addMonths(currentDate, 1))
  }

  const goToToday = () => {
    onDateChange(new Date())
  }

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={goToToday}
        >
          Today
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPreviousMonth}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={goToNextMonth}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
} 
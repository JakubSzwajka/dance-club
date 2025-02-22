import { Button } from '@/components/ui/button'
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from 'lucide-react'
import { format } from 'date-fns'

type CalendarHeaderProps = {
  currentDate: Date
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
  view: 'month' | 'week'
  onViewChange: (view: 'month' | 'week') => void
}

export function CalendarHeader({
  currentDate,
  onPrevious,
  onNext,
  onToday,
  view,
  onViewChange,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={onPrevious}>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onNext}>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="ml-2" onClick={onToday}>
            Today
          </Button>
        </div>
        <h2 className="text-lg font-semibold">{format(currentDate, 'MMMM yyyy')}</h2>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center rounded-lg border p-1">
          <Button
            variant={view === 'month' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('month')}
            className="px-3"
          >
            Month
          </Button>
          <Button
            variant={view === 'week' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('week')}
            className="px-3"
          >
            Week
          </Button>
        </div>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>
    </div>
  )
}

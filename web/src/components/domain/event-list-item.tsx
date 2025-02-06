import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { components } from '@/lib/api/schema'

interface EventListItemProps {
  event: components['schemas']['SpecialEventSchema']
  onDetailsClick?: () => void
}

export function EventListItem({ event, onDetailsClick }: EventListItemProps) {
  const eventDate = new Date(event.datetime)

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="flex items-center gap-6 p-6">
          {/* Date Box */}
          <div className="flex-shrink-0 w-20 h-20 bg-primary/5 rounded-lg flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{format(eventDate, 'dd')}</span>
            <span className="text-sm text-muted-foreground">{format(eventDate, 'MMM')}</span>
          </div>

          {/* Event Info */}
          <div className="flex-grow min-w-0">
            <h3 className="text-xl font-semibold mb-2 truncate">{event.name}</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                <span>{format(eventDate, 'EEEE, MMMM d, yyyy • h:mm a')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPinIcon className="h-4 w-4" />
                <span className="truncate">{event.location.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserIcon className="h-4 w-4" />
                <span>
                  {event.instructor.first_name} {event.instructor.last_name}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex-shrink-0 flex flex-col gap-2">
            <Button onClick={onDetailsClick}>View Details</Button>
            <div className="text-sm text-center">
              <span className="font-semibold">${event.price}</span>
              <span className="text-muted-foreground"> / person</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

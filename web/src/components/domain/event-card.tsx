import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SpecialEventPublicSchema } from "@/lib/api/public"
import { CalendarIcon, ClockIcon, UsersIcon } from "@heroicons/react/24/outline"
import { InstructorPill } from "./instructor-pill"
import { LocationPill } from "./location-pill"

interface EventCardProps {
  event: SpecialEventPublicSchema
  onDetailsClick?: () => void
}

export function EventCard({ event, onDetailsClick }: EventCardProps) {
  const eventDate = new Date(event.datetime)
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4">{event.name}</h3>
        
        <div className="space-y-2 mb-6">
          <InstructorPill instructor={event.instructor} />
          <LocationPill location={event.location} />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ClockIcon className="h-4 w-4" />
            <span>{formattedTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <UsersIcon className="h-4 w-4" />
            <span>{event.current_capacity}/{event.capacity} spots</span>
          </div>
        </div>

        <Button 
          variant="default" 
          className="w-full"
          onClick={onDetailsClick}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}

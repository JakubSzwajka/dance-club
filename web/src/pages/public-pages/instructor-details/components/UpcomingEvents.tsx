import { usePublicInstructorEvents } from "@/lib/api/public"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "@tanstack/react-router"
import { MapPinIcon, CalendarIcon, ClockIcon, UsersIcon } from "@heroicons/react/24/outline"

interface UpcomingEventsProps {
  instructorId: string
}

export function UpcomingEvents({ instructorId }: UpcomingEventsProps) {
  const navigate = useNavigate()
  const { data: events, isLoading } = usePublicInstructorEvents(instructorId)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-6 bg-muted rounded w-3/4 mb-4" />
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (!events?.length) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">
          No upcoming events scheduled at the moment.
        </p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => {
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
          <Card key={event.id} className="p-6">
            <h3 className="font-semibold mb-4">{event.name}</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ClockIcon className="h-4 w-4" />
                <span>{formattedTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPinIcon className="h-4 w-4" />
                <span>{event.location.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UsersIcon className="h-4 w-4" />
                <span>{event.current_capacity}/{event.capacity} spots</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate({
                to: '/events/$eventId',
                params: { eventId: event.id }
              })}
            >
              View Details
            </Button>
          </Card>
        )
      })}
    </div>
  )
} 
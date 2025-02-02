import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "@tanstack/react-router"
import { InstructorPill } from "@/components/domain/instructor-pill"
import { CalendarIcon, ClockIcon, UsersIcon } from "@heroicons/react/24/outline"
import { components } from "@/lib/api/schema"

interface EventsSectionProps {
  events: components["schemas"]["SpecialEventSchema"][]
}

export function EventsSection({ events }: EventsSectionProps) {
  const navigate = useNavigate()

  if (!events.length) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">
          No upcoming events scheduled at this location.
        </p>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
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
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{event.name}</h3>

                <div className="flex flex-col gap-2 mb-4">
                  <InstructorPill instructor={event.instructor} />
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

                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {event.description}
                </p>
              </div>

              <div className="w-full md:w-auto flex flex-col gap-4">
                <div className="text-right">
                  <div className="font-semibold">{event.price} PLN</div>
                  <div className="text-sm text-muted-foreground">per person</div>
                </div>
                <Button 
                  className="w-full md:w-auto"
                  onClick={() => navigate({
                    to: '/events/$eventId',
                    params: { eventId: event.id }
                  })}
                >
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
} 
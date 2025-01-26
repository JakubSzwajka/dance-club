import { Container } from "@/components/ui/container"
import { EventCard } from "@/components/domain/event-card"
import { usePublicEventsNearLocation } from "@/lib/api/public"
import { useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"

interface FeaturedEventsSectionProps {
  latitude: number
  longitude: number
}

export function FeaturedEventsSection({ latitude, longitude }: FeaturedEventsSectionProps) {
  const navigate = useNavigate()
  const { data: events, isLoading } = usePublicEventsNearLocation(latitude, longitude, undefined, undefined, 3)

  return (
    <section className="py-16">
      <Container>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Special Events Near You</h2>
            <p className="text-muted-foreground">
              Discover unique dance events and workshops in your area
            </p>
          </div>
          <Button onClick={() => navigate({ to: '/events/$eventId', params: { eventId: '' } })}>View All Events</Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[400px] bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onDetailsClick={() => navigate({ to: `/events/${event.id}` })}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold">No events found nearby</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your location or date range</p>
          </div>
        )}
      </Container>
    </section>
  )
} 
import { useParams } from "@tanstack/react-router"
import { Container } from "@/components/ui/container"
import { Header } from "@/components/domain/header"
import { usePublicEvent } from "@/lib/api/public"
import { HeroSection } from "./components/HeroSection"
import { QuickInfoCard } from "./components/QuickInfoCard"
import { LocationSection } from "./components/LocationSection"

export function EventDetailsPage() {
  const { eventId } = useParams({ from: '/events/$eventId' })
  const { data: eventDetails, isLoading } = usePublicEvent(eventId)

  if (isLoading || !eventDetails) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Container>
          <div className="py-8 animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="bg-muted/30 border-b">
        <Container>
          <div className="py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <HeroSection eventDetails={eventDetails} />
              <QuickInfoCard eventDetails={eventDetails} />
            </div>
          </div>
        </Container>
      </div>

      {/* Location Section */}
      <Container>
        <LocationSection location={eventDetails.location} />
      </Container>
    </div>
  )
}

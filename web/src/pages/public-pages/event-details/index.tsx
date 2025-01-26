import { useParams } from "@tanstack/react-router"
import { Container } from "@/components/ui/container"
import { Header } from "@/components/domain/header"
import { usePublicEvent } from "@/lib/api/public"
import { HeroSection } from "./components/HeroSection"
import { LocationSection } from "./components/LocationSection"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function EventDetailsPage() {
  const { eventId } = useParams({ from: '/events/$eventId' })
  const { data: event, isLoading } = usePublicEvent(eventId)
  const [isExpanded, setIsExpanded] = useState(false)

  if (isLoading || !event) {
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

  const descriptionSections = event.description.split('\n\n')

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="bg-muted/30 border-b">
        <Container>
          <div className="py-8">
            <HeroSection eventDetails={event} />
          </div>
        </Container>
      </div>

      {/* Description Section */}
      <Container>
        <div className="py-8">
          <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
          <Card className="p-6 bg-muted/30">
            <div className={`prose prose-slate max-w-none ${!isExpanded ? 'line-clamp-4' : ''}`}>
              {descriptionSections.map((paragraph, index) => (
                <p key={index} className="whitespace-pre-line mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
            <Button 
              variant="ghost" 
              className="mt-4 w-full hover:bg-muted"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Show Less' : 'Read More'}
            </Button>
          </Card>
        </div>
      </Container>

      {/* Location Section */}
      <Container>
        <div className="py-8">
          <h2 className="text-2xl font-semibold mb-6">Location & Directions</h2>
          <LocationSection location={event.location} />
        </div>
      </Container>
    </div>
  )
}

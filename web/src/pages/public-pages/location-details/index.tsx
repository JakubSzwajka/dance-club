import { useParams } from '@tanstack/react-router'
import { Container } from '@/components/ui/container'
import { Header } from '@/components/domain/header'
import { usePublicLocation, usePublicClasses } from '@/lib/api/public'
import { HeroSection } from './components/HeroSection'
import { MapSection } from './components/MapSection'
import { ClassesSection } from './components/ClassesSection'

export function LocationDetailsPage() {
  const { locationId } = useParams({ from: '/locations/$locationId' })
  const { data: location, isLoading } = usePublicLocation(locationId)
  const { data: classes } = usePublicClasses(
    null,
    locationId,
    null,
    null,
    null,
    null,
    null
  )
  if (isLoading || !location) {
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
            <HeroSection location={location} />
          </div>
        </Container>
      </div>

      {/* Map Section */}
      <Container>
        <div className="py-8">
          <h2 className="text-2xl font-semibold mb-6">Location & Directions</h2>
          <MapSection location={location} />
        </div>
      </Container>

      {/* Classes Section */}
      <Container>
        <div className="py-8">
          <h2 className="text-2xl font-semibold mb-6">Regular Classes</h2>
          <ClassesSection classes={classes || []} />
        </div>
      </Container>
    </div>
  )
}

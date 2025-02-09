import { Header } from '@/components/domain/header'
import { HeroSection } from './components/HeroSection'
import { FeaturedInstructorsSection } from './components/FeaturedInstructorsSection'
import { FeaturesSection } from './components/FeaturesSection'
import { CTASection } from './components/CTASection'
import { useEffect, useState } from 'react'
import { usePublicLocations, usePublicClasses } from '@/lib/api/public'
import { SchoolsNearbyMap } from '@/components/domain/locations-map'
import { components } from '@/lib/api/schema'

type LocationSchema = components['schemas']['LocationSchema']
type DanceClassSchema = components['schemas']['DanceClassSchema']
type LocationWithClasses = LocationSchema & { classes: DanceClassSchema[] }

export function HomePage() {
  const [latitude, setLatitude] = useState<number>(0)
  const [longitude, setLongitude] = useState<number>(0)
  const [locationsWithClasses, setLocationsWithClasses] = useState<LocationWithClasses[]>([])

  // Add AbortController for cleanup
  useEffect(() => {
    const abortController = new AbortController()

    if ('geolocation' in navigator) {
      const timeoutId = setTimeout(() => {
        navigator.geolocation.getCurrentPosition(
          position => {
            if (
              Math.abs(position.coords.latitude - latitude) > 0.001 ||
              Math.abs(position.coords.longitude - longitude) > 0.001
            ) {
              setLatitude(position.coords.latitude)
              setLongitude(position.coords.longitude)
            }
          },
          error => {
            if (!abortController.signal.aborted) {
              console.error('Error getting geolocation:', error)
            }
          }
        )
      }, 1000) // 1 second debounce

      return () => {
        abortController.abort()
        clearTimeout(timeoutId)
      }
    } else {
      console.error('Geolocation is not supported by this browser')
    }
  }, [latitude, longitude])

  const { data: locations, isLoading: isLoadingLocations } = usePublicLocations(
    true,
    latitude,
    longitude
  )

  const { data: classes } = usePublicClasses()

  useEffect(() => {
    if (!locations || !classes) return

    const locationsMap = new Map<string, LocationWithClasses>()

    // Initialize locations with empty classes arrays
    locations.forEach(location => {
      locationsMap.set(location.id, { ...location, classes: [] })
    })

    // Add classes to their respective locations
    classes.forEach(danceClass => {
      if (danceClass.location) {
        const locationId = danceClass.location.id
        const location = locationsMap.get(locationId)
        if (location) {
          location.classes.push(danceClass)
        }
      }
    })

    setLocationsWithClasses(Array.from(locationsMap.values()))
  }, [locations, classes])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturedInstructorsSection />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Find Dance Schools Near You</h2>
          <p className="text-lg text-muted-foreground">
            Browse our interactive map to discover dance schools and classes in your area. You can also{' '}
            <a href="/classes" className="text-primary hover:underline">
              explore our complete class catalog
            </a>{' '}
            to find the perfect dance class for you.
          </p>
        </div>
      </section>

      <SchoolsNearbyMap
        locationsWithClasses={locationsWithClasses}
        isLoadingLocations={isLoadingLocations}
      />
      <FeaturesSection />
      <CTASection />
    </div>
  )
}

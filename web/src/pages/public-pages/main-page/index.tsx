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

  const { data: locations, isLoading: isLoadingLocations } = usePublicLocations(
    true,
    latitude,
    longitude
  )

  const { data: classes } = usePublicClasses()

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLatitude(position.coords.latitude)
          setLongitude(position.coords.longitude)
        },
        error => {
          console.error('Error getting geolocation:', error)
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser')
    }
  }, [])

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
      <SchoolsNearbyMap
        locationsWithClasses={locationsWithClasses}
        isLoadingLocations={isLoadingLocations}
      />
      <FeaturesSection />
      <CTASection />
    </div>
  )
}

import { Header } from '@/components/domain/header'
import { HeroSection } from './components/HeroSection'
import { FeaturedInstructorsSection } from './components/FeaturedInstructorsSection'
import { FeaturesSection } from './components/FeaturesSection'
import { CTASection } from './components/CTASection'
import { useEffect, useState } from 'react'
import { usePublicLocations } from '@/lib/api/public'
import { SchoolsNearbyMap } from '@/components/domain/locations-map'

export function HomePage() {
  const [latitude, setLatitude] = useState<number>(0)
  const [longitude, setLongitude] = useState<number>(0)
  

  const { data: locations, isLoading: isLoadingLocations } = usePublicLocations(
    true,
    latitude,
    longitude
  )

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturedInstructorsSection />
      <SchoolsNearbyMap locations={locations || []} isLoadingLocations={isLoadingLocations} />
      <FeaturesSection />
      <CTASection />
    </div>
  )
}

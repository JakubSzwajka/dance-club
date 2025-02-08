import { Header } from '@/components/domain/header'
import { HeroSection } from './components/HeroSection'
import { FeaturedInstructorsSection } from './components/FeaturedInstructorsSection'
import { FeaturesSection } from './components/FeaturesSection'
import { CTASection } from './components/CTASection'
import { useEffect, useState } from 'react'
import { SchoolsNearbyMap } from './components/SchoolsNearbyMap'

export function HomePage() {
  const [latitude, setLatitude] = useState<number>(0)
  const [longitude, setLongitude] = useState<number>(0)

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
      {latitude && longitude && <SchoolsNearbyMap userLocation={{ latitude, longitude }} />}
      <FeaturesSection />
      <CTASection />
    </div>
  )
}

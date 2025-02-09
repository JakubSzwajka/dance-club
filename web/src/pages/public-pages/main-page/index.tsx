import { Header } from '@/components/domain/header'
import { HeroSection } from './components/HeroSection'
import { FeaturedInstructorsSection } from './components/FeaturedInstructorsSection'
import { FeaturesSection } from './components/FeaturesSection'
import { CTASection } from './components/CTASection'
import { SchoolsNearbyMap } from '@/components/domain/locations-map/index'


export function HomePage() {

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturedInstructorsSection />
      <SchoolsNearbyMap/>
      <FeaturesSection />
      <CTASection />
    </div>
  )
}

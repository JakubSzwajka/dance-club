import { Header } from '@/components/domain/header'
import { HeroSection } from './components/HeroSection'
import { FeaturedInstructorsSection } from './components/FeaturedInstructorsSection'
import { CTASection } from './components/CTASection'
import { SchoolsNearbyMap } from '@/components/domain/locations-map/index'
import { HowItWorksSection } from './components/HowItWorksSection'
import { TrendingClassesSection } from './components/TrendingClassesSection'

export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <HowItWorksSection />
      <FeaturedInstructorsSection />
      <TrendingClassesSection />
      <SchoolsNearbyMap/>
      <CTASection />
    </div>
  )
}

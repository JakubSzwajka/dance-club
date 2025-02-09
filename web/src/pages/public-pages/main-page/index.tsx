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

      <SchoolsNearbyMap/>
      <FeaturesSection />
      <CTASection />
    </div>
  )
}

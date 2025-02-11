import { Container } from '@/components/ui/container'
import { Search, Star, School, BarChart3, MapPin, Users, Sparkles } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

interface StepProps {
  icon: React.ReactNode
  title: string
  description: string
  features?: string[]
  isPro?: boolean
  benefits?: {
    icon: React.ReactNode
    title: string
    description: string
  }[]
  imageAlt?: string
  badge?: 'premium' | 'business'
}

function Step({ icon, title, description, features, benefits, isPro, badge }: StepProps) {
  return (
    <div className="flex flex-col h-full bg-background rounded-lg border p-6">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            {icon}
          </div>
          {badge && (
            <div className={`absolute -top-1 -right-1 text-xs font-medium px-2 py-0.5 rounded-full ${
              badge === 'premium' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-yellow-500 text-white'
            }`}>
              {badge === 'premium' ? 'Premium' : 'Business'}
            </div>
          )}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      {features && (
        <div className="mt-auto">
          <ul className="space-y-2 text-sm text-muted-foreground">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {benefits && (
        <div className="mt-4">
          <div className="grid grid-cols-1 gap-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  {benefit.icon}
                </div>
                <div className="text-left">
                  <h5 className="font-medium text-sm">{benefit.title}</h5>
                  <p className="text-xs text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-muted/30">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">How MyDanceClub Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Whether you're looking for dance classes or running a dance school, we've got you covered.
            Choose your path to see how our platform can help you.
          </p>

          <Tabs defaultValue="students" className="w-full">
            <TabsList className="grid w-[400px] grid-cols-2 mx-auto">
              <TabsTrigger value="students">For Students</TabsTrigger>
              <TabsTrigger value="schools">For Dance Schools</TabsTrigger>
            </TabsList>

            <TabsContent value="students" className="mt-16">
              <Carousel
                opts={{
                  align: 'start',
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  <CarouselItem className="md:basis-1/3 lg:basis-1/4">
                    <Step
                      icon={<Search className="w-6 h-6 text-primary" />}
                      title="Search & Filter"
                      description="Find your perfect dance class with powerful search tools."
                      features={[
                        'Filter by dance style',
                        'Choose skill level',
                        'Set price range',
                        'Pick convenient times',
                      ]}
                    />
                  </CarouselItem>

                  <CarouselItem className="md:basis-1/3 lg:basis-1/4">
                    <Step
                      icon={<MapPin className="w-6 h-6 text-primary" />}
                      title="Location Based"
                      description="Discover dance schools near you."
                      features={[
                        'Interactive map view',
                        'Distance-based search',
                        'Public transport info',
                        'Parking availability',
                      ]}
                      badge="premium"
                    />
                  </CarouselItem>

                  <CarouselItem className="md:basis-1/3 lg:basis-1/4">
                    <Step
                      icon={<Users className="w-6 h-6 text-primary" />}
                      title="Expert Teachers"
                      description="Learn from experienced dance instructors."
                      features={[
                        'Verified professionals',
                        'Years of experience',
                        'Specialized skills',
                        'Teaching excellence',
                      ]}
                    />
                  </CarouselItem>

                  <CarouselItem className="md:basis-1/3 lg:basis-1/4">
                    <Step
                      icon={<Star className="w-6 h-6 text-primary" />}
                      title="Reviews & Ratings"
                      description="Make informed decisions with community feedback."
                      features={[
                        'Verified reviews',
                        'Detailed ratings',
                        'Photo reviews',
                        'Student experiences',
                      ]}
                      badge="premium"
                    />
                  </CarouselItem>

                  <CarouselItem className="md:basis-1/3 lg:basis-1/4">
                    <Step
                      icon={<Sparkles className="w-6 h-6 text-primary" />}
                      title="Sports Cards"
                      description="Use your sports cards for classes."
                      features={[
                        'MultiSport support',
                        'Medicover accepted',
                        'Easy verification',
                        'Instant booking',
                      ]}
                    />
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </TabsContent>

            <TabsContent value="schools" className="mt-16">
              <Carousel
                opts={{
                  align: 'start',
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  <CarouselItem className="md:basis-1/3 lg:basis-1/4">
                    <Step
                      icon={<School className="w-6 h-6 text-primary" />}
                      title="School Profile"
                      description="Create your professional online presence."
                      features={[
                        'Custom branding',
                        'Photo gallery',
                        'Facility details',
                        'Contact info',
                      ]}
                    />
                  </CarouselItem>

                  <CarouselItem className="md:basis-1/3 lg:basis-1/4">
                    <Step
                      icon={<Users className="w-6 h-6 text-primary" />}
                      title="Class Management"
                      description="Efficiently manage your dance classes."
                      features={[
                        'Schedule classes',
                        'Manage bookings',
                        'Track attendance',
                        'Handle payments',
                      ]}
                      badge="business"
                    />
                  </CarouselItem>

                  <CarouselItem className="md:basis-1/3 lg:basis-1/4">
                    <Step
                      icon={<BarChart3 className="w-6 h-6 text-primary" />}
                      title="Analytics"
                      description="Track your school's performance."
                      features={[
                        'Attendance stats',
                        'Revenue tracking',
                        'Student growth',
                        'Class popularity',
                      ]}
                      badge="business"
                    />
                  </CarouselItem>

                  <CarouselItem className="md:basis-1/3 lg:basis-1/4">
                    <Step
                      icon={<Sparkles className="w-6 h-6 text-primary" />}
                      title="Marketing Tools"
                      description="Promote your dance school effectively."
                      features={[
                        'Social sharing',
                        'SEO optimization',
                        'Email campaigns',
                        'Special offers',
                      ]}
                      badge="business"
                    />
                  </CarouselItem>

                  <CarouselItem className="md:basis-1/3 lg:basis-1/4">
                    <Step
                      icon={<Star className="w-6 h-6 text-primary" />}
                      title="Review Management"
                      description="Build your school's reputation."
                      features={[
                        'Collect reviews',
                        'Respond to feedback',
                        'Show testimonials',
                        'Build trust',
                      ]}
                    />
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold mb-4">Ready to Start?</h3>
          <p className="text-muted-foreground mb-8">
            Join our community of dancers and dance schools to find your perfect match or grow your business.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/classes"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Browse Classes
            </a>
            <a
              href="/for-schools"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              For Dance Schools
            </a>
          </div>
        </div>
      </Container>
    </section>
  )
} 

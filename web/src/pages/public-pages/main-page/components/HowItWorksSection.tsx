import { Container } from '@/components/ui/container'
import { Search, Star, School, BarChart3, MapPin, Users, Sparkles } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface StepProps {
  icon: React.ReactNode
  title: string
  description: string
  isLeft?: boolean
  features?: string[]
  benefits?: {
    icon: React.ReactNode
    title: string
    description: string
  }[]
  imageAlt?: string
}

function Step({ icon, title, description, isLeft = false, features, benefits, imageAlt }: StepProps) {
  const Content = () => (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      <p className="text-muted-foreground text-center max-w-md mb-8">{description}</p>
      
      {/* Features list */}
      {features && (
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground mb-8 w-full">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
              {feature}
            </li>
          ))}
        </ul>
      )}

      {/* Benefits grid */}
      {benefits && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                {benefit.icon}
              </div>
              <h4 className="font-semibold mb-2">{benefit.title}</h4>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const ImagePlaceholder = () => (
    <div className="w-full h-full min-h-[500px] bg-muted rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
      <div className="text-center p-4">
        <p className="text-muted-foreground text-sm">{imageAlt || 'Screenshot placeholder'}</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Image will be added here</p>
      </div>
    </div>
  )

  return (
    <div className={`flex items-center gap-12 min-h-[600px] ${isLeft ? 'flex-row-reverse' : ''}`}>
      <div className="w-1/2">
        <Content />
      </div>
      <div className="w-px self-stretch bg-border" />
      <div className="w-1/2 flex items-center">
        <ImagePlaceholder />
      </div>
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
              <div className="space-y-32">
                <Step
                  icon={<Search className="w-8 h-8 text-primary" />}
                  title="Find Your Perfect Dance Class"
                  description="Use our advanced search filters to find exactly what you're looking for."
                  benefits={[
                    {
                      icon: <Users className="h-6 w-6" />,
                      title: "Expert Instructors",
                      description: "Learn from professional dancers with years of teaching experience and proven track records."
                    },
                    {
                      icon: <Star className="h-6 w-6" />,
                      title: "All Skill Levels",
                      description: "From beginners to advanced dancers, find classes tailored to your experience level."
                    }
                  ]}
                  features={[
                    'Filter by dance style and difficulty level',
                    'Find schools near you',
                    'Check sports card compatibility',
                    'Compare prices and schedules',
                  ]}
                  imageAlt="Advanced search filters and class listing interface"
                />

                <Step
                  icon={<MapPin className="w-8 h-8 text-primary" />}
                  title="Explore Dance Schools"
                  description="Discover dance schools in your area with our interactive map."
                  benefits={[
                    {
                      icon: <MapPin className="h-6 w-6" />,
                      title: "Multiple Locations",
                      description: "Find classes at convenient locations with detailed information about facilities and amenities."
                    },
                    {
                      icon: <Sparkles className="h-6 w-6" />,
                      title: "Sports Card Support",
                      description: "Use your MultiSport, Medicover, or other sports cards at participating locations."
                    }
                  ]}
                  features={[
                    'View schools on an interactive map',
                    'Check detailed school information',
                    'Browse available classes',
                    'Read verified reviews',
                  ]}
                  isLeft
                  imageAlt="Interactive map with dance schools locations"
                />

                <Step
                  icon={<Star className="w-8 h-8 text-primary" />}
                  title="Share Your Experience"
                  description="Help others by sharing detailed reviews about your dance journey."
                  benefits={[
                    {
                      icon: <Star className="h-6 w-6" />,
                      title: "Verified Reviews",
                      description: "Make informed decisions with detailed reviews covering instructors, class quality, and facilities."
                    },
                    {
                      icon: <Sparkles className="h-6 w-6" />,
                      title: "Detailed Information",
                      description: "Access comprehensive details about class schedules, pricing, and special requirements."
                    }
                  ]}
                  features={[
                    'Rate locations and instructors',
                    'Review specific classes',
                    'Share your dance experience',
                    'Help others choose better',
                  ]}
                  imageAlt="Review and rating interface"
                />
              </div>
            </TabsContent>

            <TabsContent value="schools" className="mt-16">
              <div className="space-y-32">
                <Step
                  icon={<School className="w-8 h-8 text-primary" />}
                  title="Manage Your School"
                  description="Take control of your dance school's online presence."
                  benefits={[
                    {
                      icon: <Users className="h-6 w-6" />,
                      title: "Student Management",
                      description: "Efficiently manage your students, classes, and schedules in one place."
                    },
                    {
                      icon: <Sparkles className="h-6 w-6" />,
                      title: "School Profile",
                      description: "Showcase your facilities, instructors, and class offerings to potential students."
                    }
                  ]}
                  features={[
                    'Create your school profile',
                    'Manage classes and schedules',
                    'Showcase your facilities',
                    'Engage with students',
                  ]}
                  imageAlt="Dance school management dashboard"
                />

                <Step
                  icon={<BarChart3 className="w-8 h-8 text-primary" />}
                  title="Grow Your Business"
                  description="Access premium tools to expand your reach and improve your services."
                  benefits={[
                    {
                      icon: <BarChart3 className="h-6 w-6" />,
                      title: "Analytics & Insights",
                      description: "Track your performance, student engagement, and business growth with detailed analytics."
                    },
                    {
                      icon: <Sparkles className="h-6 w-6" />,
                      title: "Marketing Tools",
                      description: "Promote your classes and reach more students with built-in marketing features."
                    }
                  ]}
                  features={[
                    'View detailed analytics',
                    'Boost search visibility',
                    'Track student engagement',
                    'Access marketing tools',
                  ]}
                  isLeft
                  imageAlt="Analytics and insights dashboard"
                />
              </div>
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

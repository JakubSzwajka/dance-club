import { useParams } from '@tanstack/react-router'
import { Container } from '@/components/ui/container'
import { Header } from '@/components/domain/header'
import { HeroSection } from './components/HeroSection'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { usePublicInstructor, usePublicInstructorClasses } from '@/lib/api/public/index'
import { ClassItem } from '@/components/domain/class-item'
import { useNavigate } from '@tanstack/react-router'
// import { ReviewsSection } from "./components/ReviewsSection"

export function InstructorDetailsPage() {
  const { instructorId } = useParams({ from: '/instructors/$instructorId' })
  const { data: instructor, isLoading } = usePublicInstructor(instructorId)
  const { data: instructorClasses } = usePublicInstructorClasses(instructorId)
  const [isExpanded, setIsExpanded] = useState(false)
  const navigate = useNavigate()

  if (isLoading || !instructor) {
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

  const bioSections = instructor.bio?.split('\n\n') || []

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="bg-muted/30 border-b">
        <Container>
          <div className="py-8">
            <HeroSection instructor={instructor} />
          </div>
        </Container>
      </div>

      {/* Bio Section */}
      <Container>
        <div className="py-8">
          <h2 className="text-2xl font-semibold mb-4">About {instructor.first_name}</h2>
          <Card className="p-6 bg-muted/30">
            <div className={`prose prose-slate max-w-none ${!isExpanded ? 'line-clamp-4' : ''}`}>
              {bioSections.map((paragraph, index) => (
                <p key={index} className="whitespace-pre-line mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
            <Button
              variant="ghost"
              className="mt-4 w-full hover:bg-muted"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Show Less' : 'Read More'}
            </Button>
          </Card>
        </div>
      </Container>

      {/* Classes Section */}
      <Container>
        <div className="py-8">
          <h2 className="text-2xl font-semibold mb-6">Regular Classes</h2>
          {instructorClasses && instructorClasses.length > 0 ? (
            <div className="space-y-4">
              {instructorClasses.map(danceClass => (
                <ClassItem
                  key={danceClass.id}
                  danceClass={danceClass}
                  onDetailsClick={id => {
                    navigate({
                      to: '/classes/$classId',
                      params: { classId: id },
                    })
                  }}
                />
              ))}
            </div>
          ) : (
            <Card className="p-6">
              <p className="text-center text-muted-foreground">
                No regular classes scheduled at the moment.
              </p>
            </Card>
          )}
        </div>
      </Container>
    </div>
  )
}

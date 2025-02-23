import { useParams, useNavigate } from '@tanstack/react-router'
import { Container } from '@/components/ui/container'
import { Header } from '@/components/domain/header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePublicClass } from '@/lib/api/public/index'
import { HeroSection } from './components/HeroSection'
import { QuickInfoCard } from './components/QuickInfoCard'
import { InstructorTab } from './components/InstructorTab'
import { ReviewsTab } from './components/ReviewsTab'
import { Button } from '@/components/ui/button'
import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { ReviewStatsSection } from './components/ReviewStatsSection'
import { FacilitiesSection } from './components/FacilitiesSection'

export function ClassDetailsPage() {
  const { classId } = useParams({ from: '/classes/$classId' })
  const { data: classDetails, isLoading } = usePublicClass(classId)
  const [isExpanded, setIsExpanded] = useState(false)
  const [needsTruncation, setNeedsTruncation] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const checkTruncation = () => {
      if (contentRef.current) {
        // Get the line height and total height
        const styles = window.getComputedStyle(contentRef.current)
        const lineHeight = parseInt(styles.lineHeight)
        const height = contentRef.current.scrollHeight

        // 4 lines + some buffer for safety
        const maxHeight = lineHeight * 4 + 8

        setNeedsTruncation(height > maxHeight)
      }
    }

    checkTruncation()
    // Add resize listener to recheck on window resize
    window.addEventListener('resize', checkTruncation)
    return () => window.removeEventListener('resize', checkTruncation)
  }, [classDetails])

  if (isLoading || !classDetails || !classDetails.instructor || !classDetails.location) {
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

  const handleStartReview = () => {
    navigate({
      to: '/reviews',
      search: {
        classId: classId,
        instructorId: classDetails.instructor?.id,
        locationId: classDetails.location?.id,
      },
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="bg-muted/30 border-b">
        <Container>
          <div className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-8">
              <HeroSection classDetails={classDetails} />
              <div className="space-y-4">
                <QuickInfoCard classDetails={classDetails} />
                <Button className="w-full" size="lg" onClick={handleStartReview}>
                  Write a Review
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Description Section */}
      <Container>
        <div className="py-8">
          <h2 className="text-2xl font-semibold mb-4">About This Class</h2>
          <Card className="p-6 bg-muted/30">
            <div
              ref={contentRef}
              className={`prose prose-slate max-w-none ${!isExpanded ? 'line-clamp-4' : ''}`}
            >
              {classDetails.description.split('\n\n').map((paragraph, index) => (
                <p key={index} className="whitespace-pre-line mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
            {needsTruncation && (
              <Button
                variant="ghost"
                className="mt-4 w-full hover:bg-muted"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Show Less' : 'Read More'}
              </Button>
            )}
          </Card>
        </div>
      </Container>

      {/* Review Stats Section */}
      <Container>
        <ReviewStatsSection
          classId={classId}
          instructorId={classDetails.instructor?.id}
          locationId={classDetails.location?.id}
        />
      </Container>

      {/* Facilities Section */}
      <Container>
        {classDetails.location && <FacilitiesSection locationId={classDetails.location.id} />}
      </Container>

      {/* Tabs Section */}
      <Container>
        <div className="py-8">
          <Tabs defaultValue="instructor" className="space-y-8">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="instructor">
              {classDetails.instructor && <InstructorTab instructor={classDetails.instructor} />}
            </TabsContent>

            <TabsContent value="reviews">
              <ReviewsTab classId={classId} />
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </div>
  )
}

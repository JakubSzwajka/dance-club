import { useParams } from "@tanstack/react-router"
import { Container } from "@/components/ui/container"
import { Header } from "@/components/domain/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePublicClass } from "@/lib/api/public/index"
import { HeroSection } from "./components/HeroSection"
import { QuickInfoCard } from "./components/QuickInfoCard"
import { ClassSchedule } from "./components/ClassSchedule"
import { InstructorTab } from "./components/InstructorTab"
import { LocationTab } from "./components/LocationTab"
import { ReviewsTab } from "./components/ReviewsTab"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ReviewStatsSection } from "./components/ReviewStatsSection"
import { FacilitiesSection } from "./components/FacilitiesSection"

export function ClassDetailsPage() {
  const { classId } = useParams({ from: '/classes/$classId' })
  const { data: classDetails, isLoading } = usePublicClass(classId)
  const [isExpanded, setIsExpanded] = useState(false)

  if (isLoading || !classDetails) {
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="bg-muted/30 border-b">
        <Container>
          <div className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-8">
              <HeroSection classDetails={classDetails} />
              <QuickInfoCard classDetails={classDetails} />
            </div>
          </div>
        </Container>
      </div>

      {/* Description Section */}
      <Container>
        <div className="py-8">
          <h2 className="text-2xl font-semibold mb-4">About This Class</h2>
          <Card className="p-6 bg-muted/30">
            <div className={`prose prose-slate max-w-none ${!isExpanded ? 'line-clamp-4' : ''}`}>
              {classDetails.description.split('\n\n').map((paragraph, index) => (
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


      {/* Review Stats Section */}
      <Container>
        <ReviewStatsSection classId={classId} />
      </Container>

      {/* Facilities Section */}
      <Container>
        <FacilitiesSection />
      </Container>

      {/* Schedule Section */}
      <Container>
        <ClassSchedule class_id={classId} />
      </Container>

      {/* Tabs Section */}
      <Container>
        <div className="py-8">
          <Tabs defaultValue="instructor" className="space-y-8">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="instructor">
              {classDetails.instructor && (
                <InstructorTab instructor={classDetails.instructor} />
              )}
            </TabsContent>

            <TabsContent value="location">
              {classDetails.location && (
                <LocationTab location={classDetails.location} />
              )}
            </TabsContent>

            <TabsContent value="reviews">
              <ReviewsTab />
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </div>
  )
}

import { useParams } from "@tanstack/react-router"
import { Container } from "@/components/ui/container"
import { Header } from "@/components/domain/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePublicClass, usePublicInstructorClasses } from "@/lib/api/public"
import { HeroSection } from "./components/HeroSection"
import { QuickInfoCard } from "./components/QuickInfoCard"
import { ClassSchedule } from "./components/ClassSchedule"
import { InstructorTab } from "./components/InstructorTab"
import { LocationTab } from "./components/LocationTab"
import { ReviewsTab } from "./components/ReviewsTab"

export function ClassDetailsPage() {
  const { classId } = useParams({ from: '/classes/$classId' })
  const { data: classDetails, isLoading } = usePublicClass(classId)
  const { data: instructorClasses } = usePublicInstructorClasses(classDetails?.instructor.id || '')

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

  const otherClasses = instructorClasses?.filter(c => c.id !== classId) || []

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="bg-muted/30 border-b">
        <Container>
          <div className="py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <HeroSection classDetails={classDetails} />
              <QuickInfoCard classDetails={classDetails} />
            </div>
          </div>
        </Container>
      </div>

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
              <InstructorTab instructor={classDetails.instructor} otherClasses={otherClasses} />
            </TabsContent>

            <TabsContent value="location">
              <LocationTab location={classDetails.location} />
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

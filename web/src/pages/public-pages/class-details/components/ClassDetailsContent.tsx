import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReviewsTab } from "./ReviewsTab"
import { ReviewStatsSection } from "./ReviewStatsSection"
import { FacilitiesSection } from "./FacilitiesSection"

export function ClassDetailsContent() {
  return (
    <div className="container py-8">
      {/* Overview Section */}
      <div className="mb-10">
        <ReviewStatsSection />
      </div>

      {/* Facilities Section */}
      <div className="mb-10">
        <FacilitiesSection />
      </div>

      {/* Reviews Tab */}
      <Tabs defaultValue="reviews" className="space-y-6">
        <TabsList>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-6">
          <ReviewsTab />
        </TabsContent>

        <TabsContent value="schedule">
          {/* Schedule content will go here */}
        </TabsContent>

        <TabsContent value="pricing">
          {/* Pricing content will go here */}
        </TabsContent>
      </Tabs>
    </div>
  )
} 
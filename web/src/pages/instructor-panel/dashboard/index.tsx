import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatsCards } from './components/stats-cards'
import { UpcomingClasses } from './components/upcoming-classes'
import { RecentFeedback } from './components/recent-feedback'
import { Analytics } from './components/analytics'

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <StatsCards />
      
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Classes</TabsTrigger>
          <TabsTrigger value="feedback">Recent Feedback</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          <UpcomingClasses />
        </TabsContent>
        
        <TabsContent value="feedback" className="space-y-4">
          <RecentFeedback />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Analytics />
        </TabsContent>
      </Tabs>
    </div>
  )
}
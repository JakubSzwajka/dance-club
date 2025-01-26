import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SpecialEventPublicSchema } from "@/lib/api/public"

interface QuickInfoCardProps {
  eventDetails: SpecialEventPublicSchema
}

export function QuickInfoCard({ eventDetails }: QuickInfoCardProps) {
  const eventDate = new Date(eventDetails.datetime)
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="lg:w-80">
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Date</span>
            <span>{formattedDate}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Time</span>
            <span>{formattedTime}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Duration</span>
            <span>2 hours</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Capacity</span>
            <span>{eventDetails.current_capacity}/{eventDetails.capacity}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Price</span>
            <span>${eventDetails.price}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
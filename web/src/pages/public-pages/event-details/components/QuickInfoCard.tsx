import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SpecialEventPublicSchema } from "@/lib/api/public"

interface QuickInfoCardProps {
  eventDetails: SpecialEventPublicSchema
}

export function QuickInfoCard({ eventDetails }: QuickInfoCardProps) {
  const eventDate = new Date(eventDetails.datetime)
  const duration = 120 // Assuming 2 hours for special events

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Quick Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Duration</span>
          <span>{duration} minutes</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Date</span>
          <span>{eventDate.toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Time</span>
          <span>{eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
  )
} 
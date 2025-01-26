import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, MapPinIcon, UserIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline"
import { format } from "date-fns"
import { SpecialEventPublicSchema } from "@/lib/api/public"

interface EventCardProps {
  event: SpecialEventPublicSchema
  onDetailsClick?: (eventId: string) => void
}

export function EventCard({ event, onDetailsClick }: EventCardProps) {
  const spotsLeft = event.capacity - event.current_capacity
  const isFullyBooked = spotsLeft <= 0

  return (
    <Card className="w-full max-w-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{event.name}</CardTitle>
            <CardDescription className="mt-2 line-clamp-2">
              {event.description}
            </CardDescription>
          </div>
          <Badge variant={isFullyBooked ? "destructive" : "secondary"}>
            {isFullyBooked ? "Fully Booked" : `${spotsLeft} spots left`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          <span>{format(new Date(event.datetime), "PPP p")}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPinIcon className="h-4 w-4" />
          <span>{`${event.location.name}, ${event.location.address}`}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <UserIcon className="h-4 w-4" />
          <span>{event.instructor_name}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <CurrencyDollarIcon className="h-4 w-4" />
          <span>{event.price}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => onDetailsClick?.(event.id)}
          variant="default"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}

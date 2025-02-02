import { Button } from "@/components/ui/button"
import { 
  UsersIcon, 
  CurrencyDollarIcon,
  CalendarIcon,
  ClockIcon
} from "@heroicons/react/24/outline"
import { LocationPill } from "@/components/domain/location-pill"
import { InstructorPill } from "@/components/domain/instructor-pill"
import { components } from "@/lib/api/schema"

interface HeroSectionProps {
  eventDetails: components["schemas"]["SpecialEventSchema"]
}

export function HeroSection({ eventDetails }: HeroSectionProps) {
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
    <div>
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-4xl font-bold">{eventDetails.name}</h1>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground mb-6">
        <div className="flex items-center gap-2">
          <InstructorPill instructor={eventDetails.instructor} />
        </div>
        <div className="flex items-center gap-2">
          <LocationPill location={eventDetails.location} />
        </div>
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <ClockIcon className="h-4 w-4" />
          <span>{formattedTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <UsersIcon className="h-4 w-4" />
          <span>{eventDetails.current_capacity}/{eventDetails.capacity} spots</span>
        </div>
        <div className="flex items-center gap-2">
          <CurrencyDollarIcon className="h-4 w-4" />
          <span>${eventDetails.price}</span>
        </div>
      </div>

      <Button size="lg" className="w-full sm:w-auto">
        Register for Event
      </Button>
    </div>
  )
} 
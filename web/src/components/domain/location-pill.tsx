import { MapPinIcon } from "@heroicons/react/24/outline"
import { useNavigate } from "@tanstack/react-router"
import { components } from "@/lib/api/schema"

interface LocationPillProps {
  location: components["schemas"]["LocationSchema"]
  className?: string
}

export function LocationPill({ location, className = "" }: LocationPillProps) {
  const navigate = useNavigate()

  return (
    <div 
      className={`flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer ${className}`}
      onClick={() => navigate({
        to: '/locations/$locationId',
        params: { locationId: location.id }
      })}
    >
      <MapPinIcon className="h-4 w-4" />
      <span>{location.name}</span>
    </div>
  )
}

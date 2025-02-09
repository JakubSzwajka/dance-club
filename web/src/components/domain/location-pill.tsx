import { MapPinIcon } from '@heroicons/react/24/outline'
import { useNavigate } from '@tanstack/react-router'
import { components } from '@/lib/api/schema'

interface LocationPillProps {
  location: components['schemas']['LocationSchema'] | null
}

export function LocationPill({ location }: LocationPillProps) {
  const navigate = useNavigate()

  if (!location) {
    return null
  }

  return (
    <div
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer min-w-0"
      onClick={() =>
        navigate({
          to: '/locations/$locationId',
          params: { locationId: location.id },
        })
      }
    >
      <MapPinIcon className="h-4 w-4 shrink-0" />
      <span className="truncate">{location.name}</span>
    </div>
  )
}

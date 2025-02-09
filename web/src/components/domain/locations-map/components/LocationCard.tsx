import { Badge } from '@/components/ui/badge'
import { ExternalLink, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from '@tanstack/react-router'
import { LocationSchema, LocationWithClasses } from '../types'

interface LocationCardProps {
  location: LocationWithClasses
  onClose: () => void
  onLocationClick: (location: LocationSchema) => void
}

export function LocationCard({ location, onClose, onLocationClick }: LocationCardProps) {
  const navigate = useNavigate()

  return (
    <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[400px] bg-background rounded-lg shadow-lg border p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{location.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{location.address}</p>
            {location.facilities?.length > 0 && (
              <div className="mb-2">
                <p className="text-sm font-medium mb-1">Facilities:</p>
                <div className="flex flex-wrap gap-1">
                  {location.facilities.map(facility => (
                    <Badge key={facility} variant="secondary" className="text-xs">
                      {facility}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {location.classes?.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <h4 className="font-medium mb-2">Available Classes:</h4>
          <div className="max-h-[200px] overflow-y-auto space-y-3">
            {location.classes.map(danceClass => (
              <div key={danceClass.id} className="border rounded-lg p-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium">{danceClass.name}</h5>
                    <p className="text-sm text-muted-foreground">
                      {danceClass.instructor
                        ? `${danceClass.instructor.first_name} ${danceClass.instructor.last_name}`
                        : 'No instructor'}{' '}
                      • {danceClass.level}
                    </p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {danceClass.style}
                      </Badge>
                      {danceClass.instructor?.rating && (
                        <Badge variant="secondary" className="text-xs">
                          ★ {danceClass.instructor.rating.toFixed(1)}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={e => {
                      e.stopPropagation()
                      navigate({
                        to: '/classes/$classId',
                        params: { classId: danceClass.id },
                      })
                    }}
                  >
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <Button className="flex-1" onClick={() => onLocationClick(location)}>
          View Location Details
        </Button>
        {location.url && (
          <Button
            variant="outline"
            className="flex gap-2"
            onClick={() => window.open(location.url || '', '_blank')}
          >
            Website
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
} 

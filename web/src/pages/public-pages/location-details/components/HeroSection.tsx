import { LocationSchema } from "@/lib/api/public"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPinIcon, GlobeAltIcon } from "@heroicons/react/24/outline"

interface HeroSectionProps {
  location: LocationSchema
}

export function HeroSection({ location }: HeroSectionProps) {
  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <h1 className="text-4xl font-bold">
            {location.name}
          </h1>
          <Badge variant="secondary" className="text-sm">
            {/* {location.area} */}
            Warsaw, Poland
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4" />
            <span>{location.address}</span>
          </div>
          {location.url && (
            <div className="flex items-center gap-2">
              <GlobeAltIcon className="h-4 w-4" />
              <a 
                href={location.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Visit Website
              </a>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4">
          <Button variant="outline" onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`, '_blank')}>
            Get Directions
          </Button>
          {location.url && (
            <Button variant="outline" onClick={() => window.open(location.url, '_blank')}>
              Visit Website
            </Button>
          )}
        </div>
      </div>

      <div className="w-full md:w-1/3 bg-muted rounded-lg p-4">
        <h3 className="font-semibold mb-2">Quick Info</h3>
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="text-muted-foreground">Area</dt>
            {/* <dd>{location.area}</dd> */}
            <dd>Warsaw, Poland</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Classes</dt>
            <dd>Multiple dance styles available</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Facilities</dt>
            <dd>Professional dance floors, changing rooms, air conditioning</dd>
          </div>
        </dl>
      </div>
    </div>
  )
} 
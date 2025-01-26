import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LocationSchema } from "@/lib/api/public"
import { MapPinIcon } from "@heroicons/react/24/outline"
import { Map, Marker } from "@vis.gl/react-google-maps"

interface LocationTabProps {
  location: LocationSchema
}

export function LocationTab({ location }: LocationTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPinIcon className="h-5 w-5" />
              {location.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{location.address}</p>
            {location.url && (
              <Button variant="outline" className="w-full" asChild>
                <a href={location.url} target="_blank" rel="noopener noreferrer">
                  Visit Venue Website
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="h-[400px] rounded-lg overflow-hidden">
        <Map
          defaultCenter={{ lat: location.latitude, lng: location.longitude }}
          defaultZoom={15}
          gestureHandling="greedy"
          mapId="event-location-map"
        >
          <Marker position={{ lat: location.latitude, lng: location.longitude }} />
        </Map>
      </div>
    </div>
  )
} 
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPinIcon } from "@heroicons/react/24/outline"
import { Map, Marker } from '@vis.gl/react-google-maps'
import { components } from "@/lib/api/schema"

interface LocationSectionProps {
  location: components["schemas"]["LocationSchema"]
}

export function LocationSection({ location }: LocationSectionProps) {
  return (
    <div className="py-8 border-t">
      <h2 className="text-2xl font-semibold mb-6">Event Location</h2>
      <Card>
        <CardHeader>
          <CardTitle>{location.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <MapPinIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">{location.name}</p>
                <p className="text-muted-foreground">{location.address}</p>
              </div>
            </div>
            {location.url && (
              <Button variant="outline" className="w-full" onClick={() => window.open(location.url ?? '', '_blank')}>
                Visit Venue Website
              </Button>
            )}
          </div>
          <div className="aspect-video bg-muted rounded-lg mb-4 mt-4">
            <Map zoom={12} center={{lat: Number(location.latitude), lng: Number(location.longitude)}}>
              <Marker position={{lat: Number(location.latitude), lng: Number(location.longitude)}}/>
            </Map>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
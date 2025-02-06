import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { components } from '@/lib/api/schema'
import { MapPinIcon } from '@heroicons/react/24/outline'
import { Map, Marker } from '@vis.gl/react-google-maps'

interface LocationTabProps {
  location: components['schemas']['LocationSchema']
}

export function LocationTab({ location: l }: LocationTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{l.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <MapPinIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">{l.name}</p>
              <p className="text-muted-foreground">{l.address}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open(l.url ?? '', '_blank')}
          >
            Visit Studio Website
          </Button>
        </div>
        <div className="aspect-video bg-muted rounded-lg mb-4 mt-4">
          <Map zoom={12} center={{ lat: Number(l.latitude), lng: Number(l.longitude) }}>
            <Marker position={{ lat: Number(l.latitude), lng: Number(l.longitude) }} />
          </Map>
        </div>
      </CardContent>
    </Card>
  )
}

import { Card } from '@/components/ui/card'
import { Map, Marker } from '@vis.gl/react-google-maps'
import { components } from '@/lib/api/schema'

interface MapSectionProps {
  location: components['schemas']['LocationSchema']
}

export function MapSection({ location }: MapSectionProps) {
  const position = { lat: Number(location.latitude), lng: Number(location.longitude) }
  return (
    <Card className="overflow-hidden">
      <div className="h-[400px] w-full">
        <Map
          defaultZoom={15}
          defaultCenter={position}
          gestureHandling="greedy"
          mapId="location-map"
        >
          <Marker position={position} />
        </Map>
      </div>
    </Card>
  )
}

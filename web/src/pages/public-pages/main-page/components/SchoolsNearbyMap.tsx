import { Card } from '@/components/ui/card'
import { Map, Marker } from '@vis.gl/react-google-maps'
import { usePublicLocations } from '@/lib/api/public/locations'
import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from '@tanstack/react-router'
import { components } from '@/lib/api/schema'

type LocationSchema = components['schemas']['LocationSchema']
export function SchoolsNearbyMap({
  userLocation,
}: {
  userLocation: {
    latitude: number
    longitude: number
  }
}) {
  const [selectedLocation, setSelectedLocation] = useState<LocationSchema | null>(null)
  const [locationsCenter, setLocationsCenter] = useState<{
    latitude: number
    longitude: number
  } | null>(null)

  const { data: locations, isLoading: isLoadingLocations } = usePublicLocations(
    true,
    userLocation.latitude,
    userLocation.longitude
  )
  const navigate = useNavigate()

  const handleLocationClick = (location: LocationSchema) => {
    navigate({
      to: '/locations/$locationId',
      params: { locationId: location.id },
    })
  }

  useEffect(() => {
    if (!locations?.length) return

    const validLocations = locations.filter(
      (loc): loc is LocationSchema =>
        typeof loc.latitude === 'number' && typeof loc.longitude === 'number'
    )

    if (!validLocations.length) return

    let totalLat = 0
    let totalLng = 0
    validLocations.forEach(location => {
      totalLat += Number(location.latitude)
      totalLng += Number(location.longitude)
    })

    const centerLat = totalLat / validLocations.length
    const centerLng = totalLng / validLocations.length

    setLocationsCenter({ latitude: centerLat, longitude: centerLng })
  }, [locations])

  if (isLoadingLocations || !locationsCenter) {
    return <div>Loading...</div>
  }

  return (
    <Card className="overflow-hidden">
      <div className="h-[600px] w-full relative">
        <Map
          defaultCenter={{
            lat: locationsCenter.latitude,
            lng: locationsCenter.longitude,
          }}
          defaultZoom={13}
          gestureHandling="greedy"
          mapId="location-map"
        >
          {locations?.map(
            location =>
              location.latitude &&
              location.longitude && (
                <div key={location.id}>
                  <Marker
                    position={{ lat: Number(location.latitude), lng: Number(location.longitude) }}
                    onClick={() => setSelectedLocation(location)}
                  />
                </div>
              )
          )}
        </Map>
        {selectedLocation && (
          <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[400px] bg-background rounded-lg shadow-lg border p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedLocation.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{selectedLocation.address}</p>
                  {selectedLocation.facilities?.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-medium mb-1">Facilities:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedLocation.facilities.map(facility => (
                          <Badge key={facility} variant="secondary" className="text-xs">
                            {facility}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedLocation(null)}
                className="text-muted-foreground hover:text-foreground"
              >
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
            <div className="mt-4 flex gap-2">
              <Button className="flex-1" onClick={() => handleLocationClick(selectedLocation)}>
                View Details
              </Button>
              {selectedLocation.url && (
                <Button
                  variant="outline"
                  className="flex gap-2"
                  onClick={() => window.open(selectedLocation.url || '', '_blank')}
                >
                  Website
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

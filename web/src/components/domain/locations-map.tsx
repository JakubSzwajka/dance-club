import { Card } from '@/components/ui/card'
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps'
import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, MapPin, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from '@tanstack/react-router'
import { components } from '@/lib/api/schema'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Loader } from '@/components/ui/loader'

type LocationSchema = components['schemas']['LocationSchema']
type DanceClassSchema = components['schemas']['DanceClassSchema']

type LocationWithClasses = LocationSchema & { classes: DanceClassSchema[] }

interface LocationFilters {
  danceStyle?: string
  minClasses?: number
  facilities?: string[]
  sportsCard?: string
}

export function SchoolsNearbyMap({
  locationsWithClasses,
  isLoadingLocations,
}: {
  locationsWithClasses: LocationWithClasses[]
  isLoadingLocations: boolean
}) {
  const [selectedLocation, setSelectedLocation] = useState<LocationSchema | null>(null)
  const [locationsCenter, setLocationsCenter] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [filters, setFilters] = useState<LocationFilters>({})

  const navigate = useNavigate()

  const handleLocationClick = (location: LocationSchema) => {
    navigate({
      to: '/locations/$locationId',
      params: { locationId: location.id },
    })
  }

  // Mock data for filters
  const danceStyles = ['Salsa', 'Bachata', 'Hip Hop', 'Ballet', 'Contemporary']
  const facilityOptions = ['parking', 'changing_room', 'shower', 'air_conditioning']
  const sportsCardOptions = ['multisport', 'medicover', 'benefit', 'ok_system', 'other']

  const updateFilters = (updates: Partial<LocationFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }))
  }

  useEffect(() => {
    if (!locationsWithClasses?.length) return

    const validLocations = locationsWithClasses.filter(
      (loc): loc is LocationWithClasses =>
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
  }, [locationsWithClasses])

  if (isLoadingLocations || !locationsCenter) {
    return (
      <Card className="h-full">
        <Loader
          className="h-full"
          text={isLoadingLocations ? 'Loading locations...' : 'Calculating map position...'}
          size="lg"
        />
      </Card>
    )
  }

  return (
    <div className="relative h-[600px]">
      {/* Filters Section */}
      <div className="absolute left-4 top-4 z-10 w-[280px]">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Location Filters</h2>
            <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Dance Style</Label>
              <Select
                value={filters.danceStyle}
                onValueChange={value => updateFilters({ danceStyle: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by style" />
                </SelectTrigger>
                <SelectContent>
                  {danceStyles.map(style => (
                    <SelectItem key={style} value={style}>
                      {style}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Minimum Classes</Label>
              <Input
                type="number"
                min="1"
                value={filters.minClasses || ''}
                onChange={e => updateFilters({ minClasses: parseInt(e.target.value) })}
                placeholder="Min. number of classes"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Required Facility</Label>
              <Select
                value={filters.facilities?.[0]}
                onValueChange={value => updateFilters({ facilities: [value] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select facility" />
                </SelectTrigger>
                <SelectContent>
                  {facilityOptions.map(facility => (
                    <SelectItem key={facility} value={facility}>
                      {facility.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Sports Card</Label>
              <Select
                value={filters.sportsCard}
                onValueChange={value => updateFilters({ sportsCard: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sports card" />
                </SelectTrigger>
                <SelectContent>
                  {sportsCardOptions.map(card => (
                    <SelectItem key={card} value={card}>
                      {card.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button variant="outline" className="w-full mt-6" onClick={() => setFilters({})}>
            Clear All Filters
          </Button>
        </Card>
      </div>

      {/* Map Section */}
      <Card className="overflow-hidden h-full">
        <div className="h-full w-full relative">
          <Map
            defaultCenter={{
              lat: locationsCenter.latitude,
              lng: locationsCenter.longitude,
            }}
            defaultZoom={13}
            gestureHandling={'cooperative'}
            mapId="location-map"
            disableDefaultUI={false}
            scrollwheel={false}
            draggable={true}
            keyboardShortcuts={false}
            disableDoubleClickZoom={true}
            className="h-full w-full"
          >
            {locationsWithClasses?.map(
              location =>
                location.latitude &&
                location.longitude && (
                  <div key={location.id}>
                    <AdvancedMarker
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

              {/* Classes Section */}
              {(selectedLocation as LocationWithClasses).classes?.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-medium mb-2">Available Classes:</h4>
                  <div className="max-h-[200px] overflow-y-auto space-y-3">
                    {(selectedLocation as LocationWithClasses).classes.map(danceClass => (
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
                <Button className="flex-1" onClick={() => handleLocationClick(selectedLocation)}>
                  View Location Details
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
    </div>
  )
}

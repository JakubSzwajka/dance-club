import { Card } from '@/components/ui/card'
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps'
import { useState, useEffect } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Loader } from '@/components/ui/loader'
import { usePublicLocationsNearby, useMetadata } from '@/lib/api/public'
import { LocationCard } from './components/LocationCard'
import { LocationSchema, LocationSearchParams, LocationWithClasses, WARSAW_COORDINATES } from './types'
import { LocationFilters } from './components/LocationFilters'


function SchoolsNearbyMap() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/' }) as LocationSearchParams

  const [selectedLocation, setSelectedLocation] = useState<LocationWithClasses | null>(null)
  const [coordinates, setCoordinates] = useState({
    latitude: WARSAW_COORDINATES.latitude,
    longitude: WARSAW_COORDINATES.longitude,
  })
  const [isLoadingGeolocation, setIsLoadingGeolocation] = useState(true)
  const [hasInitializedLocation, setHasInitializedLocation] = useState(false)

  // Get metadata for filter options
  const { data: metadata } = useMetadata()
  const danceStyles = metadata?.dance_styles || []
  const sportsCardOptions = metadata?.sports_cards || []
  const facilityOptions = metadata?.facilities || []

  // Update URL with new filters
  const updateFilters = (updates: Partial<LocationSearchParams>) => {
    const newSearch = {
      ...search,
      ...updates,
    }

    // Remove undefined values
    Object.keys(newSearch).forEach(key => {
      if (newSearch[key as keyof LocationSearchParams] === undefined) {
        delete newSearch[key as keyof LocationSearchParams]
      }
    })

    navigate({
      to: '/',
      search: newSearch,
    })
  }

  // Get user location with fallback to Warsaw
  useEffect(() => {
    const abortController = new AbortController()

    if ('geolocation' in navigator) {
      setIsLoadingGeolocation(true)
      navigator.geolocation.getCurrentPosition(
        position => {
          const newLat = position.coords.latitude
          const newLng = position.coords.longitude

          if (
            Math.abs(newLat - coordinates.latitude) > 0.001 ||
            Math.abs(newLng - coordinates.longitude) > 0.001
          ) {
            setCoordinates({
              latitude: newLat,
              longitude: newLng,
            })
            updateFilters({ lat: newLat.toString(), lng: newLng.toString() })
          }
          setIsLoadingGeolocation(false)
          setHasInitializedLocation(true)
        },
        error => {
          if (!abortController.signal.aborted) {
            console.error('Error getting geolocation:', error)
            // Fallback to Warsaw coordinates if geolocation fails
            if (!search.lat || !search.lng) {
              setCoordinates(WARSAW_COORDINATES)
              updateFilters({
                lat: WARSAW_COORDINATES.latitude.toString(),
                lng: WARSAW_COORDINATES.longitude.toString(),
              })
            }
            setIsLoadingGeolocation(false)
            setHasInitializedLocation(true)
          }
        }
      )
    } else {
      setIsLoadingGeolocation(false)
      setHasInitializedLocation(true)
    }

    return () => {
      abortController.abort()
    }
  }, [])

  
  // Load locations based on filters
  const { data: locations, isLoading: isLoadingLocations } = usePublicLocationsNearby(
    hasInitializedLocation, // Only start loading when we have initial location
    coordinates.latitude,
    coordinates.longitude,
    search.danceStyle,
    search.level,
    search.minClasses ? parseInt(search.minClasses) : undefined,
    search.minRating ? parseFloat(search.minRating) : undefined
)

    useEffect(() => {
      if (locations && locations.length > 0 && hasInitializedLocation) {
        // Calculate average latitude and longitude
        const avgCoordinates = locations.reduce(
          (acc, location) => {
            if (location.latitude && location.longitude) {
              acc.latitude += Number(location.latitude)
              acc.longitude += Number(location.longitude)
            }
            return acc
          },
          { latitude: 0, longitude: 0 }
        )

        const newCenter = {
          latitude: avgCoordinates.latitude / locations.length,
          longitude: avgCoordinates.longitude / locations.length
        }

        setCoordinates(newCenter)
      }
    }, [locations, hasInitializedLocation])

  const handleLocationClick = (location: LocationSchema) => {
    navigate({
      to: '/locations/$locationId',
      params: { locationId: location.id },
    })
  }

  return (
    <div className="hidden md:block">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Find Dance Schools Near You</h2>
          <p className="text-lg text-muted-foreground">
            Browse our interactive map to discover dance schools and classes in your area. You can also{' '}
            <a href="/classes" className="text-primary hover:underline">
              explore our complete class catalog
            </a>{' '}
            to find the perfect dance class for you.
          </p>
        </div>
      </section>

      {(isLoadingGeolocation || isLoadingLocations || !hasInitializedLocation) ? (
        <Card className="h-[600px]">
          <Loader className="h-full" text="Loading map and locations..." size="lg" />
        </Card>
      ) : (
        <div className="relative h-[600px]">
          {/* Filters Section */}
          <div className="absolute left-4 top-4 z-10 w-[280px]">
            <LocationFilters
              search={search}
              updateFilters={updateFilters}
              onClearAll={() => navigate({ to: '/', search: {} })}
              danceStyles={danceStyles}
              facilityOptions={facilityOptions}
              sportsCardOptions={sportsCardOptions}
            />
          </div>

          {/* Map Section */}
          <Card className="overflow-hidden h-full">
            <div className="h-full w-full relative">
              <Map
                defaultCenter={{
                  lat: coordinates.latitude,
                  lng: coordinates.longitude,
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
                {locations?.map(
                  location =>
                    location.latitude &&
                    location.longitude && (
                      <div key={location.id}>
                        <AdvancedMarker
                          position={{ lat: Number(location.latitude), lng: Number(location.longitude) }}
                          onClick={() => setSelectedLocation(location as LocationWithClasses)}
                        />
                      </div>
                    )
                )}
              </Map>

              {selectedLocation && (
                <LocationCard
                  location={selectedLocation}
                  onClose={() => setSelectedLocation(null)}
                  onLocationClick={handleLocationClick}
                />
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export { SchoolsNearbyMap }

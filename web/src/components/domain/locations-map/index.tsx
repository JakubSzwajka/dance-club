import { Card } from '@/components/ui/card'
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps'
import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Loader } from '@/components/ui/loader'
import { usePublicLocationsNearby, useMetadata } from '@/lib/api/public'
import { LocationCard } from './components/LocationCard'
import { LocationSchema, LocationSearchParams, LocationWithClasses, WARSAW_COORDINATES } from './types'
import { LocationFilters } from './components/LocationFilters'

function SchoolsNearbyMap() {
  const navigate = useNavigate()
  const urlSearch = useSearch({ from: '/' }) as LocationSearchParams
  
  // Local state for filters to prevent URL updates on every change
  const [filters, setFilters] = useState<LocationSearchParams>(urlSearch)
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

  // Debounced filter updates to URL
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Remove undefined values
      const newSearch = { ...filters }
      Object.keys(newSearch).forEach(key => {
        if (newSearch[key as keyof LocationSearchParams] === undefined) {
          delete newSearch[key as keyof LocationSearchParams]
        }
      })

      navigate({
        to: '/',
        search: newSearch,
      })
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [filters, navigate])

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
            setFilters(prev => ({
              ...prev,
              lat: newLat.toString(),
              lng: newLng.toString(),
            }))
          }
          setIsLoadingGeolocation(false)
          setHasInitializedLocation(true)
        },
        error => {
          if (!abortController.signal.aborted) {
            console.error('Error getting geolocation:', error)
            // Fallback to Warsaw coordinates if geolocation fails
            if (!filters.lat || !filters.lng) {
              setCoordinates(WARSAW_COORDINATES)
              setFilters(prev => ({
                ...prev,
                lat: WARSAW_COORDINATES.latitude.toString(),
                lng: WARSAW_COORDINATES.longitude.toString(),
              }))
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
  const { data: locations, isLoading: isLoadingLocations } = usePublicLocationsNearby({
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    dance_style: filters.danceStyle,
    level: filters.level,
    min_classes: filters.minClasses ? parseInt(filters.minClasses) : undefined,
    min_location_rating: filters.minRating ? parseFloat(filters.minRating) : undefined,
    radius_km: filters.radiusKm ? parseFloat(filters.radiusKm) : undefined,
    facility: filters.facility,
    sports_card: filters.sportsCard,
  })


  // Memoize map center to prevent unnecessary re-renders
  const mapCenter = useMemo(() => ({
    lat: coordinates.latitude,
    lng: coordinates.longitude,
  }), [coordinates.latitude, coordinates.longitude])

  const handleLocationClick = (location: LocationSchema) => {
    navigate({
      to: '/locations/$locationId',
      params: { locationId: location.id },
    })
  }

  // Memoize the map component to prevent re-renders when only markers change
  const MapComponent = useMemo(() => (
    <Map
      defaultCenter={mapCenter}
      defaultZoom={13}
      gestureHandling={'cooperative'}
      mapId="location-map"
      disableDefaultUI={false}
      scrollwheel={false}
      draggable={true}
      keyboardShortcuts={false}
      disableDoubleClickZoom={true}
      className="h-full w-full"
    />
  ), [mapCenter])

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

      {(isLoadingGeolocation || !hasInitializedLocation) ? (
        <Card className="h-[600px]">
          <Loader className="h-full" text="Loading map..." size="lg" />
        </Card>
      ) : (
        <div className="relative h-[600px]">
          {/* Map Section */}
          <Card className="overflow-hidden h-full">
            <div className="h-full w-full relative">
              {MapComponent}
              
              {/* Markers Layer */}
              {locations?.map(
                location =>
                  location.latitude &&
                  location.longitude && (
                    <AdvancedMarker
                      key={location.id}
                      position={{ lat: Number(location.latitude), lng: Number(location.longitude) }}
                      onClick={() => setSelectedLocation(location as LocationWithClasses)}
                    />
                  )
              )}

              {selectedLocation && (
                <LocationCard
                  location={selectedLocation}
                  onClose={() => setSelectedLocation(null)}
                  onLocationClick={handleLocationClick}
                />
              )}

              {/* Loading overlay for locations */}
              {isLoadingLocations && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                  <Loader text="Updating results..." size="lg" />
                </div>
              )}
            </div>
          </Card>

          {/* Filters Section */}
          <div className="absolute left-4 top-4 z-10">
            <LocationFilters
              search={filters}
              updateFilters={(updates) => setFilters(prev => ({ ...prev, ...updates }))}
              onClearAll={() => setFilters({})}
              danceStyles={danceStyles}
              facilityOptions={facilityOptions}
              sportsCardOptions={sportsCardOptions}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export { SchoolsNearbyMap }

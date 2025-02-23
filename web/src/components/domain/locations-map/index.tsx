import { Card } from '@/components/ui/card'
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps'
import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Loader } from '@/components/ui/loader'
import { usePublicLocationsNearby, useMetadata } from '@/lib/api/public'
import { LocationCard } from './components/LocationCard'
import {
  LocationSchema,
  LocationSearchParams,
  LocationWithClasses,
  WARSAW_COORDINATES,
} from './types'
import { LocationFilters } from './components/LocationFilters'

function SchoolsNearbyMap() {
  const navigate = useNavigate()
  const urlSearch = useSearch({ from: '/' }) as LocationSearchParams
  const locationInitializedRef = useRef(false)

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

  // Update URL without navigation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Remove undefined values
      const newSearch = { ...filters }
      Object.keys(newSearch).forEach(key => {
        if (newSearch[key as keyof LocationSearchParams] === undefined) {
          delete newSearch[key as keyof LocationSearchParams]
        }
      })

      // Create the new URL with search params
      const searchParams = new URLSearchParams()
      Object.entries(newSearch).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.set(key, value.toString())
        }
      })

      // Update URL without causing a navigation
      const newUrl =
        window.location.pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
      window.history.replaceState({}, '', newUrl)
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [filters])

  // Get user location with fallback to Warsaw
  useEffect(() => {
    // Skip if we've already initialized location
    if (locationInitializedRef.current) {
      return
    }

    const abortController = new AbortController()

    const handlePositionUpdate = (newLat: number, newLng: number) => {
      const hasSignificantChange =
        Math.abs(newLat - coordinates.latitude) > 0.001 ||
        Math.abs(newLng - coordinates.longitude) > 0.001

      if (hasSignificantChange) {
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
      locationInitializedRef.current = true
    }

    const handleError = () => {
      if (!abortController.signal.aborted) {
        console.error('Error getting geolocation')
        // Fallback to Warsaw coordinates if geolocation fails
        if (!filters.lat || !filters.lng) {
          handlePositionUpdate(WARSAW_COORDINATES.latitude, WARSAW_COORDINATES.longitude)
        } else {
          setIsLoadingGeolocation(false)
          setHasInitializedLocation(true)
          locationInitializedRef.current = true
        }
      }
    }

    if ('geolocation' in navigator) {
      setIsLoadingGeolocation(true)
      navigator.geolocation.getCurrentPosition(position => {
        handlePositionUpdate(position.coords.latitude, position.coords.longitude)
      }, handleError)
    } else {
      handleError()
    }

    return () => {
      abortController.abort()
    }
  }, [coordinates.latitude, coordinates.longitude, filters.lat, filters.lng])

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

  // Calculate center point of all locations
  const mapCenter = useMemo(() => {
    if (!locations || locations.length === 0) {
      return {
        lat: coordinates.latitude,
        lng: coordinates.longitude,
      }
    }

    const validLocations = locations.filter(location => location.latitude && location.longitude)

    if (validLocations.length === 0) {
      return {
        lat: coordinates.latitude,
        lng: coordinates.longitude,
      }
    }

    const sumLat = validLocations.reduce((sum, location) => sum + Number(location.latitude), 0)
    const sumLng = validLocations.reduce((sum, location) => sum + Number(location.longitude), 0)

    return {
      lat: sumLat / validLocations.length,
      lng: sumLng / validLocations.length,
    }
  }, [locations, coordinates])

  const handleLocationClick = (location: LocationSchema) => {
    navigate({
      to: '/locations/$locationId',
      params: { locationId: location.id },
    })
  }

  // Memoize the map component to prevent re-renders when only markers change
  const MapComponent = useMemo(
    () => (
      <Map
        defaultCenter={mapCenter}
        defaultZoom={13}
        gestureHandling={'cooperative'}
        mapId="location-map"
        disableDefaultUI={false}
        scrollwheel={false}
        keyboardShortcuts={false}
        disableDoubleClickZoom={true}
        className="h-full w-full"
      />
    ),
    [mapCenter]
  )

  return (
    <div className="hidden md:block">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Find Dance Schools Near You</h2>
          <p className="text-lg text-muted-foreground">
            Browse our interactive map to discover dance schools and classes in your area. You can
            also{' '}
            <a href="/classes" className="text-primary hover:underline">
              explore our complete class catalog
            </a>{' '}
            to find the perfect dance class for you.
          </p>
        </div>
      </section>

      {isLoadingGeolocation || !hasInitializedLocation ? (
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
              updateFilters={updates => setFilters(prev => ({ ...prev, ...updates }))}
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

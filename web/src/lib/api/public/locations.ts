import { $api } from '../queryClient'

export function usePublicLocationsNearby(
  hasActiveClasses: boolean = true,
  latitude: number | null = null,
  longitude: number | null = null,
  danceStyle: string | null = null,
  level: string | null = null,
  minClasses: number | null = null,
  minRating: number | null = null,
) {
  return $api.useQuery(
    'get',
    '/api/public/locations/nearby',
    {
      params: {
        query: {
          has_active_classes: hasActiveClasses,
          latitude: latitude,
          longitude: longitude,
          dance_style: danceStyle,
          level: level,
          min_classes: minClasses,
          min_rating: minRating,
        },
      },
    },
    {
      enabled: !!latitude && !!longitude,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: false, // Don't retry failed requests
      networkMode: 'online', // Only make requests when online
    }
  )
}

export function usePublicLocation(id: string) {
  return $api.useQuery('get', '/api/public/locations/{location_id}', {
    params: {
      path: {
        location_id: id,
      },
    },
  })
}

export function usePublicLocationStats(id: string) {
  return $api.useQuery('get', '/api/public/locations/{location_id}/stats', {
    params: {
      path: {
        location_id: id,
      },
    },
  })
}
export function usePublicLocationClasses(id: string, includePast: boolean = false) {
  return $api.useQuery('get', '/api/public/locations/{location_id}/classes', {
    params: {
      path: {
        location_id: id,
      },
      query: {
        include_past: includePast,
      },
    },
  })
}

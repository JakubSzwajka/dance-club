import { $api } from '../queryClient'
import { operations } from '../schema'

type LocationSearchParams =
  operations['mydanceclub_api_public_locations_get_locations_nearby']['parameters']['query']

export function usePublicLocationsNearby(params: LocationSearchParams) {
  return $api.useQuery(
    'get',
    '/api/public/locations/nearby',
    {
      params: {
        query: params,
      },
    },
    {
      enabled: !!params?.latitude && !!params?.longitude,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: false, // Don't retry failed requests
      networkMode: 'online', // Only make requests when online
    }
  )
}

export function usePublicLocations(params: LocationSearchParams) {
  return $api.useQuery('get', '/api/public/locations', {
    params: {
      query: params,
    },
  })
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

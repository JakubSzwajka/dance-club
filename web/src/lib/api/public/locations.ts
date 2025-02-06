import { $api } from '../queryClient'

export function usePublicLocations(hasActiveClasses: boolean = true) {
  return $api.useQuery('get', '/api/public/locations', {
    params: {
      query: {
        has_active_classes: hasActiveClasses,
      },
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

import { $api } from '../queryClient'

export function useMetadata() {
  return $api.useQuery('get', '/api/public/metadata')
}

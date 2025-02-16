import { QueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import createFetchClient from 'openapi-fetch'
import createClient from 'openapi-react-query'
import type { paths } from './schema' // generated by openapi-typescript

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
        if (error instanceof AxiosError && error.response?.status === 401) {
          return false
        }
        return failureCount < 3
      },
    },
    mutations: {
      retry: (failureCount, error) => {
        if (error instanceof AxiosError && error.response?.status === 401) {
          return false
        }
        return failureCount < 1
      },
    },
  },
})

const fetchClient = createFetchClient<paths>({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
})
export const $api = createClient(fetchClient)

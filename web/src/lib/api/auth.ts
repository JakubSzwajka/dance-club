import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from './api'

export type UserPublicSchema = {
  id: string
  first_name: string
  last_name: string
  bio: string
  profile_picture: string
}

export type UserPrivateSchema = UserPublicSchema & {
  email: string
  role: string
}

export type LoginCredentials = {
  email: string
  password: string
}

export type SignupCredentials = LoginCredentials & {
  role: 'student' | 'instructor'
}

export type AuthResponse = {
  access: string
  email: string
}

export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.post<AuthResponse>('/api/auth/login', credentials)
      return response.data
    },
  })
}

export function useCurrentUser(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await api.get<UserPrivateSchema>('/api/auth/me')
      return response.data
    },
    enabled: options?.enabled !== false,
  })
}

export function useSignup() {
  return useMutation({
    mutationFn: async (credentials: SignupCredentials) => {
      const response = await api.post<AuthResponse>('/api/auth/signup', credentials)
      return response.data
    },
  })
}

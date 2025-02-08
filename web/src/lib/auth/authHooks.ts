import { createContext, useContext } from 'react'
import { UserPrivateSchema } from '../api/auth'

export type AuthContextType = {
  user: UserPrivateSchema | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: UserPrivateSchema | null) => void
  getToken: () => string | null
  setToken: (token: string) => void
  logout: () => void
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, role: 'student' | 'instructor') => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

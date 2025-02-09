import { components } from '@/lib/api/schema'

export type LocationSchema = components['schemas']['LocationSchema']
export type DanceClassSchema = components['schemas']['DanceClassSchema']
export type Facilities = components['schemas']['Facilities']
export type SportsCard = components['schemas']['SportsCard']

export type LocationWithClasses = LocationSchema & { classes: DanceClassSchema[] }

export interface LocationSearchParams {
  danceStyle?: string
  level?: string
  minClasses?: string
  minRating?: string
  facility?: Facilities
  sportsCard?: SportsCard
  lat?: string
  lng?: string
}

export const WARSAW_COORDINATES = {
  latitude: 52.237049,
  longitude: 21.017532,
}

// Add route validation type
export type LocationsSearchValidation = {
  danceStyle?: string
  level?: string
  minClasses?: string
  minRating?: string
  facility?: Facilities
  sportsCard?: SportsCard
  lat?: string
  lng?: string
} 

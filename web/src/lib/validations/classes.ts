export interface DanceClassPublicSchema {
  id: string
  name: string
  description: string
  style: string
  level: string
  price: number
  capacity: number
  current_capacity: number
  instructor: {
    id: string
    first_name: string
    last_name: string
    bio: string
  }
  location: {
    id: string
    name: string
    address: string
    url?: string
  }
  recurring_schedules: Array<{
    id: string
    day_of_week: string
    start_time: string
    end_time: string
    status: string
  }>
  special_schedules: Array<{
    id: string
    date: string
    start_time: string
    end_time: string
    status: string
  }>
}

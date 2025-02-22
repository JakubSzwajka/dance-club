import { AnalyticsReservations } from './analytics-reservations'
// import { AnalyticsRatings } from './analytics-ratings'
// import { AnalyticsClassPopularity } from './analytics-class-popularity'

export function Analytics() {
  return (
    <div className="space-y-6">
      <AnalyticsReservations />
      {/* <AnalyticsRatings />
      <AnalyticsClassPopularity /> */}
      {/* More analytics sections can be added here */}
    </div>
  )
}

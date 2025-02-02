import { Card, CardContent } from "@/components/ui/card"
import { usePublicClassSchedule } from "@/lib/api/public"
import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline"

interface ClassScheduleProps {
  class_id: string
}

export function ClassSchedule({ class_id }: ClassScheduleProps) {
  const {data: schedules} = usePublicClassSchedule(class_id)

  return (
    <div className="py-8 border-t">
      <h2 className="text-2xl font-semibold mb-6">🗓️ Class Schedule</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {schedules?.map((schedule) => (
          <Card key={schedule.id}>
            <CardContent className="flex items-center gap-4 py-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][schedule.day_of_week]}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-muted-foreground" />
                <span>
                  {new Date(`1970-01-01T${schedule.start_time}`).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                  {' - '}
                  {new Date(`1970-01-01T${schedule.end_time}`).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 
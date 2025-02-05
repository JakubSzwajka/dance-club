import { Card } from "@/components/ui/card"
import { SkillLevelBadge } from "@/components/domain/skill-level-badge"
import { Button } from "@/components/ui/button"
import { useNavigate } from "@tanstack/react-router"
import { MapPinIcon } from "@heroicons/react/24/outline"
import { components } from "@/lib/api/schema"

interface TeachingScheduleProps {
  classes: components["schemas"]["DanceClassSchema"][]
}

export function TeachingSchedule({ classes }: TeachingScheduleProps) {
  const navigate = useNavigate()

  if (classes.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">
          No regular classes scheduled at the moment.
        </p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map((danceClass) => (
        <Card key={danceClass.id} className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold mb-1">{danceClass.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPinIcon className="h-4 w-4" />
                <span>{danceClass.location?.name}</span>
              </div>
            </div>
            <SkillLevelBadge level={danceClass.level} />
          </div>

          {/* <div className="space-y-2 mb-4">
            {danceClass.schedule.map((schedule) => (
              <div key={schedule.id} className="flex items-center gap-2 text-sm">
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
                <span>
                  {schedule.day_of_week_display}, {schedule.start_time} - {schedule.end_time}
                </span>
              </div>
            ))}
          </div> */}

          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate({
              to: '/classes/$classId',
              params: { classId: danceClass.id }
            })}
          >
            View Details
          </Button>
        </Card>
      ))}
    </div>
  )
} 
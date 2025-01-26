import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserIcon, CalendarIcon } from "@heroicons/react/24/outline"
import { SkillLevelBadge } from "../../../../components/domain/skill-level-badge"
import { DanceClassPublicSchema } from "@/lib/api/public"

interface ClassItemProps {
  danceClass: DanceClassPublicSchema
  onDetailsClick?: (classId: string) => void
}

function getScheduleSummary(schedules: DanceClassPublicSchema['schedule']) {
  if (!schedules || schedules.length === 0) return 'No schedule available'
  
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const firstSchedule = schedules[0]
  const time = new Date(`1970-01-01T${firstSchedule.start_time}`).toLocaleTimeString([], { 
    hour: '2-digit',
    minute: '2-digit'
  })
  
  if (schedules.length === 1) {
    return `${days[firstSchedule.day_of_week]} at ${time}`
  }
  
  return `${days[firstSchedule.day_of_week]} at ${time} + ${schedules.length - 1} more`
}

export function ClassItem({ danceClass, onDetailsClick }: ClassItemProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow group">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
              {danceClass.name}
            </CardTitle>
            <CardDescription className="mt-2 flex items-center gap-2">
              {danceClass.style}
              <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground" />
              <span>{danceClass.location.name}</span>
            </CardDescription>
          </div>
          <SkillLevelBadge level={danceClass.level} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {danceClass.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserIcon className="h-4 w-4" />
                <span>{danceClass.instructor.first_name} {danceClass.instructor.last_name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                <span>{getScheduleSummary(danceClass.schedule)}</span>
              </div>
            </div>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => onDetailsClick?.(danceClass.id)}
              className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
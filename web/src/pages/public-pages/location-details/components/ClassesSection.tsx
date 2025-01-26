import { DanceClassPublicSchema } from "@/lib/api/public"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "@tanstack/react-router"
import { SkillLevelBadge } from "@/components/domain/skill-level-badge"
import { InstructorPill } from "@/components/domain/instructor-pill"
import { ClockIcon } from "@heroicons/react/24/outline"

interface ClassesSectionProps {
  classes: DanceClassPublicSchema[]
}

export function ClassesSection({ classes }: ClassesSectionProps) {
  const navigate = useNavigate()

  if (!classes.length) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">
          No regular classes scheduled at this location yet.
        </p>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {classes.map((cls) => (
        <Card key={cls.id} className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-semibold">{cls.name}</h3>
                <SkillLevelBadge level={cls.level} />
              </div>

              <div className="flex flex-col gap-2 mb-4">
                <InstructorPill instructor={cls.instructor} />
                {cls.schedule?.map((schedule, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ClockIcon className="h-4 w-4" />
                    <span>
                      {schedule.day_of_week}, {schedule.start_time} - {schedule.end_time}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {cls.description}
              </p>
            </div>

            <div className="w-full md:w-auto flex flex-col gap-4">
              <div className="text-right">
                <div className="font-semibold">{cls.price} PLN</div>
                <div className="text-sm text-muted-foreground">per class</div>
              </div>
              <Button 
                className="w-full md:w-auto"
                onClick={() => navigate({
                  to: '/classes/$classId',
                  params: { classId: cls.id }
                })}
              >
                View Details
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
} 
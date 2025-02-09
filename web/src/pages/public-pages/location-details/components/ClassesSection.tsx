import { Card } from '@/components/ui/card'
import { useNavigate } from '@tanstack/react-router'
import { components } from '@/lib/api/schema'
import { ClassItem } from '@/components/domain/class-item'

interface ClassesSectionProps {
  classes: components['schemas']['DanceClassSchema'][]
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
    <div className="space-y-4">
      {classes.map(danceClass => (
        <ClassItem
          key={danceClass.id}
          danceClass={danceClass}
          onDetailsClick={id => {
            navigate({
              to: '/classes/$classId',
              params: { classId: id },
            })
          }}
        />
      ))}
    </div>
  )
}

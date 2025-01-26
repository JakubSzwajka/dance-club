import { ClassItem } from "../../class-browser/components/class-item"
import { DanceClassPublicSchema } from "@/lib/api/public"
import { useNavigate } from "@tanstack/react-router"
import { InstructorCard } from "@/components/domain/instructor-card"

interface InstructorTabProps {
  instructor: DanceClassPublicSchema['instructor']
  otherClasses: DanceClassPublicSchema[]
}

export function InstructorTab({ instructor, otherClasses }: InstructorTabProps) {
  const navigate = useNavigate()

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <InstructorCard instructor={instructor} />
      </div>

      <div className="md:col-span-2">
        <h3 className="text-xl font-semibold mb-4">Other Classes by {instructor.first_name}</h3>
        <div className="grid gap-4">
          {otherClasses.map((cls) => (
            <ClassItem key={cls.id} danceClass={cls} onDetailsClick={() => navigate({
              to: `/classes/${cls.id}`
            })} />
          ))}
        </div>
      </div>
    </div>
  )
} 
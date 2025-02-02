import { ClassItem } from "../../class-browser/components/class-item"
import { useNavigate } from "@tanstack/react-router"
import { InstructorCard } from "@/components/domain/instructor-card"
import { components } from "@/lib/api/schema"
import { usePublicInstructorClasses } from "@/lib/api/public/index"

interface InstructorTabProps {
  instructor: components["schemas"]["InstructorPublicSchema"]
}

export function InstructorTab({ instructor }: InstructorTabProps) {
  const navigate = useNavigate()

  const { data: instructorClasses } = usePublicInstructorClasses(instructor.id, true)


  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <InstructorCard instructor={instructor} />
      </div>

      <div className="md:col-span-2">
        <h3 className="text-xl font-semibold mb-4">Classes by {instructor.first_name}</h3>
        <div className="grid gap-4">
          {instructorClasses?.map((cls) => (
            <ClassItem key={cls.id} danceClass={cls} onDetailsClick={() => navigate({
              to: `/classes/${cls.id}`
            })} />
          ))}
        </div>
      </div>
    </div>
  )
} 
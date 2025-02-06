import { components } from '@/lib/api/schema'
import { UserIcon } from '@heroicons/react/24/outline'
import { useNavigate } from '@tanstack/react-router'

interface InstructorPillProps {
  instructor: components['schemas']['UserPublicSchema']
  className?: string
}

export function InstructorPill({ instructor, className = '' }: InstructorPillProps) {
  const navigate = useNavigate()

  return (
    <div
      className={`flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer ${className}`}
      onClick={() =>
        navigate({
          to: '/instructors/$instructorId',
          params: { instructorId: instructor.id },
        })
      }
    >
      <UserIcon className="h-4 w-4" />
      <span>
        {instructor.first_name} {instructor.last_name}
      </span>
    </div>
  )
}

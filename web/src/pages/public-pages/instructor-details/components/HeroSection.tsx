import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { StarIcon } from '@heroicons/react/24/solid'
import { components } from '@/lib/api/schema'

interface HeroSectionProps {
  instructor: components['schemas']['InstructorPublicSchema']
}

export function HeroSection({ instructor }: HeroSectionProps) {
  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <Avatar className="w-32 h-32">
        <AvatarImage
          src={instructor.profile_picture || undefined}
          alt={`${instructor.first_name} ${instructor.last_name}`}
        />
        <AvatarFallback>
          {instructor.first_name[0]}
          {instructor.last_name[0]}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <h1 className="text-4xl font-bold">
            {instructor.first_name} {instructor.last_name}
          </h1>
          <Badge variant="secondary" className="text-sm">
            Dance Instructor
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
            <span className="font-medium">{instructor.rating || 0}</span>
            <span className="ml-1">({instructor.reviews_count || 0} reviews)</span>
          </div>
          <span>•</span>
          <span>{instructor.classes_count || 0} active classes</span>
        </div>
      </div>
    </div>
  )
}

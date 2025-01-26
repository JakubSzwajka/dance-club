import { Button } from "@/components/ui/button"
import { UserIcon, MapPinIcon, UsersIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline"
import { SkillLevelBadge } from "../../../../components/domain/skill-level-badge"
import { DanceClassPublicSchema } from "@/lib/api/public"

interface HeroSectionProps {
  classDetails: DanceClassPublicSchema
}

export function HeroSection({ classDetails }: HeroSectionProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-4xl font-bold">{classDetails.name}</h1>
          <SkillLevelBadge level={classDetails.level} />
        </div>
        
        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            <span>{classDetails.instructor.first_name} {classDetails.instructor.last_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4" />
            <span>{classDetails.location.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4" />
            <span>{classDetails.current_capacity}/{classDetails.capacity} students</span>
          </div>
          <div className="flex items-center gap-2">
            <CurrencyDollarIcon className="h-4 w-4" />
            <span>${classDetails.price}/class</span>
          </div>
        </div>

        <p className="text-lg mb-8">{classDetails.description}</p>

        <Button size="lg" className="w-full md:w-auto">
          Join This Class
        </Button>
      </div>
    </div>
  )
} 
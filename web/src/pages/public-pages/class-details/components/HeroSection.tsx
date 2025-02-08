import { CurrencyDollarIcon } from '@heroicons/react/24/outline'
import { SkillLevelBadge } from '../../../../components/domain/skill-level-badge'
import { LocationPill } from '@/components/domain/location-pill'
import { InstructorPill } from '@/components/domain/instructor-pill'
import { components } from '@/lib/api/schema'

interface HeroSectionProps {
  classDetails: components['schemas']['DanceClassSchema']
}

export function HeroSection({ classDetails }: HeroSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-4xl font-bold">{classDetails.name}</h1>
        <SkillLevelBadge level={classDetails.level} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 text-sm text-muted-foreground mb-6">
        <div className="flex items-center gap-2">
          {classDetails.instructor && <InstructorPill instructor={classDetails.instructor} />}
        </div>
        <div className="flex items-center gap-2">
          <LocationPill location={classDetails.location} />
        </div>
        <div className="flex items-center gap-2">
          <CurrencyDollarIcon className="h-4 w-4" />
          <span>${classDetails.price}/class</span>
        </div>
      </div>

      {/* <Button size="lg" className="w-full sm:w-auto">
        Join This Class
      </Button> */}
    </div>
  )
}

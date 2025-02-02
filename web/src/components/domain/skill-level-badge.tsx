import { Badge } from "@/components/ui/badge"
import { components } from "@/lib/api/schema"

interface SkillLevelBadgeProps {
  level: components["schemas"]["DanceClassSchema"]["level"]
}

export function SkillLevelBadge({ level }: SkillLevelBadgeProps) {
  const variants = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-blue-100 text-blue-800",
    advanced: "bg-purple-100 text-purple-800",
  }

  return (
    <Badge className={variants[level as keyof typeof variants]}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </Badge>
  )
} 
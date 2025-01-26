import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { LocationSchema, UserPublicSchema } from "@/lib/api/public"

interface ActiveFiltersProps {
  selectedInstructor?: string
  selectedStyle?: string
  selectedLevel?: string
  selectedLocation?: string
  instructors: UserPublicSchema[]
  locations: LocationSchema[]
  onClearInstructor: () => void
  onClearStyle: () => void
  onClearLevel: () => void
  onClearLocation: () => void
  onClearAll: () => void
}

export function ActiveFilters({
  selectedInstructor,
  selectedStyle,
  selectedLevel,
  selectedLocation,
  instructors,
  locations,
  onClearInstructor,
  onClearStyle,
  onClearLevel,
  onClearLocation,
  onClearAll,
}: ActiveFiltersProps) {
  const hasActiveFilters = selectedInstructor || selectedStyle || selectedLevel || selectedLocation

  if (!hasActiveFilters) return null

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm text-muted-foreground">Active filters:</span>
      {selectedInstructor && (
        <Badge variant="secondary" className="flex items-center gap-1">
          {instructors.find(i => i.id === selectedInstructor)?.first_name} {instructors.find(i => i.id === selectedInstructor)?.last_name}
          <XMarkIcon className="h-3 w-3 cursor-pointer" onClick={onClearInstructor} />
        </Badge>
      )}
      {selectedStyle && (
        <Badge variant="secondary" className="flex items-center gap-1">
          {selectedStyle}
          <XMarkIcon className="h-3 w-3 cursor-pointer" onClick={onClearStyle} />
        </Badge>
      )}
      {selectedLevel && (
        <Badge variant="secondary" className="flex items-center gap-1">
          {selectedLevel}
          <XMarkIcon className="h-3 w-3 cursor-pointer" onClick={onClearLevel} />
        </Badge>
      )}
      {selectedLocation && (
        <Badge variant="secondary" className="flex items-center gap-1">
          {locations.find(l => l.id === selectedLocation)?.name}
          <XMarkIcon className="h-3 w-3 cursor-pointer" onClick={onClearLocation} />
        </Badge>
      )}
      <Button variant="ghost" size="sm" onClick={onClearAll} className="ml-2">
        Clear all
      </Button>
    </div>
  )
} 
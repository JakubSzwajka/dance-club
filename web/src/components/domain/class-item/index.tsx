import { Card } from '@/components/ui/card'
import { ChevronRight, Star, CalendarDays, Clock } from 'lucide-react'
import { formatDate, formatTime } from '@/lib/utils'
import { components } from '@/lib/api/schema'
import { InstructorPill } from '@/components/domain/instructor-pill'
import { LocationPill } from '@/components/domain/location-pill'
import { cn } from '@/lib/utils'

interface ClassItemProps {
  danceClass: components['schemas']['DanceClassSchema']
  onDetailsClick?: (classId: string) => void
}

const levelColors: Record<string, { bg: string; text: string }> = {
  beginner: {
    bg: 'bg-emerald-100 dark:bg-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-300',
  },
  intermediate: { bg: 'bg-blue-100 dark:bg-blue-500/20', text: 'text-blue-700 dark:text-blue-300' },
  advanced: {
    bg: 'bg-purple-100 dark:bg-purple-500/20',
    text: 'text-purple-700 dark:text-purple-300',
  },
}

export function ClassItem({ danceClass, onDetailsClick }: ClassItemProps) {
  const levelColor = levelColors[danceClass.level.toLowerCase()] || {
    bg: 'bg-primary/10',
    text: 'text-primary',
  }

  const handlePillClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <Card 
      className="w-full overflow-hidden hover:border-primary/50 transition-colors cursor-pointer group"
      onClick={() => onDetailsClick?.(danceClass.id)}
    >
      <div className="p-4">
        <div className="space-y-3">
          {/* Header Section */}
          <div className="flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold truncate group-hover:text-primary transition-colors">{danceClass.name}</h3>
                {danceClass.avg_rating !== null && danceClass.avg_rating > 0 && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground shrink-0">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{danceClass.avg_rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <div
                  className={cn(
                    'text-xs font-medium px-2.5 py-1 rounded-full shrink-0',
                    levelColor.bg,
                    levelColor.text
                  )}
                >
                  {danceClass.level}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">{danceClass.description}</p>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="space-y-2 min-w-0">
              {danceClass.instructor && (
                <div className="flex items-center gap-2 overflow-hidden" onClick={handlePillClick}>
                  <InstructorPill instructor={danceClass.instructor} />
                </div>
              )}
              {danceClass.location && (
                <div className="flex items-center gap-2 overflow-hidden" onClick={handlePillClick}>
                  <LocationPill location={danceClass.location} />
                </div>
              )}
            </div>
            
            <div className="space-y-2 min-w-0">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="w-4 h-4 shrink-0" />
                  <span className="truncate">{formatDate(danceClass.start_date)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span className="truncate">
                    {formatTime(danceClass.start_date)} - {formatTime(danceClass.end_date)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
    </Card>
  )
} 
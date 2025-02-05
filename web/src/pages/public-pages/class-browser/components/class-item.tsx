import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, Clock, ChevronRight } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils"
import { components } from "@/lib/api/schema"
import { InstructorPill } from "@/components/domain/instructor-pill"
import { LocationPill } from "@/components/domain/location-pill"
import { cn } from "@/lib/utils"

interface ClassItemProps {
  danceClass: components["schemas"]["DanceClassSchema"]
  onDetailsClick?: (classId: string) => void
}

const levelColors: Record<string, { bg: string, text: string }> = {
  beginner: { bg: 'bg-emerald-100 dark:bg-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-300' },
  intermediate: { bg: 'bg-blue-100 dark:bg-blue-500/20', text: 'text-blue-700 dark:text-blue-300' },
  advanced: { bg: 'bg-purple-100 dark:bg-purple-500/20', text: 'text-purple-700 dark:text-purple-300' },
}

export function ClassItem({ danceClass, onDetailsClick }: ClassItemProps) {
  const levelColor = levelColors[danceClass.level.toLowerCase()] || { bg: 'bg-primary/10', text: 'text-primary' }

  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-colors">
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-semibold">{danceClass.name}</h3>
                <div className={cn(
                  "text-xs font-medium px-2.5 py-1 rounded-full",
                  levelColor.bg,
                  levelColor.text
                )}>
                  {danceClass.level}
                </div>
              </div>
              <p className="text-muted-foreground line-clamp-2">{danceClass.description}</p>
            </div>

            <Button 
              variant="ghost" 
              className="gap-2"
              onClick={() => onDetailsClick?.(danceClass.id)}
            >
              View Details
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {danceClass.instructor && (
                <InstructorPill instructor={danceClass.instructor} />
              )}
              {danceClass.location && (
                <LocationPill location={danceClass.location} />
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="w-4 h-4" />
                <span>{formatDate(danceClass.start_date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{formatTime(danceClass.start_date)} - {formatTime(danceClass.end_date)}</span>
              </div>
            </div>
            <div className="text-lg font-semibold ml-6">
              {typeof danceClass.price === 'number' 
                ? `$${danceClass.price.toFixed(2)}`
                : danceClass.price
              }
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
} 
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Clock, Star } from 'lucide-react'
import { components } from '@/lib/api/schema'
import { formatDate, formatTime } from '@/lib/utils'
import { InstructorPill } from '@/components/domain/instructor-pill'
import { LocationPill } from '@/components/domain/location-pill'

interface DanceClassCardProps {
  danceClass: components['schemas']['DanceClassSchema']
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

export function DanceClassCard({ danceClass }: DanceClassCardProps) {
  const levelColor = levelColors[danceClass.level.toLowerCase()] || {
    bg: 'bg-primary/10',
    text: 'text-primary',
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{danceClass.name}</h3>
            {danceClass.instructor && (
              <InstructorPill instructor={danceClass.instructor} />
            )}
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">{danceClass.style}</Badge>
            <div className={`text-xs font-medium px-2.5 py-1 rounded-full ${levelColor.bg} ${levelColor.text}`}>
              {danceClass.level}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {danceClass.location && (
            <div className="flex items-center gap-2">
              <LocationPill location={danceClass.location} />
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="w-4 h-4" />
            <span>{formatDate(danceClass.start_date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>
              {formatTime(danceClass.start_date)} - {formatTime(danceClass.end_date)}
            </span>
          </div>
          {danceClass.avg_rating !== null && danceClass.avg_rating > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{danceClass.avg_rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 
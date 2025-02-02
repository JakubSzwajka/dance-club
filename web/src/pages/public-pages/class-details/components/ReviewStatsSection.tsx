import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarIcon } from "@heroicons/react/24/solid"
import { cn } from "@/lib/utils"
import { 
  UserGroupIcon, 
  SpeakerWaveIcon, 
  ClockIcon,
  ChartBarIcon,
  BuildingLibraryIcon,
  UserIcon
} from "@heroicons/react/24/outline"

interface ReviewStats {
  // Instructor metrics
  teachingStyle: number // 0-100: 0 = strict, 100 = casual
  feedbackApproach: number // 0-100: 0 = verbal, 100 = physical
  paceOfTeaching: number // 0-100: 0 = methodical, 100 = fast-paced
  breakdownQuality: number // 1-5
  
  // Environment metrics
  floorQuality: number // 1-5
  crowdedness: number // 1-5
  mirrors: {
    hasMirrors: boolean
    coverage: 'partial' | 'full'
  }
  ventilation: number // 1-5
  temperature: 'cool' | 'moderate' | 'warm'
  
  // Music metrics
  musicGenres: string[]
  volumeLevel: number // 1-5
  musicStyle: number // 0-100: 0 = classic, 100 = modern
  
  // Class dynamics
  averageAttendees: number
  typicalDuration: number // in minutes
  breakFrequency: 'no breaks' | 'one break' | 'multiple breaks'
  partnerRotation: boolean
  skillLevelMix: ('beginner' | 'intermediate' | 'advanced')[]
  commonOutfits: string[]
}

// Mock data
const mockStats: ReviewStats = {
  teachingStyle: 70,
  feedbackApproach: 40,
  paceOfTeaching: 60,
  breakdownQuality: 5,
  floorQuality: 4,
  crowdedness: 3,
  mirrors: {
    hasMirrors: true,
    coverage: 'full'
  },
  ventilation: 4,
  temperature: 'moderate',
  musicGenres: ['Latin', 'Pop', 'Contemporary'],
  volumeLevel: 4,
  musicStyle: 80,
  averageAttendees: 16,
  typicalDuration: 90,
  breakFrequency: 'one break',
  partnerRotation: true,
  skillLevelMix: ['beginner', 'intermediate'],
  commonOutfits: ['Comfortable sportswear', 'Dance shoes required']
}

function Slider({ value, leftLabel, rightLabel, className }: { 
  value: number, 
  leftLabel: string, 
  rightLabel: string,
  className?: string
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="h-2 bg-muted rounded-full relative">
        <div 
          className="absolute top-0 left-0 h-full bg-primary rounded-full"
          style={{ width: `${value}%` }}
        />
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full border-2 border-background"
          style={{ left: `${value}%`, transform: `translateX(-50%) translateY(-50%)` }}
        />
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  )
}

function StarRating({ rating, label }: { rating: number, label: string }) {
  return (
    <div className="flex items-center gap-4 justify-between">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon 
            key={i}
            className={cn(
              "h-4 w-4",
              i < rating ? "text-yellow-500" : "text-muted"
            )}
          />
        ))}
      </div>
    </div>
  )
}

function MetricWithIcon({ icon: Icon, label, value }: { 
  icon: React.ComponentType<{ className?: string }>,
  label: string, 
  value: string | number 
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-muted rounded-lg">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  )
}

export function ReviewStatsSection() {
  return (
    <div className="py-8 border-t">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Class Experience</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-normal">
            Based on 42 reviews
          </Badge>
          <Badge variant="secondary" className="font-normal">
            Last updated 2 days ago
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Teaching Style Card */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-lg font-medium">Teaching Approach</h3>
            <div className="space-y-6">
              <Slider 
                value={mockStats.teachingStyle}
                leftLabel="Structured"
                rightLabel="Casual"
              />
              <Slider 
                value={mockStats.feedbackApproach}
                leftLabel="Verbal Guidance"
                rightLabel="Hands-on Corrections"
              />
              <Slider 
                value={mockStats.paceOfTeaching}
                leftLabel="Methodical"
                rightLabel="Fast-paced"
              />
              <StarRating rating={mockStats.breakdownQuality} label="Move Breakdown Quality" />
            </div>
          </CardContent>
        </Card>

        {/* Environment Card */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-medium">Studio Environment</h3>
            <div className="space-y-4">
              <StarRating rating={mockStats.floorQuality} label="Floor Quality" />
              <StarRating rating={mockStats.crowdedness} label="Space Comfort" />
              <StarRating rating={mockStats.ventilation} label="Ventilation" />
              <div className="flex items-center justify-between">
                <span className="text-sm">Room Temperature</span>
                <Badge variant="secondary" className="capitalize">
                  {mockStats.temperature}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Mirrors</span>
                <div className="flex gap-2">
                  {mockStats.mirrors.hasMirrors ? (
                    <Badge variant="secondary">
                      {mockStats.mirrors.coverage === 'full' ? 'Full Wall' : 'Partial'}
                    </Badge>
                  ) : (
                    <Badge variant="outline">No Mirrors</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Class Dynamics Card */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-lg font-medium">Class Dynamics</h3>
            <div className="grid grid-cols-2 gap-4">
              <MetricWithIcon 
                icon={UserGroupIcon}
                label="Average Class Size"
                value={`${mockStats.averageAttendees} students`}
              />
              <MetricWithIcon 
                icon={ClockIcon}
                label="Duration"
                value={`${mockStats.typicalDuration} min`}
              />
              <MetricWithIcon 
                icon={ChartBarIcon}
                label="Skill Mix"
                value={mockStats.skillLevelMix.join(' & ')}
              />
              <MetricWithIcon 
                icon={UserIcon}
                label="Partner Rotation"
                value={mockStats.partnerRotation ? 'Yes' : 'No'}
              />
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">What to Wear</p>
              <div className="flex flex-wrap gap-2">
                {mockStats.commonOutfits.map((outfit) => (
                  <Badge key={outfit} variant="outline">
                    {outfit}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Music Card */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-lg font-medium">Music & Atmosphere</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Music Genres</span>
                  <div className="flex gap-2">
                    {mockStats.musicGenres.map((genre) => (
                      <Badge key={genre} variant="secondary">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
                <StarRating rating={mockStats.volumeLevel} label="Volume Level" />
              </div>
              <Slider 
                value={mockStats.musicStyle}
                leftLabel="Classical"
                rightLabel="Modern"
              />
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Break Schedule</p>
                <Badge variant="secondary">
                  {mockStats.breakFrequency}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface ClassDetails {
  name: string
  description: string
}

interface InstructorDetails {
  first_name: string
  last_name: string
  bio: string | null
  classes_count: number
  rating: number
  reviews_count: number
}

interface LocationDetails {
  name: string
  address: string
}

interface ReviewContextCardProps {
  type: 'class' | 'instructor' | 'location'
  details: ClassDetails | InstructorDetails | LocationDetails | null
  expanded: boolean
  onToggleExpand: () => void
}

export function ReviewContextCard({ 
  type, 
  details, 
  expanded, 
  onToggleExpand 
}: ReviewContextCardProps) {
  if (!details) return null

  return (
    <div className="xl:sticky xl:top-8">
      <Card className="p-6 h-fit">
        <h3 className="text-lg font-semibold mb-4">
          {type === 'class' && 'About This Class'}
          {type === 'instructor' && 'About The Instructor'}
          {type === 'location' && 'About The Location'}
        </h3>
        <div className="space-y-4">
          {type === 'class' && 'name' in details && (
            <>
              <div>
                <div className="text-sm font-medium">Class Name</div>
                <div className="text-muted-foreground">{details.name}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Description</div>
                <div className={cn(
                  "text-muted-foreground relative",
                  !expanded && "line-clamp-4"
                )}>
                  {details.description}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 flex items-center gap-2 hover:bg-muted"
                  onClick={onToggleExpand}
                >
                  {expanded ? (
                    <>Show Less <ChevronUp className="w-4 h-4" /></>
                  ) : (
                    <>Read More <ChevronDown className="w-4 h-4" /></>
                  )}
                </Button>
              </div>
            </>
          )}

          {type === 'instructor' && 'first_name' in details && (
            <>
              <div>
                <div className="text-sm font-medium">Instructor Name</div>
                <div className="text-muted-foreground">
                  {details.first_name} {details.last_name}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Bio</div>
                <div className={cn(
                  "text-muted-foreground relative",
                  !expanded && "line-clamp-4"
                )}>
                  {details.bio || 'No bio available'}
                </div>
                {details.bio && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 flex items-center gap-2 hover:bg-muted"
                    onClick={onToggleExpand}
                  >
                    {expanded ? (
                      <>Show Less <ChevronUp className="w-4 h-4" /></>
                    ) : (
                      <>Read More <ChevronDown className="w-4 h-4" /></>
                    )}
                  </Button>
                )}
              </div>
              <div>
                <div className="text-sm font-medium">Experience</div>
                <div className="text-muted-foreground">
                  {details.classes_count} classes taught
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Rating</div>
                <div className="text-muted-foreground">
                  {details.rating.toFixed(1)} ({details.reviews_count} reviews)
                </div>
              </div>
            </>
          )}

          {type === 'location' && 'address' in details && (
            <>
              <div>
                <div className="text-sm font-medium">Location Name</div>
                <div className="text-muted-foreground">{details.name}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Address</div>
                <div className="text-muted-foreground">{details.address}</div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  )
} 
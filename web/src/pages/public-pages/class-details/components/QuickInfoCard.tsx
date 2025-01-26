import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DanceClassPublicSchema } from "@/lib/api/public"

interface QuickInfoCardProps {
  classDetails: DanceClassPublicSchema
}

export function QuickInfoCard({ classDetails }: QuickInfoCardProps) {
  return (
    <div className="lg:w-80">
      <Card>
        <CardHeader>
          <CardTitle>Quick Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Style</span>
            <Badge variant="outline">{classDetails.style}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Duration</span>
            <span>90 minutes</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Skill Level</span>
            <span className="capitalize">{classDetails.level}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Capacity</span>
            <span>{classDetails.current_capacity}/{classDetails.capacity}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
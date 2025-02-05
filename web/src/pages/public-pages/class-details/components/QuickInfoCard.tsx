import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { components } from "@/lib/api/schema"

interface QuickInfoCardProps {
  classDetails: components["schemas"]["DanceClassSchema"]
}

export function QuickInfoCard({ classDetails }: QuickInfoCardProps) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Quick Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Style</span>
          <Badge variant="outline" className="capitalize">{classDetails.style}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Duration</span>
          <span>{classDetails.duration} minutes</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Skill Level</span>
          <span className="capitalize">{classDetails.level}</span>
        </div>
      </CardContent>
    </Card>
  )
} 
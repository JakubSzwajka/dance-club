import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPublicSchema } from "@/lib/api/public"
import { useNavigate } from "@tanstack/react-router"

interface InstructorCardProps {
  instructor: UserPublicSchema
}

export function InstructorCard({ instructor }: InstructorCardProps) {
    const navigate = useNavigate()
    return (
    <Card className="h-full">
      <CardContent className="pt-6 text-center">
        <div className="w-32 h-32 mx-auto rounded-full bg-muted mb-4" />
        <h3 className="text-xl font-semibold mb-2">
          {instructor.first_name} {instructor.last_name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {instructor.bio}
        </p>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate({
            to: `/classes?instructor=${instructor.id}`
          })}
        >
          View Classes
        </Button>
      </CardContent>
    </Card>
  )
} 
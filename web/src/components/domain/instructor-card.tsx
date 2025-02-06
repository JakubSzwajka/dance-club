import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { components } from '@/lib/api/schema'

interface InstructorCardProps {
  instructor: components['schemas']['UserPublicSchema']
}

export function InstructorCard({ instructor }: InstructorCardProps) {
  const navigate = useNavigate()

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card click when clicking the button
    if ((e.target as HTMLElement).closest('button')) return
    navigate({
      to: '/instructors/$instructorId',
      params: { instructorId: instructor.id },
    })
  }

  return (
    <Card
      className="h-full cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={handleCardClick}
    >
      <CardContent className="pt-6 text-center">
        <Avatar className="w-32 h-32 mx-auto mb-4">
          <AvatarImage
            src={instructor.profile_picture ?? undefined}
            alt={`${instructor.first_name} ${instructor.last_name}`}
          />
          <AvatarFallback>
            {instructor.first_name[0]}
            {instructor.last_name[0]}
          </AvatarFallback>
        </Avatar>
        <h3 className="text-xl font-semibold mb-2">
          {instructor.first_name} {instructor.last_name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{instructor.bio}</p>
        <Button
          variant="outline"
          className="w-full"
          onClick={() =>
            navigate({
              to: `/classes?instructor=${instructor.id}`,
            })
          }
        >
          View Classes
        </Button>
      </CardContent>
    </Card>
  )
}

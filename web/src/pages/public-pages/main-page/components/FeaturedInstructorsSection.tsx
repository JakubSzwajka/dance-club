import { Container } from "@/components/ui/container"
import { InstructorCard } from "@/components/domain/instructor-card"
import { usePublicInstructors } from "@/lib/api/public"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function FeaturedInstructorsSection() {
  const { data: instructors, isLoading: instructorsLoading } = usePublicInstructors()

  return (
    <section className="py-16 bg-muted/30">
      <Container>
        <div className="space-y-4 mb-8">
          <h2 className="text-3xl font-bold">Meet Our Instructors</h2>
          <p className="text-muted-foreground">
            Learn from our talented and experienced dance instructors
          </p>
        </div>

        {instructorsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[300px] bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : instructors && instructors.length > 0 ? (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {instructors.map((instructor) => (
                <CarouselItem key={instructor.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <InstructorCard
                      instructor={instructor}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold">No instructors found</h3>
            <p className="text-muted-foreground mt-2">Please try again later</p>
          </div>
        )}
      </Container>
    </section>
  )
} 
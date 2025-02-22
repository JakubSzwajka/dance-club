import { Container } from '@/components/ui/container'
import { DanceClassCard } from '@/components/domain/dance-class-card'
import { useTrendingClasses } from '@/lib/api/public/classes'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

export function TrendingClassesSection() {
  const { data: classes, isLoading: classesLoading } = useTrendingClasses()

  return (
    <section className="py-16">
      <Container>
        <div className="space-y-4 mb-8">
          <h2 className="text-3xl font-bold">Trending Dance Classes</h2>
          <p className="text-muted-foreground">
            Discover our most popular dance classes and join the rhythm
          </p>
        </div>

        {classesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[300px] bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : classes && classes.length > 0 ? (
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {classes.map(danceClass => (
                <CarouselItem key={danceClass.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <DanceClassCard danceClass={danceClass} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold">No trending classes found</h3>
            <p className="text-muted-foreground mt-2">Please try again later</p>
          </div>
        )}
      </Container>
    </section>
  )
}

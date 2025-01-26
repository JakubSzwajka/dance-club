import { Header } from '@/components/domain/header';
import { useEffect, useState } from 'react';
import { EventCard } from '@/components/domain/event-card';
import { InstructorCard } from '@/components/domain/instructor-card';
import { usePublicEventsNearLocation, usePublicInstructors } from '@/lib/api/public';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { useNavigate } from '@tanstack/react-router';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function HomePage() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser");
    }
  }, []);

  const { data: events, isLoading } = usePublicEventsNearLocation(latitude ?? 0, longitude ?? 0, undefined, undefined, 3);
  const { data: instructors, isLoading: instructorsLoading } = usePublicInstructors();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-32">
        <Container>
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Discover Dance Classes Near You
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Join our vibrant dance community. Find local classes, special events, and connect with talented instructors. 
              Start your dance journey today!
            </p>
            <div className="mt-8 flex gap-4">
              <Button size="lg" onClick={() => navigate({ to: '/signup' })}>Join Now</Button>
              <Button size="lg" variant="outline" onClick={() => navigate({ to: '/classes' })}>Browse Classes</Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Events Section */}
      <section className="py-16">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Special Events Near You</h2>
              <p className="text-muted-foreground">
                Discover unique dance events and workshops in your area
              </p>
            </div>
            <Button onClick={() => navigate({ to: '/events' })}>View All Events</Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[400px] bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onDetailsClick={() => navigate({ to: `/events/${event.id}` })}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold">No events found nearby</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your location or date range</p>
            </div>
          )}
        </Container>
      </section>

      {/* Featured Instructors Section */}
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

      {/* Why Choose Us Section */}
      <section className="py-16 bg-muted/50">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Expert Instructors</h3>
              <p className="text-muted-foreground">Learn from professional dancers with years of teaching experience</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Multiple Locations</h3>
              <p className="text-muted-foreground">Find classes and events at convenient locations near you</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">All Skill Levels</h3>
              <p className="text-muted-foreground">From beginners to advanced dancers, we have classes for everyone</p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <Container>
          <div className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Dancing?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our community today and get access to exclusive events, special workshops, 
              and connect with other dance enthusiasts.
            </p>
            <Button size="lg" onClick={() => navigate({ to: '/signup' })}>Sign Up Now</Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
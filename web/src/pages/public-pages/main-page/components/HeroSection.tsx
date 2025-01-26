import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { useNavigate } from "@tanstack/react-router"

export function HeroSection() {
  const navigate = useNavigate()

  return (
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
  )
} 
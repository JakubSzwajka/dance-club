import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { useNavigate } from '@tanstack/react-router'

export function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className="relative min-h-[600px] flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/main_page_2.jpg")',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <Container className="relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-white">
            Discover Dance Classes Near You
          </h1>
          <p className="mt-6 text-lg text-gray-200">
            Join our vibrant dance community. Find local classes, special events, and connect with
            talented instructors. Start your dance journey today!
          </p>
          <div className="mt-12 flex gap-6">
            <Button
              size="lg"
              disabled
              className="text-lg px-8 py-6 shadow-lg cursor-not-allowed opacity-50"
            >
              Join Now (coming soon)
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 bg-white hover:bg-white/90 text-primary shadow-lg hover:shadow-xl transition-all hover:scale-105"
              onClick={() => navigate({ to: '/classes' })}
            >
              Browse Classes
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}

import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { useNavigate } from '@tanstack/react-router'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function CTASection() {
  const navigate = useNavigate()

  return (
    <section className="py-16">
      <Container>
        <div className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Dancing?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our community today and get access to exclusive events, special workshops, and
            connect with other dance enthusiasts.
          </p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button size="lg" disabled className="cursor-not-allowed opacity-50">
                    Sign Up Now
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Coming soon!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </Container>
    </section>
  )
}

import { Container } from '@/components/ui/container'

interface Step {
  id: string
  title: string
  icon: React.ElementType
}

interface ReviewHeaderProps {
  classDetails: {
    name: string
  } | null
  completedSteps: Set<string>
  currentStep: string
  steps: Step[]
}

export function ReviewHeader({
  classDetails,
}: ReviewHeaderProps) {
  return (
    <div className="bg-muted/30 border-b">
      <Container>
        <div className="py-8">
          <div>
            <h1 className="text-3xl font-bold mb-3">Share Your Dance Journey</h1>
            <div className="space-y-3">
              <p className="text-muted-foreground text-lg">
                Your experience is invaluable to the dance community. By sharing your insights,
                you help fellow dancers find the perfect class and inspire instructors to excel.
              </p>
              {classDetails && (
                <div className="flex items-center gap-2 text-lg">
                  <span className="text-muted-foreground">Currently reviewing:</span>
                  <span className="font-medium text-foreground">{classDetails.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

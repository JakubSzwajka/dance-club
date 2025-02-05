import { Container } from "@/components/ui/container"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

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
  completedSteps, 
  currentStep,
  steps 
}: ReviewHeaderProps) {
  return (
    <div className="bg-muted/30 border-b">
      <Container>
        <div className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-8">
            <div>
              <h1 className="text-3xl font-bold mb-3">Share Your Dance Journey</h1>
              <div className="space-y-3 max-w-2xl">
                <p className="text-muted-foreground text-lg">
                  Your experience is invaluable to the dance community. By sharing your insights, you help fellow dancers find the perfect class and inspire instructors to excel.
                </p>
                {classDetails && (
                  <div className="flex items-center gap-2 text-lg">
                    <span className="text-muted-foreground">Currently reviewing:</span>
                    <span className="font-medium text-foreground">{classDetails.name}</span>
                  </div>
                )}
              </div>
            </div>
            
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Review Progress</div>
                  <div className="text-2xl font-bold">
                    {completedSteps.size}/3
                  </div>
                </div>
                <div className="space-y-2.5">
                  {steps.slice(0, 3).map((step) => {
                    const isCompleted = completedSteps.has(step.id)
                    const isCurrent = currentStep === step.id
                    const Icon = step.icon
                    return (
                      <div key={step.id} className="flex items-center gap-2 text-sm">
                        <div className={cn(
                          "p-1.5 rounded-md",
                          isCurrent ? "bg-primary/10" : "bg-muted"
                        )}>
                          <Icon className={cn(
                            "w-3.5 h-3.5",
                            isCompleted ? "text-primary" : 
                            isCurrent ? "text-primary" :
                            "text-muted-foreground"
                          )} />
                        </div>
                        <span className={cn(
                          "flex-1",
                          isCompleted ? "text-primary font-medium" : 
                          isCurrent ? "font-medium" :
                          "text-muted-foreground"
                        )}>
                          {step.title}
                        </span>
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        ) : isCurrent ? (
                          <Circle className="w-4 h-4 fill-primary/20 text-primary" />
                        ) : (
                          <Circle className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    )
                  })}
                </div>
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  Feel free to skip any section you're not comfortable reviewing
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  )
} 
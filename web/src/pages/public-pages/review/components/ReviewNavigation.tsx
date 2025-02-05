import { Card } from "@/components/ui/card"
import { CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: string
  title: string
  icon: React.ElementType
}

interface ReviewNavigationProps {
  steps: Step[]
  currentStep: string
  completedSteps: Set<string>
  onStepClick: (stepId: string) => void
}

export function ReviewNavigation({ 
  steps, 
  currentStep, 
  completedSteps, 
  onStepClick 
}: ReviewNavigationProps) {
  return (
    <div className="hidden xl:block">
      <div className="sticky top-8">
        <Card className="p-4">
          <div className="space-y-1">
            {steps.map((step) => {
              const isCompleted = completedSteps.has(step.id)
              const isCurrent = currentStep === step.id
              const Icon = step.icon

              return (
                <button 
                  key={step.id}
                  onClick={() => onStepClick(step.id)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg transition-all duration-200 w-full text-left",
                    isCurrent && "bg-primary text-primary-foreground",
                    !isCurrent && isCompleted && "text-primary",
                    !isCurrent && !isCompleted && "text-muted-foreground hover:text-foreground",
                    !isCurrent && "hover:bg-muted"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-lg",
                    isCurrent && "bg-primary-foreground/20",
                    !isCurrent && "bg-background"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-[120px]">
                    <div className="text-sm font-medium">{step.title}</div>
                    <div className={cn(
                      "text-xs",
                      isCurrent && "text-primary-foreground/80",
                      !isCurrent && "text-muted-foreground"
                    )}>
                      {step.id === 'submit' 
                        ? `${completedSteps.size} of 3 Complete`
                        : isCompleted 
                          ? "Completed" 
                          : isCurrent 
                            ? "In Progress" 
                            : "Not Started"
                      }
                    </div>
                  </div>
                  <div className="ml-auto">
                    {step.id === 'submit' ? (
                      <div className={cn(
                        "text-xs font-medium rounded-full px-2 py-1",
                        completedSteps.size === 3 ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        {completedSteps.size}/3
                      </div>
                    ) : isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isCurrent ? (
                      <Circle className="w-4 h-4 fill-current/20" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
} 
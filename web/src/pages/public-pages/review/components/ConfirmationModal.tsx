import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { CheckCircle2, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  id: string
  title: string
  icon: React.ElementType
}

interface ConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  steps: Step[]
  completedSteps: Set<string>
  onConfirm: () => void
}

export function ConfirmationModal({
  open,
  onOpenChange,
  steps,
  completedSteps,
  onConfirm,
}: ConfirmationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Confirm Review Submission</DialogTitle>
          <DialogDescription>
            You're about to submit your reviews. Please confirm the sections you've completed.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-4">
          {steps.slice(0, 3).map(step => {
            const isCompleted = completedSteps.has(step.id)
            const Icon = step.icon
            return (
              <div
                key={step.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border',
                  isCompleted ? 'border-primary/20 bg-primary/5' : 'border-muted bg-muted/5'
                )}
              >
                <div className={cn('p-2 rounded-lg', isCompleted ? 'bg-primary/10' : 'bg-muted')}>
                  <Icon
                    className={cn(
                      'w-4 h-4',
                      isCompleted ? 'text-primary' : 'text-muted-foreground'
                    )}
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{step.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {isCompleted ? 'Review completed' : 'Not reviewed'}
                  </div>
                </div>
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                ) : (
                  <div className="text-xs text-muted-foreground border rounded-full px-2 py-0.5">
                    Skipped
                  </div>
                )}
              </div>
            )
          })}

          {completedSteps.size < 3 && (
            <div className="text-sm text-muted-foreground mt-4">
              <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
                <Info className="w-4 h-4" />
                <span>You haven't completed all sections</span>
              </div>
              <p className="mt-1 pl-6">
                That's okay! Your feedback is still valuable. You can always come back later to
                review the remaining sections.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Go Back
          </Button>
          <Button onClick={onConfirm} className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Submit {completedSteps.size} Review{completedSteps.size !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

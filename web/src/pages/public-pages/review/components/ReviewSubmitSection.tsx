import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

interface ReviewSubmitSectionProps {
  completedSteps: Set<string>
  onSubmit: () => void
  isActive: boolean
}

export function ReviewSubmitSection({ 
  completedSteps, 
  onSubmit, 
  isActive 
}: ReviewSubmitSectionProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr,400px] gap-8">
      <Card className="p-8 bg-muted/30">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className={`w-12 h-12 ${completedSteps.size > 0 ? 'text-primary' : 'text-muted'}`} />
          </div>
          <h3 className="text-xl font-semibold">
            {completedSteps.size === 0 ? (
              "Ready to Share Your Experience"
            ) : completedSteps.size === 3 ? (
              "All Reviews Complete!"
            ) : (
              `${completedSteps.size} of 3 Reviews Complete`
            )}
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {completedSteps.size === 0 
              ? "Complete any of the review sections above to share your experience."
              : completedSteps.size === 3 
                ? "Thank you for sharing your experience! Your feedback will help others make informed decisions."
                : "You can continue reviewing or submit your completed reviews now."}
          </p>
          <Button 
            size="lg" 
            className="mt-4 px-8"
            onClick={onSubmit}
            disabled={completedSteps.size === 0}
          >
            Submit {completedSteps.size > 0 ? `${completedSteps.size} ` : ''}Review{completedSteps.size !== 1 ? 's' : ''}
          </Button>
        </div>
      </Card>
      <div className="hidden xl:block" /> {/* Empty div to maintain grid layout */}
    </div>
  )
} 
import { Container } from "@/components/ui/container"
import { Header } from "@/components/domain/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { School, User2, Building2, CheckCircle2, Circle } from "lucide-react"
import { usePublicClass, usePublicInstructor, usePublicLocation } from "@/lib/api/public"
import { reviewFlowRoute } from "@/router"
import { ClassReviewBlock } from "./components/ClassReviewBlock"
import { InstructorReviewBlock } from "./components/InstructorReviewBlock"
import { LocationReviewBlock } from "./components/LocationReviewBlock"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface ReviewSearchParams {
  classId?: string
  instructorId?: string
  locationId?: string
}

export function ReviewPage() {
  const navigate = useNavigate()
  const { classId, instructorId, locationId } = useSearch({ from: reviewFlowRoute.id }) as ReviewSearchParams
  const [currentStep, setCurrentStep] = useState<'class' | 'instructor' | 'location' | 'submit'>('class')
  
  const classRef = useRef<HTMLDivElement>(null)
  const instructorRef = useRef<HTMLDivElement>(null)
  const locationRef = useRef<HTMLDivElement>(null)

  const { data: instructorDetails } = usePublicInstructor(instructorId || '')
  const { data: locationDetails } = usePublicLocation(locationId || '')
  const { data: classDetails } = usePublicClass(classId || '')

  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

  useEffect(() => {
    const refs = {
      class: classRef,
      instructor: instructorRef,
      location: locationRef,
      submit: { current: document.getElementById('submit-section') }
    }

    const currentRef = refs[currentStep]
    if (currentRef?.current) {
      currentRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      })
    }
  }, [currentStep])

  const handleClassSubmit = () => {
    setCompletedSteps(prev => new Set([...prev, 'class']))
    setCurrentStep('instructor')
  }

  const handleInstructorSubmit = () => {
    setCompletedSteps(prev => new Set([...prev, 'instructor']))
    setCurrentStep('location')
  }

  const handleLocationSubmit = () => {
    setCompletedSteps(prev => new Set([...prev, 'location']))
  }

  const handleSkip = () => {
    if (currentStep === 'class') setCurrentStep('instructor')
    else if (currentStep === 'instructor') setCurrentStep('location')
  }

  const handleBack = () => {
    if (currentStep === 'instructor') setCurrentStep('class')
    else if (currentStep === 'location') setCurrentStep('instructor')
  }

  const handleFinalSubmit = () => {
    navigate({ to: '/classes/$classId', params: { classId: classId || '' } })
  }

  const reviewTypes = [
    {
      title: "Review Dance Class",
      description: "Share your experience about the class structure, teaching pace, group size, and overall engagement level.",
      icon: School,
      path: "/review/class",
      isEnabled: !!classId,
      disabledMessage: "Please select a class to review",
      id: classId
    },
    {
      title: "Review Instructor",
      description: "Evaluate the instructor's teaching style, communication skills, and ability to provide guidance and corrections.",
      icon: User2,
      path: "/review/instructor",
      isEnabled: !!instructorId,
      disabledMessage: "Please select an instructor to review",
      id: instructorId
    },
    {
      title: "Review Location",
      description: "Rate the facilities including cleanliness, acoustics, temperature control, and additional amenities.",
      icon: Building2,
      path: "/review/location",
      isEnabled: !!locationId,
      disabledMessage: "Please select a location to review",
      id: locationId
    }
  ]

  const handleStartReview = () => {
    setCurrentStep('class')
  }

  const steps = [
    {
      id: 'class',
      title: "Class Review",
      icon: School,
    },
    {
      id: 'instructor',
      title: "Instructor Review",
      icon: User2,
    },
    {
      id: 'location',
      title: "Location Review",
      icon: Building2,
    },
    {
      id: 'submit',
      title: "Submit Reviews",
      icon: CheckCircle2,
    }
  ]

  const handleStepClick = (stepId: string) => {
    setCurrentStep(stepId as typeof currentStep)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Container className="relative">
        {/* Fixed Legend */}
        <div className="fixed left-8 top-[20%] hidden lg:block">
          <Card className="p-4 w-[280px]">
            <div className="space-y-1">
              {steps.map((step) => {
                const isCompleted = completedSteps.has(step.id)
                const isCurrent = currentStep === step.id
                const Icon = step.icon

                return (
                  <button 
                    key={step.id}
                    onClick={() => handleStepClick(step.id)}
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

        <div className="py-12 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Share Your Experience</h1>
          <p className="text-muted-foreground mb-8">
              Your feedback helps us improve and helps others make informed decisions.
              {classDetails && (
                <span className="block mt-2">
                  Reviewing: <span className="font-medium">{classDetails.name}</span>
                </span>
              )}
            </p>

          <div className="space-y-8">
            <div 
              ref={classRef}
              className={`transition-all duration-200 ${currentStep !== 'class' ? 'opacity-50 pointer-events-none scale-95' : 'scale-100'}`}
            >
              {classId && (
                <ClassReviewBlock
                  classId={classId}
                  onSubmit={handleClassSubmit}
                  onSkip={handleSkip}
                  isActive={currentStep === 'class'}
                />
              )}
            </div>

            <div 
              ref={instructorRef}
              className={`transition-all duration-200 ${currentStep !== 'instructor' ? 'opacity-50 pointer-events-none scale-95' : 'scale-100'}`}
            >
              {instructorId && (
                <InstructorReviewBlock
                  instructorId={instructorId}
                  onSubmit={handleInstructorSubmit}
                  onSkip={handleSkip}
                  onBack={handleBack}
                  isActive={currentStep === 'instructor'}
                />
              )}
            </div>

            <div 
              ref={locationRef}
              className={`transition-all duration-200 ${currentStep !== 'location' ? 'opacity-50 pointer-events-none scale-95' : 'scale-100'}`}
            >
              {locationId && (
                <LocationReviewBlock
                  locationId={locationId}
                  onSubmit={handleLocationSubmit}
                  onSkip={handleSkip}
                  onBack={handleBack}
                  isActive={currentStep === 'location'}
                />
              )}
            </div>

            {/* Final Submit Section - Add id for scrolling */}
            <div 
              id="submit-section"
              className={`transition-all duration-500 opacity-100 translate-y-0 ${currentStep === 'submit' ? 'scale-100' : 'scale-95 opacity-50'}`}
            >
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
                    onClick={handleFinalSubmit}
                    disabled={completedSteps.size === 0}
                  >
                    Submit {completedSteps.size > 0 ? `${completedSteps.size} ` : ''}Review{completedSteps.size !== 1 ? 's' : ''}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

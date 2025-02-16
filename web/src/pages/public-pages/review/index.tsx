import { Container } from '@/components/ui/container'
import { Header } from '@/components/domain/header'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { School, User2, Building2, CheckCircle2 } from 'lucide-react'
import { usePublicClass } from '@/lib/api/public'
import { reviewFlowRoute } from '@/router'
import { ClassReviewBlock } from './components/ClassReviewBlock'
import { InstructorReviewBlock } from './components/InstructorReviewBlock'
import { LocationReviewBlock } from './components/LocationReviewBlock'
import { useState, useRef, useEffect } from 'react'
import { ConfirmationModal } from './components/ConfirmationModal'
import { ReviewHeader } from './components/ReviewHeader'
import { ReviewNavigation } from './components/ReviewNavigation'
import { ReviewSubmitSection } from './components/ReviewSubmitSection'

interface ReviewSearchParams {
  classId?: string
  instructorId?: string
  locationId?: string
}

export function ReviewPage() {
  const navigate = useNavigate()
  const { classId, instructorId, locationId } = useSearch({
    from: reviewFlowRoute.id,
  }) as ReviewSearchParams
  const [currentStep, setCurrentStep] = useState<'class' | 'instructor' | 'location' | 'submit'>(
    'class'
  )

  const classRef = useRef<HTMLDivElement>(null)
  const instructorRef = useRef<HTMLDivElement>(null)
  const locationRef = useRef<HTMLDivElement>(null)

  const { data: classDetails } = usePublicClass(classId || '')

  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // Add scroll handler
  const scrollToSection = (sectionId: typeof currentStep) => {
    const refs = {
      class: classRef,
      instructor: instructorRef,
      location: locationRef,
      submit: { current: document.getElementById('submit-section') },
    }

    const targetRef = refs[sectionId]
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  // Update click handler to include scrolling
  const handleStepClick = (stepId: string) => {
    setCurrentStep(stepId as typeof currentStep)
    scrollToSection(stepId as typeof currentStep)
  }

  // Update submit handlers to include scrolling
  const handleClassSubmit = () => {
    setCompletedSteps(prev => new Set([...prev, 'class']))
    setCurrentStep('instructor')
    scrollToSection('instructor')
  }

  const handleInstructorSubmit = () => {
    setCompletedSteps(prev => new Set([...prev, 'instructor']))
    setCurrentStep('location')
    scrollToSection('location')
  }

  const handleLocationSubmit = () => {
    setCompletedSteps(prev => new Set([...prev, 'location']))
    setCurrentStep('submit')
    scrollToSection('submit')
  }

  const handleSkip = () => {
    if (currentStep === 'class') {
      setCurrentStep('instructor')
      scrollToSection('instructor')
    } else if (currentStep === 'instructor') {
      setCurrentStep('location')
      scrollToSection('location')
    }
  }

  const handleBack = () => {
    if (currentStep === 'instructor') {
      setCurrentStep('class')
      scrollToSection('class')
    } else if (currentStep === 'location') {
      setCurrentStep('instructor')
      scrollToSection('instructor')
    }
  }

  const handleFinalSubmit = () => {
    setShowConfirmModal(true)
  }

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false)
    navigate({ to: '/classes/$classId', params: { classId: classId || '' } })
  }

  const steps = [
    {
      id: 'class',
      title: 'Class Review',
      icon: School,
    },
    {
      id: 'instructor',
      title: 'Instructor Review',
      icon: User2,
    },
    {
      id: 'location',
      title: 'Location Review',
      icon: Building2,
    },
    {
      id: 'submit',
      title: 'Submit Reviews',
      icon: CheckCircle2,
    },
  ]

  // Update Intersection Observer to prevent conflicts with manual scrolling
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout
    const options = {
      root: null,
      rootMargin: '-20% 0px -30% 0px',
      threshold: 0.4,
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('data-section-id')
          if (sectionId) {
            // Add a small delay to prevent conflicts with manual scrolling
            clearTimeout(scrollTimeout)
            scrollTimeout = setTimeout(() => {
              setCurrentStep(sectionId as typeof currentStep)
            }, 100)
          }
        }
      })
    }, options)

    const classSection = classRef.current
    const instructorSection = instructorRef.current
    const locationSection = locationRef.current
    const submitSection = document.getElementById('submit-section')

    if (classSection) observer.observe(classSection)
    if (instructorSection) observer.observe(instructorSection)
    if (locationSection) observer.observe(locationSection)
    if (submitSection) observer.observe(submitSection)

    return () => {
      observer.disconnect()
      clearTimeout(scrollTimeout)
    }
  }, []) // Empty dependency array as we only want to set this up once

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <ReviewHeader
        classDetails={classDetails ? { name: classDetails.name } : null}
        completedSteps={completedSteps}
        currentStep={currentStep}
        steps={steps}
      />

      <Container className="relative max-w-[1600px]">
        <div className="py-12">
          <div className="grid grid-cols-1 xl:grid-cols-[280px,1fr] gap-8">
            <ReviewNavigation
              steps={steps}
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={handleStepClick}
            />

            <div className="space-y-8 max-w-4xl">
              {/* Class Review Section */}
              <div
                ref={classRef}
                data-section-id="class"
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

              {/* Instructor Review Section */}
              <div
                ref={instructorRef}
                data-section-id="instructor"
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

              {/* Location Review Section */}
              <div
                ref={locationRef}
                data-section-id="location"
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

              {/* Final Submit Section */}
              <ReviewSubmitSection
                completedSteps={completedSteps}
                onSubmit={handleFinalSubmit}
                isActive={currentStep === 'submit'}
              />
              <div
                id="submit-section"
                data-section-id="submit"
                className={`transition-all duration-500 opacity-100 translate-y-0 ${currentStep === 'submit' ? 'scale-100' : 'scale-95 opacity-50'}`}
              ></div>
            </div>
          </div>
        </div>
      </Container>

      <ConfirmationModal
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        steps={steps}
        completedSteps={completedSteps}
        onConfirm={handleConfirmSubmit}
      />
    </div>
  )
}

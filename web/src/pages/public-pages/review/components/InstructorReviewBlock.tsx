import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ReviewSlider, StarRatingInput, CommentField } from "./ReviewFormComponents"
import { useState } from "react"
import { User2, ChevronLeft } from "lucide-react"

interface InstructorReviewBlockProps {
  onSubmit: () => void
  onSkip: () => void
  onBack: () => void
  instructorId: string
  isActive: boolean
}

interface InstructorReviewForm {
  move_breakdown: number
  individual_approach: number
  posture_correction_ability: number
  communication_and_feedback: number
  patience_and_encouragement: number
  motivation_and_energy: number
  overall_rating: number
  comment: string
}

export function InstructorReviewBlock({ onSubmit, onSkip, onBack, instructorId, isActive }: InstructorReviewBlockProps) {
  const [form, setForm] = useState<InstructorReviewForm>({
    move_breakdown: 0,
    individual_approach: 0,
    posture_correction_ability: 0,
    communication_and_feedback: 0,
    patience_and_encouragement: 0,
    motivation_and_energy: 0,
    overall_rating: 0,
    comment: ""
  })

  const handleSubmit = () => {
    // TODO: Submit form data
    onSubmit()
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <User2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Instructor Review</h2>
          <p className="text-muted-foreground">Evaluate the instructor's teaching style and effectiveness</p>
        </div>
      </div>

      <div className="space-y-8">
        <ReviewSlider
          label="Move Breakdown"
          value={form.move_breakdown}
          onChange={(value) => setForm(prev => ({ ...prev, move_breakdown: value }))}
          leftLabel="Not at all"
          middleLabel="Good"
          rightLabel="Too much details"
          description="How well did the instructor break down complex moves into manageable steps?"
        />

        <ReviewSlider
          label="Individual Approach"
          value={form.individual_approach}
          onChange={(value) => setForm(prev => ({ ...prev, individual_approach: value }))}
          leftLabel="Not at all"
          middleLabel="Good"
          rightLabel="Too much details"
          description="Did the instructor provide appropriate individual attention and corrections?"
        />

        <div className="border-t pt-6 space-y-6">
          <StarRatingInput
            label="Posture Correction Ability"
            value={form.posture_correction_ability}
            onChange={(value) => setForm(prev => ({ ...prev, posture_correction_ability: value }))}
            description="How effectively did the instructor help with posture and technique corrections?"
          />

          <StarRatingInput
            label="Communication and Feedback"
            value={form.communication_and_feedback}
            onChange={(value) => setForm(prev => ({ ...prev, communication_and_feedback: value }))}
            description="How clear and helpful was the instructor's communication and feedback?"
          />

          <StarRatingInput
            label="Patience and Encouragement"
            value={form.patience_and_encouragement}
            onChange={(value) => setForm(prev => ({ ...prev, patience_and_encouragement: value }))}
            description="Did the instructor show patience and provide encouragement throughout the class?"
          />

          <StarRatingInput
            label="Motivation and Energy"
            value={form.motivation_and_energy}
            onChange={(value) => setForm(prev => ({ ...prev, motivation_and_energy: value }))}
            description="How well did the instructor maintain energy and motivation levels?"
          />
        </div>

        <div className="border-t pt-6">
          <StarRatingInput
            label="Overall Rating"
            value={form.overall_rating}
            onChange={(value) => setForm(prev => ({ ...prev, overall_rating: value }))}
            maxStars={5}
            description="Your overall satisfaction with the instructor"
          />
        </div>

        <CommentField
          value={form.comment}
          onChange={(value) => setForm(prev => ({ ...prev, comment: value }))}
          label="Share Your Experience"
          description="Help others understand what to expect from this instructor"
          placeholder="Share your thoughts about the instructor's teaching style, communication, and overall approach..."
        />
      </div>

      <div className="flex justify-between gap-4 mt-8 pt-4 border-t">
        <Button 
          variant="ghost" 
          onClick={onBack}
          disabled={!isActive}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex gap-4">
          <Button variant="outline" onClick={onSkip} disabled={!isActive}>
            Skip
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!isActive || form.overall_rating === 0}
            className="px-8"
          >
            Submit & Continue
          </Button>
        </div>
      </div>
    </Card>
  )
} 
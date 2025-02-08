import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ReviewSlider, StarRatingInput, CommentField } from './ReviewFormComponents'
import { useState } from 'react'
import { School } from 'lucide-react'

interface ClassReviewBlockProps {
  onSubmit: () => void
  onSkip: () => void
  classId: string
  isActive: boolean
}

interface ClassReviewForm {
  group_size: number
  level: number
  engagement: number
  teaching_pace: number
  overall_rating: number
  comment: string
}

export function ClassReviewBlock({ onSubmit, onSkip, isActive }: ClassReviewBlockProps) {
  const [form, setForm] = useState<ClassReviewForm>({
    group_size: 0,
    level: 0,
    engagement: 0,
    teaching_pace: 0,
    overall_rating: 0,
    comment: '',
  })

  const handleSubmit = () => {
    // TODO: Submit form data
    onSubmit()
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <School className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Class Review</h2>
          <p className="text-muted-foreground">
            Share your experience about the class structure and teaching methods
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <ReviewSlider
          label="Group Size"
          value={form.group_size}
          onChange={value => setForm(prev => ({ ...prev, group_size: value }))}
          leftLabel="Too small"
          middleLabel="Perfect"
          rightLabel="Too big"
          description="How would you rate the number of students in the class? Was it too crowded or too empty?"
        />

        <ReviewSlider
          label="Level"
          value={form.level}
          onChange={value => setForm(prev => ({ ...prev, level: value }))}
          leftLabel="Too easy"
          middleLabel="Perfect"
          rightLabel="Too hard"
          description="Was the class level appropriate for you? Did you feel challenged or was it too basic?"
        />

        <ReviewSlider
          label="Engagement"
          value={form.engagement}
          onChange={value => setForm(prev => ({ ...prev, engagement: value }))}
          leftLabel="Not engaged"
          middleLabel="Perfect"
          rightLabel="Too engaged"
          description="How engaging was the class? Were you able to stay focused and motivated throughout?"
        />

        <ReviewSlider
          label="Teaching Pace"
          value={form.teaching_pace}
          onChange={value => setForm(prev => ({ ...prev, teaching_pace: value }))}
          leftLabel="Too slow"
          middleLabel="Perfect"
          rightLabel="Too fast"
          description="How was the teaching pace? Could you follow along comfortably?"
        />

        <div className="border-t pt-6">
          <StarRatingInput
            label="Overall Rating"
            value={form.overall_rating}
            onChange={value => setForm(prev => ({ ...prev, overall_rating: value }))}
            maxStars={5}
            description="Your overall satisfaction with the class experience"
          />
        </div>

        <CommentField
          value={form.comment}
          onChange={value => setForm(prev => ({ ...prev, comment: value }))}
          label="Share Your Experience"
          description="Help others understand what to expect from this class"
          placeholder="Share your thoughts about the class structure, teaching methods, and overall experience..."
        />
      </div>

      <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
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
    </Card>
  )
}

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ReviewSlider, StarRatingInput, CommentField } from './ReviewFormComponents'
import { useState } from 'react'
import { Building2, ChevronLeft } from 'lucide-react'

interface LocationReviewBlockProps {
  onSubmit: () => void
  onSkip: () => void
  onBack: () => void
  locationId: string
  isActive: boolean
}

interface LocationReviewForm {
  cleanness: number
  general_look: number
  acustic_quality: number
  additional_facilities: number
  temperature: number
  lighting: number
  overall_rating: number
  comment: string
}

export function LocationReviewBlock({
  onSubmit,
  onSkip,
  onBack,
  locationId,
  isActive,
}: LocationReviewBlockProps) {
  const [form, setForm] = useState<LocationReviewForm>({
    cleanness: 0,
    general_look: 0,
    acustic_quality: 0,
    additional_facilities: 0,
    temperature: 0,
    lighting: 0,
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
          <Building2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Location Review</h2>
          <p className="text-muted-foreground">
            Rate the facilities and comfort of the dance studio
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-6">
          <StarRatingInput
            label="Cleanness"
            value={form.cleanness}
            onChange={value => setForm(prev => ({ ...prev, cleanness: value }))}
            description="How clean and well-maintained are the facilities?"
          />

          <StarRatingInput
            label="General Look"
            value={form.general_look}
            onChange={value => setForm(prev => ({ ...prev, general_look: value }))}
            description="How would you rate the overall appearance and atmosphere?"
          />

          <StarRatingInput
            label="Acoustic Quality"
            value={form.acustic_quality}
            onChange={value => setForm(prev => ({ ...prev, acustic_quality: value }))}
            description="How is the sound quality and music system in the studio?"
          />

          <StarRatingInput
            label="Additional Facilities"
            value={form.additional_facilities}
            onChange={value => setForm(prev => ({ ...prev, additional_facilities: value }))}
            description="How would you rate the changing rooms, waiting area, and other amenities?"
          />
        </div>

        <div className="border-t pt-6 space-y-6">
          <ReviewSlider
            label="Temperature"
            value={form.temperature}
            onChange={value => setForm(prev => ({ ...prev, temperature: value }))}
            leftLabel="Too cold"
            middleLabel="Perfect"
            rightLabel="Too hot"
            description="How comfortable was the temperature during your class?"
          />

          <ReviewSlider
            label="Lighting"
            value={form.lighting}
            onChange={value => setForm(prev => ({ ...prev, lighting: value }))}
            leftLabel="Too dark"
            middleLabel="Perfect"
            rightLabel="Too bright"
            description="How would you rate the lighting conditions?"
          />
        </div>

        <div className="border-t pt-6">
          <StarRatingInput
            label="Overall Rating"
            value={form.overall_rating}
            onChange={value => setForm(prev => ({ ...prev, overall_rating: value }))}
            maxStars={5}
            description="Your overall satisfaction with the facilities"
          />
        </div>

        <CommentField
          value={form.comment}
          onChange={value => setForm(prev => ({ ...prev, comment: value }))}
          label="Share Your Experience"
          description="Help others understand what to expect from this location"
          placeholder="Share your thoughts about the facilities, comfort, and overall experience..."
        />
      </div>

      <div className="flex justify-between gap-4 mt-8 pt-4 border-t">
        <Button variant="ghost" onClick={onBack} disabled={!isActive} className="gap-2">
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
            Submit & Finish
          </Button>
        </div>
      </div>
    </Card>
  )
}

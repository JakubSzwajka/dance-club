import { StarIcon } from '@heroicons/react/24/solid'
import { cn } from '@/lib/utils'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface ReviewSliderProps {
  value: number
  onChange: (value: number) => void
  label: string
  leftLabel: string
  rightLabel: string
  middleLabel: string
  description?: string
  className?: string
}

export function ReviewSlider({
  value,
  onChange,
  label,
  leftLabel,
  rightLabel,
  middleLabel,
  description,
  className,
}: ReviewSliderProps) {
  // Convert -10 to 10 range to 0 to 100 for the slider
  const sliderValue = ((value + 10) / 20) * 100

  // Convert slider value (0-100) back to -10 to 10 range
  const handleSliderChange = (newValue: number[]) => {
    const normalizedValue = (newValue[0] / 100) * 20 - 10
    onChange(normalizedValue)
  }

  // Calculate color based on distance from 0
  const absValue = Math.abs(value)
  const color = absValue <= 2 ? 'bg-green-500' : absValue <= 5 ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <div className={cn('space-y-2', className)}>
      <div className="space-y-1">
        <Label className="text-base">{label}</Label>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="relative pt-6">
        {/* <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-sm font-medium text-muted-foreground">
          {value.toFixed(1)}
        </div> */}
        <Slider
          value={[sliderValue]}
          onValueChange={handleSliderChange}
          max={100}
          step={1}
          className={cn('relative', color)}
        />
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{leftLabel}</span>
        <span>{middleLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  )
}

interface StarRatingInputProps {
  value: number
  onChange: (value: number) => void
  label: string
  description?: string
  maxStars?: number
  className?: string
}

export function StarRatingInput({
  value,
  onChange,
  label,
  description,
  maxStars = 10,
  className,
}: StarRatingInputProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="space-y-1">
        <Label className="text-base">{label}</Label>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: maxStars }).map((_, i) => (
            <StarIcon
              key={i}
              className={cn(
                'h-6 w-6 cursor-pointer transition-colors',
                i < value ? 'text-yellow-500' : 'text-muted hover:text-yellow-200'
              )}
              onClick={() => onChange(i + 1)}
            />
          ))}
        </div>
        {value > 0 && (
          <div className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            {value} / {maxStars}
          </div>
        )}
      </div>
    </div>
  )
}

interface CommentFieldProps {
  value: string
  onChange: (value: string) => void
  label?: string
  description?: string
  placeholder?: string
  className?: string
}

export function CommentField({
  value,
  onChange,
  label = 'Additional Comments',
  description,
  placeholder = 'Share your thoughts and experience...',
  className,
}: CommentFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="space-y-1">
        <Label className="text-base">{label}</Label>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <Textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[100px]"
      />
      <div className="text-sm text-muted-foreground">{value.length} / 1000 characters</div>
    </div>
  )
}

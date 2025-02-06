import { cn } from '@/lib/utils'

type Role = 'student' | 'instructor'

interface RoleToggleProps {
  value: Role
  onChange: (value: Role) => void
  className?: string
}

export function RoleToggle({ value, onChange, className }: RoleToggleProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg', className)}>
      <button
        type="button"
        onClick={() => onChange('student')}
        className={cn(
          'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
          value === 'student'
            ? 'bg-white text-primary shadow-sm'
            : 'hover:bg-white/50 text-muted-foreground'
        )}
      >
        Take dance classes
      </button>
      <button
        type="button"
        onClick={() => onChange('instructor')}
        className={cn(
          'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
          value === 'instructor'
            ? 'bg-white text-primary shadow-sm'
            : 'hover:bg-white/50 text-muted-foreground'
        )}
      >
        Teach dance classes
      </button>
    </div>
  )
}

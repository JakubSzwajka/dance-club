'use client'

import * as React from 'react'
import { Clock } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'

interface TimePickerProps {
  time?: string
  onChange?: (time: string) => void
  name?: string
}

export function TimePicker({ time, onChange, name }: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (onChange) {
      onChange(value)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !time && 'text-muted-foreground'
          )}
          name={name}
        >
          <Clock className="mr-2 h-4 w-4" />
          {time ? time : <span>Pick a time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="space-y-2">
          <Input type="time" value={time} onChange={handleTimeChange} className="w-[120px]" />
        </div>
      </PopoverContent>
    </Popover>
  )
}

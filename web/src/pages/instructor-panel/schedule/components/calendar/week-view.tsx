import * as React from 'react'
import { addDays, startOfWeek, endOfWeek, format, isToday } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MapPinIcon, ClockIcon, UsersIcon } from 'lucide-react'

// Reuse the mock data from month-view
import { mockClasses } from './mock-data.ts'

type WeekViewProps = {
  currentDate: Date
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)

export function WeekView({ currentDate }: WeekViewProps) {
  const [selectedSlot, setSelectedSlot] = React.useState<{ day: Date; hour: number } | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

  // Get the start and end dates for the week
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })

  // Generate array of dates for the week
  const weekDays: Date[] = []
  let currentDay = weekStart
  while (currentDay <= weekEnd) {
    weekDays.push(currentDay)
    currentDay = addDays(currentDay, 1)
  }

  // Function to get classes for a specific day and hour
  const getClassesForTimeSlot = (date: Date, hour: number) => {
    // Only show classes on weekdays
    if (date.getDay() === 0 || date.getDay() === 6) {
      return []
    }

    return mockClasses
      .filter((class_: any) => {
        const [startHour] = class_.time.split(' - ')[0].split(':')
        return parseInt(startHour) === hour
      })
      .sort(() => Math.random() - 0.5)
      .slice(0, 1) // Show only one class per slot for simplicity
  }

  const handleSlotClick = (day: Date, hour: number) => {
    setSelectedSlot({ day, hour })
    setIsDrawerOpen(true)
  }

  const selectedSlotClasses = selectedSlot
    ? getClassesForTimeSlot(selectedSlot.day, selectedSlot.hour)
    : []

  return (
    <>
      <div className="grid grid-cols-8 gap-px bg-muted">
        {/* Time column */}
        <div className="bg-background">
          <div className="h-10" /> {/* Empty cell for alignment */}
          {HOURS.map(hour => (
            <div key={hour} className="h-20 border-t p-2 text-sm text-muted-foreground">
              {format(new Date().setHours(hour), 'ha')}
            </div>
          ))}
        </div>

        {/* Days columns */}
        {weekDays.map(day => (
          <div key={day.toISOString()} className="bg-background">
            <div className="h-10 p-2 text-center">
              <div className="font-medium">{format(day, 'EEE')}</div>
              <div
                className={`text-sm ${isToday(day) ? 'text-primary font-bold' : 'text-muted-foreground'}`}
              >
                {format(day, 'd')}
              </div>
            </div>
            {HOURS.map(hour => {
              const classes = getClassesForTimeSlot(day, hour)
              return (
                <div
                  key={hour}
                  className="h-20 border-t p-1 hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleSlotClick(day, hour)}
                >
                  {classes.map((class_: any) => (
                    <div
                      key={class_.id}
                      className={`text-xs p-1 rounded truncate h-full
                        ${
                          class_.type === 'private'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-primary/10 text-primary dark:bg-primary/30'
                        }`}
                    >
                      <div className="font-medium truncate">{class_.name}</div>
                      <div className="text-[10px] opacity-80">{class_.time}</div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-4xl">
            <DrawerHeader>
              <DrawerTitle>
                Classes for {selectedSlot ? format(selectedSlot.day, 'EEEE, MMMM d') : ''} at{' '}
                {selectedSlot ? format(new Date().setHours(selectedSlot.hour), 'ha') : ''}
              </DrawerTitle>
              <DrawerDescription>{selectedSlotClasses.length} classes scheduled</DrawerDescription>
            </DrawerHeader>
            <ScrollArea className="h-[50vh] px-4">
              <div className="space-y-4 pb-4">
                {selectedSlotClasses.map((class_: any) => (
                  <div
                    key={class_.id}
                    className={`p-4 rounded-lg border
                      ${
                        class_.type === 'private'
                          ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-900/20'
                          : 'bg-primary/5 border-primary/10'
                      }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{class_.name}</h3>
                        <p className="text-sm text-muted-foreground">{class_.description}</p>
                      </div>
                      <div
                        className={`px-2 py-1 rounded text-xs font-medium
                        ${
                          class_.type === 'private'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {class_.type}
                      </div>
                    </div>
                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{class_.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{class_.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UsersIcon className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {class_.enrolled}/{class_.capacity} students
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm font-medium">Instructor: {class_.instructor}</div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <DrawerFooter>
              <Button onClick={() => setIsDrawerOpen(false)}>Close</Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}

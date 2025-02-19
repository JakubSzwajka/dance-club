import * as React from "react"
import { addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, format, isSameMonth, isToday } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPinIcon, ClockIcon, UsersIcon } from "lucide-react"

// Mock data for example classes
const mockClasses = [
  {
    id: "1",
    name: "Salsa Beginners",
    time: "18:00 - 19:30",
    location: "Studio A",
    type: "group",
    instructor: "John Doe",
    enrolled: 12,
    capacity: 20,
    description: "Perfect introduction to Salsa dancing. Learn the basic steps, rhythm, and essential moves.",
  },
  {
    id: "2",
    name: "Bachata Intermediate",
    time: "19:45 - 21:15",
    location: "Studio B",
    type: "group",
    instructor: "Maria Garcia",
    enrolled: 15,
    capacity: 18,
    description: "Advance your Bachata skills with more complex patterns and styling techniques.",
  },
  {
    id: "3",
    name: "Private Lesson",
    time: "17:00 - 18:00",
    location: "Studio C",
    type: "private",
    instructor: "Alex Smith",
    enrolled: 1,
    capacity: 1,
    description: "One-on-one instruction tailored to your specific needs and goals.",
  },
  {
    id: "4",
    name: "Salsa Advanced",
    time: "20:00 - 21:30",
    location: "Studio A",
    type: "group",
    instructor: "Carlos Rodriguez",
    enrolled: 8,
    capacity: 15,
    description: "Advanced patterns, styling, and musicality for experienced dancers.",
  },
  {
    id: "5",
    name: "Kizomba Beginners",
    time: "18:30 - 20:00",
    location: "Studio D",
    type: "group",
    instructor: "Ana Silva",
    enrolled: 10,
    capacity: 16,
    description: "Introduction to Kizomba fundamentals and basic movements.",
  },
]

type MonthViewProps = {
  currentDate: Date
}

export function MonthView({ currentDate }: MonthViewProps) {
  const [selectedDay, setSelectedDay] = React.useState<Date | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

  // Get the start and end dates for the calendar grid
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  // Generate array of dates for the calendar
  const calendarDays: Date[] = []
  let currentDay = calendarStart
  while (currentDay <= calendarEnd) {
    calendarDays.push(currentDay)
    currentDay = addDays(currentDay, 1)
  }

  // Function to get classes for a day (for demo purposes)
  const getClassesForDay = (date: Date) => {
    // Only show classes on weekdays and within the current month
    if (date.getDay() === 0 || date.getDay() === 6 || !isSameMonth(date, currentDate)) {
      return []
    }
    // Randomly select 2-5 classes
    return mockClasses
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 4) + 2)
  }

  const handleDayClick = (day: Date) => {
    setSelectedDay(day)
    setIsDrawerOpen(true)
  }

  const selectedDayClasses = selectedDay ? getClassesForDay(selectedDay) : []
  const MAX_VISIBLE_CLASSES = 2

  return (
    <>
      <div className="grid grid-cols-7 gap-px bg-muted">
        {/* Week day headers */}
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div
            key={day}
            className="h-10 bg-background p-2 text-center text-sm font-medium"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((day, index) => {
          const dayClasses = getClassesForDay(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isCurrentDay = isToday(day)
          const hasMoreClasses = dayClasses.length > MAX_VISIBLE_CLASSES

          return (
            <div
              key={index}
              className={`min-h-[120px] bg-background p-2 cursor-pointer hover:bg-muted/50 transition-colors relative
                ${!isCurrentMonth ? "text-muted-foreground" : ""}
                ${selectedDay && day.toDateString() === selectedDay.toDateString() 
                  ? "bg-blue-50 dark:bg-blue-950/20 shadow-[inset_0_0_12px_rgba(59,130,246,0.2)]" 
                  : ""
                }
              `}
              onClick={() => handleDayClick(day)}
            >
              <div className="flex justify-between items-center mb-1">
                <span
                  className={`text-sm inline-flex items-center justify-center
                    ${isCurrentDay 
                      ? "font-bold text-lg text-blue-600 dark:text-blue-400"
                      : ""
                    }`}
                >
                  {format(day, "d")}
                </span>
                {dayClasses.length > 0 && isCurrentMonth && (
                  <span className="text-xs text-muted-foreground">
                    {dayClasses.length} classes
                  </span>
                )}
              </div>
              <div className="space-y-1">
                {dayClasses.slice(0, MAX_VISIBLE_CLASSES).map((class_) => (
                  <div
                    key={class_.id}
                    className={`text-xs p-1 rounded truncate
                      ${class_.type === "private" 
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-primary/10 text-primary dark:bg-primary/30"
                      }`}
                  >
                    <div className="font-medium truncate">{class_.name}</div>
                    <div className="text-[10px] opacity-80">{class_.time}</div>
                  </div>
                ))}
                {hasMoreClasses && (
                  <div className="text-xs text-muted-foreground text-center">
                    {dayClasses.length - MAX_VISIBLE_CLASSES} more...
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-4xl">
            <DrawerHeader>
              <DrawerTitle>
                Classes for {selectedDay ? format(selectedDay, "EEEE, MMMM d, yyyy") : ""}
              </DrawerTitle>
              <DrawerDescription>
                {selectedDayClasses.length} classes scheduled
              </DrawerDescription>
            </DrawerHeader>
            <ScrollArea className="h-[50vh] px-4">
              <div className="space-y-4 pb-4">
                {selectedDayClasses.map((class_) => (
                  <div
                    key={class_.id}
                    className={`p-4 rounded-lg border
                      ${class_.type === "private"
                        ? "bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-900/20"
                        : "bg-primary/5 border-primary/10"
                      }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{class_.name}</h3>
                        <p className="text-sm text-muted-foreground">{class_.description}</p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium
                        ${class_.type === "private"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-primary/10 text-primary"
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
                        <span>{class_.enrolled}/{class_.capacity} students</span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm font-medium">
                      Instructor: {class_.instructor}
                    </div>
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
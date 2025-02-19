import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { PlusIcon, XIcon } from "lucide-react"

export type ScheduleItem = {
  id: string
  day: string
  startTime: string
  endTime: string
}

type ScheduleSelectorProps = {
  value: ScheduleItem[]
  onChange: (schedule: ScheduleItem[]) => void
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

export function ScheduleSelector({ value, onChange }: ScheduleSelectorProps) {
  const addScheduleItem = () => {
    const newItem: ScheduleItem = {
      id: Math.random().toString(36).substring(7),
      day: "",
      startTime: "",
      endTime: "",
    }
    onChange([...value, newItem])
  }

  const removeScheduleItem = (id: string) => {
    onChange(value.filter((item) => item.id !== id))
  }

  const updateScheduleItem = (id: string, field: keyof ScheduleItem, newValue: string) => {
    onChange(
      value.map((item) =>
        item.id === id ? { ...item, [field]: newValue } : item
      )
    )
  }

  return (
    <div className="space-y-4">
      {value.map((item) => (
        <div key={item.id} className="flex items-center gap-4">
          <Select
            value={item.day}
            onValueChange={(newValue) =>
              updateScheduleItem(item.id, "day", newValue)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              {DAYS_OF_WEEK.map((day) => (
                <SelectItem key={day} value={day.toLowerCase()}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Input
              type="time"
              value={item.startTime}
              onChange={(e) =>
                updateScheduleItem(item.id, "startTime", e.target.value)
              }
              className="w-[120px]"
            />
            <span>to</span>
            <Input
              type="time"
              value={item.endTime}
              onChange={(e) =>
                updateScheduleItem(item.id, "endTime", e.target.value)
              }
              className="w-[120px]"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeScheduleItem(item.id)}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addScheduleItem}
        className="mt-2"
      >
        <PlusIcon className="mr-2 h-4 w-4" />
        Add Schedule
      </Button>
    </div>
  )
} 
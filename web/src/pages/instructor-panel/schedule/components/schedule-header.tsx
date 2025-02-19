import * as React from "react"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

export function ScheduleHeader() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-medium">Schedule</h3>
        <p className="text-sm text-muted-foreground">
          Manage your classes and appointments
        </p>
      </div>
      <Button>
        <PlusIcon className="mr-2 h-4 w-4" />
        Add Event
      </Button>
    </div>
  )
} 
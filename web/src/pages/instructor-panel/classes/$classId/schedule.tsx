import { useParams } from "@tanstack/react-router"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScheduleSelector } from "@/components/schedule/schedule-selector"
import { WeeklyScheduleDisplay } from "@/components/schedule/weekly-schedule-display"

const scheduleFormSchema = z.object({
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
  schedule: z.array(
    z.object({
      id: z.string(),
      day: z.string(),
      startTime: z.string(),
      endTime: z.string(),
    })
  ),
})

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>

// Mock data - in real app this would come from API
const defaultValues: ScheduleFormValues = {
  startDate: "2024-02-01",
  endDate: "2024-05-31",
  schedule: [
    {
      id: "1",
      day: "monday",
      startTime: "18:00",
      endTime: "19:30",
    },
    {
      id: "2",
      day: "wednesday",
      startTime: "19:00",
      endTime: "20:30",
    },
  ],
}

export function ClassSchedulePage() {
  const { classId } = useParams({from: "/instructor-panel/instructor-panel/classes/$classId/schedule"})
  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues,
  })

  function onSubmit(data: ScheduleFormValues) {
    console.log("Updating schedule for class:", classId, data)
    // TODO: Handle form submission
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Class Schedule</h3>
        <p className="text-sm text-muted-foreground">
          Manage the schedule for this class
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Settings</CardTitle>
              <CardDescription>
                Set the class duration and weekly schedule
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>
                        When the class starts
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>
                        When the class ends
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="schedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weekly Schedule</FormLabel>
                    <FormControl>
                      <ScheduleSelector
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Set the weekly recurring schedule
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schedule Preview</CardTitle>
              <CardDescription>
                Preview how your schedule will look
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WeeklyScheduleDisplay
                schedule={form.watch("schedule")}
                startDate={new Date(form.watch("startDate"))}
                endDate={new Date(form.watch("endDate"))}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => history.back()}
            >
              Cancel
            </Button>
            <Button type="submit">Save Schedule</Button>
          </div>
        </form>
      </Form>
    </div>
  )
} 
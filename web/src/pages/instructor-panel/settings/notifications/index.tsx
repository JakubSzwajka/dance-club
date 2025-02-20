import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  remindersBefore: z.string(),
  newStudentNotifications: z.boolean(),
  reviewNotifications: z.boolean(),
  marketingEmails: z.boolean(),
})

type NotificationSettingsValues = z.infer<typeof notificationSettingsSchema>

const defaultValues: Partial<NotificationSettingsValues> = {
  emailNotifications: true,
  smsNotifications: true,
  remindersBefore: "60",
  newStudentNotifications: true,
  reviewNotifications: true,
  marketingEmails: false,
}

export function NotificationSettings() {
  const form = useForm<NotificationSettingsValues>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues,
  })

  function onSubmit(data: NotificationSettingsValues) {
    console.log(data)
    // TODO: Handle form submission
  }

  return (
    <div className="space-y-6">
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Separator />
              {/* Communication Channels Section */}
              <div className="grid grid-cols-5 gap-6">
                <div className="col-span-2">
                  <h4 className="text-sm font-medium">Communication Channels</h4>
                  <p className="text-sm text-muted-foreground">
                    Choose how you want to be notified
                  </p>
                </div>
                <div className="col-span-3 space-y-4">
                  <FormField
                    control={form.control}
                    name="emailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Email Notifications
                          </FormLabel>
                          <FormDescription>
                            Receive notifications via email
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="smsNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            SMS Notifications
                          </FormLabel>
                          <FormDescription>
                            Receive notifications via SMS
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Class Notifications Section */}
              <div className="grid grid-cols-5 gap-6">
                <div className="col-span-2">
                  <h4 className="text-sm font-medium">Class Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Settings for class-related notifications
                  </p>
                </div>
                <div className="col-span-3 space-y-4">
                  <FormField
                    control={form.control}
                    name="remindersBefore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class Reminders</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select reminder time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="30">30 minutes before</SelectItem>
                            <SelectItem value="60">1 hour before</SelectItem>
                            <SelectItem value="120">2 hours before</SelectItem>
                            <SelectItem value="1440">24 hours before</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          When to send class reminders
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="newStudentNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            New Student Notifications
                          </FormLabel>
                          <FormDescription>
                            Get notified when new students join your class
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Other Notifications Section */}
              <div className="grid grid-cols-5 gap-6">
                <div className="col-span-2">
                  <h4 className="text-sm font-medium">Other Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Additional notification preferences
                  </p>
                </div>
                <div className="col-span-3 space-y-4">
                  <FormField
                    control={form.control}
                    name="reviewNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Review Notifications
                          </FormLabel>
                          <FormDescription>
                            Get notified when you receive new reviews
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="marketingEmails"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Marketing Emails
                          </FormLabel>
                          <FormDescription>
                            Receive marketing and promotional emails
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
} 
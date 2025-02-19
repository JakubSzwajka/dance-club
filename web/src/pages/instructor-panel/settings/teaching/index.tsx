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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const teachingSettingsSchema = z.object({
  experienceLevel: z.enum(["beginner", "intermediate", "advanced", "all"]),
  maxStudentsPerClass: z.string(),
  preferredDanceStyles: z.string(),
  teachingExperience: z.string(),
  certifications: z.string(),
  specialties: z.string(),
  classFormat: z.enum(["group", "private", "both"]),
  pricePerHour: z.string(),
})

type TeachingSettingsValues = z.infer<typeof teachingSettingsSchema>

const defaultValues: Partial<TeachingSettingsValues> = {
  experienceLevel: "all",
  maxStudentsPerClass: "20",
  preferredDanceStyles: "Salsa, Bachata",
  teachingExperience: "10 years",
  certifications: "International Dance Teachers Association (IDTA)",
  specialties: "Salsa on1, Bachata Sensual",
  classFormat: "both",
  pricePerHour: "50",
}

export function TeachingSettings() {
  const form = useForm<TeachingSettingsValues>({
    resolver: zodResolver(teachingSettingsSchema),
    defaultValues,
  })

  function onSubmit(data: TeachingSettingsValues) {
    console.log(data)
    // TODO: Handle form submission
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Teaching Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Configure your teaching style and class preferences
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Teaching Profile</CardTitle>
              <CardDescription>
                Set up your teaching profile and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="experienceLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Teaching Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="all">All Levels</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="maxStudentsPerClass"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Students per Class</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pricePerHour"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per Hour ($)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="classFormat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Format</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="group">Group Classes Only</SelectItem>
                        <SelectItem value="private">Private Classes Only</SelectItem>
                        <SelectItem value="both">Both Group and Private</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredDanceStyles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Dance Styles</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Salsa, Bachata" {...field} />
                    </FormControl>
                    <FormDescription>
                      Separate styles with commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialties"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialties</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Salsa on1, Bachata Sensual" {...field} />
                    </FormControl>
                    <FormDescription>
                      List your dance specialties
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teachingExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teaching Experience</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your teaching experience..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="certifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certifications</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List your dance teaching certifications..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Form>
    </div>
  )
} 
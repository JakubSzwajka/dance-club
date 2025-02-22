import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const classFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  type: z.enum(['group', 'private', 'workshop']),
  capacity: z.string().min(1, {
    message: 'Please enter the class capacity.',
  }),
  price: z.string().min(1, {
    message: 'Please enter the class price.',
  }),
  duration: z.string().min(1, {
    message: 'Please enter the class duration.',
  }),
  location: z.string().min(1, {
    message: 'Please enter the class location.',
  }),
})

type ClassFormValues = z.infer<typeof classFormSchema>

const defaultValues: Partial<ClassFormValues> = {
  name: '',
  description: '',
  level: 'beginner',
  type: 'group',
  capacity: '20',
  price: '25',
  duration: '60',
  location: '',
}

export function CreateClassPage() {
  const navigate = useNavigate()
  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues,
  })

  function onSubmit(data: ClassFormValues) {
    console.log(data)
    // TODO: Handle form submission
    // navigate({ to: "/instructor-panel/classes" })
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Class Details</CardTitle>
              <CardDescription>Enter the details of your new class</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Separator />
              {/* Basic Information Section */}
              <div className="grid grid-cols-5 gap-6">
                <div className="col-span-2">
                  <h4 className="text-sm font-medium">Basic Information</h4>
                  <p className="text-sm text-muted-foreground">The core details of your class</p>
                </div>
                <div className="col-span-3 space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Salsa Beginners" {...field} />
                        </FormControl>
                        <FormDescription>The name of your dance class</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your class..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a detailed description of what students will learn
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Class Type Section */}
              <div className="grid grid-cols-5 gap-6">
                <div className="col-span-2">
                  <h4 className="text-sm font-medium">Class Type & Level</h4>
                  <p className="text-sm text-muted-foreground">
                    Define the format and skill level of your class
                  </p>
                </div>
                <div className="col-span-3 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Level</FormLabel>
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
                            </SelectContent>
                          </Select>
                          <FormDescription>The skill level required for this class</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="group">Group Class</SelectItem>
                              <SelectItem value="private">Private Class</SelectItem>
                              <SelectItem value="workshop">Workshop</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>The format of the class</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Class Details Section */}
              <div className="grid grid-cols-5 gap-6">
                <div className="col-span-2">
                  <h4 className="text-sm font-medium">Class Details</h4>
                  <p className="text-sm text-muted-foreground">
                    Set capacity, pricing, and duration
                  </p>
                </div>
                <div className="col-span-3 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacity</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormDescription>Maximum students</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} />
                          </FormControl>
                          <FormDescription>Price per class</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (min)</FormLabel>
                          <FormControl>
                            <Input type="number" min="15" step="15" {...field} />
                          </FormControl>
                          <FormDescription>Class length</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Studio A" {...field} />
                        </FormControl>
                        <FormDescription>Where the class will be held</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: '/instructor-panel/classes' })}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Class</Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}

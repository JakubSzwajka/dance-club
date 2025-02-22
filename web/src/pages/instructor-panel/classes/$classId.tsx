import * as React from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CalendarIcon, MapPinIcon, UsersIcon, ClockIcon } from 'lucide-react'
import { WeeklyScheduleDisplay } from '@/components/schedule/weekly-schedule-display'

// Mock data - in real app this would come from API
const classDetails = {
  id: '1',
  name: 'Salsa Beginners',
  description:
    'Perfect introduction to Salsa dancing. Learn the basic steps, rhythm, and essential moves.',
  level: 'Beginner',
  type: 'Group',
  location: 'Studio A',
  capacity: 20,
  enrolled: 15,
  status: 'Active',
  price: 25,
  duration: 90,
  instructor: {
    id: '1',
    name: 'John Doe',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  },
  students: [
    {
      id: '1',
      name: 'Alice Smith',
      email: 'alice@example.com',
      joinedDate: '2024-01-15',
      attendance: '85%',
    },
    {
      id: '2',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      joinedDate: '2024-01-20',
      attendance: '90%',
    },
  ],
  upcomingClasses: [
    {
      id: '1',
      date: '2024-02-19',
      time: '18:00 - 19:30',
      confirmedStudents: 12,
      status: 'Scheduled',
    },
    {
      id: '2',
      date: '2024-02-26',
      time: '18:00 - 19:30',
      confirmedStudents: 10,
      status: 'Scheduled',
    },
  ],
  startDate: new Date('2024-02-01'),
  endDate: new Date('2024-05-31'),
  schedule: [
    {
      id: '1',
      day: 'monday',
      startTime: '18:00',
      endTime: '19:30',
    },
    {
      id: '2',
      day: 'wednesday',
      startTime: '19:00',
      endTime: '20:30',
    },
  ],
}

export function ClassDetailsPage() {
  const { classId } = useParams({ from: '/instructor-panel/instructor-panel/classes/$classId' })
  const [activeTab, setActiveTab] = React.useState('overview')

  // In real app, fetch class details based on classId
  React.useEffect(() => {
    console.log('Fetch class details for ID:', classId)
  }, [classId])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">{classDetails.name}</h3>
          <p className="text-sm text-muted-foreground">Manage class details and students</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/instructor-panel/classes/$classId/edit" params={{ classId }}>
              Edit Class Details
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/instructor-panel/classes/$classId/schedule" params={{ classId }}>
              Manage Schedule
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Class Information</CardTitle>
            <CardDescription>Basic details about the class</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm font-medium">Level</div>
                <div className="text-sm text-muted-foreground">{classDetails.level}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Type</div>
                <div className="text-sm text-muted-foreground">{classDetails.type}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Price</div>
                <div className="text-sm text-muted-foreground">${classDetails.price} per class</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Duration</div>
                <div className="text-sm text-muted-foreground">{classDetails.duration} minutes</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Description</div>
              <div className="text-sm text-muted-foreground">{classDetails.description}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Current class statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 rounded-lg border p-3">
                <UsersIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Students</div>
                  <div className="text-2xl font-bold">
                    {classDetails.enrolled}/{classDetails.capacity}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border p-3">
                <ClockIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Duration</div>
                  <div className="text-2xl font-bold">{classDetails.duration}m</div>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border p-3">
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Schedule</div>
                  <div className="text-sm font-medium">Monday 18:00</div>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border p-3">
                <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Location</div>
                  <div className="text-sm font-medium">{classDetails.location}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <CardHeader>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="overview" className="space-y-4">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">About this Class</h4>
                <p className="text-sm text-muted-foreground">{classDetails.description}</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Class Schedule</h4>
                    <div className="rounded-lg border p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Day</span>
                          <span className="text-sm font-medium">Monday</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Time</span>
                          <span className="text-sm font-medium">18:00 - 19:30</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Location</span>
                          <span className="text-sm font-medium">{classDetails.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Instructor</h4>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={classDetails.instructor.image}
                          alt={classDetails.instructor.name}
                          className="h-12 w-12 rounded-full"
                        />
                        <div>
                          <div className="font-medium">{classDetails.instructor.name}</div>
                          <div className="text-sm text-muted-foreground">Lead Instructor</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schedule">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium">Class Schedule</h4>
                    <p className="text-sm text-muted-foreground">
                      Weekly recurring schedule for this class
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/instructor-panel/classes/$classId/schedule" params={{ classId }}>
                      Edit Schedule
                    </Link>
                  </Button>
                </div>

                <WeeklyScheduleDisplay
                  schedule={classDetails.schedule}
                  startDate={classDetails.startDate}
                  endDate={classDetails.endDate}
                />

                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-4">Upcoming Sessions</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {classDetails.upcomingClasses.map(session => (
                        <TableRow key={session.id}>
                          <TableCell className="font-medium">{session.date}</TableCell>
                          <TableCell>{session.time}</TableCell>
                          <TableCell>{session.confirmedStudents} confirmed</TableCell>
                          <TableCell>
                            <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-700">
                              {session.status}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Manage
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="students">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classDetails.students.map(student => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.joinedDate}</TableCell>
                      <TableCell>{student.attendance}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View Profile
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  )
}

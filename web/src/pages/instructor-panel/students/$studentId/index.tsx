import * as React from 'react'
import { useParams } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Mail as EnvelopeIcon, Phone as PhoneIcon } from 'lucide-react'

// Mock data - in real app this would come from API
const studentDetails = {
  id: '1',
  name: 'Alice Smith',
  email: 'alice@example.com',
  avatar: '/avatars/alice.jpg',
  joinedDate: '2023-09-15',
  totalClasses: 45,
  activeClasses: 2,
  shareContact: true,
  phone: '+1 (555) 000-0000',
  lastActive: '2024-02-15',
  preferredStyles: ['Salsa', 'Bachata'],
  level: 'intermediate',
  notes: 'Excellent progress in Salsa. Shows natural rhythm and dedication.',
  attendance: '85%',
  upcomingClasses: [
    {
      id: '1',
      name: 'Salsa Intermediate',
      date: '2024-02-20',
      time: '18:00',
      instructor: 'John Doe',
    },
    {
      id: '2',
      name: 'Bachata Beginners',
      date: '2024-02-22',
      time: '19:30',
      instructor: 'Maria Garcia',
    },
  ],
  classHistory: [
    {
      id: '1',
      name: 'Salsa Beginners',
      date: '2024-02-15',
      attendance: 'Attended',
      instructor: 'John Doe',
      notes: 'Great participation',
    },
    {
      id: '2',
      name: 'Bachata Beginners',
      date: '2024-02-13',
      attendance: 'Missed',
      instructor: 'Maria Garcia',
      notes: 'Notified in advance',
    },
  ],
  progress: [
    {
      skill: 'Salsa Basic Steps',
      level: 'Advanced',
      lastAssessed: '2024-02-01',
    },
    {
      skill: 'Bachata Timing',
      level: 'Intermediate',
      lastAssessed: '2024-02-01',
    },
    {
      skill: 'Partner Work',
      level: 'Intermediate',
      lastAssessed: '2024-02-01',
    },
  ],
}

export function StudentDetailsPage() {
  const { studentId } = useParams({
    from: '/instructor-panel/instructor-panel/students/$studentId',
  })
  const [activeTab, setActiveTab] = React.useState('overview')

  // In real app, fetch student details based on studentId
  React.useEffect(() => {
    console.log('Fetch student details for ID:', studentId)
  }, [studentId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={studentDetails.avatar} alt={studentDetails.name} />
            <AvatarFallback>{studentDetails.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-2xl font-medium">{studentDetails.name}</h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <EnvelopeIcon className="h-4 w-4" />
                {studentDetails.email}
              </div>
              {studentDetails.shareContact && (
                <div className="flex items-center gap-1">
                  <PhoneIcon className="h-4 w-4" />
                  {studentDetails.phone}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentDetails.totalClasses}</div>
            <p className="text-xs text-muted-foreground">
              {studentDetails.activeClasses} active enrollments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentDetails.attendance}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Member Since</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDate(studentDetails.joinedDate)}</div>
            <p className="text-xs text-muted-foreground">
              Last active {formatDate(studentDetails.lastActive)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="classes">Classes</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="overview" className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Preferred Styles</h4>
                <div className="flex gap-2">
                  {studentDetails.preferredStyles.map(style => (
                    <span
                      key={style}
                      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10"
                    >
                      {style}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Upcoming Classes</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Instructor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentDetails.upcomingClasses.map(class_ => (
                      <TableRow key={class_.id}>
                        <TableCell className="font-medium">{class_.name}</TableCell>
                        <TableCell>{formatDate(class_.date)}</TableCell>
                        <TableCell>{class_.time}</TableCell>
                        <TableCell>{class_.instructor}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="classes">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentDetails.classHistory.map(class_ => (
                    <TableRow key={class_.id}>
                      <TableCell className="font-medium">{class_.name}</TableCell>
                      <TableCell>{formatDate(class_.date)}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            class_.attendance === 'Attended'
                              ? 'bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-500'
                              : 'bg-red-100 text-red-700 dark:bg-red-700/20 dark:text-red-500'
                          }`}
                        >
                          {class_.attendance}
                        </span>
                      </TableCell>
                      <TableCell>{class_.instructor}</TableCell>
                      <TableCell className="text-muted-foreground">{class_.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="progress">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Skill</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Last Assessed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentDetails.progress.map(item => (
                    <TableRow key={item.skill}>
                      <TableCell className="font-medium">{item.skill}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            item.level === 'Advanced'
                              ? 'bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-500'
                              : item.level === 'Intermediate'
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700/20 dark:text-yellow-500'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-700/20 dark:text-blue-500'
                          }`}
                        >
                          {item.level}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(item.lastAssessed)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="notes">
              <div className="space-y-4">
                <div className="text-sm">{studentDetails.notes}</div>
                <Button>Add Note</Button>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UsersIcon, UserPlusIcon, ClockIcon, StarIcon } from 'lucide-react'

// Mock data - in real app this would come from API
const stats = {
  totalStudents: 245,
  newThisMonth: 12,
  averageAttendance: '85%',
  averageRetention: '7.5 months',
}

export function StudentStats() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          <UsersIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalStudents}</div>
          <p className="text-xs text-muted-foreground">+{stats.newThisMonth} from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New Students</CardTitle>
          <UserPlusIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.newThisMonth}</div>
          <p className="text-xs text-muted-foreground">This month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
          <ClockIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageAttendance}</div>
          <p className="text-xs text-muted-foreground">Per class</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Retention</CardTitle>
          <StarIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageRetention}</div>
          <p className="text-xs text-muted-foreground">Per student</p>
        </CardContent>
      </Card>
    </div>
  )
}

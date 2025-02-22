import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StudentStats } from './components/student-stats'
import { StudentsTable } from './components/students-table'
import { InviteStudents } from './components/invite-students'

export function StudentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Students</h3>
          <p className="text-sm text-muted-foreground">
            Manage your students and track their progress
          </p>
        </div>
        <InviteStudents />
      </div>

      <StudentStats />

      <Card>
        <CardHeader>
          <CardTitle>Student Directory</CardTitle>
          <CardDescription>View and manage all your students</CardDescription>
        </CardHeader>
        <CardContent>
          <StudentsTable />
        </CardContent>
      </Card>
    </div>
  )
}

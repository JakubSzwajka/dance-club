import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PlusIcon, SearchIcon } from 'lucide-react'

// Mock data - in real app this would come from API
const classes = [
  {
    id: '1',
    name: 'Salsa Beginners',
    level: 'Beginner',
    type: 'Group',
    schedule: 'Monday, 18:00',
    location: 'Studio A',
    capacity: 20,
    enrolled: 15,
    status: 'Active',
  },
  {
    id: '2',
    name: 'Bachata Intermediate',
    level: 'Intermediate',
    type: 'Group',
    schedule: 'Tuesday, 19:00',
    location: 'Studio B',
    capacity: 15,
    enrolled: 12,
    status: 'Active',
  },
  {
    id: '3',
    name: 'Private Salsa',
    level: 'Advanced',
    type: 'Private',
    schedule: 'On Demand',
    location: 'Studio C',
    capacity: 2,
    enrolled: 1,
    status: 'Active',
  },
  {
    id: '4',
    name: 'Kizomba Beginners',
    level: 'Beginner',
    type: 'Group',
    schedule: 'Wednesday, 20:00',
    location: 'Studio A',
    capacity: 15,
    enrolled: 8,
    status: 'Draft',
  },
]

export function ClassesPage() {
  const [search, setSearch] = React.useState('')
  const [filter, setFilter] = React.useState('all')

  const filteredClasses = classes.filter(class_ => {
    const matchesSearch = class_.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || class_.status.toLowerCase() === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Classes</h3>
          <p className="text-sm text-muted-foreground">Manage your dance classes and schedules</p>
        </div>
        <Button asChild>
          <Link to="/instructor-panel/classes/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Class
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Classes</CardTitle>
          <CardDescription>View and manage all your dance classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search classes..."
                className="pl-8"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.map(class_ => (
                  <TableRow key={class_.id}>
                    <TableCell className="font-medium">
                      <Link
                        to="/instructor-panel/classes/$classId"
                        params={{ classId: class_.id }}
                        className="hover:underline"
                      >
                        {class_.name}
                      </Link>
                    </TableCell>
                    <TableCell>{class_.level}</TableCell>
                    <TableCell>{class_.type}</TableCell>
                    <TableCell>{class_.schedule}</TableCell>
                    <TableCell>{class_.location}</TableCell>
                    <TableCell>
                      {class_.enrolled}/{class_.capacity}
                    </TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${
                          class_.status === 'Active'
                            ? 'bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-500'
                            : class_.status === 'Draft'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700/20 dark:text-yellow-500'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-700/20 dark:text-gray-500'
                        }`}
                      >
                        {class_.status}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          to="/instructor-panel/classes/$classId"
                          params={{ classId: class_.id }}
                        >
                          View Details
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

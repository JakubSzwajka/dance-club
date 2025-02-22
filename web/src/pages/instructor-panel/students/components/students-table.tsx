import * as React from 'react'
import { Link } from '@tanstack/react-router'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SearchIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Mock data - in real app this would come from API
const students = [
  {
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
  },
  {
    id: '2',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    avatar: '/avatars/bob.jpg',
    joinedDate: '2024-01-01',
    totalClasses: 12,
    activeClasses: 1,
    shareContact: false,
    phone: null,
    lastActive: '2024-02-14',
    preferredStyles: ['Salsa'],
    level: 'beginner',
  },
  // Add more mock data as needed
]

export function StudentsTable() {
  const [search, setSearch] = React.useState('')
  const [filter, setFilter] = React.useState('all')

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || student.level === filter
    return matchesSearch && matchesFilter
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const calculateMembership = (joinedDate: string) => {
    const joined = new Date(joinedDate)
    const now = new Date()
    const diffMonths =
      (now.getFullYear() - joined.getFullYear()) * 12 + (now.getMonth() - joined.getMonth())

    if (diffMonths < 1) return 'New member'
    if (diffMonths < 12) return `${diffMonths} months`
    const years = Math.floor(diffMonths / 12)
    const months = diffMonths % 12
    return months > 0 ? `${years}y ${months}m` : `${years} years`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            className="pl-8"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Member Since</TableHead>
              <TableHead>Classes</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Preferred Styles</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map(student => (
              <TableRow key={student.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={student.avatar} alt={student.name} />
                      <AvatarFallback>{student.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">{student.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{formatDate(student.joinedDate)}</div>
                    <div className="text-muted-foreground">
                      {calculateMembership(student.joinedDate)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{student.totalClasses} total</div>
                    <div className="text-muted-foreground">{student.activeClasses} active</div>
                  </div>
                </TableCell>
                <TableCell>
                  {student.shareContact ? (
                    <div className="text-sm">
                      <div className="text-green-600">Public</div>
                      <div className="text-muted-foreground">{student.phone}</div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">Private</div>
                  )}
                </TableCell>
                <TableCell>{formatDate(student.lastActive)}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {student.preferredStyles.map(style => (
                      <span
                        key={style}
                        className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-primary/10"
                      >
                        {style}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link
                      to="/instructor-panel/students/$studentId"
                      params={{ studentId: student.id }}
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
    </div>
  )
}

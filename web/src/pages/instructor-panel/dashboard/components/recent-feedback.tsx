import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Mock data - in real app this would come from API
const recentFeedback = [
  {
    id: 1,
    studentName: 'Alice Smith',
    avatar: '/avatars/alice.jpg',
    rating: 5,
    comment: 'Amazing class! The instructor was very patient and helpful.',
    className: 'Salsa Intermediate',
    date: '2024-02-15',
  },
  {
    id: 2,
    studentName: 'John Doe',
    avatar: '/avatars/john.jpg',
    rating: 4,
    comment: 'Great energy in the class, looking forward to the next one!',
    className: 'Bachata Advanced',
    date: '2024-02-14',
  },
  {
    id: 3,
    studentName: 'Maria Garcia',
    avatar: '/avatars/maria.jpg',
    rating: 5,
    comment: 'Perfect pace and clear instructions. Loved it!',
    className: 'Salsa Beginners',
    date: '2024-02-13',
  },
  // ... more feedback
]

export function RecentFeedback() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Feedback</CardTitle>
        <CardDescription>Latest reviews from your students</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Feedback</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentFeedback.map((feedback) => (
              <TableRow key={feedback.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={feedback.avatar} alt={feedback.studentName} />
                      <AvatarFallback>{feedback.studentName.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{feedback.studentName}</span>
                  </div>
                </TableCell>
                <TableCell>{feedback.className}</TableCell>
                <TableCell>
                  <div className="text-yellow-500">{'⭐️'.repeat(feedback.rating)}</div>
                </TableCell>
                <TableCell className="max-w-[300px]">
                  <p className="truncate">{feedback.comment}</p>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {feedback.date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 
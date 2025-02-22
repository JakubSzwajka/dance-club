import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Mock data - in real app this would come from API
const upcomingClasses = [
  {
    id: 1,
    name: 'Salsa Beginners',
    date: '2024-02-20 18:00',
    place: 'Studio A',
    reservations: 12,
    pendingReservations: 3,
    confirmedReservations: 9,
    rating: 4.8,
  },
  // ... more classes
]

export function UpcomingClasses() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Classes</CardTitle>
        <CardDescription>Your next 5 scheduled classes</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Reservations</TableHead>
              <TableHead className="text-right">Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {upcomingClasses.map(class_ => (
              <TableRow key={class_.id}>
                <TableCell className="font-medium">{class_.name}</TableCell>
                <TableCell>{class_.date}</TableCell>
                <TableCell>{class_.place}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{class_.confirmedReservations} confirmed</div>
                    <div className="text-muted-foreground">
                      {class_.pendingReservations} pending
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">{class_.rating} ⭐️</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

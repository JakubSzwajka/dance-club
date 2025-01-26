import { useParams, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../lib/auth/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Container } from '../components/ui/container';
import { Header } from '../components/domain/header';
import { Badge } from '../components/ui/badge';
import { useClass } from '../lib/api/classes';
import { formatDayOfWeek } from '../lib/api/schedules';

export function ClassDetailsPage() {
  const { classId } = useParams({ from: '/protected/instructor/classes/$classId' });
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: classDetails, isLoading } = useClass(Number(classId));

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
      </div>
    );
  }

  if (!classDetails) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-destructive">Failed to load class details.</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Container>
        <div className="py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">{classDetails.name}</h1>
              <p className="text-muted-foreground">
                Level: {classDetails.level.charAt(0).toUpperCase() + classDetails.level.slice(1)}
              </p>
            </div>
            {user?.role === 'instructor' && user?.id === classDetails.instructor_id && (
              <Button onClick={() => navigate({ to: `/classes/${classId}/schedules` })}>
                Manage Schedules
              </Button>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Class Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{classDetails.description}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Class Period</h3>
                  <p className="text-muted-foreground">
                    From {new Date(classDetails.start_date).toLocaleDateString()} to{' '}
                    {new Date(classDetails.end_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Capacity</h3>
                  <p className="text-muted-foreground">
                    {classDetails.current_capacity} / {classDetails.max_capacity} students
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Price</h3>
                  <p className="text-muted-foreground">${classDetails.price.toFixed(2)} per class</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Regular Schedule</h3>
                    {classDetails.recurring_schedules.length === 0 ? (
                      <p className="text-muted-foreground">No regular schedules set.</p>
                    ) : (
                      <div className="space-y-4">
                        {classDetails.recurring_schedules.map((schedule) => (
                          <div key={schedule.id} className="flex justify-between items-start border-b pb-4 last:border-0">
                            <div>
                              <p className="font-medium">{formatDayOfWeek(schedule.day_of_week)}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(`1970-01-01T${schedule.start_time}`).toLocaleTimeString()} - 
                                {new Date(`1970-01-01T${schedule.end_time}`).toLocaleTimeString()}
                              </p>
                            </div>
                            <Badge variant={schedule.status === 'active' ? 'default' : 'secondary'}>
                              {schedule.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Special Sessions</h3>
                    {classDetails.special_schedules.length === 0 ? (
                      <p className="text-muted-foreground">No special sessions scheduled.</p>
                    ) : (
                      <div className="space-y-4">
                        {classDetails.special_schedules.map((schedule) => (
                          <div key={schedule.id} className="flex justify-between items-start border-b pb-4 last:border-0">
                            <div>
                              <p className="font-medium">{new Date(schedule.date).toLocaleDateString()}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(`1970-01-01T${schedule.start_time}`).toLocaleTimeString()} - 
                                {new Date(`1970-01-01T${schedule.end_time}`).toLocaleTimeString()}
                              </p>
                              {schedule.note && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  Note: {schedule.note}
                                </p>
                              )}
                            </div>
                            <Badge variant={
                              schedule.status === 'scheduled' ? 'default' :
                              schedule.status === 'cancelled' ? 'destructive' :
                              schedule.status === 'rescheduled' ? 'secondary' : 'outline'
                            }>
                              {schedule.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
} 
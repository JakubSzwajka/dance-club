import { useNavigate } from '@tanstack/react-router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useInstructorEventsHooks } from '../hooks/use-instructor-events';
import { useAuth } from '@/lib/auth/AuthContext';

export function EventsList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { events, isLoading, stats } = useInstructorEventsHooks(user?.id || '');

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Special Events</h2>
        <Button onClick={() => navigate({ to: '/events/create' })}>
          Create New Event
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Stats Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Total Events</CardTitle>
            <CardDescription>All special events and workshops</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? '...' : stats.totalEvents}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Events scheduled in the future</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? '...' : stats.upcomingEvents}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Participants</CardTitle>
            <CardDescription>People enrolled in your events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? '...' : stats.totalParticipants}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : events?.length ? (
          <div className="grid gap-4">
            {events.map((event) => (
              <Card key={event.id} className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => navigate({ to: `/events/${event.id}` })}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{event.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">
                          {format(new Date(event.datetime), 'PPP')}
                        </Badge>
                        <span>•</span>
                        <Badge variant="outline">{event.location.name}</Badge>
                      </CardDescription>
                      <p className="text-sm text-muted-foreground mt-2">
                        {event.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{event.price} PLN</div>
                      <div className="text-sm text-muted-foreground">
                        {event.current_capacity}/{event.capacity} spots
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground mb-4">You haven't created any special events yet.</p>
              <Button onClick={() => navigate({ to: '/events/create' })}>
                Create Your First Event
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}

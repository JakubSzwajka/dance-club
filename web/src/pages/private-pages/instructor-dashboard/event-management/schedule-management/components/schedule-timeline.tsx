import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { cn } from '../../../lib/utils';

interface TimelineEvent {
  date: Date;
  type: 'recurring' | 'special';
  startTime: string;
  endTime: string;
  status: string;
  note?: string;
  replacedSchedule?: {
    day: string;
    startTime: string;
    endTime: string;
    date: Date;
  };
  isReplaced: boolean;
  isReplacedById?: string;
}

interface ScheduleTimelineProps {
  events: TimelineEvent[];
}

export function ScheduleTimeline({ events }: ScheduleTimelineProps) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Schedule Timeline</CardTitle>
        <CardDescription>
          View all upcoming classes, including regular sessions and special events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="regular">Regular Classes</TabsTrigger>
            <TabsTrigger value="special">Special Sessions</TabsTrigger>
            <TabsTrigger value="replaced">Replaced Classes</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Date</TableHead>
                    <TableHead className="w-[120px]">Type</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event, index) => (
                    <TableRow 
                      key={index}
                      className={cn(
                        event.isReplaced && "opacity-50 bg-muted/50"
                      )}
                    >
                      <TableCell className="font-medium">
                        {event.date.toLocaleDateString()}
                        <div className="text-xs text-muted-foreground">
                          {event.date.toLocaleDateString('en-US', { weekday: 'long' })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          event.type === 'special' 
                            ? event.status === 'extra' 
                              ? 'outline'
                              : event.status === 'cancelled'
                                ? 'destructive'
                                : 'secondary'
                            : event.status === 'active'
                              ? 'default'
                              : 'secondary'
                        }>
                          {event.type === 'special' 
                            ? event.status.charAt(0).toUpperCase() + event.status.slice(1)
                            : 'Regular Class'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(`1970-01-01T${event.startTime}`).toLocaleTimeString()} - 
                        {new Date(`1970-01-01T${event.endTime}`).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>
                        {event.type === 'special' && event.replacedSchedule && (
                          <div className="text-sm text-muted-foreground">
                            Replaces: {event.replacedSchedule.day} {event.replacedSchedule.date ? `on ${event.replacedSchedule.date.toLocaleDateString()}` : ''} class at{' '}
                            {new Date(`1970-01-01T${event.replacedSchedule.startTime}`).toLocaleTimeString()}
                          </div>
                        )}
                        {event.note && (
                          <div className="text-sm text-muted-foreground mt-1">
                            Note: {event.note}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="regular">
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Date</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events
                    .filter(event => event.type === 'recurring')
                    .map((event, index) => (
                      <TableRow 
                        key={index}
                        className={cn(
                          event.isReplaced && "opacity-50 bg-muted/50"
                        )}
                      >
                        <TableCell className="font-medium">
                          {event.date.toLocaleDateString()}
                          <div className="text-xs text-muted-foreground">
                            {event.date.toLocaleDateString('en-US', { weekday: 'long' })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={event.status === 'active' ? 'default' : 'secondary'}>
                            Regular Class
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(`1970-01-01T${event.startTime}`).toLocaleTimeString()} - 
                          {new Date(`1970-01-01T${event.endTime}`).toLocaleTimeString()}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="special">
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Date</TableHead>
                    <TableHead className="w-[120px]">Type</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events
                    .filter(event => event.type === 'special' && !event.replacedSchedule)
                    .map((event, index) => (
                      <TableRow 
                        key={index}
                        className={cn(
                          event.isReplaced && "opacity-50 bg-muted/50"
                        )}
                      >
                        <TableCell className="font-medium">
                          {event.date.toLocaleDateString()}
                          <div className="text-xs text-muted-foreground">
                            {event.date.toLocaleDateString('en-US', { weekday: 'long' })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={event.status === 'extra' ? 'outline' : 'secondary'}>
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(`1970-01-01T${event.startTime}`).toLocaleTimeString()} - 
                          {new Date(`1970-01-01T${event.endTime}`).toLocaleTimeString()}
                        </TableCell>
                        <TableCell>
                          {event.note && (
                            <div className="text-sm text-muted-foreground">
                              {event.note}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="replaced">
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Date</TableHead>
                    <TableHead className="w-[120px]">Type</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Replaces</TableHead>
                    <TableHead>Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events
                    .filter(event => event.type === 'special' && event.replacedSchedule)
                    .map((event, index) => (
                      <TableRow 
                        key={index}
                        className={cn(
                          event.isReplaced && "opacity-50 bg-muted/50"
                        )}
                      >
                        <TableCell className="font-medium">
                          {event.date.toLocaleDateString()}
                          <div className="text-xs text-muted-foreground">
                            {event.date.toLocaleDateString('en-US', { weekday: 'long' })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(`1970-01-01T${event.startTime}`).toLocaleTimeString()} - 
                          {new Date(`1970-01-01T${event.endTime}`).toLocaleTimeString()}
                        </TableCell>
                        <TableCell>
                          {event.replacedSchedule && (
                            <div className="text-sm text-muted-foreground">
                              {event.replacedSchedule.day} {event.replacedSchedule.date ? `on ${event.replacedSchedule.date.toLocaleDateString()}` : ''} at{' '}
                              {new Date(`1970-01-01T${event.replacedSchedule.startTime}`).toLocaleTimeString()}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {event.note && (
                            <div className="text-sm text-muted-foreground">
                              {event.note}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 
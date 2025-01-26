import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { RecurringSchedule, formatDayOfWeek } from '../../../lib/api/schedules';

interface RegularScheduleListProps {
  schedules: RecurringSchedule[] | undefined;
  onDelete: (id: number) => void;
  onUpdateStatus: (params: { scheduleId: number; status: RecurringSchedule['status'] }) => void;
}

export function RegularScheduleList({ schedules, onDelete, onUpdateStatus }: RegularScheduleListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Regular Schedules</CardTitle>
        <CardDescription>View and manage your weekly classes</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {!schedules || schedules.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No regular schedules yet.
              </p>
            ) : (
              schedules.map((schedule) => (
                <Card key={schedule.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">
                          {formatDayOfWeek(schedule.day_of_week)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(`1970-01-01T${schedule.start_time}`).toLocaleTimeString()} - 
                          {new Date(`1970-01-01T${schedule.end_time}`).toLocaleTimeString()}
                        </p>
                        <Badge variant={schedule.status === 'active' ? 'default' : 'secondary'}>
                          {schedule.status}
                        </Badge>
                      </div>
                      <div className="space-x-2">
                        {schedule.status === 'active' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateStatus({ scheduleId: schedule.id, status: 'cancelled' })}
                          >
                            Cancel
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateStatus({ scheduleId: schedule.id, status: 'active' })}
                          >
                            Activate
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(schedule.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { SpecialSchedule } from '../../../lib/api/schedules';

interface SpecialScheduleListProps {
  schedules: SpecialSchedule[] | undefined;
  onDelete: (id: number) => void;
  onUpdateStatus: (params: { scheduleId: number; status: SpecialSchedule['status'] }) => void;
}

export function SpecialScheduleList({ schedules, onDelete, onUpdateStatus }: SpecialScheduleListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Special Sessions</CardTitle>
        <CardDescription>View and manage your special sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {!schedules || schedules.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No special sessions scheduled.
              </p>
            ) : (
              schedules.map((schedule) => (
                <Card key={schedule.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">
                          {new Date(schedule.date).toLocaleDateString()}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(`1970-01-01T${schedule.start_time}`).toLocaleTimeString()} - 
                          {new Date(`1970-01-01T${schedule.end_time}`).toLocaleTimeString()}
                        </p>
                        <Badge variant={
                          schedule.status === 'scheduled' ? 'default' :
                          schedule.status === 'cancelled' ? 'destructive' :
                          schedule.status === 'rescheduled' ? 'secondary' : 'outline'
                        }>
                          {schedule.status}
                        </Badge>
                        {schedule.note && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Note: {schedule.note}
                          </p>
                        )}
                      </div>
                      <div className="space-x-2">
                        {schedule.status !== 'cancelled' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateStatus({ scheduleId: schedule.id, status: 'cancelled' })}
                          >
                            Cancel
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
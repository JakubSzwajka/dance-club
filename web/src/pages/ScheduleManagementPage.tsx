import { useParams, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../lib/auth/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Container } from '../components/ui/container';
import { Header } from '../components/ui/header';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';
import { useClass } from '../lib/api/classes';
import { 
  useRecurringSchedules, 
  useCreateRecurringSchedule, 
  useDeleteRecurringSchedule, 
  useUpdateRecurringScheduleStatus,
  useSpecialSchedules,
  useCreateSpecialSchedule,
  useDeleteSpecialSchedule,
  useUpdateSpecialScheduleStatus,
  useRecurringScheduleOccurrences,
  DAYS_OF_WEEK, 
  formatDayOfWeek,
  type SpecialSchedule 
} from '../lib/api/schedules';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { AxiosError } from 'axios';
import { ScrollArea } from '../components/ui/scroll-area';

export function ScheduleManagementPage() {
  const { classId } = useParams({ from: '/protected/classes/$classId/schedules' });
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [selectedRecurringSchedule, setSelectedRecurringSchedule] = useState<number | null>(null);
  const [specialSessionType, setSpecialSessionType] = useState<SpecialSchedule['status']>('scheduled');

  const { data: classDetails, isLoading: isLoadingClass } = useClass(Number(classId));
  const { data: recurringSchedules, isLoading: isLoadingRecurring } = useRecurringSchedules(Number(classId));
  const { data: specialSchedules, isLoading: isLoadingSpecial } = useSpecialSchedules(Number(classId));
  const { data: recurringOccurrences, isLoading: isLoadingOccurrences } = useRecurringScheduleOccurrences(
    Number(classId),
    selectedRecurringSchedule ?? 0
  );

  const { mutate: createRecurringSchedule, isPending: isCreatingRecurring } = useCreateRecurringSchedule(Number(classId));
  const { mutate: createSpecialSchedule, isPending: isCreatingSpecial } = useCreateSpecialSchedule(Number(classId));
  const { mutate: deleteRecurringSchedule } = useDeleteRecurringSchedule();
  const { mutate: deleteSpecialSchedule } = useDeleteSpecialSchedule();
  const { mutate: updateRecurringStatus } = useUpdateRecurringScheduleStatus();
  const { mutate: updateSpecialStatus } = useUpdateSpecialScheduleStatus();

  if (isLoadingClass || isLoadingRecurring || isLoadingSpecial) {
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

  if (user?.role !== 'instructor' || user?.id !== classDetails.instructor_id) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-destructive">Only the instructor who created this class can manage schedules.</div>
        </main>
      </div>
    );
  }

  const handleCreateRecurringSchedule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    try {
      await createRecurringSchedule({
        day_of_week: parseInt(formData.get('day_of_week') as string),
        start_time: formData.get('start_time') as string,
        end_time: formData.get('end_time') as string,
      });
      e.currentTarget.reset();
      toast({
        title: "Schedule Created",
        description: "Regular schedule has been added successfully.",
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.detail || 'Failed to create recurring schedule');
      } else {
        setError('Failed to create recurring schedule');
      }
    }
  };

  const handleCreateSpecialSchedule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    try {
      const scheduleId = formData.get('replaced_schedule_id');
      const scheduleDate = formData.get('replaced_schedule_date');
      const status = formData.get('status') as SpecialSchedule['status'];
      const date = formData.get('date') as string;

      await createSpecialSchedule({
        date,  // The new date when the rescheduled class will happen
        start_time: formData.get('start_time') as string,
        end_time: formData.get('end_time') as string,
        status,
        replaced_schedule_id: scheduleId ? parseInt(scheduleId as string) : undefined,
        replaced_schedule_date: status === 'rescheduled' ? scheduleDate as string : undefined,  // The original date being replaced
        note: formData.get('note') as string,
      });
      e.currentTarget.reset();
      setSelectedRecurringSchedule(null);
      setSpecialSessionType('scheduled');
      toast({
        title: "Special Session Created",
        description: "Special session has been added successfully.",
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.detail || 'Failed to create special schedule');
      } else {
        setError('Failed to create special schedule');
      }
    }
  };

  // Helper function to get all schedule events sorted by date
  const getAllScheduleEvents = () => {
    if (!recurringSchedules || !specialSchedules || !classDetails) return [];

    const events: Array<{
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
      };
    }> = [];

    // Add special schedules
    specialSchedules.forEach(special => {
      const replacedSchedule = special.replaced_schedule_id 
        ? recurringSchedules.find(r => r.id === special.replaced_schedule_id)
        : undefined;

      events.push({
        date: new Date(special.date),
        type: 'special',
        startTime: special.start_time,
        endTime: special.end_time,
        status: special.status,
        note: special.note,
        replacedSchedule: replacedSchedule ? {
          day: formatDayOfWeek(replacedSchedule.day_of_week),
          startTime: replacedSchedule.start_time,
          endTime: replacedSchedule.end_time,
        } : undefined,
      });
    });

    // Add recurring schedules
    // We'll only show the next 4 weeks of recurring schedules to keep the list manageable
    recurringSchedules.forEach(recurring => {
      let currentDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 28); // Show next 4 weeks

      while (currentDate <= endDate) {
        // Convert JavaScript's Sunday-based day (0-6) to Monday-based day (0-6)
        const jsDay = currentDate.getDay();
        const pythonDay = jsDay === 0 ? 6 : jsDay - 1;

        if (pythonDay === recurring.day_of_week) {
          // Check if this occurrence is not replaced by a special schedule
          const isReplaced = specialSchedules.some(
            special => 
              special.replaced_schedule_id === recurring.id && 
              special.date === currentDate.toISOString().split('T')[0]
          );

          if (!isReplaced) {
            events.push({
              date: new Date(currentDate),
              type: 'recurring',
              startTime: recurring.start_time,
              endTime: recurring.end_time,
              status: recurring.status,
            });
          }
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    // Sort by date and time
    return events.sort((a, b) => {
      const dateCompare = a.date.getTime() - b.date.getTime();
      if (dateCompare !== 0) return dateCompare;
      return a.startTime.localeCompare(b.startTime);
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Container>
        <div className="py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Schedule Management</h1>
              <p className="text-muted-foreground">
                Manage schedules for {classDetails.name}
              </p>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline">
                  {new Date(classDetails.start_date).toLocaleDateString()} - {new Date(classDetails.end_date).toLocaleDateString()}
                </Badge>
                <Badge variant="outline">{classDetails.level}</Badge>
              </div>
            </div>
            <Button onClick={() => navigate({ to: `/classes/${classId}` })}>
              Back to Class
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Schedule Management Tabs */}
          <Tabs defaultValue="regular" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="regular" className="flex-1">Regular Schedule</TabsTrigger>
              <TabsTrigger value="special" className="flex-1">Special Sessions</TabsTrigger>
            </TabsList>

            {/* Regular Schedule Tab */}
            <TabsContent value="regular">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Regular Schedule Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Add Regular Schedule</CardTitle>
                    <CardDescription>Set up recurring weekly classes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateRecurringSchedule} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="day_of_week">Day of Week</Label>
                        <Select name="day_of_week" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                          <SelectContent>
                            {DAYS_OF_WEEK.map((day, index) => (
                              <SelectItem key={day} value={index.toString()}>
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="start_time">Start Time</Label>
                          <Input
                            id="start_time"
                            name="start_time"
                            type="time"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="end_time">End Time</Label>
                          <Input
                            id="end_time"
                            name="end_time"
                            type="time"
                            required
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isCreatingRecurring}
                      >
                        {isCreatingRecurring ? 'Adding...' : 'Add Regular Schedule'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Regular Schedule List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Current Regular Schedules</CardTitle>
                    <CardDescription>View and manage your weekly classes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {recurringSchedules?.length === 0 ? (
                          <p className="text-muted-foreground text-center py-4">
                            No regular schedules yet.
                          </p>
                        ) : (
                          recurringSchedules?.map((schedule) => (
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
                                        onClick={() => updateRecurringStatus({ scheduleId: schedule.id, status: 'cancelled' })}
                                      >
                                        Cancel
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => updateRecurringStatus({ scheduleId: schedule.id, status: 'active' })}
                                      >
                                        Activate
                                      </Button>
                                    )}
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => deleteRecurringSchedule(schedule.id)}
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
              </div>
            </TabsContent>

            {/* Special Sessions Tab */}
            <TabsContent value="special">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Special Session Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Add Special Session</CardTitle>
                    <CardDescription>Create one-time sessions, rescheduled classes, and cancellations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateSpecialSchedule} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          name="date"
                          type="date"
                          min={classDetails.start_date}
                          max={classDetails.end_date}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="start_time">Start Time</Label>
                          <Input
                            id="start_time"
                            name="start_time"
                            type="time"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="end_time">End Time</Label>
                          <Input
                            id="end_time"
                            name="end_time"
                            type="time"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Type</Label>
                        <Select 
                          name="status" 
                          required
                          onValueChange={(value: SpecialSchedule['status']) => {
                            setSpecialSessionType(value);
                            if (value !== 'rescheduled') {
                              setSelectedRecurringSchedule(null);
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="scheduled">Regular Session</SelectItem>
                            <SelectItem value="extra">Extra Class</SelectItem>
                            <SelectItem value="rescheduled">Rescheduled Class</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {recurringSchedules && recurringSchedules.length > 0 && (
                        <div className="space-y-4 data-[hidden=true]:hidden" data-hidden={specialSessionType !== 'rescheduled'}>
                          <div className="space-y-2">
                            <Label htmlFor="replaced_schedule_id">Replaces Regular Schedule</Label>
                            <Select 
                              name="replaced_schedule_id" 
                              onValueChange={(value) => setSelectedRecurringSchedule(value ? parseInt(value) : null)}
                              required={specialSessionType === 'rescheduled'}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select schedule to replace" />
                              </SelectTrigger>
                              <SelectContent>
                                {recurringSchedules.map((schedule) => (
                                  <SelectItem key={schedule.id} value={schedule.id.toString()}>
                                    {formatDayOfWeek(schedule.day_of_week)}{' '}
                                    {new Date(`1970-01-01T${schedule.start_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                                    {new Date(`1970-01-01T${schedule.end_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {selectedRecurringSchedule && (
                            <div className="space-y-2">
                              <Label htmlFor="replaced_schedule_date">Select Date to Replace</Label>
                              <Select 
                                name="replaced_schedule_date" 
                                required={specialSessionType === 'rescheduled'}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select date to replace" />
                                </SelectTrigger>
                                <SelectContent>
                                  {recurringOccurrences?.map((date) => {
                                    const dateObj = new Date(date);
                                    return (
                                      <SelectItem key={date} value={date}>
                                        {dateObj.toLocaleDateString()}{' - '}
                                        {dateObj.toLocaleDateString('en-US', { weekday: 'long' })}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                              {isLoadingOccurrences && (
                                <p className="text-sm text-muted-foreground">Loading available dates...</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="note">Note (Optional)</Label>
                        <Textarea
                          id="note"
                          name="note"
                          placeholder="Add a note explaining this special session..."
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isCreatingSpecial}
                      >
                        {isCreatingSpecial ? 'Adding...' : 'Add Special Session'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Special Sessions List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Special Sessions</CardTitle>
                    <CardDescription>View and manage your special sessions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[600px]">
                      <div className="space-y-4">
                        {specialSchedules?.length === 0 ? (
                          <p className="text-muted-foreground text-center py-4">
                            No special sessions scheduled.
                          </p>
                        ) : (
                          specialSchedules?.map((schedule) => (
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
                                        onClick={() => updateSpecialStatus({ scheduleId: schedule.id, status: 'cancelled' })}
                                      >
                                        Cancel
                                      </Button>
                                    )}
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => deleteSpecialSchedule(schedule.id)}
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
              </div>
            </TabsContent>
          </Tabs>

          {/* Schedule Timeline */}
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
                  <ScrollArea className="h-[600px] w-full">
                    <div className="space-y-8">
                      {getAllScheduleEvents().map((event, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="min-w-[180px] text-sm">
                            {event.date.toLocaleDateString()}{' '}
                            <span className="text-muted-foreground">
                              {event.date.toLocaleDateString('en-US', { weekday: 'long' })}
                            </span>
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center space-x-2">
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
                              <span className="text-sm font-medium">
                                {new Date(`1970-01-01T${event.startTime}`).toLocaleTimeString()} - 
                                {new Date(`1970-01-01T${event.endTime}`).toLocaleTimeString()}
                              </span>
                            </div>
                            
                            {event.type === 'special' && event.replacedSchedule && (
                              <p className="text-sm text-muted-foreground">
                                Replaces: {event.replacedSchedule.day} class at{' '}
                                {new Date(`1970-01-01T${event.replacedSchedule.startTime}`).toLocaleTimeString()}
                              </p>
                            )}
                            
                            {event.note && (
                              <p className="text-sm text-muted-foreground">
                                Note: {event.note}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="regular">
                  <ScrollArea className="h-[600px] w-full">
                    <div className="space-y-8">
                      {getAllScheduleEvents()
                        .filter(event => event.type === 'recurring')
                        .map((event, index) => (
                          <div key={index} className="flex items-start space-x-4">
                            <div className="min-w-[180px] text-sm">
                              {event.date.toLocaleDateString()}{' '}
                              <span className="text-muted-foreground">
                                {event.date.toLocaleDateString('en-US', { weekday: 'long' })}
                              </span>
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center space-x-2">
                                <Badge variant={event.status === 'active' ? 'default' : 'secondary'}>
                                  Regular Class
                                </Badge>
                                <span className="text-sm font-medium">
                                  {new Date(`1970-01-01T${event.startTime}`).toLocaleTimeString()} - 
                                  {new Date(`1970-01-01T${event.endTime}`).toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="special">
                  <ScrollArea className="h-[600px] w-full">
                    <div className="space-y-8">
                      {getAllScheduleEvents()
                        .filter(event => event.type === 'special' && !event.replacedSchedule)
                        .map((event, index) => (
                          <div key={index} className="flex items-start space-x-4">
                            <div className="min-w-[180px] text-sm">
                              {event.date.toLocaleDateString()}{' '}
                              <span className="text-muted-foreground">
                                {event.date.toLocaleDateString('en-US', { weekday: 'long' })}
                              </span>
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center space-x-2">
                                <Badge variant={event.status === 'extra' ? 'outline' : 'secondary'}>
                                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                </Badge>
                                <span className="text-sm font-medium">
                                  {new Date(`1970-01-01T${event.startTime}`).toLocaleTimeString()} - 
                                  {new Date(`1970-01-01T${event.endTime}`).toLocaleTimeString()}
                                </span>
                              </div>
                              {event.note && (
                                <p className="text-sm text-muted-foreground">
                                  Note: {event.note}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="replaced">
                  <ScrollArea className="h-[600px] w-full">
                    <div className="space-y-8">
                      {getAllScheduleEvents()
                        .filter(event => event.type === 'special' && event.replacedSchedule)
                        .map((event, index) => (
                          <div key={index} className="flex items-start space-x-4">
                            <div className="min-w-[180px] text-sm">
                              {event.date.toLocaleDateString()}{' '}
                              <span className="text-muted-foreground">
                                {event.date.toLocaleDateString('en-US', { weekday: 'long' })}
                              </span>
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary">
                                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                </Badge>
                                <span className="text-sm font-medium">
                                  {new Date(`1970-01-01T${event.startTime}`).toLocaleTimeString()} - 
                                  {new Date(`1970-01-01T${event.endTime}`).toLocaleTimeString()}
                                </span>
                              </div>
                              {event.replacedSchedule && (
                                <p className="text-sm text-muted-foreground">
                                  Replaces: {event.replacedSchedule.day} class at{' '}
                                  {new Date(`1970-01-01T${event.replacedSchedule.startTime}`).toLocaleTimeString()}
                                </p>
                              )}
                              {event.note && (
                                <p className="text-sm text-muted-foreground">
                                  Note: {event.note}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
} 
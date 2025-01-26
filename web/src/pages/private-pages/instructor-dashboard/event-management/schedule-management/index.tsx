import { useParams } from '@tanstack/react-router';
import { useRegularSchedules } from './hooks/use-regular-schedules';
import { useSpecialSchedules } from './hooks/use-special-schedules';
import { useScheduleTimeline } from './hooks/use-schedule-timeline';
import { RegularScheduleForm } from './components/regular-schedule-form';
import { RegularScheduleList } from './components/regular-schedule-list';
import { SpecialScheduleForm } from './components/special-schedule-form';
import { SpecialScheduleList } from './components/special-schedule-list';
import { ScheduleTimeline } from './components/schedule-timeline';
import { useToast } from '../../hooks/use-toast';
import { useClass } from '../../lib/api/classes';
import { Header } from '@/components/domain/header';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ScheduleManagementPage() {
  const { classId } = useParams({ from: '/protected/instructor/classes/$classId/schedules' });
  const { toast } = useToast();
  const { data: classData, isLoading: isLoadingClass } = useClass(Number(classId));

  // Regular schedules
  const {
    recurringSchedules,
    isLoadingRecurring,
    isCreatingRecurring,
    handleCreateRecurringSchedule,
    deleteRecurringSchedule,
    updateRecurringStatus,
  } = useRegularSchedules(Number(classId));

  // Special schedules
  const {
    specialSchedules,
    isLoadingSpecial,
    isCreatingSpecial,
    handleCreateSpecialSchedule,
    deleteSpecialSchedule,
    updateSpecialStatus,
  } = useSpecialSchedules(Number(classId));


  // Get timeline events using the hook
  const { getAllScheduleEvents, getAllRegularScheduleOccurrences } = useScheduleTimeline(
    recurringSchedules || [], 
    specialSchedules || [], 
    classData
  );
  const timelineEvents = getAllScheduleEvents();
  const regularOccurrences = getAllRegularScheduleOccurrences();

  if (isLoadingClass || isLoadingRecurring || isLoadingSpecial) {
    return <div>Loading...</div>;
  }

  if (!classData) {
    return <div>Class not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <Container>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{classData.name}</h1>
            <p className="text-muted-foreground">
              Manage schedules and sessions for this class
            </p>
          </div>
        </div>

        <Tabs defaultValue="regular" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger className="flex-1" value="regular">Regular Schedule</TabsTrigger>
            <TabsTrigger className="flex-1" value="special">Special Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value="regular">
            <div className="grid gap-6 md:grid-cols-2">
              <RegularScheduleForm
                onSubmit={async (data) => {
                  try {
                    await handleCreateRecurringSchedule(data);
                    toast({
                      title: 'Regular schedule created',
                      description: 'The weekly schedule has been added successfully.',
                    });
                  } catch (error) {
                    toast({
                      title: 'Error creating schedule',
                      description: 'Failed to create the weekly schedule. Please try again.',
                      variant: 'destructive',
                    });
                  }
                }}
                isCreatingRecurring={isCreatingRecurring}
              />
              <RegularScheduleList
                schedules={recurringSchedules || []}
                onDelete={async (id) => {
                  try {
                    await deleteRecurringSchedule(id);
                    toast({
                      title: 'Schedule deleted',
                      description: 'The weekly schedule has been removed.',
                    });
                  } catch (error) {
                    toast({
                      title: 'Error deleting schedule',
                      description: 'Failed to delete the schedule. Please try again.',
                      variant: 'destructive',
                    });
                  }
                }}
                onUpdateStatus={async ({ scheduleId, status }) => {
                  try {
                    await updateRecurringStatus({ scheduleId, status });
                    toast({
                      title: 'Schedule updated',
                      description: 'The schedule status has been updated.',
                    });
                  } catch (error) {
                    toast({
                      title: 'Error updating schedule',
                      description: 'Failed to update the schedule status. Please try again.',
                      variant: 'destructive',
                    });
                  }
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="special">
            <div className="grid gap-6 md:grid-cols-2">
              <SpecialScheduleForm
                recurringOccurrences={regularOccurrences}
                onSubmit={async (data) => {
                  try {
                    await handleCreateSpecialSchedule({
                      date: data.date,
                      start_time: data.startTime,
                      end_time: data.endTime,
                      status: data.status,
                      note: data.note,
                      replaced_schedule_id: data.replacedScheduleId ? parseInt(data.replacedScheduleId) : undefined,
                      replaced_schedule_date: data.replacedScheduleDate,
                    });
                    toast({
                      title: 'Special session created',
                      description: 'The special session has been added successfully.',
                    });
                  } catch (error) {
                    toast({
                      title: 'Error creating session',
                      description: 'Failed to create the special session. Please try again.',
                      variant: 'destructive',
                    });
                  }
                }}
                isCreating={isCreatingSpecial}
              />
              <SpecialScheduleList
                schedules={specialSchedules || []}
                onDelete={async (id) => {
                  try {
                    await deleteSpecialSchedule(id);
                    toast({
                      title: 'Session deleted',
                      description: 'The special session has been removed.',
                    });
                  } catch (error) {
                    toast({
                      title: 'Error deleting session',
                      description: 'Failed to delete the session. Please try again.',
                      variant: 'destructive',
                    });
                  }
                }}
                onUpdateStatus={async ({ scheduleId, status }) => {
                  try {
                    await updateSpecialStatus({ scheduleId, status });
                    toast({
                      title: 'Session updated',
                      description: 'The session status has been updated.',
                    });
                  } catch (error) {
                    toast({
                      title: 'Error updating session',
                      description: 'Failed to update the session status. Please try again.',
                      variant: 'destructive',
                    });
                  }
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
        <ScheduleTimeline events={timelineEvents} />
      </Container>
    </div>
  );
} 
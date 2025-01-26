import { DanceClass } from '@/lib/api/classes';
import { RecurringSchedule, SpecialSchedule, formatDayOfWeek } from '../../../lib/api/schedules';

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
    date?: Date;
  };
  isReplaced: boolean;
  isReplacedById?: string;
}

interface ScheduleOccurrence {
  scheduleId: string;
  date: string;
  displayText: string;
}

export function useScheduleTimeline(
  recurringSchedules: RecurringSchedule[],
  specialSchedules: SpecialSchedule[],
  classData: DanceClass | undefined,
) {
  const getAllRegularScheduleOccurrences = (): ScheduleOccurrence[] => {
    if (!classData) return [];
    const occurrences: ScheduleOccurrence[] = [];
    
    // Convert start and end dates to Date objects
    const startDate = new Date(classData.start_date);
    const endDate = new Date(classData.end_date);
    
    // For each recurring schedule
    recurringSchedules.forEach(schedule => {
      let currentDate = new Date(startDate);
      
      // Iterate through all dates between start and end
      while (currentDate <= endDate) {
        // Convert JavaScript's Sunday-based day (0-6) to Monday-based day (0-6)
        const jsDay = currentDate.getDay();
        const pythonDay = jsDay === 0 ? 6 : jsDay - 1;
        
        // If this is the right day of the week for this schedule
        if (pythonDay === schedule.day_of_week) {
          // Check if this occurrence is not replaced by a special schedule
          const dateString = currentDate.toISOString().split('T')[0];
          const isReplaced = specialSchedules.some(
            special => 
              special.replaced_schedule_id === schedule.id && 
              special.date === dateString
          );
          
          // Only add if not replaced
          if (!isReplaced) {
            occurrences.push({
              scheduleId: schedule.id.toString(),
              date: dateString,
              displayText: `${formatDayOfWeek(schedule.day_of_week)}, ${currentDate.toLocaleDateString()} at ${new Date(`1970-01-01T${schedule.start_time}`).toLocaleTimeString()}`
            });
          }
        }
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    
    // Sort by date
    return occurrences.sort((a, b) => a.date.localeCompare(b.date));
  };

  const getAllScheduleEvents = (): TimelineEvent[] => {
    if (!recurringSchedules || !specialSchedules) return [];

    const events: TimelineEvent[] = [];

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
          date: special.replaced_schedule_date ? new Date(special.replaced_schedule_date) : undefined,
        } : undefined,
        isReplaced: false,
        isReplacedById: undefined,
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
          const isReplaced = specialSchedules.find(
            special => 
              special.replaced_schedule_id === recurring.id && 
              special.replaced_schedule_date === currentDate.toISOString().split('T')[0]
          );

            events.push({
              date: new Date(currentDate),
              type: 'recurring',
              startTime: recurring.start_time,
              endTime: recurring.end_time,
              status: recurring.status,
              isReplaced: !!isReplaced,
              isReplacedById: isReplaced?.id?.toString(),
          });
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

  return {
    getAllScheduleEvents,
    getAllRegularScheduleOccurrences,
  };
} 
import { useState } from 'react';
import { useToast } from '../../../hooks/use-toast';
import { AxiosError } from 'axios';
import { 
  useRecurringSchedules, 
  useCreateRecurringSchedule, 
  useDeleteRecurringSchedule, 
  useUpdateRecurringScheduleStatus,
} from '../../../lib/api/schedules';

interface CreateRecurringScheduleData {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export function useRegularSchedules(classId: number) {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const { 
    data: recurringSchedules, 
    isLoading: isLoadingRecurring 
  } = useRecurringSchedules(classId);

  const { 
    mutate: createRecurringSchedule, 
    isPending: isCreatingRecurring 
  } = useCreateRecurringSchedule(classId);

  const { mutate: deleteRecurringSchedule } = useDeleteRecurringSchedule();
  const { mutate: updateRecurringStatus } = useUpdateRecurringScheduleStatus();

  const handleCreateRecurringSchedule = async (data: CreateRecurringScheduleData) => {
    setError(null);
    try {
      await createRecurringSchedule(data);
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

  return {
    recurringSchedules: recurringSchedules ?? [],
    isLoadingRecurring,
    isCreatingRecurring,
    error,
    setError,
    handleCreateRecurringSchedule,
    deleteRecurringSchedule,
    updateRecurringStatus,
  };
} 
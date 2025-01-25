import { useState } from 'react';
import { useToast } from '../../../hooks/use-toast';
import { AxiosError } from 'axios';
import { 
  useSpecialSchedules as useSpecialSchedulesApi,
  useCreateSpecialSchedule,
  useDeleteSpecialSchedule,
  useUpdateSpecialScheduleStatus,
  useRecurringScheduleOccurrences,
  type SpecialSchedule 
} from '../../../lib/api/schedules';

interface CreateSpecialScheduleData {
  date: string;
  start_time: string;
  end_time: string;
  status: SpecialSchedule['status'];
  note?: string;
  replaced_schedule_id?: number;
  replaced_schedule_date?: string;
}

interface UseSpecialSchedulesReturn {
  specialSchedules: SpecialSchedule[];
  isLoadingSpecial: boolean;
  isCreatingSpecial: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  selectedRecurringSchedule: number | null;
  setSelectedRecurringSchedule: (id: number | null) => void;
  specialSessionType: SpecialSchedule['status'];
  setSpecialSessionType: (type: SpecialSchedule['status']) => void;
  handleCreateSpecialSchedule: (data: CreateSpecialScheduleData) => Promise<void>;
  deleteSpecialSchedule: (id: number) => void;
  updateSpecialStatus: (params: { scheduleId: number; status: SpecialSchedule['status'] }) => void;
}

export function useSpecialSchedules(classId: number): UseSpecialSchedulesReturn {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [selectedRecurringSchedule, setSelectedRecurringSchedule] = useState<number | null>(null);
  const [specialSessionType, setSpecialSessionType] = useState<SpecialSchedule['status']>('scheduled');

  const { 
    data: specialSchedules, 
    isLoading: isLoadingSpecial 
  } = useSpecialSchedulesApi(classId);



  const { 
    mutate: createSpecialSchedule, 
    isPending: isCreatingSpecial 
  } = useCreateSpecialSchedule(classId);

  const { mutate: deleteSpecialSchedule } = useDeleteSpecialSchedule();
  const { mutate: updateSpecialStatus } = useUpdateSpecialScheduleStatus();

  const handleCreateSpecialSchedule = async (data: CreateSpecialScheduleData) => {
    setError(null);
    try {
      createSpecialSchedule(data);
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

  return {
    specialSchedules: specialSchedules ?? [],
    isLoadingSpecial,
    isCreatingSpecial,
    error,
    setError,
    selectedRecurringSchedule,
    setSelectedRecurringSchedule,
    specialSessionType,
    setSpecialSessionType,
    handleCreateSpecialSchedule,
    deleteSpecialSchedule,
    updateSpecialStatus,
  };
} 
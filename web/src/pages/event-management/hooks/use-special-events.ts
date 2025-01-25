import { useQueryClient } from '@tanstack/react-query';
import { CreateSpecialEvent } from '@/lib/api/types';
import { 
  useSpecialEvents as useSpecialEventsQuery,
  useCreateSpecialEvent,
  useUpdateSpecialEvent,
  useDeleteSpecialEvent,
} from '@/lib/api/events';

export function useSpecialEvents() {
  const queryClient = useQueryClient();
  const { data: specialEvents = [], isLoading, error } = useSpecialEventsQuery();
  
  const createMutation = useCreateSpecialEvent();
  const updateMutation = useUpdateSpecialEvent();
  const deleteMutation = useDeleteSpecialEvent();

  const createSpecialEvent = async (data: CreateSpecialEvent) => {
    await createMutation.mutateAsync(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['special-events'] });
      },
    });
  };

  const updateSpecialEvent = async (id: string, data: CreateSpecialEvent) => {
    await updateMutation.mutateAsync({ id, data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['special-events'] });
      },
    });
  };

  const deleteSpecialEvent = async (id: string) => {
    await deleteMutation.mutateAsync(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['special-events'] });
      },
    });
  };

  return {
    specialEvents,
    isLoading: isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    error: error || createMutation.error || updateMutation.error || deleteMutation.error,
    createSpecialEvent,
    updateSpecialEvent,
    deleteSpecialEvent,
  };
} 
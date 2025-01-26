import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/api';

interface SocialLink {
  platform: string;
  url: string;
}

interface SpecialEvent {
  id: number;
  name: string;
  description: string;
  datetime: string;
  capacity: number;
  location: string;
  instructorId: number;
  instructorName: string;
  socialLinks: SocialLink[];
}

interface CreateSpecialEventData {
  name: string;
  description: string;
  datetime: Date;
  capacity: number;
  location: string;
  instructorId: number;
  socialLinks: SocialLink[];
}

export function useSpecialEvents() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const {
    data: specialEvents,
    isLoading,
    error: fetchError,
  } = useQuery<SpecialEvent[]>({
    queryKey: ['special-events'],
    queryFn: () => api.get('/api/special-events/').then((res) => res.data),
  });

  const { mutate: createSpecialEvent, isPending: isCreating } = useMutation({
    mutationFn: (data: CreateSpecialEventData) =>
      api.post('/api/special-events/', data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['special-events'] });
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const { mutate: deleteSpecialEvent } = useMutation({
    mutationFn: (id: number) =>
      api.delete(`/api/special-events/${id}/`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['special-events'] });
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  return {
    specialEvents,
    isLoading,
    error: error || fetchError,
    createSpecialEvent,
    isCreating,
    deleteSpecialEvent,
  };
} 
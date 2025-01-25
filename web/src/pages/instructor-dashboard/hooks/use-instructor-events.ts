import { useInstructorEvents } from '@/lib/api/events';

interface SocialLink {
  platform: string;
  url: string;
}

export interface SpecialEvent {
  id: number;
  name: string;
  description: string;
  datetime: string;
  capacity: number;
  currentCapacity: number;
  location: string;
  instructorId: number;
  instructorName: string;
  socialLinks: SocialLink[];
  price: number;
}

export interface EventStats {
  totalEvents: number;
  upcomingEvents: number;
  totalParticipants: number;
}

// Mock data

export function useInstructorEventsHooks(instructorId: string) {
  const { data: events, isLoading } = useInstructorEvents(instructorId);

  const stats: EventStats = {
    totalEvents: events?.length || 0,
    upcomingEvents: events?.filter(event => new Date(event.datetime) > new Date()).length || 0,
    totalParticipants: events?.reduce((acc, event) => acc + event.current_capacity, 0) || 0,
  };

  return {
    events,
    isLoading,
    stats,
  };
} 
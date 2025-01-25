import { useClasses } from '@/lib/api/classes';

export interface ClassStats {
  totalClasses: number;
  totalStudents: number;
  averageCapacity: string;
}

export function useInstructorClasses() {
  const { data: classes, isLoading } = useClasses();

  const stats: ClassStats = {
    totalClasses: classes?.length || 0,
    totalStudents: classes?.reduce((acc: number, cls) => acc + (cls.current_capacity || 0), 0) || 0,
    averageCapacity: classes?.length 
      ? Math.round(
          (classes.reduce((acc: number, cls) => 
            acc + ((cls.current_capacity || 0) / (cls.max_capacity || 0)) * 100, 0
          ) / classes.length)
        ) + '%'
      : '0%'
  };

  return {
    classes,
    isLoading,
    stats,
  };
} 
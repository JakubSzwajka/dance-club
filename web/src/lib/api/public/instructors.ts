import { $api } from '../queryClient';

export function usePublicInstructors() {
  return $api.useQuery('get', '/api/public/instructors');
}

export function usePublicInstructor(id: string) {
  return $api.useQuery('get', '/api/public/instructors/{instructor_id}', {
    params: {
      path: {
        instructor_id: id
      }
    }
  });
}

export function usePublicInstructorClasses(id: string, includePast: boolean = false) {
  return $api.useQuery('get', '/api/public/instructors/{instructor_id}/classes', {
    params: {
      path: {
        instructor_id: id
      },
      query: {
        include_past: includePast
      }
    }
  });
} 
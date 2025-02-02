import { $api } from "./queryClient";

// ------------ PRIVATE INSTRUCTOR ------------

export function useInstructorClassesQuery(instructorId: string) {
    return $api.useQuery('get', "/api/private/instructors/{instructor_id}/classes", {
        params: {
            path: {
                instructor_id: instructorId
            }
        }
    });
}

export function useInstructorClassQuery(instructorId: string, classId: string) {
    return $api.useQuery('get', "/api/private/instructors/{instructor_id}/classes/{class_id}", {
        params: {
            path: {
                instructor_id: instructorId,
                class_id: classId
            }
        }
    });
}

export function useCreateClassMutation() {
  return $api.useMutation('post', "/api/private/instructors/{instructor_id}/classes");  
}


export function useInstructorStatsQuery(instructorId: string) {
    return $api.useQuery('get', "/api/private/instructors/{instructor_id}/stats", {
        params: {
            path: {
                instructor_id: instructorId
            }
        }
    });
}
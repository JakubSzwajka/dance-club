import { $api } from '../queryClient';


export function usePublicClasses(
  instructorId?: string | null,
  locationId?: string | null,
  style?: string | null,
  level?: string | null,
  startDate?: string | null,
  endDate?: string | null,
  minRating?: number | null,
  sortBy?: string | null
) {
  return $api.useQuery('get', '/api/public/classes', {
    params: {
      query: {
        instructor_id: instructorId,
        location_id: locationId,
        style,
        level,
        start_date: startDate,
        end_date: endDate,
        min_rating: minRating,
        sort_by: sortBy
      }
    }
  });
}

export function usePublicClass(id: string) {
  return $api.useQuery('get', '/api/public/classes/{class_id}', {
    params: {
      path: {
        class_id: id
      }
    }
  });
}

export function useClassReviews(
  classId: string,
  page: number = 1,
  pageSize: number = 10,
  sortBy?: string | null
) {
  return $api.useQuery('get', '/api/public/classes/{class_id}/reviews', {
    params: {
      path: {
        class_id: classId
      },
      query: {
        page,
        page_size: pageSize,
        sort_by: sortBy
      }
    }
  });
}

export function useClassStats(id: string) {
  return $api.useQuery('get', '/api/public/classes/{class_id}/stats', {
    params: {
      path: {
        class_id: id
      }
    }
  });
}

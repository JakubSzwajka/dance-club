import { $api } from '../queryClient'

export function useReviewTeaching(reviewId: string) {
  return $api.useQuery('get', '/api/public/reviews/{review_id}/teaching', {
    params: {
      path: {
        review_id: reviewId,
      },
    },
  })
}

export function useReviewEnvironment(reviewId: string) {
  return $api.useQuery('get', '/api/public/reviews/{review_id}/environment', {
    params: {
      path: {
        review_id: reviewId,
      },
    },
  })
}

export function useReviewMusic(reviewId: string) {
  return $api.useQuery('get', '/api/public/reviews/{review_id}/music', {
    params: {
      path: {
        review_id: reviewId,
      },
    },
  })
}

export function useReviewFacilities(reviewId: string) {
  return $api.useQuery('get', '/api/public/reviews/{review_id}/facilities', {
    params: {
      path: {
        review_id: reviewId,
      },
    },
  })
}

export function useReviewMetadata() {
  return $api.useQuery('get', '/api/public/reviews/metadata')
}

export function useVerifyReview() {
  return $api.useMutation('post', '/api/public/reviews/{review_id}/verify')
}

export function useVerificationMethods() {
  return $api.useQuery('get', '/api/public/reviews/verification-methods')
}

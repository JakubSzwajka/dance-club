// import { Card } from "@/components/ui/card"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { StarIcon } from "@heroicons/react/24/solid"
// import { usePublicInstructorReviews } from "@/lib/api/public"

// interface ReviewsSectionProps {
//   instructorId: string
// }

// export function ReviewsSection({ instructorId }: ReviewsSectionProps) {
//   const { data: reviews = [], isLoading } = usePublicInstructorReviews(instructorId)

//   if (isLoading) {
//     return (
//       <div className="space-y-6">
//         {[1, 2, 3].map((i) => (
//           <Card key={i} className="p-6 animate-pulse">
//             <div className="flex items-start gap-4">
//               <div className="h-10 w-10 rounded-full bg-muted" />
//               <div className="flex-1">
//                 <div className="h-4 bg-muted rounded w-1/4 mb-2" />
//                 <div className="h-4 bg-muted rounded w-1/3 mb-4" />
//                 <div className="space-y-2">
//                   <div className="h-4 bg-muted rounded w-full" />
//                   <div className="h-4 bg-muted rounded w-3/4" />
//                 </div>
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>
//     )
//   }

//   if (!reviews?.length) {
//     return (
//       <Card className="p-6">
//         <p className="text-center text-muted-foreground">
//           No reviews yet.
//         </p>
//       </Card>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {reviews.map((review) => (
//         <Card key={review.id} className="p-6">
//           <div className="flex items-start gap-4">
//             <Avatar>
//               <AvatarFallback>{review.student_name[0]}</AvatarFallback>
//             </Avatar>

//             <div className="flex-1">
//               <div className="flex items-center justify-between mb-2">
//                 <h4 className="font-medium">{review.student_name}</h4>
//                 <div className="flex items-center gap-1">
//                   {[...Array(5)].map((_, i) => (
//                     <StarIcon
//                       key={i}
//                       className={`h-4 w-4 ${
//                         i < review.rating
//                           ? 'text-yellow-400'
//                           : 'text-gray-200'
//                       }`}
//                     />
//                   ))}
//                 </div>
//               </div>

//               <div className="text-sm text-muted-foreground mb-2">
//                 {new Date(review.created_at).toLocaleDateString()}
//               </div>

//               <p className="text-sm">{review.comment}</p>
//             </div>
//           </div>
//         </Card>
//       ))}
//     </div>
//   )
// }

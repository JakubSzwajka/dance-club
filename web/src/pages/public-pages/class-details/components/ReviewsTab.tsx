import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StarIcon } from "@heroicons/react/24/outline"

export function ReviewsTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Student Reviews</h2>
        <Button>Write a Review</Button>
      </div>

      <div className="grid gap-6">
        {/* Example reviews - replace with actual data */}
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="py-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="font-medium">Student Name</div>
                  <div className="text-sm text-muted-foreground">2 months ago</div>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 
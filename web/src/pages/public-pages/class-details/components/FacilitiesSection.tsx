import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarIcon } from "@heroicons/react/24/solid"
import { 
  BuildingOffice2Icon, 
  ClockIcon, 
  CreditCardIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline"
import { cn } from "@/lib/utils"

interface FacilitiesData {
  changingRoom: {
    available: boolean
    averageQuality: number
    features: string[]
  }
  waitingArea: {
    available: boolean
    type: 'indoor' | 'outdoor' | 'both'
    seating: boolean
    features: string[]
  }
  acceptedCards: {
    name: string
    popularity: number // percentage of reviews mentioning this card
  }[]
}

// This would come from your backend, aggregated from all reviews
const mockFacilitiesData: FacilitiesData = {
  changingRoom: {
    available: true,
    averageQuality: 4,
    features: [
      "Lockers available",
      "Showers",
      "Mirrors",
      "Hair dryers"
    ]
  },
  waitingArea: {
    available: true,
    type: 'both',
    seating: true,
    features: [
      "Water dispenser",
      "Comfortable seating",
      "Air conditioning",
      "WiFi available"
    ]
  },
  acceptedCards: [
    { name: "MultiSport", popularity: 85 },
    { name: "Medicover Sport", popularity: 65 },
    { name: "OK System", popularity: 45 },
    { name: "BeActive", popularity: 30 }
  ]
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon 
          key={star} 
          className={cn(
            "h-5 w-5",
            star <= rating ? "text-yellow-400" : "text-muted"
          )}
        />
      ))}
    </div>
  )
}

function MetricWithIcon({ icon: Icon, label, children }: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-muted rounded-lg shrink-0">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium">{label}</p>
        {children}
      </div>
    </div>
  )
}

export function FacilitiesSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Facilities & Amenities</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Changing Room Card */}
        <Card>
          <CardContent className="p-6">
            <MetricWithIcon icon={BuildingOffice2Icon} label="Changing Room">
              <div className="space-y-3 mt-2">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">
                    {mockFacilitiesData.changingRoom.available ? "Available" : "Not Available"}
                  </Badge>
                  {mockFacilitiesData.changingRoom.available && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Quality:</span>
                      <StarRating rating={mockFacilitiesData.changingRoom.averageQuality} />
                    </div>
                  )}
                </div>
                {mockFacilitiesData.changingRoom.available && (
                  <div className="flex flex-wrap gap-2">
                    {mockFacilitiesData.changingRoom.features.map((feature) => (
                      <Badge key={feature} variant="outline">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </MetricWithIcon>
          </CardContent>
        </Card>

        {/* Waiting Area Card */}
        <Card>
          <CardContent className="p-6">
            <MetricWithIcon icon={UserGroupIcon} label="Waiting Area">
              <div className="space-y-3 mt-2">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">
                    {mockFacilitiesData.waitingArea.available ? "Available" : "Not Available"}
                  </Badge>
                  {mockFacilitiesData.waitingArea.available && (
                    <>
                      <Badge variant="secondary" className="capitalize">
                        {mockFacilitiesData.waitingArea.type} Area
                      </Badge>
                      <Badge variant={mockFacilitiesData.waitingArea.seating ? "secondary" : "outline"}>
                        {mockFacilitiesData.waitingArea.seating ? "Seating Available" : "No Seating"}
                      </Badge>
                    </>
                  )}
                </div>
                {mockFacilitiesData.waitingArea.available && (
                  <div className="flex flex-wrap gap-2">
                    {mockFacilitiesData.waitingArea.features.map((feature) => (
                      <Badge key={feature} variant="outline">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </MetricWithIcon>
          </CardContent>
        </Card>

        {/* Sports Cards Card */}
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <MetricWithIcon icon={CreditCardIcon} label="Accepted Sports Cards">
              <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-4">
                {mockFacilitiesData.acceptedCards.map((card) => (
                  <div key={card.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{card.name}</span>
                      <Badge variant="secondary">{card.popularity}% usage</Badge>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${card.popularity}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </MetricWithIcon>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
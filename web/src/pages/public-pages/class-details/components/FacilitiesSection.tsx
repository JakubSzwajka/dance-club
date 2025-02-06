import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BuildingOffice2Icon, CreditCardIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { Map, Marker } from '@vis.gl/react-google-maps'
import { usePublicLocation, usePublicLocationStats } from '@/lib/api/public/index'

function MetricWithIcon({
  icon: Icon,
  label,
  children,
}: {
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

interface FacilitiesSectionProps {
  locationId: string
}

export function FacilitiesSection({ locationId }: FacilitiesSectionProps) {
  const { data: location } = usePublicLocation(locationId)
  const { data: _locationStats } = usePublicLocationStats(locationId)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Facilities & Amenities</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Changing Room Card */}
        <Card className="">
          <CardContent className="p-6">
            <MetricWithIcon icon={BuildingOffice2Icon} label="Facilities">
              <div className="space-y-3 mt-2">
                <div className="flex flex-wrap gap-2">
                  {facilities.map(feature => (
                    <Badge key={feature} variant="outline">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </MetricWithIcon>
          </CardContent>
          <CardContent>
            <MetricWithIcon icon={CreditCardIcon} label="Accepted Sports Cards">
              <div className="flex flex-wrap gap-4 mt-4">
                {sportsCards.map(card => (
                  <Badge key={card} variant="outline">
                    {card}
                  </Badge>
                ))}
              </div>
            </MetricWithIcon>
          </CardContent>
          <CardContent>
            <MetricWithIcon icon={MapPinIcon} label="Location">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <div>
                    <p className="font-medium">{location?.name}</p>
                    <p className="text-muted-foreground">{location?.address}</p>
                  </div>
                </div>
              </div>
            </MetricWithIcon>
          </CardContent>
        </Card>

        <Card className="p-4">
          {location && (
            <div className="h-full bg-muted rounded-lg">
              <Map
                zoom={12}
                center={{ lat: Number(location.latitude), lng: Number(location.longitude) }}
              >
                <Marker
                  position={{ lat: Number(location.latitude), lng: Number(location.longitude) }}
                />
              </Map>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

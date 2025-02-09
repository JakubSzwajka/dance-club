import { Card } from '@/components/ui/card'
import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { components } from '@/lib/api/schema'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { LocationSearchParams } from '@/components/domain/locations-map/types'

type Facilities = components['schemas']['Facilities']
type SportsCard = components['schemas']['SportsCard']

interface LocationFiltersProps {
  search: LocationSearchParams
  updateFilters: (updates: Partial<LocationSearchParams>) => void
  onClearAll: () => void
  danceStyles?: string[]
  facilityOptions?: Facilities[]
  sportsCardOptions?: SportsCard[]
}

export function LocationFilters({
  search,
  updateFilters,
  onClearAll,
  danceStyles = [],
  facilityOptions = [],
  sportsCardOptions = [],
}: LocationFiltersProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Location Filters</h2>
        <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Dance Style</Label>
          <Select
            value={search.danceStyle}
            onValueChange={value => updateFilters({ danceStyle: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by style" />
            </SelectTrigger>
            <SelectContent>
              {danceStyles.map(style => (
                <SelectItem key={style} value={style}>
                  {style}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Minimum Classes</Label>
          <Input
            type="number"
            min="1"
            value={search.minClasses || ''}
            onChange={e => updateFilters({ minClasses: e.target.value })}
            placeholder="Min. number of classes"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Required Facility</Label>
          <Select
            value={search.facility}
            onValueChange={value => updateFilters({ facility: value as Facilities })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select facility" />
            </SelectTrigger>
            <SelectContent>
              {facilityOptions.map(facility => (
                <SelectItem key={facility} value={facility}>
                  {facility.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Sports Card</Label>
          <Select
            value={search.sportsCard}
            onValueChange={value => updateFilters({ sportsCard: value as SportsCard })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sports card" />
            </SelectTrigger>
            <SelectContent>
              {sportsCardOptions.map(card => (
                <SelectItem key={card} value={card}>
                  {card.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button variant="outline" className="w-full mt-6" onClick={onClearAll}>
        Clear All Filters
      </Button>
    </Card>
  )
} 
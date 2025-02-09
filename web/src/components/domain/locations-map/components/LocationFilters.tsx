import { Card } from '@/components/ui/card'
import { ChevronRight, Check } from 'lucide-react'
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
import { cn } from '@/lib/utils'
import { useState } from 'react'

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
  const [isExpanded, setIsExpanded] = useState(false)

  const FilterLabel = ({ children, isActive }: { children: React.ReactNode; isActive: boolean }) => (
    <div className="flex items-center justify-between">
      <Label className={cn(
        "text-sm",
        isActive ? "font-bold text-primary" : "font-medium text-foreground"
      )}>
        {children}
      </Label>
      {isActive && <Check className="h-3 w-3 text-primary" />}
    </div>
  )

  const BasicFilters = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <FilterLabel isActive={!!search.danceStyle}>Dance Style</FilterLabel>
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
        <FilterLabel isActive={!!search.level}>Difficulty Level</FilterLabel>
        <Select
          value={search.level}
          onValueChange={value => updateFilters({ level: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            {['Beginner', 'Intermediate', 'Advanced'].map(level => (
              <SelectItem key={level} value={level.toLowerCase()}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <FilterLabel isActive={!!search.sportsCard}>Sports Card</FilterLabel>
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

      <div className="space-y-2">
        <FilterLabel isActive={!!search.radiusKm}>Distance from you</FilterLabel>
        <Input
          type="number"
          min="1"
          max="50"
          value={search.radiusKm || ''}
          onChange={e => updateFilters({ radiusKm: e.target.value })}
          placeholder="Distance in km"
        />
      </div>
    </div>
  )

  const AdvancedFilters = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <FilterLabel isActive={!!search.minRating}>Location Rating</FilterLabel>
        <Input
          type="number"
          min="1"
          max="5"
          step="0.1"
          value={search.minRating || ''}
          onChange={e => updateFilters({ minRating: e.target.value })}
          placeholder="Min. location rating"
        />
      </div>

      <div className="space-y-2">
        <FilterLabel isActive={!!search.facility}>Required Facility</FilterLabel>
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
        <FilterLabel isActive={!!search.minClasses}>Minimum Classes</FilterLabel>
        <Input
          type="number"
          min="1"
          value={search.minClasses || ''}
          onChange={e => updateFilters({ minClasses: e.target.value })}
          placeholder="Min. number of classes"
        />
      </div>
    </div>
  )

  return (
    <div className={cn(
      "relative transition-all duration-300 ease-in-out",
      isExpanded ? "w-[600px]" : "w-[280px]"
    )}>
      <Card className="p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Location Filters</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="hover:bg-transparent"
          >
            <ChevronRight className={cn(
              "h-5 w-5 transition-transform duration-300",
              isExpanded && "rotate-180"
            )} />
          </Button>
        </div>

        <div className="flex">
          {/* Basic filters with fixed width */}
          <div className="w-[240px] flex-shrink-0">
            <BasicFilters />
          </div>
          
          {/* Advanced filters with smooth width transition */}
          <div className={cn(
            "ml-6 transition-all duration-300 ease-in-out",
            isExpanded 
              ? "w-[240px] opacity-100 translate-x-0" 
              : "w-0 opacity-0 -translate-x-4 pointer-events-none"
          )}>
            <div className="w-[240px]">
              <AdvancedFilters />
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full mt-6" onClick={onClearAll}>
          Clear All Filters
        </Button>
      </Card>
    </div>
  )
} 
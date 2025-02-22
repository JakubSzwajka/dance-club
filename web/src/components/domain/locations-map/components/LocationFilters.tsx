import { Card } from '@/components/ui/card'
import { ChevronRight, Check, X } from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'

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

  const FilterLabel = ({
    children,
    isActive,
  }: {
    children: React.ReactNode
    isActive: boolean
  }) => (
    <div className="flex items-center justify-between">
      <Label
        className={cn(
          'text-sm',
          isActive ? 'font-bold text-primary' : 'font-medium text-foreground'
        )}
      >
        {children}
      </Label>
      {isActive && <Check className="h-3 w-3 text-primary" />}
    </div>
  )

  // Helper function to handle multi-select values
  const getSelectedValues = (value: string | undefined) => {
    return value ? value.split(',') : []
  }

  // Helper function to format selected values for display
  const formatSelectedValues = (values: string[]) => {
    if (values.length === 0) return ''
    if (values.length === 1) return values[0]
    return `${values.length} selected`
  }

  const BasicFilters = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <FilterLabel isActive={!!search.danceStyle}>Dance Style</FilterLabel>
        <Select
          value={search.danceStyle}
          onValueChange={value => {
            const current = getSelectedValues(search.danceStyle)
            const updated = current.includes(value)
              ? current.filter(s => s !== value)
              : [...current, value]
            updateFilters({ danceStyle: updated.join(',') })
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by style">
              {formatSelectedValues(getSelectedValues(search.danceStyle))}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {danceStyles.map(style => (
              <SelectItem key={style} value={style}>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={getSelectedValues(search.danceStyle).includes(style)}
                    onChange={e => {
                      e.preventDefault()
                      const current = getSelectedValues(search.danceStyle)
                      const updated = current.includes(style)
                        ? current.filter(s => s !== style)
                        : [...current, style]
                      updateFilters({ danceStyle: updated.join(',') })
                    }}
                  />
                  {style}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {search.danceStyle && (
          <div className="flex flex-wrap gap-2 mt-2">
            {getSelectedValues(search.danceStyle).map(style => (
              <Badge key={style} variant="secondary" className="flex items-center gap-1">
                {style}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => {
                    const newStyles = getSelectedValues(search.danceStyle).filter(s => s !== style)
                    updateFilters({ danceStyle: newStyles.join(',') })
                  }}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <FilterLabel isActive={!!search.level}>Difficulty Level</FilterLabel>
        <Select
          value={search.level}
          onValueChange={value => {
            const current = getSelectedValues(search.level)
            const updated = current.includes(value)
              ? current.filter(l => l !== value)
              : [...current, value]
            updateFilters({ level: updated.join(',') })
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select level">
              {formatSelectedValues(getSelectedValues(search.level))}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {['Beginner', 'Intermediate', 'Advanced'].map(level => (
              <SelectItem key={level} value={level.toLowerCase()}>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={getSelectedValues(search.level).includes(level.toLowerCase())}
                    onChange={e => {
                      e.preventDefault()
                      const current = getSelectedValues(search.level)
                      const updated = current.includes(level.toLowerCase())
                        ? current.filter(l => l !== level.toLowerCase())
                        : [...current, level.toLowerCase()]
                      updateFilters({ level: updated.join(',') })
                    }}
                  />
                  {level}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {search.level && (
          <div className="flex flex-wrap gap-2 mt-2">
            {getSelectedValues(search.level).map(level => (
              <Badge key={level} variant="secondary" className="flex items-center gap-1">
                {level}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => {
                    const newLevels = getSelectedValues(search.level).filter(l => l !== level)
                    updateFilters({ level: newLevels.join(',') })
                  }}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <FilterLabel isActive={!!search.sportsCard}>Sports Card</FilterLabel>
        <Select
          value={search.sportsCard}
          onValueChange={value => {
            const current = getSelectedValues(search.sportsCard)
            const updated = current.includes(value)
              ? current.filter(c => c !== value)
              : [...current, value]
            updateFilters({ sportsCard: updated.join(',') as SportsCard })
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select sports card">
              {formatSelectedValues(getSelectedValues(search.sportsCard))}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {sportsCardOptions.map(card => (
              <SelectItem key={card} value={card}>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={getSelectedValues(search.sportsCard).includes(card)}
                    onChange={e => {
                      e.preventDefault()
                      const current = getSelectedValues(search.sportsCard)
                      const updated = current.includes(card)
                        ? current.filter(c => c !== card)
                        : [...current, card]
                      updateFilters({ sportsCard: updated.join(',') as SportsCard })
                    }}
                  />
                  {card.replace('_', ' ')}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {search.sportsCard && (
          <div className="flex flex-wrap gap-2 mt-2">
            {getSelectedValues(search.sportsCard).map(card => (
              <Badge key={card} variant="secondary" className="flex items-center gap-1">
                {card.replace('_', ' ')}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => {
                    const newCards = getSelectedValues(search.sportsCard).filter(c => c !== card)
                    updateFilters({ sportsCard: newCards.join(',') as SportsCard })
                  }}
                />
              </Badge>
            ))}
          </div>
        )}
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
          onValueChange={value => {
            const current = getSelectedValues(search.facility)
            const updated = current.includes(value)
              ? current.filter(f => f !== value)
              : [...current, value]
            updateFilters({ facility: updated.join(',') as Facilities })
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select facility">
              {formatSelectedValues(getSelectedValues(search.facility))}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {facilityOptions.map(facility => (
              <SelectItem key={facility} value={facility}>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={getSelectedValues(search.facility).includes(facility)}
                    onChange={e => {
                      e.preventDefault()
                      const current = getSelectedValues(search.facility)
                      const updated = current.includes(facility)
                        ? current.filter(f => f !== facility)
                        : [...current, facility]
                      updateFilters({ facility: updated.join(',') as Facilities })
                    }}
                  />
                  {facility.replace('_', ' ')}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {search.facility && (
          <div className="flex flex-wrap gap-2 mt-2">
            {getSelectedValues(search.facility).map(facility => (
              <Badge key={facility} variant="secondary" className="flex items-center gap-1">
                {facility.replace('_', ' ')}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => {
                    const newFacilities = getSelectedValues(search.facility).filter(
                      f => f !== facility
                    )
                    updateFilters({ facility: newFacilities.join(',') as Facilities })
                  }}
                />
              </Badge>
            ))}
          </div>
        )}
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
    <div
      className={cn(
        'relative transition-all duration-300 ease-in-out',
        isExpanded ? 'w-[600px]' : 'w-[280px]'
      )}
    >
      <Card className="p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Location Filters</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="hover:bg-transparent"
          >
            <ChevronRight
              className={cn(
                'h-5 w-5 transition-transform duration-300',
                isExpanded && 'rotate-180'
              )}
            />
          </Button>
        </div>

        <div className="flex">
          {/* Basic filters with fixed width */}
          <div className="w-[240px] flex-shrink-0">
            <BasicFilters />
          </div>

          {/* Advanced filters with smooth width transition */}
          <div
            className={cn(
              'ml-6 transition-all duration-300 ease-in-out',
              isExpanded
                ? 'w-[240px] opacity-100 translate-x-0'
                : 'w-0 opacity-0 -translate-x-4 pointer-events-none'
            )}
          >
            <div className="w-[240px]">
              <AdvancedFilters />
            </div>
          </div>
        </div>

        <Button className="w-full mt-6" onClick={onClearAll}>
          Clear All Filters
        </Button>
      </Card>
    </div>
  )
}

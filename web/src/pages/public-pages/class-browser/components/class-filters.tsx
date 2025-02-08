import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { CalendarIcon, SlidersHorizontal } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ActiveFilters } from './active-filters'
import { components } from '@/lib/api/schema'

type InstructorPublicSchema = components['schemas']['InstructorPublicSchema']
type LocationSchema = components['schemas']['LocationSchema']

export interface ClassSearchParams {
  instructor?: string
  style?: string
  level?: string
  location?: string
  start_date?: string
  end_date?: string
  min_rating?: string
  sort_by?: string
}

interface ClassFiltersProps {
  search: ClassSearchParams
  updateFilters: (updates: Partial<ClassSearchParams>) => void
  onClearAll: () => void
  instructors?: InstructorPublicSchema[]
  locations?: LocationSchema[]
  danceStyles?: string[]
}

export function ClassFilters({
  search,
  updateFilters,
  onClearAll,
  instructors,
  locations,
  danceStyles,
}: ClassFiltersProps) {
  const {
    instructor: selectedInstructor,
    style: selectedStyle,
    level: selectedLevel,
    location: selectedLocation,
    start_date: selectedStartDate,
    end_date: selectedEndDate,
    min_rating: selectedMinRating,
    sort_by: selectedSortBy,
  } = search

  return (
    <div className="sticky top-8">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Sort By</label>
            <Select
              value={selectedSortBy}
              onValueChange={value => updateFilters({ sort_by: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date_asc">Date (Earliest First)</SelectItem>
                <SelectItem value="date_desc">Date (Latest First)</SelectItem>
                <SelectItem value="rating_desc">Highest Rated</SelectItem>
                <SelectItem value="price_asc">Price (Low to High)</SelectItem>
                <SelectItem value="price_desc">Price (High to Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Instructor</label>
            <Select
              value={selectedInstructor}
              onValueChange={value => updateFilters({ instructor: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select instructor" />
              </SelectTrigger>
              <SelectContent>
                {instructors?.map(instructor => (
                  <SelectItem key={instructor.id} value={instructor.id}>
                    {instructor.first_name} {instructor.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Select
              value={selectedLocation}
              onValueChange={value => updateFilters({ location: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations?.map(location => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Dance Style</label>
            <Select value={selectedStyle} onValueChange={value => updateFilters({ style: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                {danceStyles?.map(style => (
                  <SelectItem key={style} value={style}>
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Level</label>
            <Select value={selectedLevel} onValueChange={value => updateFilters({ level: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Date Range</Label>
            <div className="grid gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !selectedStartDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedStartDate ? format(new Date(selectedStartDate), 'PPP') : 'Start date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedStartDate ? new Date(selectedStartDate) : undefined}
                    onSelect={date => updateFilters({ start_date: date?.toISOString() })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !selectedEndDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedEndDate ? format(new Date(selectedEndDate), 'PPP') : 'End date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedEndDate ? new Date(selectedEndDate) : undefined}
                    onSelect={date => updateFilters({ end_date: date?.toISOString() })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Minimum Rating</Label>
            <Input
              type="number"
              min="0"
              max="5"
              step="0.5"
              value={selectedMinRating || ''}
              onChange={e => updateFilters({ min_rating: e.target.value })}
              placeholder="e.g. 4.5"
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <ActiveFilters
            selectedInstructor={selectedInstructor}
            selectedStyle={selectedStyle}
            selectedLevel={selectedLevel}
            selectedLocation={selectedLocation}
            instructors={instructors || []}
            locations={locations || []}
            onClearInstructor={() => updateFilters({ instructor: undefined })}
            onClearStyle={() => updateFilters({ style: undefined })}
            onClearLevel={() => updateFilters({ level: undefined })}
            onClearLocation={() => updateFilters({ location: undefined })}
            onClearAll={onClearAll}
          />
        </div>
      </Card>
    </div>
  )
}

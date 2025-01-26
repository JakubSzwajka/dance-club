import { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Container } from "@/components/ui/container"
import { Header } from "@/components/domain/header"
import { EventCard } from "@/components/domain/event-card"
import { EventListItem } from "@/components/domain/event-list-item"
import { usePublicEvents, usePublicLocations, usePublicInstructors } from "@/lib/api/public"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { XMarkIcon, Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/outline"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "@heroicons/react/24/outline"
import { cn } from "@/lib/utils"

interface EventSearchParams {
  location?: string
  date?: string
  instructor?: string
  view?: 'grid' | 'list'
}

// Main Event Browser Component
export function EventBrowser() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/events' }) as EventSearchParams
  
  // Get filters from URL query params
  const selectedLocation = search.location
  const selectedDate = search.date ? new Date(search.date) : undefined
  const selectedInstructor = search.instructor
  const viewMode = search.view || 'grid'

  // Function to update URL with new filters
  const updateFilters = (updates: Partial<EventSearchParams>) => {
    const newSearch = {
      ...search,
      ...updates,
    }

    // Remove undefined values
    Object.keys(newSearch).forEach(key => {
      if (newSearch[key as keyof EventSearchParams] === undefined) {
        delete newSearch[key as keyof EventSearchParams]
      }
    })

    navigate({
      to: '/events/$eventId',
      params: { eventId: '' },
      search: newSearch as EventSearchParams,
    })
  }

  const { data: locations, isLoading: locationsLoading } = usePublicLocations()
  const { data: instructors } = usePublicInstructors()
  const { data: events, isLoading: eventsLoading } = usePublicEvents(
    selectedLocation,
    selectedInstructor,
    selectedDate?.toISOString()
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />      
      <div className="bg-muted/30 border-b">
        <Container>
          <div className="py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold">Special Events</h1>
                <p className="text-muted-foreground mt-1">
                  Discover unique dance events and workshops
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => updateFilters({ view: 'grid' })}
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => updateFilters({ view: 'list' })}
                >
                  <ListBulletIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Select 
                value={selectedLocation} 
                onValueChange={(value) => updateFilters({ location: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations?.map((location) => (
                    <SelectItem key={location.id} value={location.id.toString()}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={selectedInstructor} 
                onValueChange={(value) => updateFilters({ instructor: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select instructor" />
                </SelectTrigger>
                <SelectContent>
                  {instructors?.map((instructor) => (
                    <SelectItem key={instructor.id} value={instructor.id}>
                      {instructor.first_name} {instructor.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => updateFilters({ date: date?.toISOString() })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Active Filters */}
            {(selectedLocation || selectedDate || selectedInstructor) && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {selectedLocation && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {locations?.find(l => l.id.toString() === selectedLocation)?.name}
                    <XMarkIcon 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => updateFilters({ location: undefined })} 
                    />
                  </Badge>
                )}
                {selectedInstructor && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {instructors?.find(i => i.id === selectedInstructor)?.first_name} {instructors?.find(i => i.id === selectedInstructor)?.last_name}
                    <XMarkIcon 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => updateFilters({ instructor: undefined })} 
                    />
                  </Badge>
                )}
                {selectedDate && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Date: {format(selectedDate, "PP")}
                    <XMarkIcon 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => updateFilters({ date: undefined })} 
                    />
                  </Badge>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate({ 
                    to: '/events/$eventId',
                    params: { eventId: '' }
                  })} 
                  className="ml-2"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </Container>
      </div>

      {/* Events List */}
      <Container>
        <div className="py-8">
          {eventsLoading ? (
            <div className={cn(
              "grid gap-6",
              viewMode === 'grid' ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"
            )}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={cn(
                  "bg-muted animate-pulse rounded-lg",
                  viewMode === 'grid' ? "h-[400px]" : "h-[120px]"
                )} />
              ))}
            </div>
          ) : (
            <>
              <div className={cn(
                "grid gap-6",
                viewMode === 'grid' ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"
              )}>
                {events?.map((event) => (
                  viewMode === 'grid' ? (
                    <EventCard
                      key={event.id}
                      event={event}
                      onDetailsClick={() => {
                        navigate({
                          to: '/events/$eventId',
                          params: { eventId: event.id },
                        })
                      }}
                    />
                  ) : (
                    <EventListItem
                      key={event.id}
                      event={event}
                      onDetailsClick={() => {
                        navigate({
                          to: '/events/$eventId',
                          params: { eventId: event.id },
                        })
                      }}
                    />
                  )
                ))}
              </div>

              {events?.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold">No events found</h3>
                  <p className="text-muted-foreground mt-2">
                    Try adjusting your filters to see more events
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </div>
  )
}

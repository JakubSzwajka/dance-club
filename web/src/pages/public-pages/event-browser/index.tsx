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
import { usePublicEvents, usePublicLocations } from "@/lib/api/public"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { XMarkIcon } from "@heroicons/react/24/outline"
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
  startDate?: string
  endDate?: string
}

// Main Event Browser Component
export function EventBrowser() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/events' }) as EventSearchParams
  
  // Get filters from URL query params
  const selectedLocation = search.location
  const startDate = search.startDate ? new Date(search.startDate) : undefined
  const endDate = search.endDate ? new Date(search.endDate) : undefined

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
  const { data: events, isLoading: eventsLoading } = usePublicEvents(
    selectedLocation,
    undefined,
    startDate?.toISOString(),
    endDate?.toISOString()
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

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => updateFilters({ startDate: date?.toISOString() })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "End date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => updateFilters({ endDate: date?.toISOString() })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Active Filters */}
            {(selectedLocation || startDate || endDate) && (
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
                {startDate && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    From: {format(startDate, "PP")}
                    <XMarkIcon 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => updateFilters({ startDate: undefined })} 
                    />
                  </Badge>
                )}
                {endDate && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    To: {format(endDate, "PP")}
                    <XMarkIcon 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => updateFilters({ endDate: undefined })} 
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[400px] bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {events?.map((event) => (
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

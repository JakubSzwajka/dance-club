import { Container } from '@/components/ui/container'
import { Header } from '@/components/domain/header'
import { ClassItem } from '@/components/domain/class-item'
import { Loader } from '@/components/ui/loader'
import { Button } from '@/components/ui/button'
import { SlidersHorizontal } from 'lucide-react'
import {
  usePublicClasses,
  useMetadata,
  usePublicInstructors,
  usePublicLocationsNearby,
} from '@/lib/api/public/index'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { ClassFilters, ClassSearchParams } from './components/class-filters'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export function ClassBrowser() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/classes' }) as ClassSearchParams

  // Get filters from URL query params
  const selectedInstructor = search.instructor
  const selectedStyle = search.style
  const selectedLevel = search.level
  const selectedLocation = search.location
  const selectedStartDate = search.start_date
  const selectedEndDate = search.end_date
  const selectedMinRating = search.min_rating
  const selectedSortBy = search.sort_by

  // Function to update URL with new filters
  const updateFilters = (updates: Partial<ClassSearchParams>) => {
    const newSearch = {
      ...search,
      ...updates,
    }

    // Remove undefined values
    Object.keys(newSearch).forEach(key => {
      if (newSearch[key as keyof ClassSearchParams] === undefined) {
        delete newSearch[key as keyof ClassSearchParams]
      }
    })

    navigate({
      to: '/classes',
      search: newSearch as ClassSearchParams,
    })
  }

  const { data: locations } = usePublicLocationsNearby()
  const { data: instructors } = usePublicInstructors()
  const { data: classes, isLoading: isLoadingClasses } = usePublicClasses(
    selectedInstructor,
    selectedLocation,
    selectedStyle,
    selectedLevel,
    selectedStartDate,
    selectedEndDate,
    selectedMinRating ? parseFloat(selectedMinRating) : undefined,
    selectedSortBy
  )
  const { data: metadata } = useMetadata()
  const danceStyles = metadata?.dance_styles

  const FiltersContent = () => (
    <ClassFilters
      search={search}
      updateFilters={updateFilters}
      onClearAll={() => navigate({ to: '/classes' })}
      instructors={instructors}
      locations={locations}
      danceStyles={danceStyles}
    />
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="bg-muted/30 border-b">
        <Container>
          <div className="py-12">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold mb-3">Find Your Perfect Dance Class</h1>
              <p className="text-muted-foreground text-lg">
                Whether you're a beginner taking your first steps or an advanced dancer looking to
                perfect your moves, use our filters to discover classes that match your style,
                level, and schedule.
              </p>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-8">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="py-6">
                  <FiltersContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
            {/* Desktop Filters */}
            <div className="hidden lg:block">
              <div className="sticky top-8">
                <FiltersContent />
              </div>
            </div>

            {/* Classes List */}
            <div className="min-w-0">
              <div className="space-y-6">
                {isLoadingClasses ? (
                  <div className="py-12">
                    <Loader size="lg" text="Loading classes..." />
                  </div>
                ) : (
                  <>
                    {classes?.map(danceClass => (
                      <ClassItem
                        key={danceClass.id}
                        danceClass={danceClass}
                        onDetailsClick={id => {
                          navigate({
                            to: '/classes/$classId',
                            params: { classId: id },
                          })
                        }}
                      />
                    ))}

                    {classes?.length === 0 && (
                      <div className="text-center py-12">
                        <h3 className="text-lg font-semibold">No classes found</h3>
                        <p className="text-muted-foreground mt-2">
                          Try adjusting your filters to see more classes
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

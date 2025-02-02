import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Container } from "@/components/ui/container"
import { Header } from "@/components/domain/header"
import { ClassItem } from "./components/class-item"
import { ActiveFilters } from "./components/active-filters"
import { usePublicClasses, useMetadata, usePublicInstructors, usePublicLocations } from "@/lib/api/public/index"
import { useNavigate, useSearch } from "@tanstack/react-router"

interface ClassSearchParams {
  instructor?: string
  style?: string
  level?: string
  location?: string
}

// Main Class Browser Component
export function ClassBrowser() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/classes' }) as ClassSearchParams
  
  // Get filters from URL query params
  const selectedInstructor = search.instructor
  const selectedStyle = search.style
  const selectedLevel = search.level
  const selectedLocation = search.location

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

  const { data: instructors } = usePublicInstructors()
  const { data: classes } = usePublicClasses(
    selectedInstructor,
    selectedLocation,
    selectedStyle,
    selectedLevel,
    undefined,
    undefined
  )
  const { data: locations } = usePublicLocations()
  const { data: metadata } = useMetadata()
  const danceStyles = metadata?.dance_styles;

  return (
    <div className="min-h-screen bg-background">
      <Header />      
      <div className="bg-muted/30 border-b">
        <Container>
          <div className="py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold">Dance Classes</h1>
                <p className="text-muted-foreground mt-1">
                  Find your perfect dance class from our wide selection
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

              <Select 
                value={selectedLocation} 
                onValueChange={(value) => updateFilters({ location: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations?.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={selectedStyle} 
                onValueChange={(value) => updateFilters({ style: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  {danceStyles?.map((style) => (
                    <SelectItem key={style} value={style}>
                      {style}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={selectedLevel} 
                onValueChange={(value) => updateFilters({ level: value })}
              >
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
              onClearAll={() => navigate({ to: '/classes' })}
            />
          </div>
        </Container>
      </div>

      {/* Classes List */}
      <Container>
        <div className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {classes?.map((danceClass) => (
              <ClassItem
                key={danceClass.id}
                danceClass={danceClass}
                onDetailsClick={(id) => {
                  navigate({
                    to: '/classes/$classId',
                    params: { classId: id },
                  })
                }}
              />
            ))}
          </div>

          {classes?.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold">No classes found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your filters to see more classes
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}

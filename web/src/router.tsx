import { Outlet, createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { AuthProvider } from './lib/auth/AuthContext'
import { Toaster } from './components/ui/toaster'
import { APIProvider } from '@vis.gl/react-google-maps'
import { HomePage } from './pages/public-pages/main-page'
import { ClassBrowser } from './pages/public-pages/class-browser'
import { ClassDetailsPage as PublicClassDetailsPage } from './pages/public-pages/class-details'
import { InstructorDetailsPage } from './pages/public-pages/instructor-details'
import { LocationDetailsPage } from './pages/public-pages/location-details'
import { ReviewPage } from './pages/public-pages/review'
import { ProtectedLayout } from './components/layouts/ProtectedLayout'
import { InstructorPanelLayout } from './components/layouts/InstructorPanelLayout'
import { DashboardPage } from './pages/instructor-panel/dashboard/index'
import { ThemeProvider } from './context/theme-context'
import { GeneralSettings } from './pages/instructor-panel/settings/general'
import { NotificationSettings } from './pages/instructor-panel/settings/notifications'
import { TeachingSettings } from './pages/instructor-panel/settings/teaching'
import { ClassesPage } from './pages/instructor-panel/classes'
import { CreateClassPage } from './pages/instructor-panel/classes/new'
import { ClassDetailsPage } from './pages/instructor-panel/classes/$classId'
import { ClassSchedulePage } from './pages/instructor-panel/classes/$classId/schedule'
import { EditClassPage } from './pages/instructor-panel/classes/$classId/edit'
import { StudentsPage } from './pages/instructor-panel/students'
import { StudentDetailsPage } from './pages/instructor-panel/students/$studentId'
import { SchedulePage } from './pages/instructor-panel/schedule'

const rootRoute = createRootRoute({
  component: () => (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <AuthProvider>
        <ThemeProvider>
          <Outlet />
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </APIProvider>
  ),
})

const protectedLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  component: ProtectedLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const classBrowserRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/classes',
  component: ClassBrowser,
})

const classBrowserDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/classes/$classId',
  component: PublicClassDetailsPage,
})

const instructorProfileDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/instructors/$instructorId',
  component: InstructorDetailsPage,
})

const locationDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/locations/$locationId',
  component: LocationDetailsPage,
})

export const reviewFlowRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reviews',
  component: ReviewPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      classId: search.classId as string | undefined,
      instructorId: search.instructorId as string | undefined,
      locationId: search.locationId as string | undefined,
    }
  },
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: SignupPage,
})

const instructorPanelLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: 'instructor-panel',
  component: InstructorPanelLayout,
})

const instructorDashboardRoute = createRoute({
  getParentRoute: () => instructorPanelLayout,
  path: '/instructor-panel',
  component: DashboardPage,
})

const instructorGeneralSettingsRoute = createRoute({
  getParentRoute: () => instructorPanelLayout,
  path: '/instructor-panel/settings-general',
  component: GeneralSettings,
})

const instructorNotificationSettingsRoute = createRoute({
  getParentRoute: () => instructorPanelLayout,
  path: '/instructor-panel/settings-notifications',
  component: NotificationSettings,
})

const instructorTeachingSettingsRoute = createRoute({
  getParentRoute: () => instructorPanelLayout,
  path: '/instructor-panel/settings-teaching',
  component: TeachingSettings,
})

const instructorClassesRoute = createRoute({
  getParentRoute: () => instructorPanelLayout,
  path: '/instructor-panel/classes',
  component: ClassesPage,
})

const instructorCreateClassRoute = createRoute({
  getParentRoute: () => instructorPanelLayout,
  path: '/instructor-panel/classes/new',
  component: CreateClassPage,
})

const instructorClassDetailsRoute = createRoute({
  getParentRoute: () => instructorPanelLayout,
  path: '/instructor-panel/classes/$classId',
  component: ClassDetailsPage,
})

const instructorClassScheduleRoute = createRoute({
  getParentRoute: () => instructorPanelLayout,
  path: '/instructor-panel/classes/$classId/schedule',
  component: ClassSchedulePage,
})

const instructorClassEditRoute = createRoute({
  getParentRoute: () => instructorPanelLayout,
  path: '/instructor-panel/classes/$classId/edit',
  component: EditClassPage,
})

const instructorStudentsRoute = createRoute({
  getParentRoute: () => instructorPanelLayout,
  path: '/instructor-panel/students',
  component: StudentsPage,
})

const instructorStudentDetailsRoute = createRoute({
  getParentRoute: () => instructorPanelLayout,
  path: '/instructor-panel/students/$studentId',
  component: StudentDetailsPage,
})

const instructorScheduleRoute = createRoute({
  getParentRoute: () => instructorPanelLayout,
  path: '/instructor-panel/schedule',
  component: SchedulePage,
})

const routeTree = rootRoute.addChildren([
  protectedLayout.addChildren([
    // instructorDashboardRoute,
    // settingsRoute,
    // eventsRoute.addChildren([
    //   createEventRoute,
    //   eventDetailsRoute,
    // ]),
    // createClassRoute,
    // classDetailsRoute,
    // classScheduleRoute,
  ]),
  instructorPanelLayout.addChildren([
    instructorDashboardRoute,
    instructorGeneralSettingsRoute,
    instructorNotificationSettingsRoute,
    instructorTeachingSettingsRoute,
    instructorClassesRoute,
    instructorCreateClassRoute,
    instructorClassDetailsRoute,
    instructorClassScheduleRoute,
    instructorClassEditRoute,
    instructorStudentsRoute,
    instructorStudentDetailsRoute,
    instructorScheduleRoute,
    // More instructor panel routes will be added here later
  ]),
  indexRoute,
  classBrowserRoute,
  classBrowserDetailsRoute,
  instructorProfileDetailsRoute,
  locationDetailsRoute,
  loginRoute,
  signupRoute,
  reviewFlowRoute,
])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

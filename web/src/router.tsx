import { Outlet, createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { CreateClassPage } from './pages/private-pages/instructor-dashboard/class-management/CreateClassPage';
import { ClassDetailsPage } from './pages/private-pages/instructor-dashboard/class-management/ClassDetailsPage';
import { AuthProvider, useAuth } from './lib/auth/AuthContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/api/queryClient';
// import { ScheduleManagementPage } from './pages/schedule-management';
// import { EventManagementPage } from './pages/private-pages/instructor-dashboard/event-management';
import { Toaster } from './components/ui/toaster';
import { APIProvider } from '@vis.gl/react-google-maps';
import { InstructorDashboardPage } from './pages/private-pages/instructor-dashboard';
import { HomePage } from './pages/public-pages/main-page';
import { ClassBrowser } from './pages/public-pages/class-browser';
import { ClassDetailsPage as PublicClassDetailsPage } from './pages/public-pages/class-details';
import { EventDetailsPage as PublicEventDetailsPage } from './pages/public-pages/event-details';
import { EventBrowser } from './pages/public-pages/event-browser';
import { InstructorDetailsPage } from './pages/public-pages/instructor-details';
import { LocationDetailsPage } from './pages/public-pages/location-details';
import { SettingsPage } from './pages/private-pages/common/settings';
import { EditClassPage } from './pages/private-pages/instructor-dashboard/class-management/EditClassPage';

const rootRoute = createRootRoute({
  component: () => (
    <APIProvider apiKey={'AIzaSyC7k8QnpwiMJvLbJ39P4yJOHBjIvDPckSk'}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Outlet />
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </APIProvider>
  ),
});

function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // window.location.href = '/login';
    return null;
  }

  return <Outlet />;
}

const protectedLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  component: ProtectedLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const classBrowserRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/classes',
  component: ClassBrowser,
});

const classBrowserDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/classes/$classId',
  component: PublicClassDetailsPage,
});

const eventBrowseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events',
  component: EventBrowser,
});

const eventBrowseDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events/$eventId',
  component: PublicEventDetailsPage,
});

const instructorProfileDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/instructors/$instructorId',
  component: InstructorDetailsPage,
});

const locationDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/locations/$locationId',
  component: LocationDetailsPage,
});

const instructorDashboardRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: '/instructor-dashboard',
  component: InstructorDashboardPage,
});

const createClassRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: '/instructor-dashboard/classes/create',
  component: CreateClassPage,
});

const classDetailsRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: '/instructor-dashboard/classes/$classId',
  component: EditClassPage,
});


const settingsRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: '/profile-settings',
  component: SettingsPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: SignupPage,
});

const routeTree = rootRoute.addChildren([
  protectedLayout.addChildren([
    instructorDashboardRoute,
    settingsRoute,
    // eventsRoute.addChildren([
    //   createEventRoute,
    //   eventDetailsRoute,
    // ]),
    createClassRoute,
    classDetailsRoute,
    // classScheduleRoute,
  ]),
  indexRoute,
  classBrowserRoute,
  classBrowserDetailsRoute,
  eventBrowseRoute,
  eventBrowseDetailsRoute,
  instructorProfileDetailsRoute,
  locationDetailsRoute,
  loginRoute,
  signupRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
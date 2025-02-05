import { Outlet, createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { AuthProvider, useAuth } from './lib/auth/AuthContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/api/queryClient';
import { Toaster } from './components/ui/toaster';
import { APIProvider } from '@vis.gl/react-google-maps';
import { HomePage } from './pages/public-pages/main-page';
import { ClassBrowser } from './pages/public-pages/class-browser';
import { ClassDetailsPage as PublicClassDetailsPage } from './pages/public-pages/class-details';
import { InstructorDetailsPage } from './pages/public-pages/instructor-details';
import { LocationDetailsPage } from './pages/public-pages/location-details';
import { ReviewPage } from './pages/public-pages/review';

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

// const eventBrowseRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/events',
//   component: EventBrowser,
// });

// const eventBrowseDetailsRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/events/$eventId',
//   component: PublicEventDetailsPage,
// });

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
  }
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
  indexRoute,
  classBrowserRoute,
  classBrowserDetailsRoute,
  instructorProfileDetailsRoute,
  locationDetailsRoute,
  loginRoute,
  signupRoute,
  reviewFlowRoute,
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
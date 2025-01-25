import { Outlet, createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { HomePage } from './pages/HomePage';
import { CreateClassPage } from './pages/CreateClassPage';
import { ClassDetailsPage } from './pages/ClassDetailsPage';
import { AuthProvider, useAuth } from './lib/auth/AuthContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/api/queryClient';
import { ScheduleManagementPage } from './pages/schedule-management';
import { EventManagementPage } from './pages/event-management';
import { Toaster } from './components/ui/toaster';
import { APIProvider } from '@vis.gl/react-google-maps';
import { InstructorDashboardPage } from './pages/instructor-dashboard';

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
    window.location.href = '/login';
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
  // WAS PROTECTED LAYOUT
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const instructorDashboardRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: '/instructor/dashboard',
  component: InstructorDashboardPage,
});

// Event management routes
const eventsRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: '/events',
});

const createEventRoute = createRoute({
  getParentRoute: () => eventsRoute,
  path: '/create',
  component: EventManagementPage,
});

const eventDetailsRoute = createRoute({
  getParentRoute: () => eventsRoute,
  path: '/$eventId',
  component: EventManagementPage,
});

const createClassRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: '/classes/create',
  component: CreateClassPage,
});

const classDetailsRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: '/classes/$classId',
  component: ClassDetailsPage,
});

const classScheduleRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: '/classes/$classId/schedules',
  component: ScheduleManagementPage,
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
    indexRoute,
    instructorDashboardRoute,
    eventsRoute.addChildren([
      createEventRoute,
      eventDetailsRoute,
    ]),
    createClassRoute,
    classDetailsRoute,
    classScheduleRoute,
  ]),
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
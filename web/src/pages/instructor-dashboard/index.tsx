import { useAuth } from '../../lib/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Header } from '@/components/ui/header';
import { useNavigate } from '@tanstack/react-router';
import { ClassesList } from './components/classes-list';
import { EventsList } from './components/events-list';

export function InstructorDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user?.role !== 'instructor') {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-destructive">Only instructors can access this page.</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Container>
        <div className="py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
              <p className="text-muted-foreground">Manage your dance classes and special events</p>
            </div>
            <Button onClick={() => navigate({ to: '/classes/create' })}>
              Create New Class
            </Button>
          </div>

          <div className="space-y-12">
            <ClassesList />
            <EventsList />
          </div>
        </div>
      </Container>
    </div>
  );
} 
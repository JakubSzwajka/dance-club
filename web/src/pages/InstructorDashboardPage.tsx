import { useAuth } from '../lib/auth/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Container } from '../components/ui/container';
import { Header } from '../components/ui/header';
import { Badge } from '../components/ui/badge';
import { useNavigate } from '@tanstack/react-router';
import { useClasses } from '../lib/api/classes';

export function InstructorDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: classes, isLoading } = useClasses();

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
              <p className="text-muted-foreground">Manage your dance classes and schedules</p>
            </div>
            <Button onClick={() => navigate({ to: '/classes/create' })}>
              Create New Class
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Stats Cards */}
            <Card>
              <CardHeader>
                <CardTitle>Total Classes</CardTitle>
                <CardDescription>Active classes you're teaching</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {isLoading ? '...' : classes?.length || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Students</CardTitle>
                <CardDescription>Students enrolled in your classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {isLoading ? '...' : 
                    classes?.reduce((acc: number, cls) => acc + (cls.current_capacity || 0), 0) || 0
                  }
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Capacity</CardTitle>
                <CardDescription>Average class fill rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {isLoading ? '...' : 
                    classes?.length 
                      ? Math.round(
                          (classes.reduce((acc: number, cls) => 
                            acc + ((cls.current_capacity || 0) / (cls.max_capacity || 0)) * 100, 0
                          ) / classes.length)
                        ) + '%'
                      : '0%'
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Your Classes</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : classes?.length ? (
            <div className="grid gap-4">
              {classes.map((cls) => (
                <Card key={cls.id} className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => navigate({ to: `/classes/${cls.id}` })}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{cls.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{cls.level}</Badge>
                          <span>•</span>
                          <span>{cls.current_capacity}/{cls.max_capacity} students</span>
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{cls.price} PLN</div>
                        <div className="text-sm text-muted-foreground">per class</div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground mb-4">You haven't created any classes yet.</p>
                <Button onClick={() => navigate({ to: '/classes/create' })}>
                  Create Your First Class
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </Container>
    </div>
  );
} 
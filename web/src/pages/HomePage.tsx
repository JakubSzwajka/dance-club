import { useAuth } from '../lib/auth/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Container } from '../components/ui/container';
import { Header } from '../components/ui/header';
import { Badge } from '../components/ui/badge';

export function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <Container>
          <div className="space-y-8">
            {/* Profile Section */}
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Role</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="capitalize">
                        {user?.role}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Account ID</p>
                    <p className="font-medium">{user?.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Role-specific Dashboard */}
            {user?.role === 'instructor' ? (
              <Card>
                <CardHeader>
                  <CardTitle>Instructor Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Manage your dance classes and view student enrollments.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Button>Create New Class</Button>
                      <Button variant="outline">View My Classes</Button>
                      <Button variant="outline">Student Requests</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Student Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Explore dance classes and manage your enrollments.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Button>Browse Classes</Button>
                      <Button variant="outline">My Enrollments</Button>
                      <Button variant="outline">Class Schedule</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </Container>
      </main>
    </div>
  );
} 
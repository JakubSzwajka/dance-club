import { useParams } from '@tanstack/react-router';
import { useAuth } from '../lib/auth/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Container } from '../components/ui/container';
import { Header } from '../components/ui/header';
import { Badge } from '../components/ui/badge';
import { useClass } from '../lib/api/classes';

type DanceClass = {
  id: number;
  name: string;
  description: string;
  instructor_id: number;
  level: string;
  capacity: number;
  price: number;
  start_time: string;
  end_time: string;
};

export function ClassDetailsPage() {
  const { classId } = useParams({ from: '/protected/classes/$classId' });
  const { user } = useAuth();

  const { data: classDetails, isLoading, error } = useClass(Number(classId));

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
      </div>
    );
  }

  if (error || !classDetails) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-destructive">Failed to load class details.</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Container>
        <div className="py-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{classDetails.name}</CardTitle>
                  <CardDescription>
                    <Badge variant="secondary" className="mt-2">
                      {classDetails.level}
                    </Badge>
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{classDetails.price} PLN</div>
                  <div className="text-sm text-muted-foreground">per class</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{classDetails.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-1">Schedule</h3>
                  <p className="text-muted-foreground">
                    {new Date(classDetails.start_time).toLocaleTimeString()} - 
                    {new Date(classDetails.end_time).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Capacity</h3>
                  <p className="text-muted-foreground">
                    {classDetails.capacity} students
                  </p>
                </div>
              </div>

              {user?.role === 'student' && (
                <div className="pt-4">
                  <Button className="w-full">Enroll in Class</Button>
                </div>
              )}

              {user?.id === classDetails.instructor_id && (
                <div className="pt-4 flex gap-4">
                  <Button variant="outline" className="flex-1">Edit Class</Button>
                  <Button variant="destructive" className="flex-1">Cancel Class</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
} 
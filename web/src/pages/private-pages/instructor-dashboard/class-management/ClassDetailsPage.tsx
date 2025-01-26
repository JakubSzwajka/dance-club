import { Container } from '@/components/ui/container';
import { Header } from '@/components/domain/header';
import { useAuth } from '@/lib/auth/AuthContext';
import { ClassForm } from '@/components/domain/class-form';
import { useParams } from '@tanstack/react-router';
import { useNavigate } from '@tanstack/react-router';
import { useInstructorClassQuery } from '@/lib/api/private';

export function ClassDetailsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { classId } = useParams({ from: '/protected/instructor-dashboard/classes/$classId' });
  const { data: classData, isLoading } = useInstructorClassQuery(user?.id ?? '', classId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div>Loading...</div>
        </main>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-destructive">Class not found.</div>
        </main>
      </div>
    );
  }

  const isOwner = user?.role === 'instructor' && classData.instructor_id === user.id;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Container>
        <div className="py-8">
          <ClassForm 
            mode="view"
            instructorId={classData.instructor_id}
            initialData={classData}
            isOwner={isOwner}
            onEdit={() => navigate({ 
              to: '/instructor-dashboard/classes/$classId',
              params: { classId: classData.id }
            })}
          />
        </div>
      </Container>
    </div>
  );
} 
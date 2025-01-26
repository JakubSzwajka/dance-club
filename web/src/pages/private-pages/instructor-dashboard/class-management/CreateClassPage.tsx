import { Container } from '@/components/ui/container';
import { Header } from '@/components/domain/header';
import { ClassForm } from '@/components/domain/class-form';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/lib/auth/AuthContext';

export function CreateClassPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Container>
        <div className="py-8">
          <ClassForm 
            mode="create"
            instructorId={user?.id ?? ''}
            onSuccess={(classId) => {
              navigate({ to: `/instructor-dashboard/classes/${classId}` });
            }}
          />
        </div>
      </Container>
    </div>
  );
} 
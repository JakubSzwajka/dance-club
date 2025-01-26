import { Container } from '@/components/ui/container';
import { Header } from '@/components/domain/header';
import { ClassForm } from '@/components/domain/class-form';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useInstructorClassQuery } from '@/lib/api/private';
import { useAuth } from '@/lib/auth/AuthContext';
import { useState } from 'react';

export function EditClassPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { classId } = useParams({ from: '/protected/instructor-dashboard/classes/$classId' });
  const { data: classData, isLoading } = useInstructorClassQuery(user?.id ?? '', classId);
  const [isEditing, setIsEditing] = useState(false);

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

  if (classData.instructor_id !== user?.id) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-destructive">You can only edit your own classes.</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Container>
        <div className="py-8">
          <ClassForm 
            mode={isEditing ? "edit" : "view"}
            instructorId={user?.id ?? ''}
            initialData={classData}
            isOwner={true}
            onEdit={() => setIsEditing(true)}
            onCancel={() => setIsEditing(false)}
            onSuccess={(classId) => {
              setIsEditing(false);
              navigate({ to: `/instructor-dashboard/classes/${classId}` });
            }}
          />
        </div>
      </Container>
    </div>
  );
} 
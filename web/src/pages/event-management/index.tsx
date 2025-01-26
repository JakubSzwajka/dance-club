import { useState } from 'react';
import { Header } from '@/components/domain/header';
import { Container } from '@/components/ui/container';
import { SpecialEventForm } from './components/special-event-form';
import { SpecialEventList } from './components/special-event-list';
import { useSpecialEvents } from './hooks/use-special-events';
import { CreateSpecialEvent, SpecialEvent } from '@/lib/api/types';

export function EventManagementPage() {
  const { 
    specialEvents, 
    isLoading, 
    error, 
    createSpecialEvent,
    updateSpecialEvent,
    deleteSpecialEvent,
  } = useSpecialEvents();

  const [editingEvent, setEditingEvent] = useState<SpecialEvent | null>(null);

  const handleSubmit = async (data: CreateSpecialEvent) => {
    try {
      if (editingEvent) {
        await updateSpecialEvent(editingEvent.id, data);
        setEditingEvent(null);
      } else {
        await createSpecialEvent(data);
      }
    } catch (err) {
      console.error('Failed to save event:', err);
    }
  };

  const handleEdit = (event: SpecialEvent) => {
    setEditingEvent(event);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSpecialEvent(id);
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <Container>
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <p>Loading...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <Container>
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <p className="text-destructive">Error: {error.toString()}</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <Container>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Event Management</h1>
            <p className="text-muted-foreground">
              Create and manage special events and workshops
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <SpecialEventForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            defaultValues={editingEvent || undefined}
          />

          <SpecialEventList
            events={specialEvents || []}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </div>
      </Container>
    </div>
  );
} 
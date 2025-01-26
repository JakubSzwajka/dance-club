import { Header } from '@/components/domain/header';
import { Container } from '@/components/ui/container';
import { useToast } from '@/hooks/use-toast';
import { SpecialEventForm } from './components/special-event-form';
import { SpecialEventList } from './components/special-event-list';

export function SpecialEventsPage() {
  const { toast } = useToast();
  const {
    specialEvents,
    isLoading,
    error,
    createSpecialEvent,
    deleteSpecialEvent,
  } = useSpecialEvents();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <Container>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Special Events</h1>
            <p className="text-muted-foreground">
              Create and manage special events and workshops
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <SpecialEventForm
            onSubmit={async (data) => {
              try {
                await createSpecialEvent(data);
                toast({
                  title: 'Special event created',
                  description: 'The event has been created successfully.',
                });
              } catch (error) {
                toast({
                  title: 'Error creating event',
                  description: 'Failed to create the event. Please try again.',
                  variant: 'destructive',
                });
              }
            }}
          />

          <SpecialEventList
            events={specialEvents || []}
            onDelete={async (id) => {
              try {
                await deleteSpecialEvent(id);
                toast({
                  title: 'Event deleted',
                  description: 'The event has been removed successfully.',
                });
              } catch (error) {
                toast({
                  title: 'Error deleting event',
                  description: 'Failed to delete the event. Please try again.',
                  variant: 'destructive',
                });
              }
            }}
          />
        </div>
      </Container>
    </div>
  );
} 
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SocialLink {
  platform: string;
  url: string;
}

interface SpecialEvent {
  id: number;
  name: string;
  description: string;
  datetime: string;
  capacity: number;
  location: string;
  instructorId: number;
  instructorName: string;
  socialLinks: SocialLink[];
}

interface SpecialEventListProps {
  events: SpecialEvent[];
  onDelete: (id: number) => Promise<void>;
}

export function SpecialEventList({ events, onDelete }: SpecialEventListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Special Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No special events created yet
            </p>
          ) : (
            events.map((event) => (
              <Card key={event.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{event.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        by {event.instructorName}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(event.id)}
                    >
                      Delete
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm">{event.description}</p>

                    <div className="flex gap-2 items-center">
                      <Badge variant="secondary">
                        {format(new Date(event.datetime), 'PPP')}
                      </Badge>
                      <Badge variant="secondary">
                        {format(new Date(event.datetime), 'p')}
                      </Badge>
                    </div>

                    <div className="flex gap-2 items-center">
                      <Badge variant="outline">
                        {event.capacity} spots
                      </Badge>
                      <Badge variant="outline">
                        {event.location}
                      </Badge>
                    </div>

                    {event.socialLinks.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {event.socialLinks.map((link, index) => (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            {link.platform}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
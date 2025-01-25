import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { TimePicker } from '@/components/ui/time-picker';

interface SocialLink {
  platform: string;
  url: string;
}

interface SpecialEventFormData {
  name: string;
  description: string;
  datetime: Date;
  capacity: number;
  location: string;
  instructorId: number;
  socialLinks: SocialLink[];
}

interface SpecialEventFormProps {
  onSubmit: (data: SpecialEventFormData) => Promise<void>;
  isCreating: boolean;
}

export function SpecialEventForm({ onSubmit, isCreating }: SpecialEventFormProps) {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([{ platform: '', url: '' }]);

  const handleAddSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: '', url: '' }]);
  };

  const handleSocialLinkChange = (index: number, field: keyof SocialLink, value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index][field] = value;
    setSocialLinks(newLinks);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: SpecialEventFormData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      datetime: new Date(formData.get('date') as string),
      capacity: parseInt(formData.get('capacity') as string),
      location: formData.get('location') as string,
      instructorId: parseInt(formData.get('instructorId') as string),
      socialLinks: socialLinks.filter(link => link.platform && link.url),
    };

    await onSubmit(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Special Event</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Event Name</Label>
            <Input id="name" name="name" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <DatePicker name="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <TimePicker name="time" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input 
              id="capacity" 
              name="capacity" 
              type="number" 
              min="1" 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location" 
              name="location" 
              placeholder="Enter location or search on map" 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label>Social Links</Label>
            {socialLinks.map((link, index) => (
              <div key={index} className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Platform (e.g., Instagram)"
                  value={link.platform}
                  onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                />
                <Input
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                />
              </div>
            ))}
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleAddSocialLink}
              className="w-full"
            >
              Add Social Link
            </Button>
          </div>

          <Button type="submit" disabled={isCreating} className="w-full">
            {isCreating ? 'Creating...' : 'Create Event'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 
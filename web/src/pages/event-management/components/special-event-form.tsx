import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateSpecialEvent, SocialLink } from '@/lib/api/types';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { useAuth } from '@/lib/auth/AuthContext';



interface PlaceAutocompleteProps {
    onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
  }
  
const PlaceAutocomplete = ({ onPlaceSelect }: PlaceAutocompleteProps) => {
    const [placeAutocomplete, setPlaceAutocomplete] =
        useState<google.maps.places.Autocomplete | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const places = useMapsLibrary('places');

    useEffect(() => {
        if (!places || !inputRef.current) return;

        setPlaceAutocomplete(new places.Autocomplete(inputRef.current));
    }, [places]);

    useEffect(() => {
        if (!placeAutocomplete) return;

        placeAutocomplete.addListener('place_changed', () => {
        onPlaceSelect(placeAutocomplete.getPlace());
        });
    }, [onPlaceSelect, placeAutocomplete]);

    return (
        <div className="autocomplete-container">
            <Input ref={inputRef} />
        </div>
    );
};

  
interface SpecialEventFormProps {
  onSubmit: (data: CreateSpecialEvent) => Promise<void>;
  isLoading?: boolean;
  defaultValues?: Partial<CreateSpecialEvent>;
}

export function SpecialEventForm({ onSubmit, isLoading, defaultValues }: SpecialEventFormProps) {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    defaultValues?.social_links || [{ platform: '', url: '' }]
  );
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>({
    name: defaultValues?.location?.name || '',
    formatted_address: defaultValues?.location?.address || '',
    geometry: {
      location: {
        lat: () => defaultValues?.location?.latitude || 0,
        lng: () => defaultValues?.location?.longitude || 0, 
        equals: () => false,
        toJSON: () => ({ lat: defaultValues?.location?.latitude || 0, lng: defaultValues?.location?.longitude || 0 }),
        toUrlValue: () => '',
      },
    },
    place_id: defaultValues?.location?.google_place_id || '',
    url: defaultValues?.location?.url || '',
  });
  const { user } = useAuth();

  useEffect(() => {
    if (defaultValues?.location) {
      setSelectedPlace(defaultValues.location);
    }
  }, [defaultValues?.location]);

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
        
    if (!user?.id) {
      console.error('User ID not found');
      return;
    }

    const data: CreateSpecialEvent = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      datetime: formData.get('datetime') as string,
      capacity: parseInt(formData.get('capacity') as string),
      
      price: parseFloat(formData.get('price') as string),
      location: {
        name: selectedPlace?.name || '',
        address: selectedPlace?.formatted_address || '',
        latitude: selectedPlace?.geometry?.location?.lat() || 0,
        longitude: selectedPlace?.geometry?.location?.lng() || 0,
        google_place_id: selectedPlace?.place_id || '',
        url: selectedPlace?.url || '',
      },
      instructor_id: user?.id,
      social_links: socialLinks.filter(link => link.platform && link.url),
    };

    await onSubmit(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{defaultValues ? 'Edit Special Event' : 'Create Special Event'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Event Name</Label>
            <Input 
              id="name" 
              name="name" 
              defaultValue={defaultValues?.name}
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              defaultValue={defaultValues?.description}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            {selectedPlace?.name && (
                    <p>📍 {selectedPlace.name}</p>
            )}
            <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
          </div>

            <div className="space-y-2">
              <Label>Time</Label>
              <Input
                id="datetime"
                name="datetime"
                type="datetime-local"
                defaultValue={defaultValues?.datetime ? new Date(defaultValues.datetime).toISOString().slice(0, 16) : ''}
              />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input 
              id="capacity" 
              name="capacity" 
              type="number" 
              min="1"
              defaultValue={defaultValues?.capacity}
              required 
            />
          </div>


          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input 
              id="price" 
              name="price" 
              type="number" 
              min="0"
              defaultValue={defaultValues?.price}
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

          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full"
          >
            {isLoading ? 'Saving...' : defaultValues ? 'Update Event' : 'Create Event'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 
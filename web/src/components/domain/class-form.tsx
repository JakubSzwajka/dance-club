import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { CreateDanceClassSchema, PrivateDanceClassSchema, useCreateClassMutation, useUpdateClassMutation } from '@/lib/api/private';
import { useMetadata } from '@/lib/api/public';
import { components } from '@/lib/api/schema';
import { Separator } from '@/components/ui/separator';
import { PencilIcon } from '@heroicons/react/24/outline';

interface ClassFormProps {
  mode: 'create' | 'edit' | 'view';
  initialData?: PrivateDanceClassSchema;
  onSuccess?: (classId: string) => void;
  instructorId: string;
  isOwner?: boolean;
  onEdit?: () => void;
  onCancel?: () => void;
}

export function ClassForm({ mode, initialData, onSuccess, instructorId, isOwner, onEdit, onCancel }: ClassFormProps) {
  const [error, setError] = useState<string | null>(null);
  const { mutate: createClass, isPending: isCreating } = useCreateClassMutation(instructorId);
  const { mutate: updateClass, isPending: isUpdating } = useUpdateClassMutation(instructorId);
  const [location, setLocation] = useState<components["schemas"]["LocationSchema"] | null>(initialData?.location ?? null);
  const { data: metadata } = useMetadata();
  const danceStyles = metadata?.dance_styles;
  
  const isReadOnly = mode === 'view';
  const isPending = isCreating || isUpdating;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    try {
      const classData: CreateDanceClassSchema = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        level: formData.get('level') as string,
        max_capacity: parseInt(formData.get('max_capacity') as string),
        price: parseFloat(formData.get('price') as string),
        start_date: formData.get('start_date') as string,
        end_date: formData.get('end_date') as string,
        style: formData.get('style') as string,
        location: location,
      };

      if (mode === 'create') {
        createClass(classData, {
          onSuccess: (newClass) => {
            onSuccess?.(newClass.id);
          },
          onError: (err) => {
            if (err instanceof AxiosError) {
              setError(err.response?.data?.detail || 'Failed to create class');
            } else {
              setError('Failed to create class');
            }
          },
        });
      } else if (mode === 'edit' && initialData) {
        updateClass({ classId: initialData.id, classData: classData }, {
          onSuccess: () => {
            onSuccess?.(initialData.id);
          },
          onError: (err) => {
            if (err instanceof AxiosError) {
              setError(err.response?.data?.detail || 'Failed to update class');
            } else {
              setError('Failed to update class');
            }
          },
        });
      }
    } catch (err) {
      setError('Please check your input values');
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">
              {mode === 'create' ? 'Create New Class' : 'Class Details'}
            </CardTitle>
            <CardDescription className="text-base">
              {mode === 'create' 
                ? "Fill in the details for your new dance class. You'll be able to customize the schedule in the next step."
                : 'View and manage your dance class details.'}
            </CardDescription>
          </div>
          {isOwner && mode !== 'create' && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={mode === 'view' ? onEdit : onCancel}
            >
              {mode === 'view' ? (
                <>
                  <PencilIcon className="h-4 w-4" />
                  Edit Class
                </>
              ) : (
                'Cancel'
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base">Class Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  required={!isReadOnly}
                  readOnly={isReadOnly}
                  defaultValue={initialData?.name}
                  className="h-11"
                  placeholder="Enter class name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  required={!isReadOnly}
                  readOnly={isReadOnly}
                  defaultValue={initialData?.description}
                  className="min-h-[120px] resize-none"
                  placeholder="Describe your class"
                />
              </div>
            </div>
          </div>

          {/* Class Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Class Details</h3>
            <Separator className="my-4" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="level" className="text-base">Level</Label>
                <Select 
                  name="level" 
                  required={!isReadOnly}
                  disabled={isReadOnly}
                  defaultValue={initialData?.level}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="style" className="text-base">Style</Label>
                <Select 
                  name="style" 
                  required={!isReadOnly}
                  disabled={isReadOnly}
                  defaultValue={initialData?.style}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    {danceStyles?.map((style) => (
                      <SelectItem key={style} value={style}>{style}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Schedule & Capacity Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Schedule & Capacity</h3>
            <Separator className="my-4" />
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="start_date" className="text-base">Start Date</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    required={!isReadOnly}
                    readOnly={isReadOnly}
                    defaultValue={initialData?.start_date}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date" className="text-base">End Date</Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="date"
                    required={!isReadOnly}
                    readOnly={isReadOnly}
                    defaultValue={initialData?.end_date}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="max_capacity" className="text-base">Maximum Capacity</Label>
                  <Input
                    id="max_capacity"
                    name="max_capacity"
                    type="number"
                    min="1"
                    required={!isReadOnly}
                    readOnly={isReadOnly}
                    defaultValue={initialData?.max_capacity}
                    className="h-11"
                    placeholder="Enter maximum capacity"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-base">Price per Class</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    required={!isReadOnly}
                    readOnly={isReadOnly}
                    defaultValue={initialData?.price}
                    className="h-11"
                    placeholder="Enter price"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {mode !== 'create' && (
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-11 text-base"
                disabled={mode === 'view' || isPending}
              >
                {isPending ? 'Updating...' : 'Update Class'}
              </Button>
            </div>
          )}
          {mode === 'create' && (
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-11 text-base"
                disabled={isPending}
              >
                {isPending ? 'Creating...' : 'Create Class'}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
} 
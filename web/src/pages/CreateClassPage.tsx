import { useNavigate } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Container } from '../components/ui/container';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Header } from '../components/domain/header';
import { useAuth } from '../lib/auth/AuthContext';
import { useCreateClass } from '../lib/api/classes';
import { useState } from 'react';
import { AxiosError } from 'axios';

export function CreateClassPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { mutate: createClass, isPending } = useCreateClass();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    try {
      const classData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        level: formData.get('level') as string,
        max_capacity: parseInt(formData.get('max_capacity') as string),
        price: parseFloat(formData.get('price') as string),
        start_date: formData.get('start_date') as string,
        end_date: formData.get('end_date') as string,
      };

      createClass(classData, {
        onSuccess: (newClass) => {
          navigate({ to: `/classes/${newClass.id}/schedules` });
        },
        onError: (err) => {
          if (err instanceof AxiosError) {
            setError(err.response?.data?.detail || 'Failed to create class');
          } else {
            setError('Failed to create class');
          }
        },
      });
    } catch (err) {
      setError('Please check your input values');
    }
  };

  if (user?.role !== 'instructor') {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-destructive">Only instructors can create classes.</div>
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
              <CardTitle>Create New Class</CardTitle>
              <CardDescription>Fill in the details for your new dance class. You'll be able to customize the schedule in the next step.</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Class Name</Label>
                  <Input id="name" name="name" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select name="level" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      name="start_date"
                      type="date"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      name="end_date"
                      type="date"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max_capacity">Maximum Capacity</Label>
                  <Input
                    id="max_capacity"
                    name="max_capacity"
                    type="number"
                    min="1"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Price per Class</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isPending}
                >
                  {isPending ? 'Creating...' : 'Create Class'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
} 
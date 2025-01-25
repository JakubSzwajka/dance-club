import { useNavigate } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Container } from '../components/ui/container';
import { useAuth } from '../lib/auth/AuthContext';
import { useCreateClass } from '../lib/api/classes';
import { Alert } from '../components/ui/alert';
import { useState } from 'react';
import { AxiosError } from 'axios';

export function CreateClassPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createClassMutation = useCreateClass();
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);
    try {
      await createClassMutation.mutateAsync({
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        level: formData.get('level') as string,
        max_capacity: parseInt(formData.get('max_capacity') as string),
        price: parseFloat(formData.get('price') as string),
      }, {
        onSuccess: () => {
          navigate({ to: '/instructor/dashboard' });
        }
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.detail || 'Failed to create class');
      } else {
        setError('Failed to create class');
      }
    }
  };

  if (user?.role !== 'instructor') {
    return (
      <Container>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>Only instructors can create new classes.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-2xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Dance Class</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  {error}
                </Alert>
              )}
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
                disabled={createClassMutation.isPending}
              >
                {createClassMutation.isPending ? 'Creating...' : 'Create Class'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
} 
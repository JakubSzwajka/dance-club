import { useState } from 'react';
import { useAuth } from '../lib/auth/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Container } from '../components/ui/container';
import { Header } from '../components/domain/header';
import { AxiosError } from 'axios';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Invalid email or password');
      } else {
        setError('Invalid email or password');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 relative">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("/main_page.jpg")',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <Container className="relative z-10 flex items-center justify-center min-h-full py-16">
          <div className="w-full max-w-[400px]">
            <Card className="backdrop-blur-sm bg-white/90">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Welcome!</CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive" className="text-sm">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full h-11 text-base font-semibold">
                    Sign in
                  </Button>
                  <div className="text-sm text-center space-y-2">
                    <p className="text-muted-foreground">
                      Don't have an account?
                    </p>
                    <a 
                      href="/signup" 
                      className="text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      Create an account
                    </a>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </div>
        </Container>
      </main>
    </div>
  );
}
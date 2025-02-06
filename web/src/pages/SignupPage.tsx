import { useState } from 'react'
import { useAuth } from '../lib/auth/AuthContext'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Container } from '../components/ui/container'
import { Header } from '../components/domain/header'
import { RoleToggle } from '../components/domain/role-toggle'
import { toast } from '../components/ui/use-toast'

type Role = 'student' | 'instructor'

export function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [role, setRole] = useState<Role>('student')
  const [error, setError] = useState('')
  const { signup } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== passwordConfirm) {
      setError('Passwords do not match')
      return
    }

    try {
      await signup(email, password, role)
    } catch (_err) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    }
  }

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
                <CardTitle className="text-2xl font-bold text-center">Join Our Community</CardTitle>
                <CardDescription className="text-center">
                  Create your account and start your dance journey
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
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passwordConfirm" className="text-sm font-medium">
                      Confirm Password
                    </Label>
                    <Input
                      id="passwordConfirm"
                      type="password"
                      value={passwordConfirm}
                      onChange={e => setPasswordConfirm(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium">
                      I want to
                    </Label>
                    <RoleToggle value={role} onChange={setRole} className="w-full" />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full h-11 text-base font-semibold">
                    Create account
                  </Button>
                  <div className="text-sm text-center space-y-2">
                    <p className="text-muted-foreground">Already have an account?</p>
                    <a
                      href="/login"
                      className="text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      Sign in here
                    </a>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </div>
        </Container>
      </main>
    </div>
  )
}

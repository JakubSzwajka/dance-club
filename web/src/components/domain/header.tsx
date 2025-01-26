import { Button } from "../ui/button"
import { Container } from "../ui/container"
import { useAuth } from "../../lib/auth/AuthContext"
import { useNavigate } from "@tanstack/react-router";

export function Header() {
  const { logout, isAuthenticated } = useAuth()

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleNavigateToDashboard = () => {
    if (user?.role === 'instructor') {
      navigate({ to: '/instructor/dashboard' });
    }
    // Add other role-specific navigation here when implemented
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="font-bold text-xl" onClick={() => navigate({ to: '/' })}>
              🕺 My Dance Club
            </div>
          </div>
          <nav className="flex items-center space-x-4">
            {user?.role === 'instructor' && (
              <Button variant="outline" onClick={handleNavigateToDashboard}>
                Dashboard
              </Button>
            )}
            
            {isAuthenticated ? (
              <Button variant="outline" onClick={logout}>
                Sign out
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate({ to: '/login' })}>Sign in</Button>
                <Button onClick={() => navigate({ to: '/signup' })}>Sign up</Button>
              </>
            )}
          </nav>
        </div>
      </Container>
    </header>
  )
} 
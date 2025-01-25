import { Button } from "./button"
import { Container } from "./container"
import { useAuth } from "../../lib/auth/AuthContext"

export function Header() {
  const { logout, isAuthenticated } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <a href="/" className="font-bold text-xl">
              My Dance Club
            </a>
          </div>
          <nav className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Button variant="outline" onClick={logout}>
                Sign out
              </Button>
            ) : (
              <>
                <a href="/login">
                  <Button variant="ghost">Sign in</Button>
                </a>
                <a href="/signup">
                  <Button>Sign up</Button>
                </a>
              </>
            )}
          </nav>
        </div>
      </Container>
    </header>
  )
} 
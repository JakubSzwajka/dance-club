import { Button } from '../ui/button'
import { Container } from '../ui/container'
import { useAuth } from '../../lib/auth/authHooks'
import { useNavigate } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu'
import { cn } from '@/lib/utils'

export function Header() {
  const { logout, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  // Get user's initials for avatar fallback
  const getInitials = () => {
    if (!user?.email) return '?'
    return user.email.charAt(0).toUpperCase()
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[100] border-b bg-background'
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="font-bold text-xl cursor-pointer" onClick={() => navigate({ to: '/' })}>
              🕺 My Dance DNA
            </div>
          </div>
          <nav className="flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.profile_picture} alt={user?.email} />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate({ to: '/instructor-panel' })}>
                    Instructor Panel
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate({ to: '/login' })}
                >
                  Sign in
                </Button>
                <Button 
                  onClick={() => navigate({ to: '/signup' })}
                >
                  Sign up
                </Button>
              </>
            )}
          </nav>
        </div>
      </Container>
    </header>
  )
}

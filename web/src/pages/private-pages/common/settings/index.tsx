import { Container } from "@/components/ui/container"
import { ProfileSection } from "./components/profile-section"
import { PasswordSection } from "./components/password-section"
import { DangerZone } from "./components/danger-zone"
import { Header } from "@/components/domain/header"
import { useAuth } from "@/lib/auth/AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function SettingsPage() {
  const { user } = useAuth()

  // Get user's initials for avatar fallback
  const getInitials = () => {
    if (!user?.email) return '?';
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Container className="flex-1 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Header with Avatar */}
          <div className="flex items-center gap-6 pb-6 border-b">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.profile_picture} alt={user?.email} />
              <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">Account Settings</h1>
              <p className="text-muted-foreground mt-1">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="space-y-6">
            <ProfileSection />
            <PasswordSection />
            <DangerZone />
          </div>
        </div>
      </Container>
    </div>
  )
}

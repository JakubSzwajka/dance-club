import { Outlet } from '@tanstack/react-router'
import { useAuth } from '../../lib/auth/authHooks'
import { AppSidebar } from './instructor-panel/app-sidebar'
import { Header } from './instructor-panel/header'
import { ProfileDropdown } from './instructor-panel/profile-dropdown'
import { SidebarProvider } from '../ui/sidebar'
import { ThemeSwitch } from '../theme-switch'

export function InstructorPanelLayout() {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return null
    }

    return (

        <div className="flex h-screen overflow-hidden">
            <SidebarProvider>
                <AppSidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header >
                        {/* <TopNav links={topNav} /> */}
                        <div className='ml-auto flex items-center space-x-4'>
                            <ThemeSwitch />
                            <ProfileDropdown />
                        </div>
                    </Header>
                    <main className="flex-1 overflow-auto">
                        <div className="container mx-auto p-6">
                                <Outlet />
                        </div>
                    </main>
                </div>
            </SidebarProvider>
        </div>
    )
} 
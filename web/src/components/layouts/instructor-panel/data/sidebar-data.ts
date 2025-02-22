import {
  HomeIcon,
  CalendarIcon,
  UsersIcon,
  AcademicCapIcon,
  BellIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import type { SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Instructor',
    email: 'instructor@mydancedna.com',
    avatar: '/avatars/default.jpg',
  },
  teams: [
    {
      name: 'My Dance DNA',
      logo: AcademicCapIcon,
      plan: 'Instructor Panel',
    },
  ],
  navGroups: [
    {
      title: 'Main',
      items: [
        {
          title: 'Dashboard',
          url: '/instructor-panel',
          icon: HomeIcon,
        },
        {
          title: 'Classes',
          url: '/instructor-panel/classes',
          icon: AcademicCapIcon,
        },
        {
          title: 'Students',
          url: '/instructor-panel/students',
          icon: UsersIcon,
        },
        {
          title: 'Schedule',
          url: '/instructor-panel/schedule',
          icon: CalendarIcon,
        },
      ],
    },
    {
      title: 'Instructor Profile Management',
      items: [
        {
          title: 'Profile',
          url: '/instructor-panel/settings-teaching',
          icon: AcademicCapIcon,
        },
      ],
    },
    // {
    //   title: 'Studio Management',
    //   items: [
    //     {
    //       title: 'Locations',
    //       url: '/instructor-panel/studio/locations',
    //       icon: MapPinIcon,
    //     },
    //     {
    //       title: 'Analytics',
    //       url: '/instructor-panel/studio/analytics',
    //       icon: ChartBarIcon,
    //     },
    //   ],
    // },
    {
      title: 'Settings',
      items: [
        {
          title: 'Profile Settings',
          url: '/instructor-panel/settings-general',
          icon: UserCircleIcon,
        },
        {
          title: 'Notifications',
          url: '/instructor-panel/settings-notifications',
          icon: BellIcon,
        },
      ],
    },
  ],
}

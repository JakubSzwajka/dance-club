export type ClassData = {
  id: string
  name: string
  time: string
  location: string
  type: 'group' | 'private'
  instructor: string
  enrolled: number
  capacity: number
  description: string
}

export const mockClasses: ClassData[] = [
  {
    id: '1',
    name: 'Salsa Beginners',
    time: '18:00 - 19:30',
    location: 'Studio A',
    type: 'group',
    instructor: 'John Doe',
    enrolled: 12,
    capacity: 20,
    description:
      'Perfect introduction to Salsa dancing. Learn the basic steps, rhythm, and essential moves.',
  },
  {
    id: '2',
    name: 'Bachata Intermediate',
    time: '19:45 - 21:15',
    location: 'Studio B',
    type: 'group',
    instructor: 'Maria Garcia',
    enrolled: 15,
    capacity: 18,
    description: 'Advance your Bachata skills with more complex patterns and styling techniques.',
  },
  {
    id: '3',
    name: 'Private Lesson',
    time: '17:00 - 18:00',
    location: 'Studio C',
    type: 'private',
    instructor: 'Alex Smith',
    enrolled: 1,
    capacity: 1,
    description: 'One-on-one instruction tailored to your specific needs and goals.',
  },
  {
    id: '4',
    name: 'Salsa Advanced',
    time: '20:00 - 21:30',
    location: 'Studio A',
    type: 'group',
    instructor: 'Carlos Rodriguez',
    enrolled: 8,
    capacity: 15,
    description: 'Advanced patterns, styling, and musicality for experienced dancers.',
  },
  {
    id: '5',
    name: 'Kizomba Beginners',
    time: '18:30 - 20:00',
    location: 'Studio D',
    type: 'group',
    instructor: 'Ana Silva',
    enrolled: 10,
    capacity: 16,
    description: 'Introduction to Kizomba fundamentals and basic movements.',
  },
]

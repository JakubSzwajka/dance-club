from datetime import datetime, time, timedelta
import random
from django.core.management.base import BaseCommand
from django.utils import timezone
from accounts.models import User
from classes.models import DanceClass, RecurringSchedule, Location, SpecialEvent

class Command(BaseCommand):
    help = 'Seeds the database with test data including instructors, classes, and events'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating test data...')

        # Create test locations
        locations_data = [
            {
                'name': 'Dance Studio XYZ',
                'address': '123 Dance Street, City',
                'area': 'Downtown'
            },
            {
                'name': 'Rhythm & Motion Studio',
                'address': '456 Music Avenue, City',
                'area': 'Uptown'
            },
            {
                'name': 'Elite Dance Center',
                'address': '789 Performance Road, City',
                'area': 'West End'
            },
            {
                'name': 'Dance Factory',
                'address': '321 Movement Lane, City',
                'area': 'East Side'
            },
            {
                'name': 'The Dance Hub',
                'address': '654 Ballet Way, City',
                'area': 'South District'
            }
        ]

        locations = []
        for loc_data in locations_data:
            # Generate random coordinates
            lat = random.uniform(49.0000, 54.8333)  # Poland latitude range
            lng = random.uniform(14.1167, 24.1500)  # Poland longitude range

            location = Location.objects.create(
                name=loc_data['name'],
                address=f"{loc_data['address']}, {loc_data['area']}",
                latitude=lat,
                longitude=lng,
                url=f"https://example.com/studios/{loc_data['name'].lower().replace(' ', '-')}"
            )
            locations.append(location)
            self.stdout.write(f'Created location: {location.name}')

        # Create 10 instructors
        instructors_data = [
            {
                'first_name': 'John',
                'last_name': 'Smith',
                'email': 'john.smith@example.com',
                'bio': 'Specializes in Salsa and Bachata',
            },
            {
                'first_name': 'Maria',
                'last_name': 'Garcia',
                'email': 'maria.garcia@example.com',
                'bio': 'Expert in Latin and Ballroom dancing',
            },
            {
                'first_name': 'David',
                'last_name': 'Johnson',
                'email': 'david.johnson@example.com',
                'bio': 'Contemporary and Modern dance specialist',
            },
            {
                'first_name': 'Sarah',
                'last_name': 'Williams',
                'email': 'sarah.williams@example.com',
                'bio': 'Hip-hop and Street dance instructor',
            },
            {
                'first_name': 'Michael',
                'last_name': 'Brown',
                'email': 'michael.brown@example.com',
                'bio': 'Jazz and Tap dance professional',
            },
            {
                'first_name': 'Emma',
                'last_name': 'Davis',
                'email': 'emma.davis@example.com',
                'bio': 'Ballet and Contemporary fusion specialist',
            },
            {
                'first_name': 'Carlos',
                'last_name': 'Rodriguez',
                'email': 'carlos.rodriguez@example.com',
                'bio': 'Latin dance champion and instructor',
            },
            {
                'first_name': 'Sophie',
                'last_name': 'Martin',
                'email': 'sophie.martin@example.com',
                'bio': 'Classical ballet and modern dance instructor',
            },
            {
                'first_name': 'James',
                'last_name': 'Wilson',
                'email': 'james.wilson@example.com',
                'bio': 'Ballroom and social dance expert',
            },
            {
                'first_name': 'Isabella',
                'last_name': 'Taylor',
                'email': 'isabella.taylor@example.com',
                'bio': 'Contemporary and jazz fusion specialist',
            },
        ]

        instructors = []
        for instructor_data in instructors_data:
            instructor = User.objects.create_user(
                email=instructor_data['email'],
                username=instructor_data['email'],
                password='testpass123',
                first_name=instructor_data['first_name'],
                last_name=instructor_data['last_name'],
                role='instructor',
                bio=instructor_data['bio']
            )
            instructors.append(instructor)
            self.stdout.write(f'Created instructor: {instructor.get_full_name()}')

        # Create classes for each instructor
        dance_styles = ['ballroom', 'latin', 'salsa', 'tango', 'other']
        levels = ['beginner', 'intermediate', 'advanced']
        time_slots = [
            (time(9, 0), time(10, 30)),   # Morning
            (time(11, 0), time(12, 30)),  # Late morning
            (time(14, 0), time(15, 30)),  # Afternoon
            (time(16, 0), time(17, 30)),  # Late afternoon
            (time(18, 0), time(19, 30)),  # Evening
            (time(20, 0), time(21, 30)),  # Late evening
        ]

        for instructor in instructors:
            # Create 3 classes for each instructor
            for i in range(3):
                # Create recurring schedule first
                start_time, end_time = random.choice(time_slots)
                schedule = RecurringSchedule.objects.create(
                    day_of_week=random.randint(0, 6),
                    start_time=start_time,
                    end_time=end_time,
                    status='active',
                )

                # Then create the dance class
                dance_class = DanceClass.objects.create(
                    name=f"{random.choice(['Fun', 'Advanced', 'Beginner', 'Professional', 'Weekend'])} {random.choice(dance_styles).title()} Class",
                    description=f"Join {instructor.get_full_name()} for an exciting {random.choice(dance_styles)} dance class suitable for {random.choice(levels)} dancers.",
                    instructor=instructor,
                    level=random.choice(levels),
                    style=random.choice(dance_styles),
                    max_capacity=random.randint(10, 25),
                    current_capacity=0,
                    price=random.choice([29.99, 39.99, 49.99, 59.99]),
                    start_date=timezone.now().date(),
                    end_date=(timezone.now() + timedelta(days=90)).date(),
                    location=random.choice(locations)
                )

                dance_class.recurring_schedules.set([schedule])
                self.stdout.write(f'Created class: {dance_class.name} for {instructor.get_full_name()}')

        # Create 10 special events with random locations
        event_names = [
            'Salsa Workshop Intensive',
            'Latin Dance Party Night',
            'Contemporary Dance Masterclass',
            'Ballet Workshop Weekend',
            'Tango Fusion Experience',
            'Street Dance Competition',
            'Partner Dancing Workshop',
            'Dance Fitness Marathon',
            'Jazz Dance Intensive',
            'Dance Performance Workshop'
        ]

        for i, event_name in enumerate(event_names):
            event_datetime = timezone.now() + timedelta(days=random.randint(7, 60))
            instructor = random.choice(instructors)
            location = random.choice(locations)

            special_event = SpecialEvent.objects.create(
                name=event_name,
                description=f"Join {instructor.get_full_name()} for an exciting {event_name.lower()}. All skill levels welcome!",
                datetime=event_datetime,
                capacity=random.randint(20, 50),
                price=random.choice([75.00, 89.99, 99.99, 129.99]),
                location=location,
                instructor=instructor
            )
            self.stdout.write(f'Created special event: {special_event.name} at {location.name}')

        self.stdout.write(self.style.SUCCESS('Successfully created test data!'))
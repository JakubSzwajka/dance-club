from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from classes.models import DanceClass, Location, SpecialEvent, RecurringSchedule
from faker import Faker
from random import randint, choice, uniform
from datetime import datetime, timedelta, time
import pytz

User = get_user_model()
fake = Faker()

DANCE_STYLES = [
    'ballroom',
    'latin',
    'salsa',
    'tango',
    'other',
]

SKILL_LEVELS = [
    'beginner',
    'intermediate',
    'advanced',
]

TEST_LOCATIONS = [
    {
        'name': 'Dance Studio One',
        'address': '123 Main St, San Francisco, CA 94105',
        'area': 'Financial District',
        'lat_base': 37.7937,
        'lng_base': -122.3965,
    },
    {
        'name': 'Rhythm & Motion Dance Center',
        'address': '456 Market St, San Francisco, CA 94105',
        'area': 'SoMa',
        'lat_base': 37.7891,
        'lng_base': -122.4012,
    },
    {
        'name': 'City Dance Studios',
        'address': '789 Mission St, San Francisco, CA 94103',
        'area': 'Mission District',
        'lat_base': 37.7830,
        'lng_base': -122.4090,
    },
    {
        'name': 'Dance Mission Theater',
        'address': '321 Valencia St, San Francisco, CA 94103',
        'area': 'Mission District',
        'lat_base': 37.7676,
        'lng_base': -122.4221,
    },
    {
        'name': 'ODC Dance Commons',
        'address': '987 Shotwell St, San Francisco, CA 94110',
        'area': 'Mission District',
        'lat_base': 37.7520,
        'lng_base': -122.4156,
    },
]

TIME_SLOTS = [
    (time(9, 0), time(10, 30)),   # Morning
    (time(11, 0), time(12, 30)),  # Late morning
    (time(14, 0), time(15, 30)),  # Afternoon
    (time(16, 0), time(17, 30)),  # Late afternoon
    (time(18, 0), time(19, 30)),  # Evening
    (time(20, 0), time(21, 30)),  # Late evening
]

DAYS_OF_WEEK = [
    (0, 'Monday'),
    (1, 'Tuesday'),
    (2, 'Wednesday'),
    (3, 'Thursday'),
    (4, 'Friday'),
    (5, 'Saturday'),
    (6, 'Sunday'),
]

def generate_long_description():
    """Generate a detailed, multi-paragraph description"""
    paragraphs = []

    # Main description - now with more dance-specific content
    paragraphs.append(fake.paragraph(nb_sentences=8))
    paragraphs.append(fake.paragraph(nb_sentences=6))

    # Class structure
    class_structure = [
        "Class Structure:",
        "1. Warm-up and stretching (15 minutes)",
        f"2. Technique training: {fake.paragraph(nb_sentences=2)}",
        f"3. Main choreography: {fake.paragraph(nb_sentences=2)}",
        f"4. Practice session: {fake.paragraph(nb_sentences=2)}",
        "5. Cool-down and review (10 minutes)"
    ]
    paragraphs.append("\n".join(class_structure))

    # What to expect - expanded with more specific details
    what_to_expect = ["What to expect:"]
    what_to_expect.extend([f"- {fake.sentence()}" for _ in range(6)])
    what_to_expect.extend([
        "- Personalized feedback and corrections",
        "- Progressive skill development",
        "- Regular practice opportunities",
        "- Supportive learning environment"
    ])
    paragraphs.append("\n".join(what_to_expect))

    # Requirements - more detailed
    requirements = ["Requirements:"]
    requirements.extend([f"- {fake.sentence()}" for _ in range(4)])
    requirements.extend([
        "- Comfortable dance shoes",
        "- Water bottle and towel",
        "- Positive attitude and willingness to learn"
    ])
    paragraphs.append("\n".join(requirements))

    # Benefits - expanded
    benefits = ["Benefits:"]
    benefits.extend([f"- {fake.sentence()}" for _ in range(5)])
    benefits.extend([
        "- Improved posture and body awareness",
        "- Enhanced musicality and rhythm",
        "- Increased confidence and self-expression",
        "- Social connection through dance",
        "- Physical fitness and coordination"
    ])
    paragraphs.append("\n".join(benefits))

    return "\n\n".join(paragraphs)

def generate_instructor_bio():
    """Generate a detailed instructor biography"""
    paragraphs = []

    # Personal introduction - more detailed
    intro = [
        fake.paragraph(nb_sentences=5),
        fake.paragraph(nb_sentences=4),
        f"Originally from {fake.city()}, {fake.country()}, they discovered their passion for dance at the age of {randint(5, 15)}."
    ]
    paragraphs.append("\n".join(intro))

    # Dance background - expanded with specific experiences
    experience_years = randint(8, 25)
    background = [
        f"With over {experience_years} years of dance experience, their journey includes:",
        f"- {randint(3, 10)} years of professional performance experience",
        f"- {randint(5, 15)} years of teaching experience",
        f"- Training in {randint(4, 8)} different dance styles",
        fake.paragraph(nb_sentences=4)
    ]
    paragraphs.append("\n".join(background))

    # Training and education
    education = ["Education and Training:"]
    education.extend([f"- {fake.sentence()}" for _ in range(5)])
    education.extend([
        f"- Certified in {choice(['International Dance Teachers Association', 'Imperial Society of Teachers of Dancing', 'Dance Masters of America'])}",
        f"- Advanced training in {choice(['Paris', 'New York', 'London', 'Buenos Aires', 'Havana'])}",
        f"- Regular workshops with world-renowned dancers and choreographers"
    ])
    paragraphs.append("\n".join(education))

    # Teaching philosophy - expanded
    philosophy = [
        "Teaching Philosophy:",
        fake.paragraph(nb_sentences=5),
        fake.paragraph(nb_sentences=4),
        "Key principles:",
        "- Individual attention and personalized feedback",
        "- Progressive skill development",
        "- Emphasis on proper technique and body awareness",
        "- Creating a supportive and inclusive learning environment",
        "- Balancing challenge with enjoyment"
    ]
    paragraphs.append("\n".join(philosophy))

    # Achievements and recognition
    achievements = ["Notable Achievements:"]
    achievements.extend([f"- {fake.sentence()}" for _ in range(6)])
    achievements.extend([
        f"- Featured performer at {fake.city()} International Dance Festival",
        f"- Choreographer for {fake.company()} dance productions",
        f"- Winner of {randint(2, 5)} national dance competitions",
        f"- Guest instructor at {randint(3, 8)} international dance conventions"
    ])
    paragraphs.append("\n".join(achievements))

    return "\n\n".join(paragraphs)

def generate_avatar_url(name: str) -> str:
    """Generate a consistent avatar URL using Dicebear API"""
    # Using 'avataaars' style, but other options include: 'bottts', 'pixel-art', 'adventurer', etc.
    style = "avataaars"
    return f"https://api.dicebear.com/7.x/{style}/svg?seed={name.replace(' ', '')}"

class Command(BaseCommand):
    help = 'Seeds the database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database...')

        # Create test locations
        locations = []
        for loc_data in TEST_LOCATIONS:
            location = Location.objects.create(
                name=loc_data['name'],
                address=loc_data['address'],
                latitude=loc_data['lat_base'] + uniform(-0.01, 0.01),
                longitude=loc_data['lng_base'] + uniform(-0.01, 0.01),
                url=fake.url()
            )
            locations.append(location)

        # Create instructors
        instructors = []
        for i in range(10):
            first_name = fake.first_name()
            last_name = fake.last_name()
            full_name = f"{first_name} {last_name}"
            instructor = User.objects.create(
                email=f"instructor{i}@example.com",
                first_name=first_name,
                last_name=last_name,
                role='instructor',
                bio=generate_instructor_bio(),
                profile_picture_url=generate_avatar_url(full_name)
            )
            instructor.set_password("password123")
            instructor.save()
            instructors.append(instructor)

        # Create classes for each instructor
        for instructor in instructors:
            for _ in range(3):
                location = choice(locations)
                max_capacity = randint(10, 30)

                dance_class = DanceClass.objects.create(
                    name=f"{choice(['Beginner', 'Intermediate', 'Advanced'])} {choice(DANCE_STYLES).title()} with {instructor.first_name}",
                    description=generate_long_description(),
                    instructor=instructor,
                    level=choice(SKILL_LEVELS),
                    style=choice(DANCE_STYLES),
                    max_capacity=max_capacity,
                    current_capacity=randint(0, max_capacity),
                    price=randint(15, 50) * 100 / 100,
                    start_date=datetime.now(pytz.UTC).date(),
                    end_date=(datetime.now(pytz.UTC) + timedelta(days=90)).date(),
                    location=location
                )

                # Create 2-3 recurring schedules for each class
                num_schedules = randint(2, 3)
                used_days = set()  # To ensure no duplicate days for the same class

                schedules = []
                for _ in range(num_schedules):
                    # Pick a day that hasn't been used for this class
                    available_days = [(day, name) for day, name in DAYS_OF_WEEK if day not in used_days]
                    if not available_days:  # If no more days available, break
                        break

                    day, _ = choice(available_days)
                    used_days.add(day)

                    # Pick a time slot
                    start_time, end_time = choice(TIME_SLOTS)

                    schedule = RecurringSchedule.objects.create(
                        day_of_week=day,
                        start_time=start_time,
                        end_time=end_time,
                        status='active'
                    )
                    schedules.append(schedule)

                dance_class.recurring_schedules.set(schedules)

        # Create special events
        for _ in range(10):
            instructor = choice(instructors)
            location = choice(locations)
            capacity = randint(20, 100)
            event_date = datetime.now(pytz.UTC) + timedelta(days=randint(1, 60))

            SpecialEvent.objects.create(
                name=f"{choice(['Workshop', 'Masterclass', 'Intensive', 'Showcase'])} - {choice(DANCE_STYLES).title()} with {instructor.first_name}",
                description=generate_long_description(),
                datetime=event_date,
                capacity=capacity,
                price=randint(30, 150) * 100 / 100,
                location=location,
                instructor=instructor
            )

        self.stdout.write(self.style.SUCCESS('Successfully seeded database'))
# from django.core.management.base import BaseCommand
# from django.contrib.auth import get_user_model
# from django.utils import timezone
# from classes.models import (
#     DanceClass,
#     Location,
#     DanceStyle,
#     ClassType,
#     Facilities,
#     SportsCard,
# )
# from reviews.models import Review, DanceClassReview, InstructorReview, LocationReview
# from faker import Faker
# from random import randint, choice, uniform, sample, random
# from datetime import timedelta
# from rich.console import Console
# from rich.progress import (
#     Progress,
#     SpinnerColumn,
#     TextColumn,
#     BarColumn,
#     TaskProgressColumn,
# )
# from rich.table import Table
# from rich.panel import Panel

# User = get_user_model()
# fake = Faker()
# console = Console()

# # Constants moved to the top for better organization
# DANCE_STYLES = [style[0] for style in DanceStyle.choices]
# SKILL_LEVELS = [
#     level[0]
#     for level in [
#         ("beginner", "Beginner"),
#         ("intermediate", "Intermediate"),
#         ("advanced", "Advanced"),
#     ]
# ]
# CLASS_TYPES = [type[0] for type in ClassType.choices]

# TEST_LOCATIONS = [
#     {
#         "name": "Dance Studio One",
#         "address": "123 Main St, San Francisco, CA 94105",
#         "area": "Financial District",
#         "lat_base": 37.7937,
#         "lng_base": -122.3965,
#     },
#     {
#         "name": "Rhythm & Motion Dance Center",
#         "address": "456 Market St, San Francisco, CA 94105",
#         "area": "SoMa",
#         "lat_base": 37.7891,
#         "lng_base": -122.4012,
#     },
#     {
#         "name": "City Dance Studios",
#         "address": "789 Mission St, San Francisco, CA 94103",
#         "area": "Mission District",
#         "lat_base": 37.7830,
#         "lng_base": -122.4090,
#     },
#     {
#         "name": "Dance Mission Theater",
#         "address": "321 Valencia St, San Francisco, CA 94103",
#         "area": "Mission District",
#         "lat_base": 37.7676,
#         "lng_base": -122.4221,
#     },
#     {
#         "name": "ODC Dance Commons",
#         "address": "987 Shotwell St, San Francisco, CA 94110",
#         "area": "Mission District",
#         "lat_base": 37.7520,
#         "lng_base": -122.4156,
#     },
# ]


# def generate_long_description():
#     """Generate a detailed, multi-paragraph description"""
#     paragraphs = []

#     # Main description - now with more dance-specific content
#     paragraphs.append(fake.paragraph(nb_sentences=8))
#     paragraphs.append(fake.paragraph(nb_sentences=6))

#     # Class structure
#     class_structure = [
#         "Class Structure:",
#         "1. Warm-up and stretching (15 minutes)",
#         f"2. Technique training: {fake.paragraph(nb_sentences=2)}",
#         f"3. Main choreography: {fake.paragraph(nb_sentences=2)}",
#         f"4. Practice session: {fake.paragraph(nb_sentences=2)}",
#         "5. Cool-down and review (10 minutes)",
#     ]
#     paragraphs.append("\n".join(class_structure))

#     # What to expect - expanded with more specific details
#     what_to_expect = ["What to expect:"]
#     what_to_expect.extend([f"- {fake.sentence()}" for _ in range(6)])
#     what_to_expect.extend(
#         [
#             "- Personalized feedback and corrections",
#             "- Progressive skill development",
#             "- Regular practice opportunities",
#             "- Supportive learning environment",
#         ]
#     )
#     paragraphs.append("\n".join(what_to_expect))

#     # Requirements - more detailed
#     requirements = ["Requirements:"]
#     requirements.extend([f"- {fake.sentence()}" for _ in range(4)])
#     requirements.extend(
#         [
#             "- Comfortable dance shoes",
#             "- Water bottle and towel",
#             "- Positive attitude and willingness to learn",
#         ]
#     )
#     paragraphs.append("\n".join(requirements))

#     # Benefits - expanded
#     benefits = ["Benefits:"]
#     benefits.extend([f"- {fake.sentence()}" for _ in range(5)])
#     benefits.extend(
#         [
#             "- Improved posture and body awareness",
#             "- Enhanced musicality and rhythm",
#             "- Increased confidence and self-expression",
#             "- Social connection through dance",
#             "- Physical fitness and coordination",
#         ]
#     )
#     paragraphs.append("\n".join(benefits))

#     return "\n\n".join(paragraphs)


# def generate_instructor_bio():
#     """Generate a detailed instructor biography"""
#     paragraphs = []

#     # Personal introduction - more detailed
#     intro = [
#         fake.paragraph(nb_sentences=5),
#         fake.paragraph(nb_sentences=4),
#         f"Originally from {fake.city()}, {fake.country()}, they discovered their passion for dance at the age of {randint(5, 15)}.",
#     ]
#     paragraphs.append("\n".join(intro))

#     # Dance background - expanded with specific experiences
#     experience_years = randint(8, 25)
#     background = [
#         f"With over {experience_years} years of dance experience, their journey includes:",
#         f"- {randint(3, 10)} years of professional performance experience",
#         f"- {randint(5, 15)} years of teaching experience",
#         f"- Training in {randint(4, 8)} different dance styles",
#         fake.paragraph(nb_sentences=4),
#     ]
#     paragraphs.append("\n".join(background))

#     # Training and education
#     education = ["Education and Training:"]
#     education.extend([f"- {fake.sentence()}" for _ in range(5)])
#     education.extend(
#         [
#             f"- Certified in {choice(['International Dance Teachers Association', 'Imperial Society of Teachers of Dancing', 'Dance Masters of America'])}",
#             f"- Advanced training in {choice(['Paris', 'New York', 'London', 'Buenos Aires', 'Havana'])}",
#             "- Regular workshops with world-renowned dancers and choreographers",
#         ]
#     )
#     paragraphs.append("\n".join(education))

#     # Teaching philosophy - expanded
#     philosophy = [
#         "Teaching Philosophy:",
#         fake.paragraph(nb_sentences=5),
#         fake.paragraph(nb_sentences=4),
#         "Key principles:",
#         "- Individual attention and personalized feedback",
#         "- Progressive skill development",
#         "- Emphasis on proper technique and body awareness",
#         "- Creating a supportive and inclusive learning environment",
#         "- Balancing challenge with enjoyment",
#     ]
#     paragraphs.append("\n".join(philosophy))

#     # Achievements and recognition
#     achievements = ["Notable Achievements:"]
#     achievements.extend([f"- {fake.sentence()}" for _ in range(6)])
#     achievements.extend(
#         [
#             f"- Featured performer at {fake.city()} International Dance Festival",
#             f"- Choreographer for {fake.company()} dance productions",
#             f"- Winner of {randint(2, 5)} national dance competitions",
#             f"- Guest instructor at {randint(3, 8)} international dance conventions",
#         ]
#     )
#     paragraphs.append("\n".join(achievements))

#     return "\n\n".join(paragraphs)


# def generate_avatar_url(name: str) -> str:
#     """Generate a consistent avatar URL using Dicebear API"""
#     # Using 'avataaars' style, but other options include: 'bottts', 'pixel-art', 'adventurer', etc.
#     style = "avataaars"
#     return f"https://api.dicebear.com/7.x/{style}/svg?seed={name.replace(' ', '')}"


# def generate_review_comment():
#     """Generate a detailed review comment"""
#     sections = []

#     # Overall impression
#     sections.append(fake.paragraph(nb_sentences=randint(2, 4)))

#     # Specific aspects
#     aspects = [
#         "The instructor's teaching style",
#         "The class atmosphere",
#         "The music selection",
#         "The facility",
#         "The pace of learning",
#         "The value for money",
#     ]
#     selected_aspects = sample(aspects, randint(2, 4))
#     for aspect in selected_aspects:
#         sections.append(f"{aspect} {fake.sentence()}")

#     # Recommendation
#     if random() > 0.2:  # 80% chance of including a recommendation
#         sections.append(
#             f"Would {choice(['definitely', 'probably', 'absolutely'])} recommend this class to {choice(['beginners', 'intermediate dancers', 'everyone', 'those interested in improving their technique'])}."
#         )

#     return " ".join(sections)


# def create_review_for_class(dance_class, user=None):
#     """Create a complete review with all related models"""
#     # Skip if user already reviewed this class
#     if (
#         user
#         and Review.objects.filter(
#             dance_class_stats__dance_class=dance_class, user=user
#         ).exists()
#     ):
#         return None

#     # Create dance class review
#     dance_class_stats = DanceClassReview.objects.create(
#         dance_class=dance_class,
#         group_size=uniform(-10, 10),
#         level=uniform(-10, 10),
#         engagement=randint(1, 10),
#         teaching_pace=uniform(-10, 10),
#         overall_rating=randint(1, 5),
#         comment=generate_review_comment(),
#     )

#     # Create instructor review
#     instructor_stats = InstructorReview.objects.create(
#         instructor=dance_class.instructor,
#         move_breakdown=uniform(-10, 10),
#         individual_approach=uniform(-10, 10),
#         posture_correction_ability=randint(1, 10),
#         communication_and_feedback=randint(1, 10),
#         patience_and_encouragement=randint(1, 10),
#         motivation_and_energy=randint(1, 10),
#         overall_rating=randint(1, 5),
#         comment=generate_review_comment(),
#     )

#     # Create facilities review
#     facilities_stats = LocationReview.objects.create(
#         location=dance_class.location,
#         cleanness=randint(1, 10),
#         general_look=randint(1, 10),
#         acustic_quality=randint(1, 10),
#         additional_facilities=randint(1, 10),
#         temperature=uniform(-10, 10),
#         lighting=uniform(-10, 10),
#         overall_rating=randint(1, 5),
#         comment=generate_review_comment(),
#     )

#     # Create main review with all components
#     review = Review.objects.create(
#         user=user,
#         anonymous_name=fake.name() if not user else None,
#         is_verified=bool(
#             user and random() > 0.3
#         ),  # 70% chance of verification for logged users
#         instructor_stats=instructor_stats,
#         dance_class_stats=dance_class_stats,
#         facilities_stats=facilities_stats,
#     )

#     return review


# class Command(BaseCommand):
#     help = "Seeds the database with test data"

#     def handle(self, *args, **kwargs):
#         console.print(Panel.fit("🌱 Starting Database Seeding", style="bold green"))

#         with Progress(
#             SpinnerColumn(),
#             TextColumn("[progress.description]{task.description}"),
#             BarColumn(),
#             TaskProgressColumn(),
#             console=console,
#         ) as progress:
#             # Create admin user if doesn't exist
#             admin_task = progress.add_task("[cyan]Creating admin user...", total=1)
#             if not User.objects.filter(role="admin").exists():
#                 User.objects.create_user(
#                     username="admin",
#                     email="admin@example.com",
#                     password="admin123",
#                     first_name="Admin",
#                     last_name="User",
#                     role="admin",
#                     is_staff=True,
#                     is_superuser=True,
#                 )
#             progress.advance(admin_task)

#             # Create test locations
#             location_task = progress.add_task(
#                 "[cyan]Creating locations...", total=len(TEST_LOCATIONS)
#             )
#             locations = []
#             for loc_data in TEST_LOCATIONS:
#                 location, _ = Location.objects.get_or_create(
#                     name=loc_data["name"],
#                     defaults={
#                         "address": loc_data["address"],
#                         "latitude": loc_data["lat_base"] + uniform(-0.01, 0.01),
#                         "longitude": loc_data["lng_base"] + uniform(-0.01, 0.01),
#                         "url": fake.url(),
#                     },
#                 )
#                 # Set multiple random facilities (3 to max available)
#                 available_facilities = list(Facilities)
#                 num_facilities = randint(3, len(available_facilities))
#                 selected_facilities = sample(available_facilities, num_facilities)
#                 location.set_facilities(selected_facilities)

#                 # Set multiple random sports cards (3 to max available)
#                 available_cards = list(SportsCard)
#                 num_cards = randint(3, len(available_cards))
#                 selected_cards = sample(available_cards, num_cards)
#                 location.set_sports_card(selected_cards)

#                 location.save()
#                 locations.append(location)
#                 progress.advance(location_task)

#             # Create students
#             student_count = 30
#             student_task = progress.add_task(
#                 "[cyan]Creating students...", total=student_count
#             )
#             students = []
#             for i in range(student_count):
#                 first_name = fake.first_name()
#                 last_name = fake.last_name()
#                 full_name = f"{first_name} {last_name}"
#                 student, created = User.objects.get_or_create(
#                     email=f"student{i}@example.com",
#                     defaults={
#                         "first_name": first_name,
#                         "last_name": last_name,
#                         "role": "student",
#                         "profile_picture_url": generate_avatar_url(full_name),
#                         "date_of_birth": fake.date_of_birth(
#                             minimum_age=16, maximum_age=60
#                         ),
#                         "phone": fake.phone_number()[:15],
#                         "is_active": True,
#                     },
#                 )
#                 if created:
#                     student.set_password("password123")
#                     student.save()
#                 students.append(student)
#                 progress.advance(student_task)

#             # Create instructors
#             instructor_count = 10
#             instructor_task = progress.add_task(
#                 "[cyan]Creating instructors...", total=instructor_count
#             )
#             instructors = []
#             for i in range(instructor_count):
#                 first_name = fake.first_name()
#                 last_name = fake.last_name()
#                 full_name = f"{first_name} {last_name}"
#                 instructor, created = User.objects.get_or_create(
#                     email=f"instructor{i}@example.com",
#                     defaults={
#                         "first_name": first_name,
#                         "last_name": last_name,
#                         "role": "instructor",
#                         "bio": generate_instructor_bio(),
#                         "profile_picture_url": generate_avatar_url(full_name),
#                         "date_of_birth": fake.date_of_birth(
#                             minimum_age=25, maximum_age=60
#                         ),
#                         "phone": fake.phone_number()[:15],
#                         "is_active": True,
#                     },
#                 )
#                 if created:
#                     instructor.set_password("password123")
#                     instructor.save()
#                 instructors.append(instructor)
#                 progress.advance(instructor_task)

#             # Create classes and reviews
#             total_classes = len(instructors) * 3
#             class_task = progress.add_task(
#                 "[cyan]Creating dance classes...", total=total_classes
#             )
#             total_reviews = 0

#             for instructor in instructors:
#                 for _ in range(3):
#                     location = choice(locations)
#                     start_date = timezone.now().date()
#                     end_date = start_date + timedelta(days=90)

#                     dance_class = DanceClass.objects.create(
#                         name=f"{choice(['Beginner', 'Intermediate', 'Advanced'])} {choice(DANCE_STYLES).title()} with {instructor.first_name}",
#                         description=generate_long_description(),
#                         instructor=instructor,
#                         level=choice(SKILL_LEVELS),
#                         style=choice(DANCE_STYLES),
#                         formation_type=choice(CLASS_TYPES),
#                         duration=choice(
#                             [45, 60, 90, 120]
#                         ),  # Common class durations in minutes
#                         price=randint(1500, 5000) / 100,
#                         start_date=start_date,
#                         end_date=end_date,
#                         location=location,
#                     )
#                     progress.advance(class_task)

#                     # Create reviews for the class
#                     num_reviews = randint(5, 15)
#                     total_reviews += num_reviews
#                     review_task = progress.add_task(
#                         f"[cyan]Creating reviews for {dance_class.name}...",
#                         total=num_reviews,
#                     )

#                     for _ in range(num_reviews):
#                         reviewer = choice(students) if random() > 0.3 else None
#                         review = create_review_for_class(dance_class, reviewer)
#                         if not review and reviewer:
#                             create_review_for_class(dance_class, None)
#                         progress.advance(review_task)

#         # Show summary
#         table = Table(
#             title="Seeding Summary", show_header=True, header_style="bold magenta"
#         )
#         table.add_column("Entity", style="cyan")
#         table.add_column("Count", justify="right", style="green")

#         table.add_row("Locations", str(len(locations)))
#         table.add_row("Students", str(len(students)))
#         table.add_row("Instructors", str(len(instructors)))
#         table.add_row("Dance Classes", str(total_classes))
#         table.add_row("Reviews", str(total_reviews))

#         console.print("\n")
#         console.print(table)
#         console.print(
#             "\n✨ [bold green]Database seeding completed successfully![/bold green]"
#         )

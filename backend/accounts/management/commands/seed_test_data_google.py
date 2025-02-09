from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db import connection
from classes.models import Location, Facilities, SportsCard, DanceClass
from reviews.models import LocationReview, DanceClassReview, InstructorReview
from faker import Faker
from random import sample, randint, random, uniform, choice
from rich.console import Console
from rich.progress import (
    Progress,
    SpinnerColumn,
    TextColumn,
    BarColumn,
    TaskProgressColumn,
)
from rich.table import Table
from rich.panel import Panel
import yaml
from datetime import datetime, timedelta
from pathlib import Path

User = get_user_model()
fake = Faker()
console = Console()


def truncate_string(text: str | None, max_length: int) -> str:
    """Truncate string to max_length characters and handle None values"""
    if text is None:
        return ""
    text_str = str(text)  # Convert to string in case it's a number or other type
    return (text_str[:max_length - 3] + "...") if len(text_str) > max_length else text_str


def generate_avatar_url(name: str) -> str:
    """Generate a consistent avatar URL using Dicebear API"""
    style = "avataaars"
    return f"https://api.dicebear.com/7.x/{style}/svg?seed={name.replace(' ', '')}"


def generate_instructor_bio() -> str:
    """Generate a realistic instructor bio"""
    experience = fake.random_int(min=3, max=20)
    dance_styles = ['Salsa', 'Bachata', 'Ballet', 'Contemporary', 'Hip Hop', 'Jazz', 'Ballroom']
    chosen_styles = sample(dance_styles, k=randint(2, 4))

    paragraphs = [
        f"With {experience} years of dance experience, I specialize in {', '.join(chosen_styles[:-1])} and {chosen_styles[-1]}.",
        fake.paragraph(nb_sentences=3),
        f"My teaching philosophy: {fake.sentence()}"
    ]

    return "\n\n".join(paragraphs)


def create_instructor_pool(num_instructors: int = 10) -> list:
    """Create a pool of instructors with detailed information"""
    instructors = []
    for _ in range(num_instructors):
        first_name = fake.first_name()
        last_name = fake.last_name()
        full_name = f"{first_name} {last_name}"

        # Generate a shorter phone number format
        phone = f"+48{fake.msisdn()[3:11]}"  # Generate a shorter, fixed-length phone number

        instructor = User.objects.create(
            email=f"{first_name.lower()}.{last_name.lower()}@example.com",
            first_name=first_name,
            last_name=last_name,
            role="instructor",  # This is a fixed string, should be within limits
            bio=generate_instructor_bio(),
            profile_picture_url=generate_avatar_url(full_name),
            phone=phone,
            is_active=True,
        )
        instructor.set_password("password123")
        instructor.save()
        instructors.append(instructor)

    return instructors


def create_dummy_classes_for_instructor(location, instructor, num_classes: int | None = None):
    """Create multiple dummy classes for an instructor at a location"""
    if num_classes is None:
        num_classes = randint(2, 5)

    classes = []
    dance_styles = ["ballroom", "latin", "salsa", "tango", "other"]
    levels = ["beginner", "intermediate", "advanced"]

    for _ in range(num_classes):
        start_date = timezone.now().date()
        end_date = start_date + timedelta(days=90)

        dance_class = DanceClass.objects.create(
            name=truncate_string(f"{fake.word().title()} {choice(dance_styles).title()} with {instructor.first_name}", 100),
            description=truncate_string(fake.paragraph(nb_sentences=5), 500),
            instructor=instructor,
            level=choice(levels),
            style=choice(dance_styles),
            formation_type="group",
            duration=choice([45, 60, 90]),
            price=randint(1500, 5000) / 100,
            start_date=start_date,
            end_date=end_date,
            location=location,
        )
        classes.append(dance_class)

    return classes


def create_location_review_from_google(location, review_data, user=None):
    """Create a location review from Google Places review data"""
    # Convert Google's 5-star rating to our 1-10 scale
    rating_multiplier = 2
    base_rating = review_data.get("rating", 3) * rating_multiplier
    created_at = datetime.fromtimestamp(
        review_data.get("time", timezone.now().timestamp())
    )
    is_verified = bool(random() > 0.3)  # 70% chance of verification
    anonymous_name = truncate_string(review_data.get("author_name", fake.name()), 100)

    # Get a random instructor from the pool
    instructor = choice(instructor_pool)

    # Create multiple classes for this instructor at this location
    dance_classes = create_dummy_classes_for_instructor(location, instructor)

    # Create reviews for each class
    for dance_class in dance_classes:
        # Create facilities review
        LocationReview.objects.create(
            location=location,
            user=user,
            anonymous_name=anonymous_name,
            is_verified=is_verified,
            cleanness=min(10, max(1, base_rating + randint(-1, 1))),
            general_look=min(10, max(1, base_rating + randint(-1, 1))),
            acustic_quality=min(10, max(1, base_rating + randint(-1, 1))),
            additional_facilities=min(10, max(1, base_rating + randint(-1, 1))),
            temperature=min(10, max(1, base_rating + randint(-2, 2))),
            lighting=min(10, max(1, base_rating + randint(-2, 2))),
            overall_rating=review_data.get("rating", 3),
            comment=truncate_string(review_data.get("text") or "", 1000),
            created_at=created_at,
        )

        # Create dance class review
        DanceClassReview.objects.create(
            dance_class=dance_class,
            user=user,
            anonymous_name=anonymous_name,
            is_verified=is_verified,
            group_size=uniform(-10, 10),
            level=uniform(-10, 10),
            engagement=randint(1, 10),
            teaching_pace=uniform(-10, 10),
            overall_rating=review_data.get("rating", 3),
            comment=truncate_string(review_data.get("text") or "", 1000),
            created_at=created_at,
        )

    # Create instructor review
    InstructorReview.objects.create(
        instructor=instructor,
        user=user,
        anonymous_name=anonymous_name,
        is_verified=is_verified,
        move_breakdown=uniform(-10, 10),
        individual_approach=uniform(-10, 10),
        posture_correction_ability=randint(1, 10),
        communication_and_feedback=randint(1, 10),
        patience_and_encouragement=randint(1, 10),
        motivation_and_energy=randint(1, 10),
        overall_rating=review_data.get("rating", 3),
        comment=truncate_string(review_data.get("text") or "", 1000),
        created_at=created_at,
    )


class Command(BaseCommand):
    help = "Seeds the database with data from Google Places API"

    def add_arguments(self, parser):
        parser.add_argument(
            "--yaml-file",
            type=str,
            help="Path to the YAML file with Google Places data",
            required=True,
        )

    def handle(self, *args, **kwargs):
        global instructor_pool  # Make instructor_pool global

        yaml_file = kwargs["yaml_file"]
        if not Path(yaml_file).exists():
            console.print(f"[red]Error: File {yaml_file} not found[/red]")
            return

        # Test database connection
        try:
            connection.ensure_connection()
        except Exception as e:
            console.print(f"[red]Error: Could not connect to database: {str(e)}[/red]")
            console.print("[yellow]Hint: Make sure your DATABASE_URL is correct in .env file[/yellow]")
            return

        console.print(
            Panel.fit(
                "🌱 Starting Database Seeding from Google Places", style="bold green"
            )
        )

        with open(yaml_file, "r", encoding="utf-8") as file:
            data = yaml.safe_load(file)

        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(),
            TaskProgressColumn(),
            console=console,
        ) as progress:
            # Create instructor pool first
            instructor_pool = create_instructor_pool(5)  # Reduce to 5 instructors

            # Calculate total reviews for progress tracking
            total_reviews_count = sum(
                len(place.get("details", {}).get("reviews", []))
                for place in data.get("places", [])
            )

            # Create locations and their reviews
            locations_task = progress.add_task(
                "[cyan]Creating locations...",
                total=len(data.get("places", [])),
            )
            reviews_task = progress.add_task(
                "[cyan]Creating reviews...",
                total=total_reviews_count,
            )

            locations = []
            total_reviews = 0

            for place in data.get("places", []):
                # Create location
                location_data = place.get("details", {})
                location_coords = place.get("location", {})

                location = Location.objects.create(
                    name=truncate_string(place.get("name") or "", 100),
                    address=truncate_string(
                        location_data.get("formatted_address")
                        or place.get("address")
                        or "",
                        200
                    ),
                    latitude=float(location_coords.get("lat", 0)),
                    longitude=float(location_coords.get("lng", 0)),
                    url=truncate_string(location_data.get("website") or "", 200),
                    phone=truncate_string(location_data.get("formatted_phone_number") or "", 20),
                )

                # Set random facilities and sports cards
                available_facilities = list(Facilities)
                num_facilities = randint(3, len(available_facilities))
                selected_facilities = sample(available_facilities, num_facilities)
                location.set_facilities(selected_facilities)

                available_cards = list(SportsCard)
                num_cards = randint(3, len(available_cards))
                selected_cards = sample(available_cards, num_cards)
                location.set_sports_card(selected_cards)

                locations.append(location)

                # Create reviews from Google data
                reviews_data = location_data.get("reviews", [])
                for review_data in reviews_data:
                    create_location_review_from_google(location, review_data)
                    total_reviews += 1
                    progress.advance(reviews_task)

                progress.advance(locations_task)

            # Show summary
            table = Table(
                title="Google Places Seeding Summary",
                show_header=True,
                header_style="bold magenta",
            )
            table.add_column("Entity", style="cyan")
            table.add_column("Count", justify="right", style="green")

            table.add_row("Locations", str(len(locations)))
            table.add_row("Reviews", str(total_reviews))
            table.add_row("Instructors", str(len(instructor_pool)))

            console.print("\n")
            console.print(table)
            console.print(
                "\n✨ [bold green]Database seeding from Google Places completed successfully![/bold green]"
            )

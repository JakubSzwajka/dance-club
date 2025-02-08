from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from classes.models import Location, Facilities, SportsCard, DanceClass
from reviews.models import LocationReview, DanceClassReview, InstructorReview
from faker import Faker
from random import sample, randint, random, uniform
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


def generate_avatar_url(name: str) -> str:
    """Generate a consistent avatar URL using Dicebear API"""
    style = "avataaars"
    return f"https://api.dicebear.com/7.x/{style}/svg?seed={name.replace(' ', '')}"


def create_dummy_instructor(location):
    """Create a dummy instructor for the location"""
    first_name = fake.first_name()
    last_name = fake.last_name()
    full_name = f"{first_name} {last_name}"
    instructor = User.objects.create(
        email=f"instructor_{location.id}_{randint(1, 1000)}@example.com",
        first_name=first_name,
        last_name=last_name,
        role="instructor",
        profile_picture_url=generate_avatar_url(full_name),
        is_active=True,
    )
    instructor.set_password("password123")
    instructor.save()
    return instructor


def create_dummy_class(location, instructor):
    """Create a dummy class for the location and instructor"""
    start_date = timezone.now().date()
    end_date = start_date + timedelta(days=90)

    return DanceClass.objects.create(
        name=f"Dance Class at {location.name}",
        description=fake.paragraph(),
        instructor=instructor,
        level="beginner",
        style="other",
        formation_type="group",
        duration=60,
        price=randint(1500, 5000) / 100,
        start_date=start_date,
        end_date=end_date,
        location=location,
    )


def create_location_review_from_google(location, review_data, user=None):
    """Create a location review from Google Places review data"""
    # Convert Google's 5-star rating to our 1-10 scale
    rating_multiplier = 2
    base_rating = review_data.get("rating", 3) * rating_multiplier
    created_at = datetime.fromtimestamp(
        review_data.get("time", timezone.now().timestamp())
    )
    is_verified = bool(random() > 0.3)  # 70% chance of verification
    anonymous_name = review_data.get("author_name", fake.name())

    # Create a dummy instructor and class for this location if needed
    instructor = create_dummy_instructor(location)
    dance_class = create_dummy_class(location, instructor)

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
        comment=review_data.get("text", ""),
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
        comment=review_data.get("text", ""),
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
        comment=review_data.get("text", ""),
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
        yaml_file = kwargs["yaml_file"]
        if not Path(yaml_file).exists():
            console.print(f"[red]Error: File {yaml_file} not found[/red]")
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
            # Create locations and their reviews
            locations_task = progress.add_task(
                "[cyan]Creating locations from Google Places...",
                total=len(data.get("places", [])),
            )

            locations = []
            total_reviews = 0

            for place in data.get("places", []):
                # Create location
                location_data = place.get("details", {})
                location_coords = place.get("location", {})

                location = Location.objects.create(
                    name=place.get("name", ""),
                    address=location_data.get(
                        "formatted_address", place.get("address", "")
                    ),
                    latitude=location_coords.get("lat", 0),
                    longitude=location_coords.get("lng", 0),
                    url=location_data.get("website", ""),
                    phone=location_data.get("formatted_phone_number", ""),
                )

                # Set random facilities and sports cards (similar to original seeding)
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
                if reviews_data:
                    reviews_task = progress.add_task(
                        f"[cyan]Creating reviews for {location.name}...",
                        total=len(reviews_data),
                    )

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

        console.print("\n")
        console.print(table)
        console.print(
            "\n✨ [bold green]Database seeding from Google Places completed successfully![/bold green]"
        )

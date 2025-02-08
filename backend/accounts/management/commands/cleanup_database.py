from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import connection
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from classes.models import Location, DanceClass
from reviews.models import LocationReview, DanceClassReview, InstructorReview

User = get_user_model()
console = Console()


class Command(BaseCommand):
    help = "Cleans up the entire database while preserving admin accounts"

    def handle(self, *args, **kwargs):
        console.print(
            Panel.fit(
                "🧹 Starting Database Cleanup (Preserving Admin Accounts)",
                style="bold yellow",
            )
        )

        # Create a table to show deletion statistics
        table = Table(
            title="Database Cleanup Summary",
            show_header=True,
            header_style="bold magenta",
        )
        table.add_column("Model", style="cyan")
        table.add_column("Deleted Count", justify="right", style="red")

        # Store counts before deletion
        counts = {}

        # Delete reviews first (they have foreign keys to other models)
        counts['LocationReviews'] = LocationReview.objects.count()
        LocationReview.objects.all().delete()

        counts['DanceClassReviews'] = DanceClassReview.objects.count()
        DanceClassReview.objects.all().delete()

        counts['InstructorReviews'] = InstructorReview.objects.count()
        InstructorReview.objects.all().delete()

        # Delete dance classes
        counts['DanceClasses'] = DanceClass.objects.count()
        DanceClass.objects.all().delete()

        # Delete locations
        counts['Locations'] = Location.objects.count()
        Location.objects.all().delete()

        # Delete all users except admins
        admin_count = User.objects.filter(is_superuser=True).count()
        total_users = User.objects.count()
        User.objects.filter(is_superuser=False).delete()
        counts['Users (non-admin)'] = total_users - admin_count

        # Add all counts to the table
        for model, count in counts.items():
            table.add_row(model, str(count))

        # Add preserved admin count
        table.add_row("Admin Users (preserved)", str(admin_count))

        console.print("\n")
        console.print(table)
        console.print(
            "\n✨ [bold green]Database cleanup completed successfully![/bold green]"
        )
        console.print(
            f"[bold blue]Preserved {admin_count} admin account{'s' if admin_count != 1 else ''}[/bold blue]"
        )
from django.contrib.auth.models import AbstractUser, UserManager as DjangoUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _
from classes.schemas.user_schema import InstructorPublicSchema, UserPublicSchema
from mydanceclub.models import generate_uuid


class UserManager(DjangoUserManager):  # type: ignore
    def create_user(self, email=None, password=None, **kwargs):  # type: ignore
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        if "username" in kwargs:
            del kwargs["username"]
        user = self.model(email=email, **kwargs)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email=None, password=None, **kwargs):  # type: ignore
        kwargs.setdefault("is_staff", True)
        kwargs.setdefault("is_superuser", True)
        if "username" in kwargs:
            del kwargs["username"]
        return self.create_user(email, password, **kwargs)


class User(AbstractUser):
    username = None
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    email = models.EmailField(_("email address"), unique=True)
    """Custom user model for MyDanceClub platform."""

    ROLE_CHOICES = [
        ("student", "Student"),
        ("instructor", "Instructor"),
        ("admin", "Administrator"),
    ]

    groups = models.ManyToManyField(
        "auth.Group",
        related_name="custom_user_set",
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups",
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="custom_user_set",
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="student")
    phone = models.CharField(max_length=30, blank=True)
    bio = models.TextField(blank=True)
    profile_picture = models.ImageField(
        upload_to="profile_pictures/", null=True, blank=True
    )
    profile_picture_url = models.CharField(max_length=1000, null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "users"
        verbose_name = "User"
        verbose_name_plural = "Users"

    objects = UserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    def to_schema(self):
        return UserPublicSchema(
            id=self.id,
            first_name=self.first_name,
            last_name=self.last_name,
            bio=self.bio,
            profile_picture=self.profile_picture_url,
        )

    def to_instructor_schema(self):
        return InstructorPublicSchema(
            id=self.id,
            first_name=self.first_name,
            last_name=self.last_name,
            bio=self.bio,
            profile_picture=self.profile_picture_url,
            classes_count=0,
            rating=0,
            reviews_count=0,
        )

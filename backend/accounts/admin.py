from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from .models import User
from unfold.admin import ModelAdmin


class CustomUserAdmin(UserAdmin, ModelAdmin):
    list_display = (
        "avatar_display",
        "email",
        "get_full_name",
        "role",
        "is_active",
        "is_staff",
        "date_joined",
    )
    list_filter = ("role", "is_active", "is_staff")
    search_fields = ("email", "first_name", "last_name")
    ordering = ("email",)

    def avatar_display(self, obj):
        if obj.profile_picture_url:
            return format_html(
                '<img src="{}" class="rounded-full w-10 h-10 object-cover" alt="{}"/>',
                obj.profile_picture_url,
                obj.get_full_name() or obj.email,
            )
        return format_html(
            '<div class="rounded-full w-10 h-10 bg-gray-200 flex items-center justify-center">'
            '<span class="text-gray-500 text-sm">{}</span>'
            "</div>",
            obj.get_initials()
            if hasattr(obj, "get_initials")
            else obj.email[0].upper(),
        )

    avatar_display.short_description = ""

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.email

    get_full_name.short_description = "Name"
    get_full_name.admin_order_field = "first_name"

    # Fields to show in the edit form
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            "Personal info",
            {
                "fields": (
                    "first_name",
                    "last_name",
                    "role",
                    "profile_picture_url",
                    "bio",
                    "phone",
                    "date_of_birth",
                )
            },
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )

    # Fields to show when creating a new user
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "password1",
                    "password2",
                    "first_name",
                    "last_name",
                    "role",
                    "profile_picture_url",
                    "is_active",
                    "is_staff",
                ),
            },
        ),
    )


admin.site.register(User, CustomUserAdmin)

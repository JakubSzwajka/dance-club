from django.db import models


class DanceStyle(models.TextChoices):
    BALLROOM = "ballroom"
    LATIN = "latin"
    SALSA = "salsa"
    TANGO = "tango"
    OTHER = "other"


class SkillLevel(models.TextChoices):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class ClassType(models.TextChoices):
    SOLO = "solo"
    DUET = "duet"
    FORMATION = "formation"


class SportsCard(models.TextChoices):
    MULTISPORT = "multisport"
    MEDICOVER = "medicover"
    OK_SYSTEM = "ok_system"
    BENEFIT = "benefit"
    FITPROFIT = "fitprofit"
    OTHER = "other"


class Facilities(models.TextChoices):
    PARKING = "parking"
    CHANGING_ROOM = "changing_room"
    LOCKERS = "lockers"
    TOILETS = "toilets"
    SHOWER = "shower"
    AIR_CONDITIONING = "air_conditioning"
    MIRRORS = "mirrors"
    LED_LIGHTS = "led_lights"
    BALLET_BARRE = "ballet_barre"
    POLES = "poles"
    CHAIRS_AVAILABLE = "chairs_available"
    WATER_DISPENSER = "water_dispenser"
    WIFI_AVAILABLE = "wifi_available"

    FLOOR_TYPE_WOOD = "floor_type_wood"
    FLOOR_TYPE_MARBLE = "floor_type_marble"
    FLOOR_TYPE_TILE = "floor_type_tile"
    FLOOR_TYPE_CONCRETE = "floor_type_concrete"
    FLOOR_TYPE_CARPET = "floor_type_carpet"
    FLOOR_TYPE_SOFT = "floor_type_soft"

    HIGH_CEILING = "high_ceiling"
    LOW_CEILING = "low_ceiling"

    GOOD_ACOUSTICS = "good_acoustics"
    AUDIO_SYSTEM__BLUETOOTH = "audio_system__bluetooth"
    AUDIO_SYSTEM__USB_C = "audio_system__usb_c"
    AUDIO_SYSTEM__MINI_JACK = "audio_system__mini_jack"
    AUDIO_SYSTEM__OTHER = "audio_system__other"

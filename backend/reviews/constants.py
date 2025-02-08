from typing import Literal


# Teaching Approach Constants
TEACHING_STYLE_MIN = 0
TEACHING_STYLE_MAX = 100
FEEDBACK_APPROACH_MIN = 0
FEEDBACK_APPROACH_MAX = 100
PACE_OF_TEACHING_MIN = 0
PACE_OF_TEACHING_MAX = 100
BREAKDOWN_QUALITY_MIN = 1
BREAKDOWN_QUALITY_MAX = 5

# Environment Constants
RATING_MIN = 1
RATING_MAX = 5

TemperatureType = Literal["cool", "moderate", "warm"]
TEMPERATURE_OPTIONS = ["cool", "moderate", "warm"]

# Music Constants
VOLUME_MIN = 1
VOLUME_MAX = 5
MUSIC_STYLE_MIN = 0
MUSIC_STYLE_MAX = 100

# Waiting Area Constants
WaitingAreaType = Literal["indoor", "outdoor", "both"]
WAITING_AREA_OPTIONS = ["indoor", "outdoor", "both"]

# Verification Constants
VerificationMethodType = Literal["in_person", "video", "photo"]
VERIFICATION_METHODS = ["in_person", "video", "photo"]

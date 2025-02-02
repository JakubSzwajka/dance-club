from ninja import Schema
from datetime import datetime
from decimal import Decimal
from typing import Optional, List


class LocationSchema(Schema):
    id: str
    name: str
    address: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    url: Optional[str] = None



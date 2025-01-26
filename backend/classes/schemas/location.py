from ninja import Schema
from datetime import datetime
from decimal import Decimal
from typing import Optional, List


class LocationSchema(Schema):
    id: str
    name: str
    address: str
    latitude: Decimal
    longitude: Decimal
    url: Optional[str] = None


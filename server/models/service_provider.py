from datetime import datetime

from .user import User
from .service_type import ServiceType
from .availability_slot import AvailabilitySlot
from typing import List

from ..utils.db import get_providers_collection


class ServiceProvider(User):
    def __init__(self, *args, services_offered: List[ServiceType], service_areas: List[str],
                 status: str, availability: List[AvailabilitySlot], is_online: bool, **kwargs):
        super().__init__(*args, **kwargs)
        self.services_offered = services_offered
        self.service_areas = service_areas
        self.status = status
        self.availability = availability
        self.is_online = is_online

class ProviderService:

    @staticmethod
    def get_providers_available_on_date(role, date_str, location):
        providers = get_providers_collection()

        # Convert date string to weekday name (e.g. "Sunday")
        weekday = datetime.strptime(date_str, "%Y-%m-%d").strftime("%A")

        query = {
            "isOnline": True,
            "status": "approved",
            "servicesOffered": role,
            "availability.day": weekday,
            # ניתן להרחיב לפי אזור (location) בעתיד
        }

        results = list(providers.find(query))

        # הפשטה: נחזיר רק חלק מהשדות (name, serviceAreas וכו’)
        return [
            {
                "_id": str(p["_id"]),
                "name": p.get("name"),
                "servicesOffered": p.get("servicesOffered", []),
                "serviceAreas": p.get("serviceAreas", [])
            }
            for p in results
        ]
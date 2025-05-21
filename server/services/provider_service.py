from utils.db import get_providers_collection, get_bookings_collection
from bson import ObjectId
from datetime import datetime

class ProviderService:

    @staticmethod
    def set_online_status(provider_id, is_online):
        """Update provider's online availability status."""
        providers = get_providers_collection()
        providers.update_one(
            {"_id": ObjectId(provider_id)},
            {"$set": {"isOnline": is_online}}
        )

    @staticmethod
    def update_availability(provider_id, availability_slots):
        """Update provider's availability slots."""
        providers = get_providers_collection()
        providers.update_one(
            {"_id": ObjectId(provider_id)},
            {"$set": {"availability": availability_slots}}
        )

    @staticmethod
    def get_available_providers(service_type, area):
        """Return available and approved providers matching role and area."""
        providers = get_providers_collection()
        return list(providers.find({
            "isOnline": True,
            "serviceAreas": area,
            "servicesOffered": service_type,
            "status": "approved"
        }))

    @staticmethod
    def get_scheduled_orders(provider_id):
        """Get only future non-instant bookings for this provider."""
        bookings = get_bookings_collection()
        now = datetime.utcnow()
        orders = bookings.find({
            "providerId": ObjectId(provider_id),
            "datetime": {"$gt": now},
            "isInstant": False
        })
        result = []
        for o in orders:
            o["_id"] = str(o["_id"])
            o["providerId"] = str(o["providerId"])
            o["customerId"] = str(o["customerId"])
            result.append(o)
        return result

    @staticmethod
    def get_immediate_orders(provider_id):
        """
        1. Orders assigned to this provider.
        2. Unassigned orders that match provider’s roles & areas.
        """
        bookings = get_bookings_collection()
        providers = get_providers_collection()
        now = datetime.utcnow()

        provider = providers.find_one({"_id": ObjectId(provider_id)})
        if not provider:
            return []

        roles = provider.get("servicesOffered", [])
        areas = provider.get("serviceAreas", [])

        orders = bookings.find({
            "isInstant": True,
            "datetime": {"$gte": now},
            "status": "pending",
            "$or": [
                {"providerId": ObjectId(provider_id)},
                {
                    "providerId": None,
                    "serviceType": {"$in": roles},
                    "location": {"$in": areas}
                }
            ]
        })

        result = []
        for o in orders:
            o["_id"] = str(o["_id"])
            o["customerId"] = str(o["customerId"])
            if o.get("providerId"):
                o["providerId"] = str(o["providerId"])
            result.append(o)
        return result

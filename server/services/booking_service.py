from utils.db import get_bookings_collection
from bson import ObjectId
from datetime import datetime

class BookingService:

    @staticmethod
    def create_booking(customer_id, provider_id, service_type, datetime_str, location):
        bookings = get_bookings_collection()

        new_booking = {
            "customerId": ObjectId(customer_id),
            "providerId": ObjectId(provider_id),
            "serviceType": service_type,
            "datetime": datetime.strptime(datetime_str, "%Y-%m-%dT%H:%M"),
            "location": location,
            "status": "pending",
            "rating": None,
            "feedback": None,
            "isInstant": False
        }

        result = bookings.insert_one(new_booking)
        return str(result.inserted_id)

    @staticmethod
    def create_instant_booking(customer_id, service_type, location, datetime_str):
        bookings = get_bookings_collection()

        new_booking = {
            "customerId": ObjectId(customer_id),
            "providerId": None,
            "serviceType": service_type,
            "datetime": datetime.strptime(datetime_str, "%Y-%m-%dT%H:%M:%S.%fZ"),
            "location": location,
            "status": "pending",
            "rating": None,
            "feedback": None,
            "isInstant": True
        }

        result = bookings.insert_one(new_booking)
        return str(result.inserted_id)

    @staticmethod
    def get_bookings_by_customer(customer_id):
        bookings = get_bookings_collection()
        return list(bookings.find({"customerId": ObjectId(customer_id)}))

    @staticmethod
    def get_bookings_by_provider(provider_id):
        bookings = get_bookings_collection()
        return list(bookings.find({"providerId": ObjectId(provider_id)}))

    @staticmethod
    def update_status(booking_id, new_status):
        bookings = get_bookings_collection()
        bookings.update_one({"_id": ObjectId(booking_id)}, {"$set": {"status": new_status}})

    @staticmethod
    def rate_booking(booking_id, rating, feedback):
        bookings = get_bookings_collection()
        bookings.update_one(
            {"_id": ObjectId(booking_id)},
            {"$set": {
                "rating": rating,
                "feedback": feedback,
                "status": "completed"
            }}
        )

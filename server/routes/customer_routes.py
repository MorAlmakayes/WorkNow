from flask import Blueprint, request, jsonify
from utils.db import get_bookings_collection, get_providers_collection
from bson import ObjectId
from datetime import datetime

customer_bp = Blueprint('customer', __name__, url_prefix='/api/customer')

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
            "providerId": None,  # not yet assigned
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

@customer_bp.route('/orders/<customer_id>', methods=['GET'])
def get_customer_orders(customer_id):
    orders = BookingService.get_bookings_by_customer(customer_id)
    providers = get_providers_collection()

    for o in orders:
        o['_id'] = str(o['_id'])
        o['customerId'] = str(o['customerId'])
        o['providerId'] = str(o.get('providerId')) if o.get('providerId') else None

        # fetch provider name from DB (if assigned)
        if o.get('providerId'):
            provider = providers.find_one({"_id": ObjectId(o['providerId'])})
            o['providerName'] = provider.get('name') if provider else 'שגיאה בשם'
        else:
            o['providerName'] = 'טרם שויך'

    return jsonify({"orders": orders})

@customer_bp.route('/orders/immediate', methods=['POST'])
def create_instant_order():
    try:
        data = request.json
        customer_id = data.get('customer_id')
        service_type = data.get('service_type')
        location = data.get('location')
        datetime_str = data.get('datetime')  # חייב להיות ISO format

        if not all([customer_id, service_type, location, datetime_str]):
            return jsonify({"error": "Missing fields"}), 400

        booking_id = BookingService.create_instant_booking(
            customer_id=customer_id,
            service_type=service_type,
            location=location,
            datetime_str=datetime_str
        )

        return jsonify({
            "message": "ההזמנה נשלחה בהצלחה",
            "booking_id": booking_id
        }), 201

    except Exception as e:
        return jsonify({"error": f"שגיאה בשרת: {str(e)}"}), 500

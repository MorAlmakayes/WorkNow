from flask import Blueprint, request, jsonify
from utils.db import get_users_collection, get_bookings_collection
from bson import ObjectId
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity

provider_bp = Blueprint('provider', __name__, url_prefix='/api/provider')


# 📞 Handle a live incoming call (not implemented yet)
@provider_bp.route('/receive_call', methods=['POST'])
def receive_call():
    data = request.json
    return jsonify({"message": "Live call received", "data": data}), 200


# 📅 Get available providers by date (mock logic)
@provider_bp.route('/available-by-date', methods=['POST'])
def get_providers_by_date():
    data = request.json
    role = data.get('role')
    date_str = data.get('date')
    location = data.get('location')

    if not role or not date_str or not location:
        return jsonify({"error": "Missing required fields"}), 400

    return jsonify({"providers": []}), 200


# 📄 Get all providers in the system
@provider_bp.route('/all', methods=['GET'])
def get_all_providers():
    users = get_users_collection()
    providers = list(users.find({"user_type": "provider"}))
    for p in providers:
        p["_id"] = str(p["_id"])
    return jsonify({"providers": providers}), 200


# ✅ Approve a provider
@provider_bp.route('/approve', methods=['POST'])
def approve_provider():
    data = request.json
    provider_id = data.get("provider_id")
    if not provider_id:
        return jsonify({"error": "Missing provider_id"}), 400

    users = get_users_collection()
    users.update_one({"_id": ObjectId(provider_id)}, {"$set": {"status": "approved"}})
    return jsonify({"message": "הספק אושר"}), 200


# ❌ Reject a provider
@provider_bp.route('/reject', methods=['POST'])
def reject_provider():
    data = request.json
    provider_id = data.get("provider_id")
    if not provider_id:
        return jsonify({"error": "Missing provider_id"}), 400

    users = get_users_collection()
    users.update_one({"_id": ObjectId(provider_id)}, {"$set": {"status": "rejected"}})
    return jsonify({"message": "הספק נדחה"}), 200


# ⚙️ Update provider status
@provider_bp.route('/status', methods=['POST'])
def update_provider_status():
    data = request.json
    provider_id = data.get("provider_id")
    new_status = data.get("status")

    if not provider_id or not new_status:
        return jsonify({"error": "Missing fields"}), 400

    users = get_users_collection()
    users.update_one({"_id": ObjectId(provider_id)}, {"$set": {"status": new_status}})
    return jsonify({"message": "הסטטוס עודכן"}), 200


# 📦 Get all scheduled orders by provider
@provider_bp.route('/orders/<provider_id>', methods=['GET'])
def get_orders_by_provider(provider_id):
    bookings = get_bookings_collection()
    try:
        provider_obj_id = ObjectId(provider_id)
    except Exception:
        return jsonify({"error": "Invalid provider ID"}), 400

    orders = list(bookings.find({"providerId": provider_obj_id}))
    for o in orders:
        o["_id"] = str(o["_id"])
        o["providerId"] = str(o["providerId"])
        o["customerId"] = str(o["customerId"])
    return jsonify({"orders": orders}), 200


# 🚨 Get relevant live (immediate) orders
@provider_bp.route('/orders/immediate/<provider_id>', methods=['GET'])
def get_immediate_orders(provider_id):
    bookings = get_bookings_collection()
    users = get_users_collection()
    now = datetime.utcnow()

    try:
        provider_obj_id = ObjectId(provider_id)
    except Exception:
        return jsonify({"error": "Invalid provider ID"}), 400

    provider = users.find_one({"_id": provider_obj_id, "user_type": "provider"})
    if not provider:
        return jsonify({"error": "Provider not found"}), 404

    services = provider.get("servicesOffered", [])
    areas = provider.get("serviceAreas", [])

    orders = bookings.find({
        "isInstant": True,
        "datetime": {"$gte": now},
        "status": "pending",
        "$or": [
            {"providerId": provider_obj_id},
            {
                "providerId": None,
                "serviceType": {"$in": services},
                "location": {"$in": areas}
            }
        ]
    })

    result = []
    for order in orders:
        order["_id"] = str(order["_id"])
        order["customerId"] = str(order["customerId"])
        if order.get("providerId"):
            order["providerId"] = str(order["providerId"])
        result.append(order)

    return jsonify({"orders": result})


# ✔️ Accept an incoming immediate order
@provider_bp.route('/accept-order', methods=['POST'])
def accept_order():
    data = request.json
    order_id = data.get("orderId")
    provider_id = data.get("providerId")

    if not order_id or not provider_id:
        return jsonify({"error": "Missing data"}), 400

    bookings = get_bookings_collection()
    bookings.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {"providerId": ObjectId(provider_id), "status": "accepted"}}
    )

    return jsonify({"message": "הקריאה התקבלה בהצלחה"}), 200


# ❌ Reject an incoming immediate order
@provider_bp.route('/reject-order', methods=['POST'])
def reject_order():
    data = request.json
    order_id = data.get("orderId")

    if not order_id:
        return jsonify({"error": "Missing orderId"}), 400

    bookings = get_bookings_collection()
    bookings.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {"status": "rejected"}}
    )

    return jsonify({"message": "הקריאה סומנה כנדחית"}), 200


# ✅ Update provider availability
@provider_bp.route('/availability/<provider_id>', methods=['POST'])
def update_provider_availability(provider_id):
    data = request.json
    availability = data.get("availability")

    if availability is None:
        return jsonify({"error": "Missing availability data"}), 400

    users = get_users_collection()
    try:
        result = users.update_one(
            {"_id": ObjectId(provider_id), "user_type": "provider"},
            {"$set": {"availability": availability}}
        )
        if result.matched_count == 0:
            return jsonify({"error": "Provider not found"}), 404
        return jsonify({"message": "Availability updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Get provider availability
@provider_bp.route('/availability/<provider_id>', methods=['GET'])
def get_provider_availability(provider_id):
    users = get_users_collection()
    try:
        provider = users.find_one({"_id": ObjectId(provider_id), "user_type": "provider"})
        if not provider:
            return jsonify({"error": "Provider not found"}), 404
        availability = provider.get("availability", {})
        return jsonify({"availability": availability}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Update provider services
@provider_bp.route('/services/<provider_id>', methods=['POST'])
def update_provider_services(provider_id):
    data = request.json
    services_offered = data.get("services_offered")

    if services_offered is None:
        return jsonify({"error": "Missing services_offered data"}), 400

    users = get_users_collection()
    try:
        result = users.update_one(
            {"_id": ObjectId(provider_id), "user_type": "provider"},
            {"$set": {"servicesOffered": services_offered}}
        )
        if result.matched_count == 0:
            return jsonify({"error": "Provider not found"}), 404
        return jsonify({"message": "Services updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Fetch open orders for providers
@provider_bp.route('/orders/open', methods=['GET'])
@jwt_required()
def get_open_orders():
    bookings = get_bookings_collection()
    open_orders = list(bookings.find({"providerId": None, "status": "pending"}))
    for order in open_orders:
        order["_id"] = str(order["_id"])
        order["customerId"] = str(order["customerId"])
    return jsonify({"orders": open_orders}), 200


# Approve an order and assign it to the provider
@provider_bp.route('/orders/approve', methods=['POST'])
@jwt_required()
def approve_order():
    data = request.json
    order_id = data.get("orderId")
    provider_id = get_jwt_identity()

    if not order_id:
        return jsonify({"error": "Missing orderId"}), 400

    bookings = get_bookings_collection()
    result = bookings.update_one(
        {"_id": ObjectId(order_id), "providerId": None, "status": "pending"},
        {"$set": {"providerId": ObjectId(provider_id), "status": "accepted"}}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Order not found or already assigned"}), 404

    return jsonify({"message": "Order approved and assigned successfully"}), 200

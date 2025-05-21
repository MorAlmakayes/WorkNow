from flask import Blueprint, request, jsonify
from utils.db import get_users_collection, get_bookings_collection

# Admin Blueprint with prefix /api/admin
admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

# Endpoint to approve a service provider (for demonstration only)
@admin_bp.route('/approve_provider', methods=['POST'])
def approve_provider():
    data = request.json
    return jsonify({"message": "Provider approved", "provider_id": data.get("provider_id")}), 200

# Endpoint to fetch all customers
@admin_bp.route('/users', methods=['GET'])
def get_users():
    users_collection = get_users_collection()
    users = list(users_collection.find({"user_type": "customer"}))

    # Convert ObjectId to string and remove internal _id
    for u in users:
        u["id"] = str(u["_id"])
        u.pop("_id", None)

    return jsonify({"users": users}), 200

# Endpoint to fetch all orders
@admin_bp.route('/orders', methods=['GET'])
def get_all_orders():
    orders_collection = get_bookings_collection()
    orders = list(orders_collection.find())

    # Convert ObjectId fields to strings for frontend compatibility
    for o in orders:
        o["_id"] = str(o["_id"])
        o["providerId"] = str(o.get("providerId", ""))
        o["customerId"] = str(o.get("customerId", ""))
        o["datetime"] = o.get("datetime", "")  # Optional: ensure datetime exists

    return jsonify({"orders": orders}), 200
@admin_bp.route('/stats', methods=['GET'])
def get_statistics():
    orders_col = get_bookings_collection()
    users_col = get_users_collection()
    providers_col = get_providers_collection()
    roles_col = get_roles_collection()

    # Orders by role
    orders_pipeline = [
        {"$group": {"_id": "$serviceType", "count": {"$sum": 1}}},
        {"$project": {"role": "$_id", "count": 1, "_id": 0}}
    ]
    orders_by_role = list(orders_col.aggregate(orders_pipeline))

    # Users by type
    users = users_col.find({}, {"user_type": 1})
    users_by_type = {}
    for u in users:
        t = u.get("user_type", "unknown")
        users_by_type[t] = users_by_type.get(t, 0) + 1

    # Availability (mocked for now)
    avg_availability = [{"name": "ספק א'", "hours_per_week": 20}, {"name": "ספק ב'", "hours_per_week": 12}]

    # Ratings
    providers = list(providers_col.find({}, {"name": 1, "ratings": 1}))
    avg_ratings = []
    for p in providers:
        ratings = p.get("ratings", [])
        if ratings:
            avg = sum(ratings) / len(ratings)
            avg_ratings.append({"name": p["name"], "avg": avg, "count": len(ratings)})

    return jsonify({
        "orders_by_role": orders_by_role,
        "users_by_type": users_by_type,
        "avg_availability": avg_availability,
        "avg_ratings": avg_ratings
    }), 200

@admin_bp.route('/availability', methods=['GET'])
def get_availability():
    settings = get_db()["settings"].find_one({"_id": "availability"})
    if not settings:
        settings = {
            "_id": "availability",
            "activeDays": [],
            "startTime": "08:00",
            "endTime": "17:00",
            "maintenance": False,
            "maintenanceMessage": "",
            "holidays": []
        }
        get_db()["settings"].insert_one(settings)
    settings["_id"] = str(settings["_id"])
    return jsonify(settings)

@admin_bp.route('/availability', methods=['POST'])
def update_availability():
    data = request.json
    data["_id"] = "availability"
    get_db()["settings"].replace_one({"_id": "availability"}, data, upsert=True)
    return jsonify({"message": "ההגדרות נשמרו בהצלחה"})
from flask import Blueprint, request, jsonify
from utils.db import get_roles_collection

roles_bp = Blueprint('roles', __name__, url_prefix='/api/roles')

@roles_bp.route('/', methods=['GET'])
def get_roles():
    try:
        roles = get_roles_collection()
        active_roles = list(roles.find({"active": True}))
        for role in active_roles:
            role["_id"] = str(role["_id"])
        return jsonify(active_roles), 200
    except Exception as e:
        print(f"Error fetching roles: {str(e)}")
        return jsonify({"error": "שגיאה בטעינת התחומים"}), 500



@roles_bp.route('/add', methods=['POST'])
def add_role():
    data = request.get_json()
    name = data.get('name')
    if not name:
        return jsonify({"error": "חסר שם תחום"}), 400

    roles_collection = get_roles_collection()
    if roles_collection.find_one({"name": name}):
        return jsonify({"error": "תחום כבר קיים"}), 409

    roles_collection.insert_one({"name": name, "active": True})
    return jsonify({"message": "התחום נוסף בהצלחה"}), 201

@roles_bp.route('/delete', methods=['POST'])
def delete_role():
    data = request.get_json()
    name = data.get('name')
    roles_collection = get_roles_collection()
    result = roles_collection.delete_one({"name": name})
    if result.deleted_count == 0:
        return jsonify({"error": "תחום לא נמצא"}), 404
    return jsonify({"message": "התחום נמחק"}), 200

@roles_bp.route('/toggle', methods=['POST'])
def toggle_active():
    data = request.get_json()
    name = data.get('name')
    roles_collection = get_roles_collection()
    role = roles_collection.find_one({"name": name})
    if not role:
        return jsonify({"error": "תחום לא נמצא"}), 404

    new_status = not role.get("active", True)
    roles_collection.update_one({"name": name}, {"$set": {"active": new_status}})
    return jsonify({"message": "סטטוס עודכן", "active": new_status}), 200
from flask import Blueprint, jsonify
from utils.db import get_roles_collection

def add_role(name):
    """Add a new role to the collection if it doesn't exist."""
    roles_collection = get_roles_collection()
    if roles_collection.find_one({"name": name}):
        return False  # Role already exists
    roles_collection.insert_one({"name": name})
    return True

def delete_role(name):
    """Delete a role by name."""
    roles_collection = get_roles_collection()
    result = roles_collection.delete_one({"name": name})
    return result.deleted_count > 0

roles_bp = Blueprint('roles', __name__, url_prefix='/api/roles')

@roles_bp.route('/', methods=['GET'])
def get_roles():
    roles_collection = get_roles_collection()
    roles = list(roles_collection.find({}, {"_id": 0, "name": 1}))
    return jsonify([r['name'] for r in roles])
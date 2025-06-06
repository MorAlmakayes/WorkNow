from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from utils.db import get_users_collection
from werkzeug.security import generate_password_hash, check_password_hash
import re

# Define blueprint for auth routes
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# Validate email format using regex
def is_valid_email(email):
    return re.match(r"^[\w\.-]+@[\w\.-]+\.\w+$", email)

# Validate Israeli ID format: exactly 9 digits
def is_valid_id(national_id):
    return re.fullmatch(r"\d{9}", national_id) is not None

# Create unique username if it already exists
def generate_unique_username(name, users_collection):
    base_username = name.replace(" ", "")
    username = base_username
    suffix = 1
    while users_collection.find_one({"username": username}):
        username = f"{base_username}{suffix}"
        suffix += 1
    return username

# Endpoint to register a new customer
@auth_bp.route('/register-user', methods=['POST'])
def register_user():
    data = request.json
    name = data.get('name')
    email = data.get('email', '').lower().strip()
    password = data.get('password')
    national_id = data.get('id')
    phone = data.get('phone')

    # Validate required fields
    if not all([name, email, password, national_id, phone]):
        return jsonify({"error": "חסרים שדות בהרשמה"}), 400
    if not is_valid_email(email):
        return jsonify({"error": "פורמט אימייל לא תקין"}), 400
    if not is_valid_id(national_id):
        return jsonify({"error": "תעודת זהות אינה תקינה (9 ספרות)"}), 400

    users = get_users_collection()

    # Check if email is already used
    if users.find_one({"email": email}):
        return jsonify({"error": "אימייל כבר קיים"}), 400

    # Create and insert new user
    username = generate_unique_username(name, users)
    new_user = {
        "username": username,
        "name": name,
        "email": email,
        "password_hash": generate_password_hash(password),
        "id": national_id,
        "phone": phone,
        "user_type": "customer"
    }

    result = users.insert_one(new_user)

    return jsonify({
        "message": "המשתמש נרשם בהצלחה",
        "username": username,
        "user_id": str(result.inserted_id)
    }), 201

# Endpoint to log in an existing user
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    identifier = data.get('identifier', '').lower().strip()
    password = data.get('password')

    # Check input
    if not identifier or not password:
        return jsonify({"error": "יש להזין שם משתמש / אימייל וסיסמה"}), 400

    users = get_users_collection()

    # Try to find user by email or username
    user = users.find_one({
        "$or": [
            {"email": identifier},
            {"username": identifier}
        ]
    })

    # Verify credentials
    if not user or not check_password_hash(user.get("password_hash", ""), password):
        return jsonify({"error": "שם משתמש / אימייל או סיסמה שגויים"}), 401

    # Create JWT token
    access_token = create_access_token(identity=str(user["_id"]))

    return jsonify({
        "access_token": access_token,
        "user": {
            "id": str(user["_id"]),
            "username": user.get("username"),
            "name": user.get("name"),
            "email": user.get("email"),
            "user_type": user.get("user_type", "customer")
        }
    }), 200

from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from utils.db import get_users_collection
from bson import ObjectId
import datetime

class AuthService:
    @staticmethod
    def register_user(name, email, password, phone, role):
        users = get_users_collection()
        if users.find_one({"email": email}):
            return {"error": "Email already exists"}, 400

        hashed_pw = generate_password_hash(password)
        user_data = {
            "name": name,
            "email": email,
            "password_hash": hashed_pw,
            "phone": phone,
            "role": role,
            "created_at": datetime.datetime.utcnow()
        }

        result = users.insert_one(user_data)
        return {"message": "User registered successfully", "user_id": str(result.inserted_id)}, 201

    @staticmethod
    def login_user(identifier, password):
        users = get_users_collection()

        # Try to find the user by email or username
        user = users.find_one({
            "$or": [
                {"email": identifier},
                {"username": identifier}
            ]
        })

        if not user or not check_password_hash(user["password_hash"], password):
            return {"error": "שם משתמש / אימייל או סיסמה שגויים"}, 401

        access_token = create_access_token(
            identity=str(user["_id"]),
            additional_claims={
                "role": user["role"],
                "email": user["email"]
            }
        )

        return {
            "message": "התחברת בהצלחה",
            "access_token": access_token,
            "user": {
                "id": str(user["_id"]),
                "name": user["name"],
                "email": user["email"],
                "role": user["role"]
            }
        }, 200

from utils.db import get_users_collection
from bson import ObjectId

class UserService:
    @staticmethod
    def get_user_by_id(user_id):
        users = get_users_collection()
        return users.find_one({"_id": ObjectId(user_id)})

    @staticmethod
    def get_user_by_email(email):
        users = get_users_collection()
        return users.find_one({"email": email})

    @staticmethod
    def update_user(user_id, updates: dict):
        users = get_users_collection()
        return users.update_one({"_id": ObjectId(user_id)}, {"$set": updates})
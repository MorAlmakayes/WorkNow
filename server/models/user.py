from bson import ObjectId

class User:
    def __init__(self, id: ObjectId, username: str, name: str, email: str, password_hash: str, phone: str, roles: list, user_type: str):
        self.id = id
        self.username = username
        self.name = name
        self.email = email
        self.password_hash = password_hash
        self.phone = phone
        self.roles = roles
        self.user_type = user_type

    def to_dict(self):
        return {
            "_id": ObjectId(self.id) if self.id else None,
            "username": self.username,
            "name": self.name,
            "email": self.email,
            "password_hash": self.password_hash,
            "phone": self.phone,
            "roles": self.roles,
            "user_type": self.user_type
        }

    @staticmethod
    def from_dict(data):
        return User(
            id=data.get("_id"),
            username=data.get("username", ""),
            name=data.get("name", ""),
            email=data.get("email", ""),
            password_hash=data.get("password_hash", ""),
            phone=data.get("phone", ""),
            roles=data.get("roles", []),
            user_type=data.get("user_type", "customer")
        )

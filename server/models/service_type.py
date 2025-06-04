from bson import ObjectId

class ServiceType:
    def __init__(self, id: ObjectId, name: str, roles: list = None):
        self.id = id
        self.name = name
        self.roles = roles if roles is not None else []
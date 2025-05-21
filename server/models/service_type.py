from bson import ObjectId

class ServiceType:
    def __init__(self, id: ObjectId, name: str):
        self.id = id
        self.name = name
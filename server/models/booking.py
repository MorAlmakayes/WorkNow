from bson import ObjectId
from datetime import datetime
from .service_type import ServiceType

class Booking:
    def __init__(self, id: ObjectId, customer_id: ObjectId, provider_id: ObjectId,
                 service_type: ServiceType, datetime: datetime, status: str,
                 location: str, rating: float, feedback: str):
        self.id = id
        self.customer_id = customer_id
        self.provider_id = provider_id
        self.service_type = service_type
        self.datetime = datetime
        self.status = status
        self.location = location
        self.rating = rating
        self.feedback = feedback
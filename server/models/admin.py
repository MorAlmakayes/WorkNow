from .user import User
from .service_provider import ServiceProvider

class Admin(User):
    def approve_service_provider(self, provider: ServiceProvider):
        provider.status = "approved"
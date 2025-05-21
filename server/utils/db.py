from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Create a single MongoDB connection using URI from environment
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)

# Get main database instance
def get_db():
    return client["WorkNow"]

# Access the users collection (customers, providers, admins)
def get_users_collection():
    return get_db()["users"]

# Access the bookings/orders collection
def get_bookings_collection():
    return get_db()["bookings"]

# Access the service providers collection
def get_providers_collection():
    return get_db()["providers"]

# Access the customers collection
def get_customers_collection():
    return get_db()["customers"]

# Access the service types collection
def get_service_types_collection():
    return get_db()["service_types"]

# Access the availability slots collection (providers' schedule)
def get_availability_slots_collection():
    return get_db()["availability_slots"]

# Access the roles (job categories) collection
def get_roles_collection():
    return get_db()["roles"]

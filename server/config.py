import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

class Config:
    # Enable debug mode if FLASK_DEBUG=true
    DEBUG = os.getenv("FLASK_DEBUG", "false").lower() == "true"

    # Port used to run the Flask server
    PORT = int(os.getenv("FLASK_PORT", 5001))

    # JWT secret key for authentication
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret-key")

    # MongoDB connection URI
    MONGO_URI = os.getenv("MONGO_URI")

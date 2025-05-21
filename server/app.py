from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from pymongo import MongoClient
from config import Config
import logging

# Initialize Flask app
app = Flask(__name__)

# Load configuration from config.py
app.config.from_object(Config)

# Enable CORS with credentials support
CORS(app, supports_credentials=True)

# Initialize JWT manager
jwt = JWTManager(app)

# Setup MongoDB connection
client = MongoClient(Config.MONGO_URI)
db = client["WorkNow"]

# === Logging Configuration ===
logging.basicConfig(level=logging.INFO)

@app.before_request
def log_request():
    logging.info(f"[{request.method}] {request.path} - From: {request.remote_addr}")

# === Global Error Handler ===
@app.errorhandler(Exception)
def handle_exception(e):
    logging.exception("Unhandled exception occurred:")
    return jsonify({"error": "Internal server error"}), 500

# === JWT Error Handlers ===
@jwt.unauthorized_loader
def handle_missing_token(callback):
    return jsonify({"error": "Missing or invalid token"}), 401

@jwt.invalid_token_loader
def handle_invalid_token(error):
    return jsonify({"error": "Invalid token"}), 422

@jwt.expired_token_loader
def handle_expired_token(jwt_header, jwt_payload):
    return jsonify({"error": "Token has expired"}), 401

# === Register Blueprints ===
from routes.auth_routes import auth_bp
from routes.admin_routes import admin_bp
from routes.customer_routes import customer_bp
from routes.provider_routes import provider_bp
from routes.roles_routes import roles_bp

app.register_blueprint(auth_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(customer_bp)
app.register_blueprint(provider_bp)
app.register_blueprint(roles_bp)

# === Utility / Health Endpoints ===
@app.route("/api/message")
def get_message():
    return jsonify(message="Hello from Flask API!")

@app.route("/")
def home():
    return "Welcome to the WorkNow backend!"

@app.route("/api/test-db")
def test_db():
    try:
        collections = db.list_collection_names()
        return jsonify(status="success", collections=collections)
    except Exception as e:
        return jsonify(status="error", message=str(e)), 500

# === Run Server ===
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=Config.PORT, debug=Config.DEBUG)

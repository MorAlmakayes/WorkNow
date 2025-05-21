WorkNow – Smart Home Service Booking System

WorkNow is a full-stack web application designed for real-time scheduling, booking, and management of home service providers. It supports admin dashboards, provider and customer portals, availability calendars, immediate job requests, and more.

Technologies Used

Frontend (React.js):

React Router

Axios for API communication

Bootstrap 5 for styling

Local storage session management

Backend (Flask):

Flask Blueprints

Flask-JWT-Extended for authentication

PyMongo for MongoDB integration

Database:

MongoDB Atlas (cloud-hosted)

Project Structure

WorkNow/
├── client/ (React frontend)
│ ├── src/
│ │ ├── pages/ – Views by role (admin, provider, customer)
│ │ ├── components/ – Shared components (Header, Footer, Route guards)
│ │ ├── services/api.js – Axios API layer
│ │ └── App.js – App entry point
│ └── public/
├── server/ (Flask backend)
│ ├── routes/ – Blueprints (auth, admin, provider, etc.)
│ ├── utils/db.py – MongoDB client and collections
│ └── app.py – Main app setup
├── .env – Environment variables
└── run.sh – Script to run client and server together

Setup Instructions

Clone the Repository:

bash
Copy
Edit
git clone https://github.com/<your-username>/WorkNow.git  
cd WorkNow
Configure Environment:
Create a .env file inside the server/ directory with the following content:

env
Copy
Edit
MONGO_URI=your_mongodb_uri  
JWT_SECRET_KEY=your_jwt_secret  
FLASK_PORT=5001
Install Backend Requirements:

bash
Copy
Edit
cd server  
pip install -r requirements.txt
Install Frontend Dependencies:

bash
Copy
Edit
cd ../client  
npm install
Running the Project

Run both frontend and backend together:

bash
Copy
Edit
./run.sh
Or separately:

Flask backend:

bash
Copy
Edit
cd server  
flask run --port=5001
React frontend:

bash
Copy
Edit
cd client  
npm start
User Roles & Features

Admin:

Manage providers, customers, roles

Approve/reject providers

View system stats and all orders

Manage site-wide availability and settings

Provider:

View and manage weekly availability

Respond to live job requests

Access calendar, messages, reports, stats

View order history and service details

Customer:

Register and book services instantly or in advance

Track order status

Browse and filter available service providers

Default Availability

Sunday–Thursday: 09:00 to 18:00

Friday: 09:00 to 14:00

Saturday: Closed (not shown)

Availability is saved in MongoDB using this structure:

json
Copy
Edit
"availability": {
"Sunday": { "available": true, "start": "09:00", "end": "18:00" },
"Friday": { "available": true, "start": "09:00", "end": "14:00" },
...
}
Features Overview

📅 Dynamic weekly calendar for provider availability

🔄 Real-time job request system for immediate services

🛠 Role-based dashboards and routes (Admin, Provider, Customer)

📊 Admin analytics and system statistics

📨 Messaging system for providers

📑 Service management and booking history

📃 Reports and payment tracking

Security

JWT-based authentication

Route protection for each user type

Role management system

Error handling and centralized logging

Contact

Developed by Mor Almakayes
Email: moralmakayes1@gmail.com
LinkedIn: linkedin.com/in/mor-almakayes

License

This project is licensed for educational and personal development use.
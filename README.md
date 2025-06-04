# WorkNow – Smart Home Service Booking System

**WorkNow** is a full-stack web application built to streamline the booking, scheduling, and management of home service providers. It supports real-time job requests, availability calendars, and role-specific dashboards for admins, providers, and customers.

---

## 🚀 Technologies Used

### Frontend (React.js)

* **React Router** – SPA routing
* **Axios** – API communication
* **Bootstrap 5** – Responsive design
* **LocalStorage** – Session state management

### Backend (Flask)

* **Flask Blueprints** – Modular route structure
* **Flask-JWT-Extended** – Secure user authentication
* **PyMongo** – MongoDB integration

### Database

* **MongoDB Atlas** – Cloud-hosted NoSQL database

---

## 🗂 Project Structure

```
WorkNow/
├── client/                  # React frontend
│   ├── src/
│   │   ├── pages/           # Role-based views (admin, provider, customer)
│   │   ├── components/      # Shared UI components (Header, Footer, etc.)
│   │   ├── services/api.js  # Axios API abstraction
│   │   └── App.js           # Main app entry point
│   └── public/
├── server/                  # Flask backend
│   ├── routes/              # Flask Blueprints (auth, admin, etc.)
│   ├── utils/db.py          # MongoDB client and collections
│   └── app.py               # App factory & setup
├── .env                     # Environment variables
└── run.sh                   # Script to run client & server
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/WorkNow.git
cd WorkNow
```

### 2. Configure Environment Variables

Create a `.env` file in the `server/` directory:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET_KEY=your_jwt_secret
FLASK_PORT=5001
```

### 3. Install Backend Dependencies

```bash
cd server
pip install -r requirements.txt
```

### 4. Install Frontend Dependencies

```bash
cd ../client
npm install
```

---

## ▶️ Running the Project

### Option 1: Run both client & server

```bash
chmod +x setup.sh run.sh
./setup.sh
./run.sh
```

### Option 2: Run separately

**Backend (Flask):**

```bash
cd server
flask run --port=5001
```

**Frontend (React):**

```bash
cd client
npm start
```

---

## 👥 User Roles & Features

### 🛠 Admin

* Manage service providers, customers, and roles
* Approve/reject provider registrations
* View analytics and system-wide orders
* Configure site availability and settings

### 🧑‍🔧 Service Provider

* Set weekly availability
* Respond to live/immediate job requests
* Access calendar, messages, reports, and statistics
* View service history

### 🧑‍💼 Customer

* Register and book services
* Browse available providers
* Schedule immediate or future services
* Track order statuses

---

## 📆 Default Availability

| Day             | Time          |
| --------------- | ------------- |
| Sunday–Thursday | 09:00 – 18:00 |
| Friday          | 09:00 – 14:00 |
| Saturday        | Closed        |

Saved in MongoDB:

```json
"availability": {
  "Sunday": { "available": true, "start": "09:00", "end": "18:00" },
  "Friday": { "available": true, "start": "09:00", "end": "14:00" }
}
```

---

## 🔍 Feature Highlights

* 📅 Dynamic Calendar – Weekly availability interface
* 🔄 Immediate Job Requests – Real-time job flow
* 🛡️ Role-based Routing – Custom views per user type
* 📊 Admin Dashboard – System-wide analytics
* 💬 Messaging System – Provider communication
* 📃 Order History & Reports – Service and payment tracking
* 🔐 Secure Auth – JWT-based access control and protected routes

---

## 🔒 Security

* JWT Authentication for all users
* Role-based route protection
* Input validation & centralized error handling
* Admin approval system for new providers

---

## 👤 Contact & Credits

**Developed by:** Mor Almakayes  
📧 Email: [moralmakayes1@gmail.com](mailto:moralmakayes1@gmail.com)  
🔗 LinkedIn: [linkedin.com/in/mor-almakayes](https://linkedin.com/in/mor-almakayes)

---

## 📜 License

This project is licensed for **educational and personal development** use only.
#  EduTrack — Student Management System

A full-stack Student Management System built with React, Node/Express, MongoDB, and JWT authentication.

---

##  Tech Stack

- **Frontend:** React.js, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Token)
- **Password Hashing:** bcryptjs



## Features

- User Registration and Login
- JWT Authentication with protected routes
- Add, View, Edit and Delete Students
- Search students by name or course
- Responsive design for desktop and mobile


##  Folder Structure

```
student-management-system/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Student.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── student.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── server.js
│   ├── config.js
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   ├── Auth.css
    │   │   └── Dashboard.css
    │   ├── App.js
    │   ├── index.js
    │   └── api.js
    └── package.json
```


##  Getting Started

### Prerequisites

Make sure you have these installed on your computer:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (local) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free cloud)
- [Git](https://git-scm.com/)


### Step 1 — Clone the repository

```bash
git clone https://github.com/yourusername/student-management-system.git
cd student-management-system
```


### Step 2 — Setup the Backend

```bash
cd backend
npm install
```

Now open `backend/config.js` and update the MongoDB URI:

**Option A — Local MongoDB:**
```js
module.exports = {
  MONGO_URI: 'mongodb://localhost:27017/student-management',
  JWT_SECRET: 'your_jwt_secret_key',
  PORT: 5001,
};
```

**Option B — MongoDB Atlas:**
```js
module.exports = {
  MONGO_URI: 'mongodb+srv://username:password@cluster.mongodb.net/student-management',
  JWT_SECRET: 'your_jwt_secret_key',
  PORT: 5001,
};
```


### Step 3 — Setup the Frontend

```bash
cd ../frontend
npm install
```

---

### Step 4 — Run the Project

Open **2 terminal tabs:**

**Terminal 1 — Start Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:5001
```

**Terminal 2 — Start Frontend:**
```bash
cd frontend
npm start
```


### Step 5 — Open the App

Go to your browser and open:
```
http://localhost:3000
```


##  API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login and get JWT token |
| GET | `/api/students` | Private | Get all students |
| POST | `/api/students` | Private | Add a new student |
| PUT | `/api/students/:id` | Private | Update a student |
| DELETE | `/api/students/:id` | Private | Delete a student |


## Installing MongoDB Locally (Mac)

```bash
brew tap mongodb/brew
brew install mongodb/brew/mongodb-community
brew services start mongodb-community
```


##  Notes

- Make sure MongoDB is running before starting the backend
- The backend runs on port **5001**
- The frontend runs on port **3000**
- Each user can only see and manage their own students


##  Author

Made with ❤️ by Gaurav
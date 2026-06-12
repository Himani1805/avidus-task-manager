# Avidus Task Manager (RBAC)

A full-stack web application for managing tasks with special **Admin** and **User** roles. It tracks user activities and shows system statistics on a clean dashboard.

---

## 🚀 Features

### 👤 For Users
* Create your own tasks.
* View only your own tasks.
* Update task details or mark them as Pending/Completed.
* Delete your own tasks.

### 🛡️ For Admins
* View all registered users in the system.
* Change user status between Active and Inactive.
* Delete any user account.
* View all tasks created by all users.
* Delete any task from the system.
* View the system activity history (Logs).
* View live charts and statistics dashboard.

### 📊 Activity Tracking
The system automatically tracks and saves logs when:
* A user logs in.
* A task is created, updated, or deleted.
* An admin changes user status or deletes anything.

---

## 🛠️ Tech Stack

* **Frontend:** React, React Router DOM, Axios, Tailwind CSS v4, Recharts
* **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Bcryptjs

---

## 📁 Folder Structure

* **backend/** — Server side code (Node.js + Express)
* **frontend/** — Client side code (React.js + Tailwind)

---

## ⚙️ How to Setup and Run the Project

Follow these steps to run the project on your laptop:

### Step 1: Clone the Project
Open your terminal and run this command to download the code:
```bash
git clone <your-repository-url>
cd task-management-rbac


Step 2: Setup the Backend
Go into the backend folder:

cd backend

2. Install all required backend packages:
   ```bash
npm install
Create a new file named .env inside the backend folder and add these values:

Code snippet
PORT=3001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
4. Start the backend server:
   ```bash
npm run dev
Step 3: Setup the Frontend
Open a new terminal tab or window, and go into the frontend folder:

cd frontend

2. Install all required frontend packages:
   ```bash
   npm install
Start the React application:

Bash
npm run dev

---

## 🔐 Test Account Credentials

You can use these pre-registered accounts to log in and test both Admin and User roles immediately:

### 🛠️ Admin Accounts
* **Account 1 (Admin):**
  * **Email:** `admin@avidus.com`
  * **Password:** `securepassword123`
* **Account 2 (Hina):**
  * **Email:** `Hina@gmail.com`
  * **Password:** `Hina123`

### 👤 User Account
* **Account 1 (Ritu):**
  * **Email:** `ritu@avidus.com`
  * **Password:** `ritu123`

---

## 🔑 Main API Endpoints

### Authentication
* `POST /api/auth/register` - Create a new user account
* `POST /api/auth/login` - Log into an account

### User Tasks
* `GET /api/tasks` - Get your tasks
* `POST /api/tasks` - Create a new task
* `PUT /api/tasks/:id` - Edit a task or change its status
* `DELETE /api/tasks/:id` - Delete a task

### Admin Controls
* `GET /api/admin/users` - View all users
* `PATCH /api/admin/users/:id/status` - Change user status (Active/Inactive)
* `DELETE /api/admin/users/:id` - Delete a user
* `GET /api/admin/tasks` - View all tasks in the system
* `DELETE /api/admin/tasks/:id` - Delete any task
* `GET /api/admin/activity-logs` - View activity logs
* `GET /api/admin/analytics` - Get database metrics for charts

---

## 🤝 How to Create More Admin Accounts Manually

By default, every new user gets the **User** role. To make any new account an **Admin**, follow these steps:

1. Open your MongoDB database tool (like MongoDB Compass).
2. Find your user document in the database collection.
3. Change your role from `"User"` to `"Admin"` manually:
   ```json
   {
     "role": "Admin"
   }
Log out from the website, and then log back in to see the Admin Dashboard.

✒️ Author
Himani Sharma - Full Stack MERN Application
# Avidus Task Manager (RBAC)

A full-stack web application for managing tasks with special **Admin** and **User** roles. It tracks user activities and shows system statistics on a clean dashboard.

---

## Live Url - 
* **Frontend** — [https://avidus-task-manager-tau.vercel.app]
* **Backend** — [https://avidus-task-manager-beyo.onrender.com]


## Test Account Credentials

You can use these pre-registered accounts to log in and test both Admin and User roles immediately:

### 🛠️ Admin Accounts

* **Account 1 (Admin):**
  * **Email:** `admin@avidus.com`
  * **Password:** `securepassword123`
* **Account 2 (Hina):**
  * **Email:** `hina@gmail.com`
  * **Password:** `Hina123`

### 👤 User Account
* **Account 1 (Ritu):**
  * **Email:** `ritu@avidus.com`
  * **Password:** `ritu123`

---


---
## Features

### For Users
* Create your own tasks.
* View only your own tasks.
* Update task details or mark them as Pending/Completed.
* Delete your own tasks.

### For Admins
* View all registered users in the system.
* Change user status between Active and Inactive.
* Delete any user account.
* View all tasks created by all users.
* Delete any task from the system.
* View the system activity history (Logs).
* View live charts and statistics dashboard.

### Activity Tracking
The system automatically tracks and saves logs when:
* A user logs in.
* A task is created, updated, or deleted.
* An admin changes user status or deletes anything.

---

## Tech Stack

* **Frontend:** React, React Router DOM, Axios, Tailwind CSS v4, Recharts
* **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Bcryptjs

---

## Folder Structure

* **backend/** — Server side code (Node.js + Express)
* **frontend/** — Client side code (React.js + Tailwind)

---

---

## ⚙️ How to Setup and Run the Project

Follow these steps to run the project locally on your machine:

### 📥 Step 1: Clone the Project
Open your terminal and run the following command to download the code:
```bash
git clone <your-repository-url>
cd task-management-rbac
```

### 💻 Step 2: Setup the Backend
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory and add the configuration values:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   SALT_ROUNDS=10
   JWT_EXPIRES=30d
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 🎨 Step 3: Setup the Frontend
1. Open a new terminal window/tab and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```

---

## 🛣️ Main API Endpoints

### 🔐 Authentication
* `POST /api/auth/register` — Register a new user account
* `POST /api/auth/login` — Log in to an existing account

### 📝 User Tasks
* `GET /api/tasks` — Retrieve your tasks
* `POST /api/tasks` — Create a new task
* `PUT /api/tasks/:id` — Edit task details or update status (Pending/Completed)
* `DELETE /api/tasks/:id` — Delete a specific task

### 🛡️ Admin Controls
* `GET /api/admin/users` — View all registered users
* `PATCH /api/admin/users/:id/status` — Change user status (Active/Inactive)
* `DELETE /api/admin/users/:id` — Delete a user account
* `GET /api/admin/tasks` — View all tasks created by all users
* `DELETE /api/admin/tasks/:id` — Delete any task in the system
* `GET /api/admin/activity-logs` — View system activity logs
* `GET /api/admin/analytics` — Get analytics metrics for the admin charts

---

## 👤 How to Create More Admin Accounts Manually

By default, every new user is registered with the **User** role. To upgrade an account to **Admin**:

1. Open your MongoDB GUI tool (e.g., MongoDB Compass or Atlas).
2. Open the `users` collection.
3. Locate the user document you wish to upgrade.
4. Modify the `role` field from `"User"` to `"Admin"`:
   ```json
   {
     "role": "Admin"
   }
   ```
5. Log out from the web app and log back in to access the Admin Dashboard.

---

## ✒️ Author

**Himani Sharma**  
*Full Stack MERN Developer*
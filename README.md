# OpenShelf - Smart Library ERP System 📚

OpenShelf is a modern full-stack Library ERP Web Application built for Students, Faculty, Librarians, and Administrators. It features a complete database backend integration using **Supabase** and a **Node.js Express** API server.

---

## 🛠️ Technology Stack
* **Frontend**: React, Vite, Axios, Bootstrap 5, React Icons, React Router DOM
* **Backend**: Node.js, Express.js, Cors, Dotenv, Supabase JS SDK
* **Database**: Supabase (PostgreSQL)

---

## 🚀 Setup & Execution Guide

Setting up OpenShelf is simple and takes just a few steps.

### Step 1: Initialize the Supabase Database
1. Go to [Supabase](https://supabase.com) and create a free account and project.
2. In your Supabase Dashboard, click on **SQL Editor** in the left sidebar.
3. Click **New query**.
4. Open the [supabase-schema.sql](supabase-schema.sql) file located in the root of this project.
5. Copy the entire contents of the file, paste it into the Supabase SQL editor, and click **Run**.
6. Your database tables (`users`, `books`, `digital_resources`, `transactions`), RLS policies, and seed mock data are now set up!

### Step 2: Configure Environment Variables
1. Go to your Supabase Dashboard -> **Project Settings** -> **API**.
2. Copy your **Project URL** and your **Anon Public Key** (or service key).
3. Navigate to the `backend` folder of this project.
4. Open the `.env` file (or rename `.env.example` to `.env`) and paste your keys:
   ```env
   PORT=5000
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_KEY=your-supabase-anon-key-here
   ```

*Note: If you run the backend without configuring these variables, the server will gracefully fallback to **Mock Data Mode** to let you explore the UI without crashing.*

### Step 3: Run the Backend API Server
Open a terminal in the `backend` directory and run:
```bash
# Install dependencies (already installed during setup)
npm install

# Start the development server
npm run dev
```
The API server will run on `http://localhost:5000`.

### Step 4: Run the React Frontend
Open a new terminal in the root directory (where `package.json` is located) and run:
```bash
# Install frontend dependencies
npm install

# Run Vite dev server
npm run dev
```
The frontend will boot up. Click the link (usually `http://localhost:5173`) to open OpenShelf in your browser!

---

## 🔑 Test Login Credentials

Use the following seeded credentials to log in and test different role-based views. (No password is required, just select the corresponding role).

| Role | Email | Name | Accessible Views |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@openshelf.com` | Admin User | Full ERP, Dashboards, User Management, Book Management, Issue/Return |
| **Librarian** | `rahul@openshelf.com` | Rahul Kumar | Librarian Dashboard, Book Management, Issue/Return |
| **Faculty** | `ananya@openshelf.com` | Ananya Das | User Dashboard, Resources, Digital Library, Profile |
| **Student** | `snehasri@openshelf.com` | Snehasri Pati | User Dashboard, Resources, Digital Library, Profile |

---

## 📂 Project Directory Structure

```
Openshelf-Frontend/
├── backend/                  # Node.js + Express API Server
│   ├── .env                  # Backend environment credentials
│   ├── package.json          # Backend package config
│   └── server.js             # API routes & Supabase client setup
├── src/
│   ├── components/           # Navbar, Sidebar, UI wrappers
│   ├── data/                 # Original static mock data files
│   ├── pages/                # App pages (Login, Dashboard, Management, etc.)
│   ├── routes/               # Routing map (AppRoutes.jsx)
│   ├── services/             # API services connecting to backend
│   │   ├── api.js            # Axios client config
│   │   ├── authService.js    # Login/Session handlers
│   │   ├── bookService.js    # Books & Digital resources queries
│   │   ├── circulationService.js # Checkout stats & transaction updates
│   │   └── userService.js    # User accounts CRUD
│   └── main.jsx              # React app entry
├── supabase-schema.sql       # Database SQL initialization script
└── README.md                 # Project instructions
```

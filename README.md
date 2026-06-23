# TaskFlow - Task Management System
![MERN](https://img.shields.io/badge/MERN-Stack-blue)
![React](https://img.shields.io/badge/React-Vite-blue)
![Node](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)

TaskFlow is a production-ready, full-stack MERN (MongoDB, Express, React, Node) application modeled after modern agile boards like Trello and Asana. It provides user authentication, statistics cards, and an interactive Kanban board for task CRUD and lifecycle movements, complete with advanced query filters and responsive light/dark themes.

## ✨ Key Highlights

- 🧠 Trello-like Kanban board experience
- 📊 Dashboard with task statistics cards
- 🎯 Advanced filtering (status, priority, search, sorting)
- 🌙 Light/Dark mode support
- 🔐 Secure JWT authentication system
- ⚡ Fully responsive UI (mobile + desktop)

## 🌐 Live Demo

👉 Frontend: https://task-management-system-umesh1.vercel.app/  
👉 Backend: task-management-system-production-1b7b.up.railway.app

---

## 📸 Screenshots

### Dashboard
<img width="1924" height="1084" alt="Screenshot 2026-06-23 230325" src="https://github.com/user-attachments/assets/53f59634-eefb-43bf-bd1f-d1a4cecc664e" />


### Kanban Board
<img width="1924" height="1084" alt="Screenshot 2026-06-23 230434" src="https://github.com/user-attachments/assets/ca2719a7-d5ed-4c3d-b57e-c28666355c9a" />


### Login Page
<img width="1924" height="1084" alt="Screenshot 2026-06-23 230456" src="https://github.com/user-attachments/assets/e164aabf-d214-4498-8c37-a4d66bb31b0c" />

---

## Tech Stack

- **Frontend**: React.js (Vite compiler), Tailwind CSS, Axios client, React Router Dom, Context API, Lucide Icons.
- **Backend**: Node.js, Express.js REST API, JWT Authentication, bcrypt password hashing, CORS, Dotenv.
- **Database**: MongoDB with Mongoose Schemas.

---

## 🚀 Project Impact

TaskFlow simulates real-world project management tools like Trello and Asana.  
It demonstrates full-stack development skills, authentication flow, API design, and modern UI architecture.

## Directory Structure

```text
/server
  /config       -> Database connection configurations
  /controllers  -> Auth and Task route controllers
  /middleware   -> Express JWT authentication middleware
  /models       -> Mongoose User and Task schemas
  /routes       -> Router routes mappings
  .env          -> System environment configurations
  server.js     -> Main server entry
  package.json  -> Backend dependencies

/client
  /src
    /components -> Common layout & widgets (Sidebar, Navbar, TaskCard, TaskModal)
    /context    -> AuthContext for auth states & dark mode toggling
    /pages      -> View layouts (Login, Register, Dashboard, Tasks, Profile)
    /services   -> Axios client configuration
    App.jsx     -> React routes & guards layout
    main.jsx    -> App entry mount
    index.css   -> Tailwind styles & custom glassmorphism utilities
  package.json  -> Frontend dependencies
```

---

## Getting Started

### Prerequisites

- **Node.js** (v16+)
- **MongoDB** (Local instance running at default `27017` port, or a MongoDB Atlas URI link)

### Setup & Installation

#### 1. Database Connection

Make sure your MongoDB server is active. By default, the application connects to a local server at `mongodb://localhost:27017/taskflow`.

#### 2. Configure Backend `.env`

Navigate to the `server/` directory and check/create the `.env` configuration file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=taskflow_jwt_secret_dev_key_2026
```

#### 3. Start Backend Server

Open a terminal at the `/server` folder:

```bash
# Install server packages
npm install

# Run the development server (with nodemon auto-restart)
npm run dev
```

The server should start on port `5000` and display:
```text
MongoDB Connected: 127.0.0.1
Server running on port 5000
```

#### 4. Start React Frontend Client

Open a second terminal at the `/client` folder:

```bash
# Install frontend packages
npm install

# Start the Vite development build server
npm run dev
```

The frontend should start on port `5173`. Open your browser and navigate to `http://localhost:5173`.

---

## API Endpoints

## 👨‍💻 Author

- GitHub: https://github.com/umeshfull-stackdeveloper  
- Portfolio:[ https://portfolio-umesh1.vercel.app/
- Live Project: https://task-management-system-umesh1.vercel.app/

### 📝 Task Routes
- `GET /api/tasks` - (Protected) Returns tasks belonging to the current user. Supports query parameters:
  - `search`: Filter by search text query in title/description.
  - `status`: Filter by status (`Pending`, `In Progress`, `Completed`).
  - `priority`: Filter by priority (`Low`, `Medium`, `High`).
  - `sortBy`: Sort expression in format `column:asc|desc` (e.g., `dueDate:asc`, `createdAt:desc`).
- `POST /api/tasks` - (Protected) Creates a new task. Expects `{ title, description, status, priority, dueDate }`.
- `PUT /api/tasks/:id` - (Protected) Updates specific task fields.
- `DELETE /api/tasks/:id` - (Protected) Deletes a specific task.

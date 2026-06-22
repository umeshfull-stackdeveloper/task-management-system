# TaskFlow - Task Management System

TaskFlow is a production-ready, full-stack MERN (MongoDB, Express, React, Node) application modeled after modern agile boards like Trello and Asana. It provides user authentication, statistics cards, and an interactive Kanban board for task CRUD and lifecycle movements, complete with advanced query filters and responsive light/dark themes.

---

## Tech Stack

- **Frontend**: React.js (Vite compiler), Tailwind CSS, Axios client, React Router Dom, Context API, Lucide Icons.
- **Backend**: Node.js, Express.js REST API, JWT Authentication, bcrypt password hashing, CORS, Dotenv.
- **Database**: MongoDB with Mongoose Schemas.

---

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

### 🔐 Auth Routes
- `POST /api/auth/register` - Registers a new user. Expects JSON body `{ name, email, password }`.
- `POST /api/auth/login` - Authenticates user. Expects JSON body `{ email, password }`.
- `GET /api/auth/me` - (Protected) Returns the current authorized user profile.

### 📝 Task Routes
- `GET /api/tasks` - (Protected) Returns tasks belonging to the current user. Supports query parameters:
  - `search`: Filter by search text query in title/description.
  - `status`: Filter by status (`Pending`, `In Progress`, `Completed`).
  - `priority`: Filter by priority (`Low`, `Medium`, `High`).
  - `sortBy`: Sort expression in format `column:asc|desc` (e.g., `dueDate:asc`, `createdAt:desc`).
- `POST /api/tasks` - (Protected) Creates a new task. Expects `{ title, description, status, priority, dueDate }`.
- `PUT /api/tasks/:id` - (Protected) Updates specific task fields.
- `DELETE /api/tasks/:id` - (Protected) Deletes a specific task.

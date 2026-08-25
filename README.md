# TaskNova 🚀
AI-Powered Full-Stack Task Manager built with the MERN Stack.

TaskNova is a full-stack task management and team collaboration platform built with the MERN stack. It helps teams create, assign, organize, and track tasks while providing role-based access, real-time updates, email-based password recovery, and AI-powered task breakdowns.

✨ Features

- JWT-based authentication
- Admin and member roles
- Protected frontend routes
- Secure password hashing with bcrypt
- Remember-me login support
- Email-based password recovery with OTP verification
- Task creation, assignment, updating, and deletion
- Task status tracking:
  - Pending
  - In Progress
  - Completed
- Task priority and category management
- Task deadlines
- Team creation and management
- Add and remove team members
- Role-based access control for administrative actions
- Real-time task and team updates using Socket.IO
- Real-time assignment and completion notifications
- Notification read/unread management
- AI-powered subtask generation using Groq
- Dashboard task statistics
- User profile editing and account deletion
- Responsive React interface with Tailwind CSS

🛠 Tech Stack
### Frontend

- React 19
- Vite
- React Router
- Axios
- Tailwind CSS
- React Toastify
- Lucide React
- Socket.IO Client
- ESLint

### Backend

- Node.js
- Express 5
- MongoDB
- Mongoose
- JSON Web Tokens
- bcrypt
- Socket.IO
- Nodemailer
- Groq SDK
- dotenv
- CORS

📂 Project Structure

TaskNova/
├── backend/
│   ├── config/
│   │   ├── ai.js
│   │   ├── db.js
│   │   └── email.js
│   ├── controllers/
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   ├── notificationController.js
│   │   ├── taskController.js
│   │   └── teamController.js
│   ├── middleware/
│   │   ├── adminMiddleware.js
│   │   ├── asyncHandler.js
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── Notification.js
│   │   ├── Task.js
│   │   ├── Team.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── taskRoutes.js
│   │   └── teamRoutes.js
│   ├── utils/
│   │   ├── emailTemplates.js
│   │   ├── generateOtp.js
│   │   ├── generateToken.js
│   │   └── socket.js
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── services/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md


## Core Data Models

### User

Stores account information, authentication data, role, login history, and password reset information.

### Task

Stores task title, description, category, status, priority, deadline, creator, assignee, team reference, and AI-generated subtasks.

### Team

Stores team name, description, members, creator, and active/inactive status.

### Notification

Stores notification recipient, notification type, related task, message, read status, and timestamps.

## Role-Based Access

### Admin

Admins can:

- Create tasks
- Delete tasks
- Create teams
- Update teams
- Delete teams
- Add and remove team members
- View all tasks and teams
- Update task details

### Member

Members can:

- View assigned tasks
- Update the status of assigned tasks
- View teams they belong to
- View and manage their notifications
- Update their profile

## API Reference

The backend API runs under the `/api` prefix.

### Authentication

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Authenticate a user | Public |
| GET | `/api/auth/profile` | Get the current user's profile | Authenticated |
| PUT | `/api/auth/profile` | Update the current user's profile | Authenticated |
| DELETE | `/api/auth/profile` | Delete the current user's account | Authenticated |
| POST | `/api/auth/forgot-password` | Send a password reset OTP | Public |
| POST | `/api/auth/verify-otp` | Verify a password reset OTP | Public |
| POST | `/api/auth/reset-password` | Reset the account password | Public |
| GET | `/api/auth/users` | Get available users for assignment | Admin |

### Tasks

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| POST | `/api/tasks` | Create a task | Admin |
| GET | `/api/tasks` | Get tasks visible to the current user | Authenticated |
| GET | `/api/tasks/:id` | Get a specific task | Authenticated |
| PUT | `/api/tasks/:id` | Update task details or status | Authenticated |
| DELETE | `/api/tasks/:id` | Delete a task | Admin |
| POST | `/api/tasks/:id/generate-subtasks` | Generate AI-powered subtasks | Authenticated |

### Teams

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | `/api/teams` | Get teams visible to the current user | Authenticated |
| POST | `/api/teams` | Create a team | Admin |
| GET | `/api/teams/:id` | Get a specific team | Authenticated |
| PUT | `/api/teams/:id` | Update a team | Admin |
| DELETE | `/api/teams/:id` | Delete a team | Admin |
| POST | `/api/teams/:id/members` | Add a team member | Admin |
| DELETE | `/api/teams/:id/members/:memberId` | Remove a team member | Admin |

### Notifications

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | `/api/notifications` | Get the current user's notifications | Authenticated |
| GET | `/api/notifications/:id` | Get a specific notification | Authenticated |
| PUT | `/api/notifications/:id/read` | Mark a notification as read | Authenticated |
| PUT | `/api/notifications/mark-all-read` | Mark all notifications as read | Authenticated |
| DELETE | `/api/notifications/:id` | Delete a notification | Authenticated |

## Real-Time Communication

TaskNova uses Socket.IO for real-time updates.

Supported events include:

- `task-assigned`
- `task-completed`
- `task-updated`
- `team-created`
- `team-updated`
- `team-deleted`

Users join individual Socket.IO rooms using their user ID, allowing task, team, and notification updates to be delivered to the relevant users.

## AI-Powered Task Breakdown

TaskNova integrates with Groq to generate actionable subtasks from an existing task.

The AI service:

1. Receives the task title and description.
2. Sends a structured project-management prompt to Groq.
3. Requests three to seven actionable subtasks.
4. Parses the returned JSON response.
5. Saves the generated subtasks to the task document.

Each generated subtask can contain:

- Title
- Description
- Priority
- Estimated time
- Completion status

## Prerequisites

Before running the project, install:

- Node.js 18 or later
- MongoDB database
- An SMTP email account
- A Groq API key

## Environment Variables

Create a `.env` file inside the `backend` directory:

```env
PORT=3001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
EMAIL_FROM=your_email@gmail.com
GROQ_API_KEY=your_groq_api_key
NODE_ENV=development
```

Do not commit `.env` files or expose private credentials in source control.

## Installation

Clone the repository and install dependencies separately for the backend and frontend.

```bash
git clone <repository-url>
cd TaskNova
```

### Backend

```bash
cd backend
npm install
npm run dev
```

The backend runs on:

```text
http://localhost:3001
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend is served by Vite, normally at:

```text
http://localhost:5173
```

## Available Scripts

### Backend

```bash
npm run dev
```

Starts the backend with Nodemon.

```bash
npm start
```

Starts the backend with Node.js.

```bash
npm run format
```

Formats backend files with Prettier.

```bash
npm run format-check
```

Checks backend formatting.

### Frontend

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run preview
```

Previews the production build locally.

```bash
npm run lint
```

Runs ESLint checks.

## Security and Reliability Practices

- Passwords are hashed with bcrypt before storage.
- Password fields are excluded from normal user queries.
- JWTs protect authenticated API routes.
- Admin-only middleware protects privileged operations.
- Users can access only their authorized tasks, teams, and notifications.
- Password reset OTPs expire after five minutes.
- Centralized async and error-handling middleware is used in the backend.
- MongoDB indexes support common task, team, and notification queries.


## Author

**Sanjiv Kumar Patel**

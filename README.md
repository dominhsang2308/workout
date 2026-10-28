# 🏋️‍♂️ Fitness Workout Planner & Tracker (FitTrack Pro)

An enterprise-grade, full-stack Fitness Workout Planner & Tracker web application designed to plan routines, log live workout sets, compute progressive overload metrics, and visualize training analytics.

Built with **FastAPI**, **SQLAlchemy 2.0**, **Pydantic v2**, **PostgreSQL / SQLite**, **React 18**, **TypeScript**, **Tailwind CSS**, **Pytest**, and **Docker**.

---

## 🌟 Key Features

- **🔐 Authentication & User Isolation:**
  - Secure registration, JWT token generation, and password hashing using salted `bcrypt`.
  - Multi-user isolation: Every user only sees their own routines, workout history, and personal metrics.
  - Quick 1-click **Demo Account** login for testing.
- **📚 Exercise Library (CRUD):**
  - Pre-seeded catalog of 19+ standard compound and isolation exercises across all muscle groups (Chest, Back, Legs, Shoulders, Arms, Core).
  - Search by name and instant filtering by target muscle group and equipment.
  - Create and manage custom user-defined exercises with technique notes.
- **📅 Workout Routines & Splits (CRUD):**
  - Build multi-exercise workout routines (e.g., Push/Pull/Legs, Upper/Lower).
  - Define target sets, target rep ranges, estimated duration, and rest intervals.
  - 1-click **"Start Workout with Routine"** button to instantly initialize an active tracker session.
- **⚡ Live Workout Tracker (Active Logging):**
  - Live stopwatch timer tracking total duration.
  - Interactive **Rest Timer** countdown (30s, 60s, 90s, etc.) with automatic trigger upon completing a set.
  - Dynamic set-by-set logging: Weight (kg), Reps, RPE (Rate of Perceived Exertion), and completion status.
  - Add/remove sets and exercises mid-workout.
  - Live total volume (kg) calculation.
  - Celebration modal upon completion with duration, volume, and sets achieved.
- **📈 Progression Analytics & Dashboard:**
  - Metric cards: Total Workouts, Active Streak (days), Total Volume Lifted (kg), and Time Trained.
  - Weekly Progression Chart: Visualizes weight volume and workout frequency over the past 6 weeks.
  - Muscle Group Distribution: Progress breakdown indicating muscle group training focus.
  - Recent workouts activity feed.
- **📜 Workout History:**
  - Complete log of all past workouts.
  - Detailed view showing every set, weight lifted, reps performed, and workout notes.
- **🎨 Modern Dark Aesthetic:**
  - Responsive layout for desktop, tablet, and mobile.
  - Glassmorphic panels, neon emerald accents, smooth hover micro-animations, and custom styled scrollbars.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Backend** | Python 3.12+, FastAPI, SQLAlchemy 2.0 (ORM), Pydantic v2, Alembic (Migrations) |
| **Security** | Python-Jose (JWT), Bcrypt, OAuth2 Password Bearer |
| **Database** | PostgreSQL 16 (Production/Docker), SQLite (Local zero-config fallback) |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Axios |
| **Testing** | Pytest, HTTPX, FastAPI TestClient |
| **DevOps** | Docker, Docker Compose, Nginx (Multi-stage build) |

---

## 📁 Project Directory Tree

```
workout-tracker/
├── backend/
│   ├── alembic/                      # Database migrations
│   │   ├── versions/                 # Version scripts
│   │   │   └── 1f57862259c2_initial_schema.py
│   │   ├── env.py
│   │   └── script.py.mako
│   ├── app/
│   │   ├── api/
│   │   │   ├── deps.py               # Auth & DB dependencies
│   │   │   └── v1/                   # REST API routes
│   │   │       ├── auth.py           # Register, Login, Logout
│   │   │       ├── users.py          # /me profile
│   │   │       ├── exercises.py      # Exercise CRUD & filter
│   │   │       ├── workout_plans.py  # Routines CRUD
│   │   │       ├── workout_sessions.py # Set logging & history
│   │   │       └── stats.py          # Dashboard analytics
│   │   ├── core/
│   │   │   ├── config.py             # Pydantic BaseSettings
│   │   │   ├── database.py           # Engine & SessionLocal
│   │   │   └── security.py           # Bcrypt & JWT tokens
│   │   ├── crud/                     # Data access layer
│   │   │   ├── user.py
│   │   │   ├── exercise.py
│   │   │   ├── workout_plan.py
│   │   │   ├── workout_session.py
│   │   │   └── stats.py
│   │   ├── models/                   # SQLAlchemy ORM models
│   │   │   ├── user.py
│   │   │   ├── exercise.py
│   │   │   ├── workout_plan.py
│   │   │   └── workout_session.py
│   │   ├── schemas/                  # Pydantic v2 validation models
│   │   │   ├── token.py
│   │   │   ├── user.py
│   │   │   ├── exercise.py
│   │   │   ├── workout_plan.py
│   │   │   ├── workout_session.py
│   │   │   └── stats.py
│   │   ├── seeds/
│   │   │   └── seed_data.py          # Pre-seeded exercises & demo user
│   │   └── main.py                   # FastAPI application entrypoint
│   ├── tests/                        # Automated Pytest suite
│   │   ├── conftest.py
│   │   ├── test_auth.py
│   │   ├── test_exercises.py
│   │   ├── test_workout_plans.py
│   │   └── test_workout_sessions.py
│   ├── alembic.ini
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/               # Navbar, Sidebar, StatCard, Modal, Spinner, EmptyState
│   │   ├── context/                  # AuthContext (JWT management)
│   │   ├── pages/                    # Dashboard, Exercises, Plans, ActiveWorkout, History, Auth
│   │   ├── services/                 # Axios API clients
│   │   ├── types/                    # Domain TypeScript interfaces
│   │   ├── App.tsx                   # Routes & App Layout
│   │   ├── index.css                 # Tailwind directives & glassmorphism
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── nginx.conf
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🚀 Quick Start (Running Locally)

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Create and activate virtual environment (Windows PowerShell)
python -m venv venv
.\venv\Scripts\Activate.ps1

# (Linux / macOS):
# python3 -m venv venv
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env from template
copy .env.example .env

# Run database migrations
python -m alembic upgrade head

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```
- API will be accessible at: `http://localhost:8000`
- Interactive Swagger UI Documentation: `http://localhost:8000/docs`
- ReDoc Documentation: `http://localhost:8000/redoc`

*(Note: On initial startup, the database automatically seeds standard exercises and a demo user account).*

---

### 2. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install npm packages
npm install

# Create .env from template
copy .env.example .env

# Start development server
npm run dev
```
- Frontend will be accessible at: `http://localhost:5173`

---

## 🔑 Demo Account Credentials

A fully populated demo account is available with pre-configured routines and logged historical workouts:

| Field | Demo Credential |
|---|---|
| **Email** | `demo@workout.com` |
| **Username** | `demouser` |
| **Password** | `password123` |

*(You can also click the **"⚡ Fill Demo Account"** button on the Login page).*

---

## 🧪 Running Automated Tests

The backend includes a comprehensive Pytest test suite testing Auth, User isolation, Exercise library, Routines builder, Set logging, Volume calculation, and Dashboard statistics:

```bash
cd backend
.\venv\Scripts\pytest.exe -v
```

All 11 tests run against an in-memory SQLite database in seconds without modifying production data.

---

## 🐳 Docker Deployment (Docker Compose)

To run the complete application stack (PostgreSQL database, FastAPI backend, and Nginx frontend) in isolated Docker containers:

```bash
# In the project root directory
docker-compose up --build -d
```

### Verified Service Ports:
- **Frontend App**: `http://localhost` (Port 80)
- **Backend API**: `http://localhost:8000` (Port 8000)
- **Swagger Documentation**: `http://localhost:8000/docs`
- **PostgreSQL Database**: `localhost:5432`

To shut down the containers:
```bash
docker-compose down
```
To remove persistent database volumes:
```bash
docker-compose down -v
```

---

## 📡 REST API Reference Summary

### Authentication (`/api/v1/auth`)
- `POST /register` - Register a new user
- `POST /login` - Form-based OAuth2 login (Swagger UI compatible)
- `POST /login/json` - JSON payload login (Axios client compatible)
- `POST /logout` - Invalidate session

### Users (`/api/v1/users`)
- `GET /me` - Get current authenticated user profile
- `PUT /me` - Update full name, email, or password

### Exercises (`/api/v1/exercises`)
- `GET /` - List exercises (Filter by `muscle_group`, `equipment`, `search`)
- `GET /{id}` - Get exercise details
- `POST /` - Create custom user exercise
- `PUT /{id}` - Update user custom exercise
- `DELETE /{id}` - Delete user custom exercise

### Workout Plans / Routines (`/api/v1/plans`)
- `GET /` - List current user's workout plans
- `GET /{id}` - Get plan detail with exercises and target sets/reps
- `POST /` - Create routine with items
- `PUT /{id}` - Update routine
- `DELETE /{id}` - Delete routine

### Workout Sessions & Logging (`/api/v1/sessions`)
- `GET /` - List user's logged workouts
- `GET /{id}` - Get workout detail with set-by-set logs
- `POST /` - Record a finished workout session
- `PUT /{id}` - Update session notes or sets
- `DELETE /{id}` - Delete session log

### Statistics & Dashboard (`/api/v1/stats`)
- `GET /dashboard` - Aggregated metrics: total volume, duration, streak, weekly charts, and muscle distribution

---

## 🛠️ Common Errors & Troubleshooting

1. **CORS Error (`Access to fetch blocked by CORS policy`)**:
   - Ensure the frontend port (`http://localhost:5173` or `http://localhost`) is listed in `BACKEND_CORS_ORIGINS` in `backend/.env`. By default, local origins are allowed.
2. **Database Connection Error in Docker**:
   - Docker Compose includes a `healthcheck` on the PostgreSQL service to ensure the database is fully initialized before the backend launches.
3. **Execution Policy Error in PowerShell**:
   - If activating the venv throws `PSSecurityException`, run:
     ```powershell
     Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
     ```
4. **JWT Expiration / 401 Unauthorized**:
   - Tokens default to 24 hours (`ACCESS_TOKEN_EXPIRE_MINUTES=1440`). If expired, log in again or refresh the token.

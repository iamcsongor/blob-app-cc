# Blob Backend - FastAPI Application

AI-powered early-warning system for employee productivity and burnout detection.

## Project Structure

```
backend/
├── app/
│   ├── core/                 # Core utilities
│   │   ├── config.py        # Pydantic Settings, environment loading
│   │   ├── auth.py          # JWT verification, authentication dependency
│   │   └── supabase.py      # Supabase client management
│   ├── models/
│   │   └── schemas.py       # Pydantic models for API request/response
│   ├── api/                 # API endpoints (routers)
│   │   ├── employees.py     # Employee CRUD + scores/metrics
│   │   ├── organisations.py # Org settings, logo upload
│   │   ├── departments.py   # Department management
│   │   ├── programs.py      # Training programs, enrolments
│   │   ├── trophies.py      # Achievement badges
│   │   ├── feed.py          # Activity feed
│   │   ├── notifications.py # User notifications
│   │   ├── watchlist.py     # Employee watchlist
│   │   ├── tools.py         # OAuth integrations (Slack, Jira, etc)
│   │   └── dashboard.py     # Company-level analytics
│   └── main.py              # FastAPI app, CORS, router registration
├── requirements.txt         # Python dependencies
├── .env.example            # Example environment variables
└── .gitignore              # Git ignore rules
```

## Setup & Installation

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Required variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Anonymous/public key
- `SUPABASE_SERVICE_KEY` - Service account key (for backend operations)

### 3. Run the Application

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API will be available at `http://localhost:8000`

Docs: `http://localhost:8000/docs` (Swagger UI)

## API Endpoints

### Authentication
All endpoints (except `/api/health`) require a Bearer token in the `Authorization` header:
```
Authorization: Bearer <user_jwt_token>
```

### Employees
- `GET /api/employees` - List employees
- `GET /api/employees/{id}` - Get employee
- `POST /api/employees` - Create employee
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee
- `GET /api/employees/{id}/scores` - Score history
- `GET /api/employees/{id}/metrics` - Current metrics

### Organisation
- `GET /api/organisation` - Get org details
- `PUT /api/organisation` - Update settings
- `POST /api/organisation/logo` - Upload logo

### Departments
- `GET /api/departments` - List departments
- `POST /api/departments` - Create department
- `PUT /api/departments/{id}` - Update department
- `DELETE /api/departments/{id}` - Delete department

### Programs
- `GET /api/programs` - List programs
- `GET /api/programs/{id}` - Get program
- `POST /api/programs` - Create program
- `PUT /api/programs/{id}` - Update program
- `POST /api/programs/{id}/enrol` - Enrol employee
- `PUT /api/programs/enrolments/{id}` - Update enrolment
- `POST /api/programs/milestones/{id}/complete` - Complete milestone

### Trophies
- `GET /api/trophies` - List trophy types
- `POST /api/trophies` - Create trophy
- `GET /api/trophies/awards` - Recent awards
- `POST /api/trophies/awards` - Award trophy
- `GET /api/trophies/leaderboard` - Top recipients

### Feed & Notifications
- `GET /api/feed` - Activity feed
- `GET /api/notifications` - User notifications
- `PUT /api/notifications/{id}/read` - Mark read
- `PUT /api/notifications/read-all` - Mark all read
- `GET /api/notifications/count` - Unread count

### Watchlist
- `GET /api/watchlist` - User's watchlist
- `POST /api/watchlist` - Add item
- `DELETE /api/watchlist/{id}` - Remove item

### Tools (OAuth)
- `GET /api/tools` - Connected tools
- `PUT /api/tools/{tool_name}` - Update connection
- `POST /api/tools/{tool_name}/connect` - Initiate OAuth
- `GET /api/tools/{tool_name}/callback` - OAuth callback

### Dashboard
- `GET /api/dashboard/summary` - Company stats
- `GET /api/dashboard/scatter` - Hero Matrix data
- `GET /api/dashboard/timeline` - Score history
- `GET /api/dashboard/departments` - Department metrics

### Health
- `GET /api/health` - Health check
- `GET /` - Root endpoint

## Key Features

### Authentication
- JWT-based auth using Supabase
- User info extracted from token claims
- Automatic organisation scoping via `org_id`

### Data Security
- Row-level security (RLS) via organisation ID
- All queries scoped to user's organisation
- User-scoped clients for sensitive operations

### Error Handling
- Proper HTTP status codes (404, 403, 500, etc)
- Meaningful error messages
- Exception handling on all endpoints

### Pydantic Models
- Strong typing with Pydantic v2
- Request/response validation
- Proper datetime and UUID handling

## Development

### Type Checking
```bash
mypy app/
```

### Linting
```bash
pylint app/
```

### Testing (when implemented)
```bash
pytest
```

## Deployment

For production:
1. Set `DEBUG=False` in `.env`
2. Use a production ASGI server (Gunicorn, etc)
3. Enable HTTPS
4. Restrict CORS origins
5. Encrypt sensitive data at rest

Example with Gunicorn:
```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

## Database Schema

This backend expects the following Supabase tables:
- `organisations`
- `employees`
- `departments`
- `scores` (historical score records)
- `metrics` (individual metric scores)
- `programs`
- `program_enrolments`
- `trophies`
- `trophy_awards`
- `feed_events`
- `notifications`
- `watchlist`
- `connected_tools`

See the Supabase migrations for full schema definition.

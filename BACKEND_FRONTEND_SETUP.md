# ByteLearn - Original Backend + Frontend Setup

## 🏗️ Architecture Overview

This setup uses:
- **Backend**: Django REST Framework API
- **Frontend**: Next.js client application
- **Database**: PostgreSQL

## 🚀 Backend Setup (Django)

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Create Virtual Environment
```bash
python -m venv env
source env/bin/activate  # On Windows: .\env\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Create a `.env` file in the `backend/` directory:

```env
SECRET_KEY=your-django-secret-key-here
DEBUG=True
DATABASE_NAME=bytelearn_db
DATABASE_USER=postgres
DATABASE_PASSWORD=your-password
DATABASE_HOST=localhost
DATABASE_PORT=5432
```

### 5. Setup Database
```bash
# Create database (if not exists)
sudo -u postgres psql -c "CREATE DATABASE bytelearn_db;"

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### 6. Run Backend Server
```bash
python manage.py runserver
```

Backend API will be available at: **http://127.0.0.1:8000/api/**

### 7. Access Admin Panel
Visit: **http://127.0.0.1:8000/admin/**

---

## 🎨 Frontend Setup (Next.js)

### 1. Navigate to Frontend Directory
```bash
cd frontend  # From project root
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

### 4. Run Frontend Development Server
```bash
npm run dev
```

Frontend will be available at: **http://localhost:3000**

---

## 🐳 Docker Setup (Optional)

To run both backend and frontend using Docker:

```bash
# From project root
docker-compose up --build
```

This will start:
- PostgreSQL database
- Django backend
- Next.js frontend

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login (get JWT tokens)
- `POST /api/auth/token/refresh/` - Refresh access token

### Courses
- `GET /api/courses/` - List all courses
- `POST /api/courses/` - Create course (instructor only)
- `GET /api/courses/{id}/` - Get course details

### Lessons
- `GET /api/lessons/` - List lessons
- `GET /api/lessons/{id}/` - Get lesson details

### Assessments/Quizzes
- `GET /api/quiz/` - List quizzes
- `POST /api/quiz/{id}/submit/` - Submit quiz answers

### Progress
- `GET /api/progress/` - Get user progress
- `POST /api/progress/` - Update progress

### Notifications
- `GET /api/notifications/` - Get user notifications

### Dashboard
- `GET /api/dashboard/summary/` - Get dashboard metrics

---

## 🔐 Authentication Flow

1. **Register**: `POST /api/auth/register/`
   ```json
   {
     "username": "student1",
     "email": "student@example.com",
     "password": "securepass123"
   }
   ```

2. **Login**: `POST /api/auth/login/`
   ```json
   {
     "username": "student1",
     "password": "securepass123"
   }
   ```
   
   Response:
   ```json
   {
     "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
     "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
   }
   ```

3. **Use Token**: Add to request headers:
   ```
   Authorization: Bearer <access_token>
   ```

---

## 🛠️ Development Workflow

### Running Both Services

**Terminal 1 - Backend:**
```bash
cd backend
source env/bin/activate
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Making Changes

**Backend Changes:**
1. Modify models in `backend/api/*/models.py`
2. Create migrations: `python manage.py makemigrations`
3. Apply migrations: `python manage.py migrate`
4. Update serializers and views as needed

**Frontend Changes:**
1. Modify components in `frontend/components/`
2. Update pages in `frontend/app/`
3. Changes auto-reload in dev mode

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 📦 Project Structure

```
ByteLearn/
├── backend/
│   ├── api/
│   │   ├── authapi/          # Authentication
│   │   ├── courses/          # Course management
│   │   ├── lessons/          # Lesson content
│   │   ├── assessments/      # Quizzes/tests
│   │   ├── progress/         # User progress
│   │   └── notifications/    # Notifications
│   ├── base/                 # Django settings
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── app/                  # Next.js pages
│   ├── components/           # React components
│   ├── contexts/            # React contexts
│   ├── hooks/               # Custom hooks
│   └── package.json
└── docker-compose.yml
```

---

## 🐛 Troubleshooting

### CORS Errors
Ensure `django-cors-headers` is installed and configured in `backend/base/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

### Database Connection Issues
1. Check PostgreSQL is running: `sudo systemctl status postgresql`
2. Verify credentials in backend `.env`
3. Ensure database exists: `psql -U postgres -l`

### JWT Token Errors
1. Check token expiry settings in Django settings
2. Implement token refresh logic in frontend
3. Clear browser localStorage/cookies

---

## 🔄 Switching Between Setups

You can choose to use either:
1. **Original Setup** (backend/ + frontend/) - Traditional client-server
2. **New Setup** (bytelearn-web/) - Modern full-stack Next.js

Both are functional and serve the same purpose with different architectures.

---

## 📚 Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

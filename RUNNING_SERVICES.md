# 🚀 ByteLearn - Currently Running Services

## ✅ Active Services

### 1. **Django Backend API**
- **URL**: http://127.0.0.1:8000/
- **Admin Panel**: http://127.0.0.1:8000/admin/
- **API Base**: http://127.0.0.1:8000/api/
- **Status**: ✅ RUNNING
- **Database**: SQLite (db.sqlite3)

**Admin Credentials:**
- Username: `admin`
- Email: `admin@bytelearn.com`
- Password: (needs to be set - see instructions below)

### 2. **Next.js Frontend**
- **URL**: http://localhost:3001/
- **Status**: ✅ RUNNING
- **API Connection**: http://localhost:8000/api

---

## 🔑 Setting Admin Password

Since we created the superuser without a password, you need to set one:

```bash
cd backend
source env/bin/activate
python manage.py changepassword admin
```

Then enter your desired password twice.

---

## 📡 Available API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login (get JWT tokens)
- `POST /api/token/refresh/` - Refresh access token

### Courses
- `GET /api/courses/` - List all courses
- `POST /api/courses/` - Create course
- `GET /api/courses/{id}/` - Get course details
- `PUT /api/courses/{id}/` - Update course
- `DELETE /api/courses/{id}/` - Delete course

### Lessons
- `GET /api/lessons/` - List lessons
- `POST /api/lessons/` - Create lesson
- `GET /api/lessons/{id}/` - Get lesson details

### Assessments (Quizzes)
- `GET /api/assessments/` - List assessments
- `POST /api/assessments/` - Create assessment
- `GET /api/assessments/{id}/` - Get assessment details

### Progress
- `GET /api/progress/` - Get user progress
- `POST /api/progress/` - Update progress

### Notifications
- `GET /api/notifications/` - Get user notifications
- `POST /api/notifications/` - Create notification

---

## 🧪 Testing the Setup

### 1. Test Backend API
Open your browser or use curl:

```bash
# Check if API is running
curl http://localhost:8000/api/

# Check courses endpoint
curl http://localhost:8000/api/courses/
```

### 2. Test Frontend
Open your browser and navigate to:
- **http://localhost:3001/**

### 3. Access Admin Panel
1. Go to http://127.0.0.1:8000/admin/
2. Login with username `admin` and the password you set
3. You can manage users, courses, lessons, etc.

---

## 📝 Creating Sample Data

### Via Django Admin:
1. Go to http://127.0.0.1:8000/admin/
2. Login with admin credentials
3. Create:
   - Courses
   - Lessons
   - Assessments
   - Users

### Via API (using curl or Postman):

**Register a new user:**
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "student1",
    "email": "student@example.com",
    "password": "testpass123",
    "password2": "testpass123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "student1",
    "password": "testpass123"
  }'
```

This will return JWT tokens:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Use the token in subsequent requests:**
```bash
curl http://localhost:8000/api/courses/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🛑 Stopping the Services

### Stop Backend:
In the terminal running Django, press `Ctrl+C`

### Stop Frontend:
In the terminal running Next.js, press `Ctrl+C`

---

## 🔄 Restarting the Services

### Start Backend:
```bash
cd backend
source env/bin/activate
python manage.py runserver
```

### Start Frontend:
```bash
cd frontend
npm run dev
```

---

## 📂 Project Structure

```
ByteLearn/
├── backend/                    # Django REST API
│   ├── api/
│   │   ├── authapi/           # Authentication
│   │   ├── courses/           # Course management
│   │   ├── lessons/           # Lesson content
│   │   ├── assessments/       # Quizzes/tests
│   │   ├── progress/          # User progress
│   │   └── notifications/     # Notifications
│   ├── base/                  # Django settings
│   ├── db.sqlite3            # SQLite database
│   └── manage.py
│
├── frontend/                  # Next.js frontend
│   ├── app/                  # Pages
│   ├── components/           # React components
│   └── .env                  # Environment config
│
└── bytelearn-web/            # Alternative full-stack app
```

---

## 🐛 Troubleshooting

### Backend Issues:
- **Port already in use**: Change port with `python manage.py runserver 8001`
- **Database errors**: Delete `db.sqlite3` and run migrations again
- **Module not found**: Ensure virtual environment is activated

### Frontend Issues:
- **Port already in use**: Next.js will auto-select next available port
- **API connection errors**: Check `NEXT_PUBLIC_API_BASE_URL` in `.env`
- **Build errors**: Delete `.next` folder and `node_modules`, then reinstall

---

## 🎯 Next Steps

1. **Set admin password** (see instructions above)
2. **Create sample courses** via Django admin
3. **Test the frontend** by browsing to http://localhost:3001
4. **Register a student account** via the frontend
5. **Explore the API** using the admin panel or Postman

---

## 📚 Additional Resources

- Django Admin: http://127.0.0.1:8000/admin/
- API Root: http://127.0.0.1:8000/api/
- Frontend: http://localhost:3001/
- Documentation: See `BACKEND_FRONTEND_SETUP.md`

---

**Built for the Africa Sustainable Classroom Challenge** 🌍

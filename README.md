# ByteLearn - On-Premise Student Learning System

ByteLearn is an on-premise digital learning platform built to support students in low-resource educational environments. It provides modules for course management, secure coding environments, quizzes, learning analytics, and local content delivery — all without requiring internet/cloud access.

---

## 🔧 Project Structure
```
ByteLearn/
├── backend/                 # Django API backend
│   ├── api/                # Main API logic (apps like auth, courses, quizzes)
│   ├── manage.py
│   └── ...
├── frontend/                # Next.js frontend client
│   ├── pages/
│   ├── components/
│   └── ...
├── .env.example             # Environment variable template
└── README.md
```

---

## 🧱 Tech Stack
- **Frontend**: Next.js (React, Tailwind CSS)
- **Backend**: Django + Django REST Framework
- **Authentication**: JWT (via SimpleJWT)
- **Database**: PostgreSQL
- **Deployment**: Docker (Optional)

---

## ⚙️ Backend Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Aliyon-dev/ByteLearn.git
cd ByteLearn/backend
```

### 2. Create & Activate Virtual Environment
```bash
python -m venv env
source env/bin/activate  # or .\env\Scripts\activate on Windows
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Create Environment Variables
Create a `.env` file:
```env
SECRET_KEY=your_secret_key
DEBUG=True
DATABASE_NAME=bytelearn_db
DATABASE_USER=youruser
DATABASE_PASSWORD=yourpass
DATABASE_HOST=localhost
DATABASE_PORT=5432
```

### 5. Run Migrations & Create Superuser
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

### 6. Start Server
```bash
python manage.py runserver
```
Access the API at: `http://127.0.0.1:8000/api/`

---

## 🌐 Frontend Setup

### 1. Navigate to Frontend
```bash
cd ../frontend
```

### 2. Install Node Modules
```bash
npm install
```

### 3. Create `.env.local`
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

### 4. Start the Frontend
```bash
npm run dev
```
Visit: `http://localhost:3000`

---

## 🐳 Docker 

To run using Docker Compose:

```bash
docker-compose up --build
```

Make sure `docker-compose.yml` is set up for backend, frontend, and PostgreSQL services.

---

## 📦 API Endpoints (Key)
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/auth/register/ | POST | Register a new user |
| /api/auth/login/ | POST | Obtain JWT tokens |
| /api/courses/ | GET/POST | List or create courses |
| /api/quiz/ | GET | List quizzes |
| /api/dashboard/summary/ | GET | Dashboard metrics for logged-in user |

---

## 🔐 Authentication
Use JWT for secure access.
Set `Authorization: Bearer <access_token>` in headers.

---

## 🛠️ Common Issues
- **CORS Errors**: Ensure CORS is allowed for frontend origin in Django settings.
- **JWT Errors**: Double-check the token expiry and refresh logic.

---

## 📩 Support
Raise an issue on GitHub or contact the team via the provided email in `README.md`.

---

## 🎓 License
MIT License — open to contributions and educational adaptation.

---

Built for the **Africa Sustainable Classroom Challenge**.


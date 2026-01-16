# 🚀 ByteLearn SQLite Demo - Quick Start

## ✨ What Changed

Your ByteLearn demo is now configured to use **SQLite** instead of PostgreSQL:

### ✅ Benefits of SQLite for Demo
- ✨ **Simpler setup** - No separate database container needed
- 🚀 **Faster deployment** - Starts in seconds
- 💾 **Portable** - Single database file, easy to backup/share
- 🎯 **Perfect for demos** - Lightweight and reliable
- 📦 **Smaller footprint** - Less memory and disk usage

### 📦 Updated Files
- ✅ `docker-compose.yml` - Removed PostgreSQL, simplified
- ✅ `deploy-demo.sh` - Updated for SQLite deployment
- ✅ `backend/Dockerfile` - Removed PostgreSQL dependencies
- ✅ `frontend/Dockerfile` - Simplified
- ✅ `.env.example` - Updated configuration

---

## 🎯 Deploy Your Demo NOW!

### One-Command Deployment ⚡

```bash
cd "/home/aliyon-dev/Documents/2026/Coding Projects/ByteLearn"
./deploy-demo.sh
```

That's it! Your demo will be ready in **~3 minutes**.

---

## 📋 What the Script Does

1. ✅ Stops any existing containers
2. ✅ Creates SQLite data directory
3. ✅ Builds Docker images (backend + frontend)
4. ✅ Starts services
5. ✅ Runs database migrations
6. ✅ Creates sample data
7. ✅ Shows access URLs

---

## 🌐 Access Your Demo

After deployment:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Django Admin**: http://localhost:8000/admin

---

## 👤 Create Admin Account

After deployment, create your admin account:

```bash
docker-compose exec backend python manage.py createsuperuser
```

Follow the prompts to set:
- Username
- Email
- Password

---

## 📊 Database Location

Your SQLite database is stored at:
```
backend/data/db.sqlite3
```

### Backup Your Database

```bash
# Create backup
cp backend/data/db.sqlite3 backup_$(date +%Y%m%d).sqlite3

# Restore backup
cp backup_20260116.sqlite3 backend/data/db.sqlite3
docker-compose restart backend
```

---

## 🎬 Demo Workflow

### 1. Start the Demo
```bash
./deploy-demo.sh
```

### 2. Create Admin Account
```bash
docker-compose exec backend python manage.py createsuperuser
```

### 3. Login to Admin Panel
- Visit: http://localhost:8000/admin
- Login with your admin credentials

### 4. Create Demo Content
- Create a course (e.g., "Introduction to Python")
- Add lessons with video URLs
- Create coding exercises
- Add assessments/quizzes

### 5. Test as Student
- Visit: http://localhost:3000
- Register a student account
- Enroll in courses
- Complete lessons
- Try coding exercises

---

## 🛠️ Useful Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart backend only
docker-compose restart backend
```

### Stop Demo
```bash
docker-compose down
```

### Clean Restart
```bash
docker-compose down -v
./deploy-demo.sh
```

### Access Django Shell
```bash
docker-compose exec backend python manage.py shell
```

### Create Sample Data
```bash
docker-compose exec backend python create_sample_lesson.py
```

---

## 🎯 Quick Demo Script

For a 5-minute presentation:

```bash
# 1. Deploy (if not already running)
./deploy-demo.sh

# 2. Create admin (if not created)
docker-compose exec backend python manage.py createsuperuser

# 3. Create sample data
docker-compose exec backend python create_sample_lesson.py

# 4. Open in browser
# - Admin: http://localhost:8000/admin
# - Frontend: http://localhost:3000
```

**Demo Flow:**
1. Show landing page (modern UI)
2. Login to admin, show course creation
3. Login as student, browse courses
4. Complete a lesson, try code editor
5. Show analytics dashboard

---

## 🔧 Troubleshooting

### Services Won't Start

```bash
# Check Docker is running
docker --version
docker-compose --version

# View detailed logs
docker-compose logs

# Rebuild from scratch
docker-compose down -v
docker-compose up --build
```

### Port Already in Use

```bash
# Check what's using the ports
sudo lsof -i :3000
sudo lsof -i :8000

# Kill the process
sudo kill -9 <PID>

# Or change ports in docker-compose.yml
```

### Database Errors

```bash
# Reset database
rm backend/data/db.sqlite3
docker-compose restart backend
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

### Frontend Can't Connect to Backend

1. Check backend is running: `docker-compose ps`
2. Test API: `curl http://localhost:8000/api/`
3. Check CORS settings in `backend/base/settings.py`
4. Verify `NEXT_PUBLIC_API_BASE_URL` in frontend

---

## 📦 Deployment Comparison

| Feature | SQLite (Current) | PostgreSQL |
|---------|------------------|------------|
| **Setup Time** | 3 min | 5 min |
| **Containers** | 2 (backend, frontend) | 3 (+ database) |
| **Memory Usage** | ~500MB | ~800MB |
| **Disk Space** | ~1GB | ~2GB |
| **Backup** | Copy 1 file | pg_dump |
| **Portability** | ✅ Excellent | ⚠️ Complex |
| **Best For** | Demos, small deployments | Production, high traffic |
| **Concurrent Users** | ~100 | Thousands |

---

## 🚀 When to Upgrade to PostgreSQL

Consider PostgreSQL when:
- You have 100+ concurrent users
- You need advanced database features
- You're deploying to production
- You need better performance for complex queries

**Easy migration path available** - see `DEPLOYMENT_GUIDE.md`

---

## 📚 Additional Resources

- **Full Deployment Guide**: `DEPLOYMENT_GUIDE.md`
- **Architecture**: `ARCHITECTURE.md`
- **Production Setup**: `PRODUCTION_RESOURCES.md`
- **Workflow**: `.agent/workflows/deploy-demo.md`

---

## ✅ Pre-Deployment Checklist

- [ ] Docker and Docker Compose installed
- [ ] Ports 3000 and 8000 available
- [ ] At least 2GB free RAM
- [ ] At least 2GB free disk space
- [ ] Terminal access to project directory

---

## 🎉 You're Ready!

Everything is configured for SQLite. Just run:

```bash
./deploy-demo.sh
```

And your demo will be live in minutes! 🚀

---

**Questions?** Check the troubleshooting section above or the full guide in `DEPLOYMENT_GUIDE.md`

**Built for the Africa Sustainable Classroom Challenge**  
**SQLite Demo Version**: 1.0  
**Date**: 2026-01-16

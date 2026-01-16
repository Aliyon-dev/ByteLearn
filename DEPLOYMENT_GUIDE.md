# ByteLearn Demo Deployment Guide

## 🚀 Quick Start (Recommended for Demo)

The fastest way to deploy ByteLearn for a demo is using Docker Compose.

### Prerequisites
- Docker and Docker Compose installed
- At least 4GB of free RAM
- Ports 3000, 8000, and 5432 available

### One-Command Deployment

```bash
./deploy-demo.sh
```

This automated script will:
1. Stop any existing containers
2. Build and start all services (PostgreSQL, Django, Next.js)
3. Run database migrations
4. Create sample data
5. Display access URLs

### Manual Deployment Steps

If you prefer to run commands manually:

```bash
# 1. Navigate to project directory
cd /home/aliyon-dev/Documents/2026/Coding\ Projects/ByteLearn

# 2. Start services
docker-compose up --build -d

# 3. Wait for services to initialize
sleep 30

# 4. Run migrations
docker-compose exec backend python manage.py migrate

# 5. Create superuser (interactive)
docker-compose exec backend python manage.py createsuperuser

# 6. Create sample data (optional)
docker-compose exec backend python create_sample_lesson.py
```

### Access Your Demo

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Django Admin**: http://localhost:8000/admin

---

## 🌐 Cloud Deployment Options

### Option 1: Render.com (Free Tier Available)

**Best for:** Quick public demos, sharing with stakeholders

#### Steps:

1. **Create Render Account**: https://render.com

2. **Deploy PostgreSQL Database**
   - New → PostgreSQL
   - Name: `bytelearn-db`
   - Plan: Free
   - Save the Internal Database URL

3. **Deploy Backend**
   - New → Web Service
   - Connect GitHub repo
   - Settings:
     ```
     Name: bytelearn-backend
     Environment: Python 3
     Build Command: cd backend && pip install -r requirements.txt
     Start Command: cd backend && gunicorn base.wsgi:application --bind 0.0.0.0:$PORT
     ```
   - Environment Variables:
     ```
     SECRET_KEY=<generate-random-key>
     DEBUG=False
     DATABASE_URL=<from-step-2>
     ALLOWED_HOSTS=*.onrender.com
     CORS_ALLOWED_ORIGINS=https://<your-frontend>.onrender.com
     ```

4. **Deploy Frontend**
   - New → Web Service
   - Settings:
     ```
     Name: bytelearn-frontend
     Environment: Node
     Build Command: cd frontend && npm install && npm run build
     Start Command: cd frontend && npm start
     ```
   - Environment Variables:
     ```
     NEXT_PUBLIC_API_BASE_URL=https://<your-backend>.onrender.com/api
     ```

5. **Initialize Database**
   - In backend service shell:
     ```bash
     python manage.py migrate
     python manage.py createsuperuser
     ```

### Option 2: Railway.app

**Best for:** Simple deployment with automatic SSL

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add PostgreSQL
railway add --plugin postgresql

# Deploy
railway up

# Run migrations
railway run python manage.py migrate
```

### Option 3: Fly.io

**Best for:** Global edge deployment

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch app
fly launch

# Deploy
fly deploy
```

---

## 🏢 Production VPS Deployment

**Best for:** Full control, on-premise deployment

### Prerequisites
- Ubuntu 22.04 VPS (2GB RAM minimum)
- Domain name (optional)
- SSH access

### Quick Setup Script

```bash
# Connect to VPS
ssh root@your-server-ip

# Download and run setup script
curl -sSL https://raw.githubusercontent.com/Aliyon-dev/ByteLearn/main/scripts/vps-setup.sh | bash
```

### Manual VPS Setup

```bash
# 1. Update system
apt update && apt upgrade -y

# 2. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
apt install -y docker-compose

# 3. Clone repository
cd /var/www
git clone https://github.com/Aliyon-dev/ByteLearn.git
cd ByteLearn

# 4. Configure environment
cp .env.example .env
nano .env  # Update with your values

# 5. Deploy with production config
docker-compose -f docker-compose.prod.yml up -d

# 6. Run migrations
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate

# 7. Create superuser
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```

### Configure Domain (Optional)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is configured automatically
```

---

## 📊 Deployment Comparison

| Feature | Docker Local | Render.com | Railway | VPS |
|---------|-------------|------------|---------|-----|
| **Setup Time** | 5 min | 15 min | 10 min | 30 min |
| **Cost** | Free | Free tier | $5/mo | $5-20/mo |
| **SSL** | No | Auto | Auto | Manual |
| **Custom Domain** | No | Yes | Yes | Yes |
| **Scalability** | Limited | Auto | Auto | Manual |
| **Control** | Full | Limited | Limited | Full |
| **Best For** | Local demo | Public demo | Quick deploy | Production |

---

## 🔧 Post-Deployment Configuration

### 1. Create Demo Accounts

```bash
# Access Django shell
docker-compose exec backend python manage.py shell

# Create demo users
from django.contrib.auth import get_user_model
User = get_user_model()

# Instructor account
User.objects.create_user(
    username='instructor_demo',
    email='instructor@demo.com',
    password='Demo123!',
    role='instructor'
)

# Student account
User.objects.create_user(
    username='student_demo',
    email='student@demo.com',
    password='Demo123!',
    role='student'
)
```

### 2. Create Sample Course

```bash
docker-compose exec backend python create_sample_lesson.py
```

Or manually through Django Admin:
1. Login to http://localhost:8000/admin
2. Create a Course
3. Add Lessons to the course
4. Create Assessments
5. Add Coding Exercises

### 3. Configure Email (Optional)

Update `.env` file:
```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

---

## 🎯 Demo Presentation Flow

For effective demos, follow this sequence:

### 1. Landing Page (30 seconds)
- Show modern, clean UI
- Highlight key features

### 2. Student Experience (3 minutes)
- Login as `student_demo`
- Browse available courses
- Enroll in a course
- Watch a lesson video
- Complete a coding exercise
- View progress dashboard

### 3. Instructor Experience (2 minutes)
- Login as `instructor_demo`
- Create a new course
- Add lessons and content
- View student analytics

### 4. Admin Experience (1 minute)
- Login as admin
- Show system-wide analytics
- Demonstrate user management

### 5. Technical Highlights (1 minute)
- Show code editor (Monaco)
- Demonstrate real-time execution
- Display analytics charts

---

## 🐛 Troubleshooting

### Services Won't Start

```bash
# Check logs
docker-compose logs

# Restart services
docker-compose restart

# Rebuild from scratch
docker-compose down -v
docker-compose up --build
```

### Database Connection Errors

```bash
# Check database status
docker-compose ps db

# Restart database
docker-compose restart db

# Check database logs
docker-compose logs db
```

### Frontend Can't Connect to Backend

1. Check CORS settings in `backend/base/settings.py`
2. Verify `NEXT_PUBLIC_API_BASE_URL` in frontend `.env.local`
3. Ensure backend is running: `curl http://localhost:8000/api/`

### Port Conflicts

```bash
# Check what's using the ports
sudo lsof -i :3000
sudo lsof -i :8000
sudo lsof -i :5432

# Kill processes if needed
sudo kill -9 <PID>
```

### Static Files Not Loading

```bash
# Collect static files
docker-compose exec backend python manage.py collectstatic --noinput

# Check Nginx configuration
docker-compose exec nginx nginx -t
```

---

## 📈 Monitoring & Maintenance

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Database Backup

```bash
# Create backup
docker-compose exec db pg_dump -U user classroom > backup_$(date +%Y%m%d).sql

# Restore backup
docker-compose exec -T db psql -U user classroom < backup_20260116.sql
```

### Update Deployment

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up --build -d

# Run migrations
docker-compose exec backend python manage.py migrate
```

### Health Checks

```bash
# Check all services
docker-compose ps

# Test backend API
curl http://localhost:8000/api/

# Test frontend
curl http://localhost:3000

# Check database
docker-compose exec db pg_isready -U user
```

---

## 🔐 Security Checklist

Before public deployment:

- [ ] Change `SECRET_KEY` to a random value
- [ ] Set `DEBUG=False` in production
- [ ] Configure `ALLOWED_HOSTS` properly
- [ ] Set up SSL/TLS certificates
- [ ] Enable CSRF protection
- [ ] Configure secure cookies
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Configure firewall rules
- [ ] Set up automated backups
- [ ] Enable monitoring and logging
- [ ] Review CORS settings

---

## 📞 Support

- **Documentation**: See `ARCHITECTURE.md`, `README.md`
- **Issues**: GitHub Issues
- **Email**: support@bytelearn.demo

---

## 📝 Next Steps

After successful deployment:

1. **Customize Branding**
   - Update logo and colors
   - Modify landing page content
   - Add your institution's information

2. **Create Content**
   - Add courses for your curriculum
   - Upload lesson videos
   - Create assessments and exercises

3. **Invite Users**
   - Set up instructor accounts
   - Import student data
   - Configure user roles

4. **Monitor Performance**
   - Set up analytics
   - Track user engagement
   - Monitor system health

5. **Plan for Scale**
   - Review resource usage
   - Plan for growth
   - Consider CDN for media files

---

**Built for the Africa Sustainable Classroom Challenge**  
**Last Updated**: 2026-01-16

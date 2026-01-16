---
description: Deploy ByteLearn demo using Docker or cloud platforms
---

# ByteLearn Demo Deployment Workflow

This workflow provides multiple options for deploying a ByteLearn demo.

---

## Option 1: Quick Local Demo (Docker Compose) ⚡

**Best for:** Quick demos, local testing, presentations

### Prerequisites
- Docker and Docker Compose installed
- Ports 3000, 8000, and 5432 available

### Steps

1. **Navigate to project root**
```bash
cd /home/aliyon-dev/Documents/2026/Coding\ Projects/ByteLearn
```

2. **Stop any running services**
```bash
docker-compose down -v
```

3. **Build and start all services**
```bash
docker-compose up --build -d
```

4. **Wait for services to initialize** (30-60 seconds)
```bash
sleep 45
```

5. **Run database migrations**
```bash
docker-compose exec backend python manage.py migrate
```

6. **Create a superuser** (interactive)
```bash
docker-compose exec backend python manage.py createsuperuser
```

7. **Load sample data** (if available)
```bash
docker-compose exec backend python manage.py loaddata sample_data.json
```
Or create sample lesson:
```bash
docker-compose exec backend python create_sample_lesson.py
```

8. **Check service status**
```bash
docker-compose ps
```

9. **View logs** (optional)
```bash
docker-compose logs -f
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Django Admin**: http://localhost:8000/admin

### Stop Demo
```bash
docker-compose down
```

### Clean Up Everything
```bash
docker-compose down -v
docker system prune -f
```

---

## Option 2: Cloud Deployment (Render/Railway/Fly.io)

**Best for:** Public demos, sharing with stakeholders

### A. Deploy to Render.com (Recommended)

#### Prerequisites
- Render.com account (free tier available)
- GitHub repository

#### Steps

1. **Push code to GitHub** (if not already)
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

2. **Create PostgreSQL Database on Render**
   - Go to https://dashboard.render.com
   - Click "New +" → "PostgreSQL"
   - Name: `bytelearn-db`
   - Plan: Free
   - Note the Internal Database URL

3. **Deploy Backend Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Settings:
     - Name: `bytelearn-backend`
     - Environment: `Python 3`
     - Build Command: `pip install -r backend/requirements.txt`
     - Start Command: `cd backend && gunicorn base.wsgi:application --bind 0.0.0.0:$PORT`
     - Add Environment Variables:
       ```
       SECRET_KEY=<generate-random-key>
       DEBUG=False
       DATABASE_URL=<from-step-2>
       ALLOWED_HOSTS=bytelearn-backend.onrender.com
       CORS_ALLOWED_ORIGINS=https://bytelearn-frontend.onrender.com
       ```

4. **Deploy Frontend Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Settings:
     - Name: `bytelearn-frontend`
     - Environment: `Node`
     - Build Command: `cd frontend && npm install && npm run build`
     - Start Command: `cd frontend && npm start`
     - Add Environment Variables:
       ```
       NEXT_PUBLIC_API_BASE_URL=https://bytelearn-backend.onrender.com/api
       ```

5. **Run Migrations**
   - In backend service shell:
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

### B. Deploy to Railway.app

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login to Railway**
```bash
railway login
```

3. **Initialize project**
```bash
railway init
```

4. **Add PostgreSQL**
```bash
railway add --plugin postgresql
```

5. **Deploy**
```bash
railway up
```

### C. Deploy to Fly.io

1. **Install Fly CLI**
```bash
curl -L https://fly.io/install.sh | sh
```

2. **Login**
```bash
fly auth login
```

3. **Launch app**
```bash
fly launch
```

---

## Option 3: Production VPS Deployment (DigitalOcean/AWS/Linode)

**Best for:** Production-ready deployment, full control

### Prerequisites
- VPS with Ubuntu 22.04 (2GB RAM minimum)
- Domain name (optional)
- SSH access

### Steps

1. **Connect to your VPS**
```bash
ssh root@your-server-ip
```

2. **Update system**
```bash
apt update && apt upgrade -y
```

3. **Install dependencies**
```bash
apt install -y python3-pip python3-venv postgresql postgresql-contrib nginx certbot python3-certbot-nginx nodejs npm git
```

4. **Install Docker (alternative)**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
apt install -y docker-compose
```

5. **Clone repository**
```bash
cd /var/www
git clone https://github.com/Aliyon-dev/ByteLearn.git
cd ByteLearn
```

6. **Setup PostgreSQL**
```bash
sudo -u postgres psql
CREATE DATABASE bytelearn_db;
CREATE USER bytelearn_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE bytelearn_db TO bytelearn_user;
\q
```

7. **Configure environment variables**
```bash
cp .env.example .env
nano .env
```

8. **Deploy with Docker Compose**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

9. **Configure Nginx reverse proxy**
```bash
nano /etc/nginx/sites-available/bytelearn
```

10. **Enable SSL with Certbot**
```bash
certbot --nginx -d yourdomain.com
```

---

## Option 4: Kubernetes Deployment (Advanced)

**Best for:** Large-scale production, high availability

### Prerequisites
- Kubernetes cluster (GKE, EKS, AKS, or local with minikube)
- kubectl configured
- Helm (optional)

### Steps

1. **Create namespace**
```bash
kubectl create namespace bytelearn
```

2. **Deploy PostgreSQL**
```bash
kubectl apply -f k8s/postgres-deployment.yaml
```

3. **Deploy backend**
```bash
kubectl apply -f k8s/backend-deployment.yaml
```

4. **Deploy frontend**
```bash
kubectl apply -f k8s/frontend-deployment.yaml
```

5. **Expose services**
```bash
kubectl apply -f k8s/ingress.yaml
```

---

## Post-Deployment Checklist

After deploying, verify:

- [ ] Frontend loads successfully
- [ ] Backend API is accessible
- [ ] Database connections work
- [ ] User registration works
- [ ] Login/authentication works
- [ ] Course creation works
- [ ] File uploads work
- [ ] Analytics dashboard loads
- [ ] Code editor functions
- [ ] Video playback works (if applicable)

---

## Troubleshooting

### Common Issues

**Issue: Frontend can't connect to backend**
- Check CORS settings in Django
- Verify NEXT_PUBLIC_API_BASE_URL is correct
- Check network connectivity

**Issue: Database connection failed**
- Verify database credentials
- Check database service is running
- Ensure migrations have run

**Issue: Static files not loading**
- Run `python manage.py collectstatic`
- Check Nginx configuration
- Verify file permissions

**Issue: Docker containers keep restarting**
- Check logs: `docker-compose logs`
- Verify environment variables
- Check port conflicts

---

## Monitoring & Maintenance

### View Logs
```bash
# Docker
docker-compose logs -f [service-name]

# Kubernetes
kubectl logs -f deployment/backend -n bytelearn
```

### Backup Database
```bash
# Docker
docker-compose exec db pg_dump -U user classroom > backup.sql

# Direct PostgreSQL
pg_dump -U bytelearn_user bytelearn_db > backup.sql
```

### Update Deployment
```bash
git pull origin main
docker-compose down
docker-compose up --build -d
docker-compose exec backend python manage.py migrate
```

---

## Demo Credentials (After Setup)

Create these test accounts for demo purposes:

**Admin:**
- Username: admin
- Password: (set during createsuperuser)

**Instructor:**
- Username: instructor_demo
- Email: instructor@bytelearn.demo
- Password: Demo123!

**Student:**
- Username: student_demo
- Email: student@bytelearn.demo
- Password: Demo123!

---

## Quick Demo Script

For presentations, follow this flow:

1. **Show Landing Page** → Clean, modern UI
2. **Login as Student** → Dashboard with enrolled courses
3. **Open a Course** → Show lessons, videos, exercises
4. **Try Code Editor** → Run a Python exercise
5. **Check Progress** → Analytics dashboard
6. **Login as Instructor** → Show course creation
7. **Login as Admin** → Show system analytics

---

## Resources

- **Documentation**: See ARCHITECTURE.md, README.md
- **API Docs**: http://your-domain/api/docs (if configured)
- **Support**: GitHub Issues

---

**Last Updated**: 2026-01-16

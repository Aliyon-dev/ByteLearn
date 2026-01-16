# ByteLearn - Known Bugs & Limitations

## 🐛 **Critical Bugs**

### 1. **Database Configuration Mismatch**
- **Severity**: HIGH
- **Issue**: `settings.py` uses SQLite (line 90) but `docker-compose.yml` configures PostgreSQL
- **Impact**: Docker deployment will fail as Django won't connect to PostgreSQL
- **Location**: `backend/base/settings.py`
- **Fix Required**: Add environment-based database configuration to switch between SQLite (dev) and PostgreSQL (production)

### 2. **Hardcoded Insecure SECRET_KEY**
- **Severity**: CRITICAL
- **Issue**: Django SECRET_KEY is hardcoded and marked as insecure (line 24 in settings.py)
- **Impact**: Security vulnerability - anyone with code access can forge sessions
- **Location**: `backend/base/settings.py`
- **Fix Required**: Move to environment variable immediately

### 3. **DEBUG Mode Enabled**
- **Severity**: CRITICAL
- **Issue**: `DEBUG = True` in production settings
- **Impact**: Exposes sensitive error information, stack traces, and internal paths
- **Location**: `backend/base/settings.py` line 27
- **Fix Required**: Environment-based DEBUG setting

### 4. **Empty ALLOWED_HOSTS**
- **Severity**: HIGH
- **Issue**: `ALLOWED_HOSTS = []` (line 29)
- **Impact**: Application won't work in production with DEBUG=False
- **Location**: `backend/base/settings.py`
- **Fix Required**: Add production domain(s) to ALLOWED_HOSTS

---

## ⚠️ **Major Issues**

### 5. **Frontend Dockerfile Uses Dev Server**
- **Severity**: MEDIUM-HIGH
- **Issue**: `CMD ["npm", "run", "dev"]` in production Dockerfile
- **Impact**: Poor performance, development warnings in production
- **Location**: `frontend/Dockerfile` line 18
- **Fix Required**: Use production build (`npm run build` + `npm start`)

### 6. **Backend Dockerfile Uses Django Dev Server**
- **Severity**: MEDIUM-HIGH
- **Issue**: `CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]`
- **Impact**: Not suitable for production, single-threaded, no process management
- **Location**: `backend/Dockerfile` line 6
- **Fix Required**: Use Gunicorn or uWSGI

### 7. **No Static File Collection**
- **Severity**: MEDIUM
- **Issue**: No `STATIC_ROOT` configured, no `collectstatic` in deployment
- **Impact**: Static files (CSS, JS, admin panel) won't work in production
- **Location**: `backend/base/settings.py`
- **Fix Required**: Add STATIC_ROOT and run collectstatic

### 8. **Missing Environment Variable Management**
- **Severity**: MEDIUM
- **Issue**: No `.env` file structure, no environment variable loading
- **Impact**: Cannot configure different environments (dev/staging/prod)
- **Location**: Project-wide
- **Fix Required**: Add `python-deotenv` and environment-based configuration

---

## 🔧 **Functional Bugs**

### 9. **Frontend npm Install Commented Out**
- **Severity**: MEDIUM
- **Issue**: Line 9 in `frontend/Dockerfile` has `#RUN npm install --force` commented out
- **Impact**: Docker build will fail - dependencies won't be installed
- **Location**: `frontend/Dockerfile` line 9
- **Fix Required**: Uncomment and fix dependency conflicts properly

### 10. **CORS Configuration Too Restrictive**
- **Severity**: LOW-MEDIUM
- **Issue**: Only allows `http://localhost:3000` but frontend runs on port 3001
- **Impact**: API calls may fail due to CORS errors
- **Location**: `backend/base/settings.py` line 141-143
- **Fix Required**: Add `http://localhost:3001` or use environment variable

### 11. **No Error Handling for API Failures**
- **Severity**: MEDIUM
- **Issue**: Frontend components log errors to console but don't show user-friendly messages
- **Impact**: Poor user experience when API calls fail
- **Location**: Multiple frontend files (see console.error grep results)
- **Fix Required**: Implement toast notifications or error boundaries

### 12. **No JWT Token Refresh Logic**
- **Severity**: MEDIUM
- **Issue**: Access tokens expire but no automatic refresh mechanism
- **Impact**: Users get logged out unexpectedly, need to re-login frequently
- **Location**: `frontend/contexts/auth-context.tsx`, `frontend/lib/api.ts`
- **Fix Required**: Implement token refresh interceptor

---

## 📋 **Limitations & Missing Features**

### 13. **No Rate Limiting**
- **Severity**: MEDIUM
- **Issue**: API endpoints have no rate limiting
- **Impact**: Vulnerable to brute force attacks and API abuse
- **Fix Required**: Add Django rate limiting middleware

### 14. **No Input Validation on Frontend**
- **Severity**: MEDIUM
- **Issue**: Forms submit without client-side validation
- **Impact**: Poor UX, unnecessary API calls with invalid data
- **Fix Required**: Add form validation using Zod schemas

### 15. **No Pagination**
- **Severity**: LOW-MEDIUM
- **Issue**: API endpoints return all records without pagination
- **Impact**: Performance issues with large datasets
- **Location**: Backend views
- **Fix Required**: Implement DRF pagination

### 16. **No File Upload Size Limits**
- **Severity**: MEDIUM
- **Issue**: No limits on media file uploads
- **Impact**: Potential DoS via large file uploads
- **Fix Required**: Configure `DATA_UPLOAD_MAX_MEMORY_SIZE` and `FILE_UPLOAD_MAX_MEMORY_SIZE`

### 17. **No Database Migrations in Docker**
- **Severity**: MEDIUM
- **Issue**: Dockerfile doesn't run migrations on startup
- **Impact**: Fresh deployments will have empty database schema
- **Fix Required**: Add migration command to entrypoint script

### 18. **No Health Check Endpoints**
- **Severity**: LOW
- **Issue**: No `/health` or `/ready` endpoints
- **Impact**: Cannot monitor application health in production
- **Fix Required**: Add health check view

### 19. **No Logging Configuration**
- **Severity**: MEDIUM
- **Issue**: Using default Django logging
- **Impact**: Difficult to debug production issues
- **Fix Required**: Configure structured logging

### 20. **No Tests**
- **Severity**: MEDIUM
- **Issue**: No unit tests, integration tests, or E2E tests
- **Impact**: Cannot verify functionality, risky deployments
- **Fix Required**: Add test suite

---

## 🔐 **Security Issues**

### 21. **No HTTPS Enforcement**
- **Severity**: HIGH
- **Issue**: No SSL/TLS configuration, no HTTPS redirect
- **Impact**: Data transmitted in plain text
- **Fix Required**: Add `SECURE_SSL_REDIRECT`, `SECURE_HSTS_SECONDS`

### 22. **No CSRF Protection for API**
- **Severity**: MEDIUM
- **Issue**: JWT authentication bypasses CSRF, but no additional protection
- **Impact**: Potential CSRF attacks if tokens stored in cookies
- **Fix Required**: Review authentication flow

### 23. **No Security Headers**
- **Severity**: MEDIUM
- **Issue**: Missing CSP, X-Frame-Options, X-Content-Type-Options
- **Impact**: Vulnerable to XSS, clickjacking
- **Fix Required**: Add Django security middleware configuration

### 24. **Password Storage**
- **Severity**: LOW (Django handles this well by default)
- **Issue**: No custom password validators beyond Django defaults
- **Impact**: Users can set weak passwords
- **Fix Required**: Add custom password strength requirements

---

## 🎨 **UI/UX Issues**

### 25. **No Loading States**
- **Severity**: LOW
- **Issue**: Some pages don't show loading indicators
- **Impact**: Users unsure if page is loading or broken
- **Fix Required**: Add loading skeletons

### 26. **No Offline Support**
- **Severity**: LOW (by design for on-premise)
- **Issue**: No service worker or offline caching
- **Impact**: App doesn't work without backend connection
- **Note**: May be intentional for on-premise deployment

### 27. **No Mobile Responsiveness Testing**
- **Severity**: LOW-MEDIUM
- **Issue**: Unknown if UI works well on mobile devices
- **Impact**: Poor mobile experience
- **Fix Required**: Test and fix responsive layouts

---

## 📊 **Performance Issues**

### 28. **No Database Indexing Strategy**
- **Severity**: MEDIUM
- **Issue**: No custom indexes on frequently queried fields
- **Impact**: Slow queries as data grows
- **Fix Required**: Add indexes on foreign keys, search fields

### 29. **No Caching Layer**
- **Severity**: MEDIUM
- **Issue**: No Redis/Memcached for caching
- **Impact**: Repeated database queries for same data
- **Fix Required**: Implement caching strategy

### 30. **No CDN for Static Assets**
- **Severity**: LOW
- **Issue**: Static files served from application server
- **Impact**: Slower page loads
- **Fix Required**: Configure CDN

---

## 🔄 **DevOps Issues**

### 31. **No CI/CD Pipeline**
- **Severity**: MEDIUM
- **Issue**: No automated testing or deployment
- **Impact**: Manual deployments, no quality gates
- **Fix Required**: Set up GitHub Actions or similar

### 32. **No Backup Strategy**
- **Severity**: HIGH
- **Issue**: No automated database backups
- **Impact**: Data loss risk
- **Fix Required**: Implement backup automation

### 33. **No Monitoring/Alerting**
- **Severity**: MEDIUM
- **Issue**: No APM, error tracking, or uptime monitoring
- **Impact**: Cannot detect or diagnose production issues
- **Fix Required**: Add Sentry, New Relic, or similar

---

## ✅ **What's Working Well**

- ✅ Core Django REST API functionality
- ✅ JWT authentication implementation
- ✅ Next.js frontend with modern UI components
- ✅ Docker containerization setup
- ✅ Course, lesson, assessment, and analytics modules
- ✅ Code editor integration (Monaco)
- ✅ Progress tracking system
- ✅ CORS configuration (needs minor adjustment)

---

## 🎯 **Priority Fix Order**

### **Immediate (Before Any Production Use):**
1. Fix SECRET_KEY (use environment variable)
2. Set DEBUG=False for production
3. Configure ALLOWED_HOSTS
4. Fix database configuration for Docker
5. Uncomment npm install in Dockerfile
6. Use production servers (Gunicorn + production Next.js build)

### **High Priority (Before Launch):**
7. Implement HTTPS/SSL
8. Add security headers
9. Configure static file serving
10. Add error tracking
11. Implement backup strategy
12. Add health check endpoints

### **Medium Priority (Post-Launch):**
13. Add rate limiting
14. Implement token refresh
15. Add pagination
16. Configure logging
17. Add monitoring
18. Write tests

### **Low Priority (Enhancement):**
19. Add caching layer
20. Optimize database queries
21. Improve mobile responsiveness
22. Add offline support (if needed)

---

**Last Updated**: 2026-01-15  
**Status**: Development - Not Production Ready

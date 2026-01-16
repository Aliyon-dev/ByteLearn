# ByteLearn - System Architecture

## Overview

ByteLearn is an on-premise digital learning platform designed for low-resource educational environments. The system follows a modern client-server architecture with a Django REST API backend and Next.js frontend.

---

## High-Level System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser["Web Browser"]
        Mobile["Mobile Browser"]
    end
    
    subgraph "Frontend - Next.js Application"
        NextJS["Next.js 15.2.4<br/>React 19"]
        AuthContext["Auth Context<br/>(JWT Management)"]
        Components["UI Components<br/>(Radix UI + Tailwind)"]
        CodeEditor["Monaco Code Editor"]
        Charts["Analytics Charts<br/>(Recharts)"]
    end
    
    subgraph "Backend - Django REST API"
        Django["Django 5.2.3<br/>DRF"]
        
        subgraph "API Modules"
            AuthAPI["Authentication<br/>(JWT + 2FA)"]
            CoursesAPI["Courses API"]
            LessonsAPI["Lessons API"]
            AssessmentsAPI["Assessments API"]
            ProgressAPI["Progress Tracking"]
            NotificationsAPI["Notifications"]
            AnalyticsAPI["Analytics API"]
        end
        
        Middleware["Middleware<br/>(CORS, Auth, Security)"]
        Admin["Django Admin Panel"]
    end
    
    subgraph "Data Layer"
        DB[(Database<br/>SQLite/PostgreSQL)]
        MediaStorage[("Media Storage<br/>(Videos, Files)")]
    end
    
    Browser --> NextJS
    Mobile --> NextJS
    NextJS --> AuthContext
    NextJS --> Components
    NextJS --> CodeEditor
    NextJS --> Charts
    
    AuthContext -->|HTTP/REST| Middleware
    Components -->|HTTP/REST| Middleware
    CodeEditor -->|HTTP/REST| Middleware
    Charts -->|HTTP/REST| Middleware
    
    Middleware --> Django
    Django --> AuthAPI
    Django --> CoursesAPI
    Django --> LessonsAPI
    Django --> AssessmentsAPI
    Django --> ProgressAPI
    Django --> NotificationsAPI
    Django --> AnalyticsAPI
    Django --> Admin
    
    AuthAPI --> DB
    CoursesAPI --> DB
    LessonsAPI --> DB
    AssessmentsAPI --> DB
    ProgressAPI --> DB
    NotificationsAPI --> DB
    AnalyticsAPI --> DB
    
    CoursesAPI --> MediaStorage
    LessonsAPI --> MediaStorage
```

---

## Component Architecture

```mermaid
graph LR
    subgraph "Frontend Components"
        Pages["Pages<br/>(App Router)"]
        Contexts["React Contexts"]
        Hooks["Custom Hooks"]
        UILib["UI Library<br/>(Radix UI)"]
        
        Pages --> Contexts
        Pages --> Hooks
        Pages --> UILib
    end
    
    subgraph "Backend Components"
        Models["Django Models<br/>(ORM)"]
        Serializers["DRF Serializers"]
        Views["API Views"]
        Permissions["Permission Classes"]
        
        Views --> Serializers
        Serializers --> Models
        Views --> Permissions
    end
    
    Contexts -->|API Calls| Views
    Hooks -->|API Calls| Views
```

---

## Data Flow Architecture

### Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant AuthAPI
    participant Database
    
    User->>Frontend: Enter Credentials
    Frontend->>AuthAPI: POST /api/auth/login/
    AuthAPI->>Database: Validate User
    Database-->>AuthAPI: User Data
    
    alt 2FA Enabled
        AuthAPI-->>Frontend: MFA Required
        Frontend->>User: Request OTP
        User->>Frontend: Enter OTP
        Frontend->>AuthAPI: POST with OTP
        AuthAPI->>Database: Validate OTP
    end
    
    AuthAPI-->>Frontend: JWT Tokens (Access + Refresh)
    Frontend->>Frontend: Store Tokens (localStorage)
    Frontend-->>User: Redirect to Dashboard
```

### Course Content Flow

```mermaid
sequenceDiagram
    participant Student
    participant Frontend
    participant CoursesAPI
    participant LessonsAPI
    participant ProgressAPI
    participant Database
    
    Student->>Frontend: Browse Courses
    Frontend->>CoursesAPI: GET /api/courses/
    CoursesAPI->>Database: Query Courses
    Database-->>CoursesAPI: Course List
    CoursesAPI-->>Frontend: JSON Response
    Frontend-->>Student: Display Courses
    
    Student->>Frontend: Select Course
    Frontend->>CoursesAPI: GET /api/courses/{id}/
    CoursesAPI->>Database: Query Course Details
    Database-->>CoursesAPI: Course + Lessons
    CoursesAPI-->>Frontend: Course Data
    
    Student->>Frontend: Start Lesson
    Frontend->>LessonsAPI: GET /api/lessons/{id}/
    LessonsAPI->>Database: Query Lesson
    Database-->>LessonsAPI: Lesson Content
    LessonsAPI-->>Frontend: Lesson Data
    
    Student->>Frontend: Complete Lesson
    Frontend->>ProgressAPI: POST /api/progress/
    ProgressAPI->>Database: Update Progress
    Database-->>ProgressAPI: Success
    ProgressAPI-->>Frontend: Updated Progress
```

### Code Execution Flow

```mermaid
sequenceDiagram
    participant Student
    participant Frontend
    participant CodeEditor
    participant CoursesAPI
    participant Database
    
    Student->>Frontend: Open Coding Exercise
    Frontend->>CoursesAPI: GET /api/courses/exercises/{id}/
    CoursesAPI->>Database: Query Exercise
    Database-->>CoursesAPI: Exercise Data
    CoursesAPI-->>Frontend: Exercise + Test Cases
    Frontend->>CodeEditor: Load Exercise
    
    Student->>CodeEditor: Write Code
    CodeEditor->>Student: Syntax Highlighting
    
    Student->>CodeEditor: Submit Code
    CodeEditor->>CoursesAPI: POST /api/courses/exercises/{id}/execute/
    CoursesAPI->>CoursesAPI: Execute Code<br/>(Run Test Cases)
    CoursesAPI-->>CodeEditor: Execution Results
    CodeEditor-->>Student: Display Results
    
    alt All Tests Pass
        CodeEditor->>CoursesAPI: POST /api/courses/exercises/{id}/submit/
        CoursesAPI->>Database: Save Submission
        Database-->>CoursesAPI: Success
        CoursesAPI-->>Student: Exercise Completed
    end
```

---

## Database Schema Overview

```mermaid
erDiagram
    User ||--o{ Course : "creates/enrolls"
    User ||--o{ Progress : "tracks"
    User ||--o{ Notification : "receives"
    User ||--o{ AssessmentSubmission : "submits"
    
    Course ||--o{ Lesson : "contains"
    Course ||--o{ Assessment : "has"
    Course ||--o{ CodingExercise : "includes"
    Course ||--o{ Enrollment : "has"
    
    Lesson ||--o{ Progress : "tracked_in"
    
    Assessment ||--o{ Question : "contains"
    Assessment ||--o{ AssessmentSubmission : "receives"
    
    CodingExercise ||--o{ TestCase : "has"
    CodingExercise ||--o{ Submission : "receives"
    
    User {
        int id PK
        string username
        string email
        string password_hash
        string role
        boolean mfa_enabled
        datetime created_at
    }
    
    Course {
        int id PK
        string title
        text description
        int instructor_id FK
        string difficulty
        int duration
        datetime created_at
    }
    
    Lesson {
        int id PK
        int course_id FK
        string title
        text content
        string video_url
        int order
        datetime created_at
    }
    
    Assessment {
        int id PK
        int course_id FK
        string title
        int duration
        int passing_score
        datetime created_at
    }
    
    CodingExercise {
        int id PK
        int course_id FK
        string title
        text description
        text starter_code
        string language
        datetime created_at
    }
    
    Progress {
        int id PK
        int user_id FK
        int lesson_id FK
        int completion_percentage
        datetime last_accessed
    }
```

---

## Deployment Architecture

### Development Environment

```mermaid
graph TB
    subgraph "Developer Machine"
        subgraph "Frontend Container"
            NextDev["Next.js Dev Server<br/>Port 3001"]
        end
        
        subgraph "Backend Container"
            DjangoDev["Django Dev Server<br/>Port 8000"]
        end
        
        subgraph "Database Container"
            SQLite["SQLite<br/>(Development)"]
        end
        
        NextDev -->|API Calls| DjangoDev
        DjangoDev --> SQLite
    end
```

### Docker Compose Architecture

```mermaid
graph TB
    subgraph "Docker Network: bytelearn-network"
        subgraph "Frontend Service"
            NextContainer["Node 18 Alpine<br/>Next.js App<br/>Port 3000"]
        end
        
        subgraph "Backend Service"
            DjangoContainer["Python 3.10<br/>Django App<br/>Port 8000"]
        end
        
        subgraph "Database Service"
            PostgresContainer["PostgreSQL 13<br/>Port 5432"]
            PGData[("Volume:<br/>postgres_data")]
        end
        
        NextContainer -->|HTTP| DjangoContainer
        DjangoContainer -->|PostgreSQL Protocol| PostgresContainer
        PostgresContainer --> PGData
    end
    
    Host["Host Machine"] -->|Port 3000| NextContainer
    Host -->|Port 8000| DjangoContainer
    Host -->|Port 5432| PostgresContainer
```

### Production Architecture (Recommended)

```mermaid
graph TB
    Internet["Internet"]
    
    subgraph "Production Environment"
        LB["Load Balancer<br/>(Nginx)"]
        
        subgraph "Application Tier"
            Web1["Nginx<br/>(Static Files)"]
            App1["Gunicorn<br/>(Django)"]
            Next1["Next.js<br/>(Production Build)"]
        end
        
        subgraph "Caching Layer"
            Redis["Redis<br/>(Sessions + Cache)"]
        end
        
        subgraph "Data Tier"
            PrimaryDB[("PostgreSQL<br/>Primary")]
            ReplicaDB[("PostgreSQL<br/>Replica")]
        end
        
        subgraph "Storage"
            MediaStore[("Object Storage<br/>S3/MinIO")]
            Backups[("Backup Storage")]
        end
        
        subgraph "Monitoring"
            Logs["Centralized Logging"]
            Metrics["Metrics Collection"]
            Alerts["Alerting System"]
        end
    end
    
    Internet --> LB
    LB --> Web1
    LB --> Next1
    Web1 --> App1
    Next1 --> App1
    App1 --> Redis
    App1 --> PrimaryDB
    App1 --> MediaStore
    PrimaryDB --> ReplicaDB
    PrimaryDB --> Backups
    
    App1 --> Logs
    App1 --> Metrics
    Metrics --> Alerts
```

---

## API Architecture

### REST API Endpoints Structure

```mermaid
graph LR
    subgraph "API Routes"
        Root["/api/"]
        
        Auth["/auth/"]
        Courses["/courses/"]
        Lessons["/lessons/"]
        Assessments["/assessments/"]
        Progress["/progress/"]
        Notifications["/notifications/"]
        Analytics["/analytics/"]
        
        Root --> Auth
        Root --> Courses
        Root --> Lessons
        Root --> Assessments
        Root --> Progress
        Root --> Notifications
        Root --> Analytics
    end
    
    subgraph "Auth Endpoints"
        Login["/login/"]
        Register["/register/"]
        Refresh["/token/refresh/"]
        MFA["/mfa/setup/"]
    end
    
    subgraph "Course Endpoints"
        CourseList["/"]
        CourseDetail["/{id}/"]
        Exercises["/{id}/exercises/"]
        Execute["/{id}/execute/"]
    end
    
    Auth --> Login
    Auth --> Register
    Auth --> Refresh
    Auth --> MFA
    
    Courses --> CourseList
    Courses --> CourseDetail
    Courses --> Exercises
    Courses --> Execute
```

---

## Technology Stack Details

### Frontend Stack

```mermaid
graph TB
    subgraph "Frontend Technologies"
        Framework["Next.js 15.2.4<br/>(React 19)"]
        Language["TypeScript 5"]
        Styling["Tailwind CSS 3.4"]
        UIComponents["Radix UI Components"]
        StateManagement["React Context API"]
        HTTPClient["Axios 1.13"]
        CodeEditor["Monaco Editor 4.7"]
        Charts["Recharts 2.15"]
        Forms["React Hook Form 7.54"]
        Validation["Zod 3.24"]
    end
```

### Backend Stack

```mermaid
graph TB
    subgraph "Backend Technologies"
        Framework["Django 5.2.3"]
        API["Django REST Framework"]
        Auth["SimpleJWT<br/>(JWT Authentication)"]
        Database["PostgreSQL 13<br/>(SQLite for dev)"]
        ORM["Django ORM"]
        CORS["django-cors-headers"]
        Filters["django-filter"]
        MFA["pyotp + qrcode<br/>(2FA)"]
        Images["Pillow<br/>(Image Processing)"]
    end
```

---

## Security Architecture

```mermaid
graph TB
    subgraph "Security Layers"
        Transport["Transport Security<br/>(HTTPS/TLS)"]
        Auth["Authentication<br/>(JWT + 2FA)"]
        AuthZ["Authorization<br/>(Role-based Permissions)"]
        CORS["CORS Protection"]
        CSRF["CSRF Protection"]
        Input["Input Validation"]
        Output["Output Sanitization"]
    end
    
    Request["Client Request"] --> Transport
    Transport --> CORS
    CORS --> Auth
    Auth --> AuthZ
    AuthZ --> Input
    Input --> Processing["Request Processing"]
    Processing --> Output
    Output --> Response["Client Response"]
```

---

## User Roles & Permissions

```mermaid
graph TB
    subgraph "User Roles"
        Admin["Administrator"]
        Instructor["Instructor"]
        Student["Student"]
    end
    
    subgraph "Admin Permissions"
        AdminP1["Manage All Users"]
        AdminP2["Manage All Courses"]
        AdminP3["View System Analytics"]
        AdminP4["Configure System Settings"]
    end
    
    subgraph "Instructor Permissions"
        InstructorP1["Create/Edit Own Courses"]
        InstructorP2["Create Lessons & Assessments"]
        InstructorP3["View Student Progress"]
        InstructorP4["Grade Submissions"]
    end
    
    subgraph "Student Permissions"
        StudentP1["Enroll in Courses"]
        StudentP2["View Course Content"]
        StudentP3["Submit Assessments"]
        StudentP4["Track Own Progress"]
    end
    
    Admin --> AdminP1
    Admin --> AdminP2
    Admin --> AdminP3
    Admin --> AdminP4
    
    Instructor --> InstructorP1
    Instructor --> InstructorP2
    Instructor --> InstructorP3
    Instructor --> InstructorP4
    
    Student --> StudentP1
    Student --> StudentP2
    Student --> StudentP3
    Student --> StudentP4
```

---

## File Structure

### Backend Structure
```
backend/
├── api/
│   ├── analytics/          # Analytics & reporting
│   ├── assessments/        # Quizzes & tests
│   ├── authapi/           # Authentication & authorization
│   ├── courses/           # Course management
│   ├── lessons/           # Lesson content
│   ├── notifications/     # User notifications
│   ├── progress/          # Progress tracking
│   └── permissions.py     # Shared permissions
├── base/
│   ├── settings.py        # Django configuration
│   ├── urls.py           # URL routing
│   └── wsgi.py           # WSGI application
├── media/                 # Uploaded files
├── db.sqlite3            # SQLite database (dev)
├── manage.py             # Django management
├── requirements.txt      # Python dependencies
└── Dockerfile            # Docker configuration
```

### Frontend Structure
```
frontend/
├── app/                   # Next.js App Router
│   ├── analytics/        # Analytics dashboard
│   ├── courses/          # Course pages
│   ├── dashboard/        # User dashboard
│   ├── login/           # Login page
│   ├── progress/        # Progress tracking
│   └── layout.tsx       # Root layout
├── components/           # React components
│   ├── analytics-charts.tsx
│   ├── code-editor.tsx
│   ├── ui/              # Radix UI components
│   └── ...
├── contexts/            # React contexts
│   └── auth-context.tsx
├── lib/                 # Utilities
│   ├── api.ts          # API client
│   └── utils.ts        # Helper functions
├── types/              # TypeScript types
├── public/             # Static assets
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
├── tailwind.config.ts  # Tailwind config
└── Dockerfile          # Docker configuration
```

---

## Key Features Architecture

### 1. Course Management
- Create, read, update, delete courses
- Organize lessons within courses
- Attach assessments and coding exercises
- Track enrollment and progress

### 2. Learning Content Delivery
- Video lessons with playback
- Text-based content (Markdown support)
- Interactive coding exercises
- Multiple-choice assessments

### 3. Code Execution Environment
- Monaco editor integration
- Server-side code execution
- Test case validation
- Real-time feedback

### 4. Progress Tracking
- Lesson completion tracking
- Assessment scores
- Course progress percentage
- Learning analytics

### 5. Analytics & Reporting
- Student performance metrics
- Instructor dashboards
- System-wide analytics
- Progress visualization

### 6. Authentication & Security
- JWT-based authentication
- Two-factor authentication (2FA)
- Role-based access control
- Session management

---

## Performance Considerations

### Current Implementation
- SQLite for development (single-file database)
- Django development server (single-threaded)
- Next.js development mode (hot reload)
- No caching layer
- Direct file storage

### Production Recommendations
- PostgreSQL with connection pooling
- Gunicorn with multiple workers
- Next.js production build (optimized)
- Redis for caching and sessions
- CDN for static assets
- Object storage for media files

---

## Scalability Strategy

```mermaid
graph LR
    subgraph "Horizontal Scaling"
        LB["Load Balancer"]
        App1["App Server 1"]
        App2["App Server 2"]
        App3["App Server N"]
        
        LB --> App1
        LB --> App2
        LB --> App3
    end
    
    subgraph "Database Scaling"
        Primary[("Primary DB<br/>(Write)")]
        Replica1[("Replica 1<br/>(Read)")]
        Replica2[("Replica 2<br/>(Read)")]
        
        Primary --> Replica1
        Primary --> Replica2
    end
    
    App1 --> Primary
    App2 --> Primary
    App3 --> Primary
    
    App1 --> Replica1
    App2 --> Replica2
    App3 --> Replica1
```

---

**Built for the Africa Sustainable Classroom Challenge**  
**Architecture Version**: 1.0  
**Last Updated**: 2026-01-15

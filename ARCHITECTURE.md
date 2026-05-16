# School Counselor AI Platform - Architecture

## System Overview

A modern, scalable, AI-powered school counseling platform designed for deployment on Google Cloud and on-premises environments.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Users (Browser)                           │
│          (Students, Counselors, Admins)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
        ▼                                 ▼
   ┌─────────────┐                  ┌──────────────┐
   │   Frontend  │                  │   Nginx      │
   │  (React)    │                  │  (Reverse    │
   │  Port 3000  │                  │   Proxy)     │
   └─────────────┘                  └──────┬───────┘
        │                                  │
        └──────────────┬───────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │   Backend API (NestJS)       │
        │   Port 3001                  │
        │  ┌────────────────────────┐  │
        │  │ - Auth Module          │  │
        │  │ - Users Module         │  │
        │  │ - Counseling Module    │  │
        │  │ - Appointments Module  │  │
        │  │ - AI Module            │  │
        │  │ - Analytics Module     │  │
        │  └────────────────────────┘  │
        └──────────────┬────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
   ┌──────────────┐          ┌────────────────┐
   │ PostgreSQL   │          │ OpenAI/LLM API │
   │ Database     │          │ (External)     │
   │ Port 5432    │          │                │
   └──────────────┘          └────────────────┘
```

## Technology Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT + Passport
- **ORM**: TypeORM
- **Validation**: Class-validator, Joi
- **API Documentation**: Swagger (optional)

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios
- **UI Components**: Lucide Icons

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL 15
- **Web Server**: Nginx (production)
- **Deployment**: Google Cloud Run / GKE / On-premises Docker

## Core Modules

### 1. Authentication Module
- JWT token generation and validation
- User registration with role-based validation
- Password hashing with bcrypt
- Protected routes with guards

### 2. Users Module
- User profile management
- Role-based access control (RBAC)
- User filtering by role
- Profile updates

### 3. Counseling Module
- Session creation and management
- AI-powered message handling
- Conversation history tracking
- Session completion and archiving

### 4. Appointments Module
- Appointment scheduling
- Status management (scheduled, confirmed, cancelled, completed)
- Counselor assignment
- Session notes

### 5. AI Module
- LLM integration (OpenAI/Anthropic)
- Sentiment analysis
- Topic extraction
- Context-aware responses
- Conversation management

### 6. Analytics Module
- Dashboard statistics
- Student progress tracking
- Counselor performance metrics
- Monthly trends
- Session analytics

## Database Schema

### Users Table
```sql
- id (UUID, PK)
- email (VARCHAR, UNIQUE)
- password (VARCHAR, hashed)
- firstName (VARCHAR)
- lastName (VARCHAR)
- role (ENUM: admin, counselor, student)
- schoolId (VARCHAR, nullable)
- isActive (BOOLEAN)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

### CounselingSession Table
```sql
- id (UUID, PK)
- studentId (UUID, FK)
- counselorId (UUID, FK, nullable)
- summary (TEXT, nullable)
- status (ENUM: active, completed, archived)
- aiContext (JSONB, nullable)
- goals (TEXT[], nullable)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

### SessionMessage Table
```sql
- id (UUID, PK)
- sessionId (UUID, FK)
- role (ENUM: user, ai, system)
- content (TEXT)
- metadata (JSONB, nullable)
- createdAt (TIMESTAMP)
```

### Appointment Table
```sql
- id (UUID, PK)
- studentId (UUID, FK)
- counselorId (UUID, FK)
- scheduledTime (TIMESTAMP)
- durationMinutes (INTEGER)
- status (ENUM: scheduled, confirmed, cancelled, completed, no_show)
- notes (TEXT, nullable)
- counselorNotes (TEXT, nullable)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

## Security Architecture

### Authentication Flow
1. User submits credentials
2. Backend validates and hashes password
3. JWT token generated with user metadata
4. Token stored in localStorage (client)
5. Token sent in Authorization header for protected routes

### Authorization
- Role-based access control (RBAC)
- Protected routes using JwtAuthGuard
- Permission checks at service level

### Data Protection
- Password hashing with bcrypt
- Environment variables for secrets
- CORS configuration
- SQL injection prevention via ORM
- XSS protection via React

## Deployment Architecture

### Local Development
```
Docker Compose (dev)
├── PostgreSQL
├── NestJS Backend
├── React Frontend (dev server)
└── Volumes for hot-reload
```

### Production
```
Docker Compose (prod) / GKE
├── PostgreSQL (managed)
├── NestJS Backend (scaled)
├── React Frontend (Nginx)
├── Nginx Reverse Proxy
└── SSL/TLS Configuration
```

### Google Cloud Run
```
Cloud Run Services
├── school-counselor-api (NestJS)
├── school-counselor-web (React)
├── Cloud SQL (PostgreSQL)
└── Cloud Load Balancer
```

### Google Kubernetes Engine
```
GKE Cluster
├── Deployments
│  ├── Backend Pod (scalable)
│  └── Frontend Pod (scalable)
├── Services
│  ├── Backend Service (ClusterIP)
│  └── Frontend Service (LoadBalancer)
├── ConfigMaps (env vars)
├── Secrets (API keys)
└── Persistent Volumes (DB)
```

## Performance Considerations

1. **Database Indexing**
   - Index on studentId, counselorId
   - Index on createdAt for time-based queries

2. **Caching**
   - Frontend: React Query (optional)
   - Backend: Redis (optional)

3. **API Optimization**
   - Pagination for list endpoints
   - Relationship lazy loading
   - Response compression

4. **Frontend Optimization**
   - Code splitting
   - Lazy loading components
   - Image optimization

## Scalability

- Stateless backend design
- Horizontal scaling with load balancer
- Database connection pooling
- Session management via JWT
- Distributed caching (optional)

## Monitoring & Logging

- Application logs: stdout/stderr
- Docker logging drivers
- GCP Cloud Logging integration
- Performance metrics with APM
- Error tracking (Sentry optional)

## CI/CD Pipeline

```
Git Push
  ↓
GitHub Actions / GCP Cloud Build
  ├── Unit Tests
  ├── Lint & Type Check
  ├── Build Docker Images
  ├── Push to Registry
  └── Deploy to Cloud
```

## Future Enhancements

- [ ] Video counseling sessions (WebRTC)
- [ ] Mobile app (React Native)
- [ ] Advanced AI features (sentiment analysis, risk detection)
- [ ] Integration with school management systems
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Resource library with media
- [ ] Appointment reminders (SMS/Email)

# School Counselor AI Platform - Local Development Guide

## Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for development without Docker)
- Git

## Quick Start with Docker

1. **Setup environment**
   ```bash
   cp .env.prod.example .env
   # Edit .env with your configuration
   ```

2. **Start services**
   ```bash
   docker-compose up -d
   ```

3. **Access application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database: localhost:5432

4. **Check logs**
   ```bash
   docker-compose logs -f
   ```

5. **Stop services**
   ```bash
   docker-compose down
   ```

## Local Development Setup

### Backend Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure database**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Run migrations**
   ```bash
   npm run migrate
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

Server runs on http://localhost:3001

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure API**
   ```bash
   cp .env.example .env
   ```

3. **Start dev server**
   ```bash
   npm run dev
   ```

Application runs on http://localhost:3000

## Production Deployment

### Google Cloud Run

**Backend Deployment:**
```bash
gcloud run deploy school-counselor-api \
  --source backend \
  --platform managed \
  --region us-central1 \
  --set-env-vars DATABASE_HOST=CLOUDSQL_INSTANCE,OPENAI_API_KEY=YOUR_KEY
```

**Frontend Deployment:**
```bash
gcloud run deploy school-counselor-web \
  --source frontend \
  --platform managed \
  --region us-central1
```

### Google Kubernetes Engine (GKE)

1. **Create cluster**
   ```bash
   gcloud container clusters create school-counselor \
     --zone us-central1-a \
     --num-nodes 3
   ```

2. **Push images**
   ```bash
   docker build -t gcr.io/$PROJECT_ID/counselor-api backend/
   docker push gcr.io/$PROJECT_ID/counselor-api
   ```

3. **Deploy with kubectl**
   ```bash
   kubectl apply -f k8s/
   ```

### Docker Compose Production

1. **Prepare environment**
   ```bash
   cp .env.prod.example .env
   # Edit with production values
   ```

2. **Start stack**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Database Migrations

Create migration:
```bash
cd backend
npm run migration:generate -- -n MigrationName
```

Run migrations:
```bash
npm run migrate
```

Revert migration:
```bash
npm run migration:revert
```

## API Documentation

All API endpoints require JWT authentication (except /auth endpoints).

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Users
- `GET /users/profile` - Get current user profile
- `PUT /users/:id` - Update user
- `GET /users/counselors` - Get list of counselors

### Counseling
- `POST /counseling/sessions` - Create session
- `GET /counseling/sessions` - Get user sessions
- `POST /counseling/sessions/:id/messages` - Add message
- `GET /counseling/sessions/:id/messages` - Get session messages

### Appointments
- `POST /appointments` - Create appointment
- `GET /appointments` - Get user appointments
- `PUT /appointments/:id/cancel` - Cancel appointment

### Analytics
- `GET /analytics/dashboard` - Dashboard statistics
- `GET /analytics/student` - Student analytics
- `GET /analytics/counselor` - Counselor analytics

## Testing

Backend:
```bash
cd backend
npm run test
```

Frontend:
```bash
cd frontend
npm run test
```

## Troubleshooting

**Database connection failed:**
- Ensure PostgreSQL is running
- Check DATABASE_HOST and credentials in .env

**API not responding:**
- Verify backend service is running
- Check CORS settings

**Frontend won't load:**
- Clear browser cache
- Check VITE_API_URL configuration

## Support & Issues

- Report bugs via GitHub Issues
- Check existing documentation in /docs
- Review API logs: `docker-compose logs backend`

## License

MIT License - See LICENSE file

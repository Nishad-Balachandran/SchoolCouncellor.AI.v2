# School Counselor AI Platform - Copilot Instructions

## Project Overview
Enterprise-grade School Counselor Agentic AI Platform with:
- Multi-role authentication (Students, Counselors, Admins)
- AI-powered counseling chat interface
- Appointment scheduling & session management
- Lightweight & locally deployable
- Google Cloud compatible
- Docker containerized

## Tech Stack
- **Backend**: NestJS + TypeScript
- **Frontend**: React + TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT + OAuth2
- **Deployment**: Docker + Docker Compose
- **Cloud**: Google Cloud Run / GKE ready

## Key Directories
- `/backend` - NestJS API server
- `/frontend` - React web application
- `/docker` - Docker configuration files
- `/docs` - Project documentation

## Development Workflow
1. Backend: `npm run dev` from backend directory
2. Frontend: `npm run dev` from frontend directory
3. Database: `docker-compose up` for local PostgreSQL
4. Deployment: `docker-compose -f docker-compose.prod.yml up`

## Important Configuration Files
- `.env.example` - Environment variables template
- `docker-compose.yml` - Local development
- `docker-compose.prod.yml` - Production deployment
- `Dockerfile` files in backend/ and frontend/

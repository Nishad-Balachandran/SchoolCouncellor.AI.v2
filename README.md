# 🎓 School Counselor AI Platform

A futuristic, agentic AI-powered school counseling platform accessible via web to students, counselors, and administrators.

## 🌟 Features

### For Students
- 🤖 AI-powered counseling chat with context awareness
- 📅 Appointment scheduling with counselors
- 📋 Personal progress tracking & goals
- 📚 Resource library & educational content
- 🔐 Secure session management

### For Counselors
- 📊 Student dashboard & case management
- 💬 AI-assisted interview insights
- 📈 Analytics & progress tracking
- 📝 Session notes & recommendations
- 🔔 Appointment management

### For Administrators
- 👥 User management & role-based access
- 📊 Platform analytics & reporting
- ⚙️ System configuration & settings
- 🔒 Security & compliance controls
- 📦 Backup & data management

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for development)
- PostgreSQL 14+ (included in Docker)

### Local Installation

```bash
# Clone and setup
git clone <repo>
cd SchoolCouncellorAI

# Start with Docker Compose
docker-compose up -d

# Access application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Database: localhost:5432
```

### Development Setup

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
SchoolCouncellorAI/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── counseling/     # Counseling sessions
│   │   ├── appointments/   # Appointment scheduling
│   │   ├── ai/             # AI integration
│   │   ├── analytics/      # Analytics & reporting
│   │   └── common/         # Shared utilities
│   └── docker/
├── frontend/               # React web application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # Context API
│   │   ├── services/      # API services
│   │   └── styles/        # Tailwind CSS
│   └── Dockerfile
├── docs/                   # Documentation
├── docker-compose.yml      # Local development
└── docker-compose.prod.yml # Production
```

## 🔐 Authentication

- JWT-based authentication
- Role-based access control (RBAC)
- OAuth2 integration ready
- Secure password hashing

## 🤖 AI Integration

- LLM API integration (OpenAI, Anthropic, local LLMs)
- Context-aware counseling conversations
- Session-based memory management
- Configurable AI parameters

## 📦 Deployment

### Local Docker
```bash
docker-compose up -d
```

### Google Cloud Run
```bash
# Backend
gcloud run deploy school-counselor-api \
  --source backend \
  --platform managed \
  --region us-central1

# Frontend
gcloud run deploy school-counselor-web \
  --source frontend \
  --platform managed \
  --region us-central1
```

### Google Kubernetes Engine (GKE)
```bash
# Push images to Google Container Registry
docker build -t gcr.io/$PROJECT_ID/counselor-api backend/
docker push gcr.io/$PROJECT_ID/counselor-api

# Deploy with provided Helm charts or kubectl
kubectl apply -f k8s/
```

## 🔧 Configuration

Create `.env` file in root:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=school_counselor
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=24h

# AI Integration
OPENAI_API_KEY=your-api-key-here
AI_MODEL=gpt-4

# Environment
NODE_ENV=development
```

## 📊 Database Schema

Key entities:
- **Users**: Students, Counselors, Admins with role-based access
- **Sessions**: Counseling sessions with AI integration
- **Appointments**: Scheduled meetings
- **Goals**: Student goals and progress tracking
- **Notes**: Session notes and recommendations
- **Analytics**: Platform metrics and insights

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit pull request

## 📝 Documentation

See [docs/](docs/) for:
- API Documentation
- Architecture Guide
- Deployment Guide
- Configuration Guide

## 📄 License

MIT License - See LICENSE file for details

## 🆘 Support

- 📧 Email: support@schoolcounselor.ai
- 🐛 Issues: GitHub Issues
- 💬 Discussions: GitHub Discussions

## 🎯 Roadmap

- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Integration with school management systems
- [ ] Multi-language support
- [ ] Advanced AI features (sentiment analysis, risk detection)
- [ ] Video counseling sessions

---

Built with ❤️ for education

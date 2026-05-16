# School Counselor AI Platform - Quick Start

## 🚀 Get Started in 5 Minutes

### Option 1: Docker Compose (Recommended)

**1. Clone and setup**
```bash
cd SchoolCouncellorAI
cp .env.prod.example .env
```

**2. Start everything**
```bash
docker-compose up -d
```

**3. Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Database: localhost:5432

**4. Login with demo credentials**
```
Email: student@school.com
Password: password123
```

### Option 2: Local Development

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

**Frontend (new terminal):**
```bash
cd frontend
npm install
npm run dev
```

## 📋 System Requirements

- Docker & Docker Compose (for Option 1)
- OR Node.js 18+ & PostgreSQL (for Option 2)

## 🎯 Key Features

✅ AI-powered counseling chat  
✅ Appointment scheduling  
✅ Student progress tracking  
✅ Role-based access (Student, Counselor, Admin)  
✅ Analytics dashboard  
✅ Cloud-ready (Google Cloud)  
✅ Lightweight & scalable  

## 📁 Project Structure

```
backend/           → NestJS API
frontend/          → React Web App
docker-compose.yml → Local development
DEPLOYMENT.md      → Deployment guide
API.md             → API documentation
ARCHITECTURE.md    → System design
```

## 🔐 User Roles

### Student
- Start AI counseling sessions
- Schedule appointments with counselors
- View personal progress
- Access resource library

### Counselor
- Review student sessions
- Manage appointments
- Add notes and recommendations
- View analytics for assigned students

### Admin
- Manage all users
- System configuration
- View platform analytics
- Manage resources

## 🔧 Configuration

Edit `.env` file before running:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=school_counselor
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h

# AI Integration
OPENAI_API_KEY=your-api-key-here
AI_MODEL=gpt-3.5-turbo
```

## 📊 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Student | student@school.com | password123 |
| Counselor | counselor@school.com | password123 |
| Admin | admin@school.com | password123 |

## 🐛 Troubleshooting

**Port already in use?**
```bash
# Change ports in docker-compose.yml or frontend/vite.config.ts
```

**Database connection error?**
```bash
# Ensure PostgreSQL is running and credentials are correct
docker-compose logs postgres
```

**Frontend can't connect to API?**
```bash
# Check VITE_API_URL in frontend/.env
# Should be http://localhost:3001 for local dev
```

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT.md)
- [API Reference](API.md)
- [Architecture](ARCHITECTURE.md)
- [Main README](README.md)

## ✨ Next Steps

1. ✅ Start the application
2. ✅ Login with demo credentials
3. ✅ Create a counseling session
4. ✅ Schedule an appointment
5. ✅ View your analytics
6. ✅ Configure for your school
7. ✅ Deploy to Google Cloud

## 🆘 Need Help?

- Check [DEPLOYMENT.md](DEPLOYMENT.md) for setup issues
- Review [API.md](API.md) for API questions
- See [ARCHITECTURE.md](ARCHITECTURE.md) for technical details

## 📄 License

MIT License - See LICENSE file

---

**Built for education with ❤️**

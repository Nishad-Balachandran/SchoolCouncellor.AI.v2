# Troubleshooting Guide

## Common Issues & Solutions

### 🔴 Database Connection Issues

**Problem**: "Connection refused to postgres"

**Solutions**:
1. Check PostgreSQL is running:
   ```bash
   docker-compose ps
   ```

2. Verify database credentials in `.env`:
   ```
   DATABASE_HOST=postgres
   DATABASE_PORT=5432
   DATABASE_NAME=school_counselor
   ```

3. Rebuild and restart:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

4. Check logs:
   ```bash
   docker-compose logs postgres
   ```

---

### 🔴 Port Already in Use

**Problem**: Port 3000 or 3001 already in use

**Solutions**:
1. Check what's using the port:
   ```bash
   lsof -i :3000
   lsof -i :3001
   ```

2. Kill the process:
   ```bash
   kill -9 <PID>
   ```

3. Or change ports in:
   - `docker-compose.yml`
   - `frontend/vite.config.ts`

---

### 🔴 Backend Won't Start

**Problem**: NestJS backend failing to start

**Solutions**:
1. Check logs:
   ```bash
   docker-compose logs backend
   ```

2. Clear and rebuild:
   ```bash
   docker-compose down
   rm -rf backend/dist backend/node_modules
   docker-compose up -d
   ```

3. Verify Node modules installed:
   ```bash
   cd backend && npm install
   ```

---

### 🔴 Frontend Won't Load

**Problem**: "Cannot GET /" on frontend

**Solutions**:
1. Check if frontend is running:
   ```bash
   docker-compose ps
   ```

2. Clear browser cache (Ctrl+Shift+Delete)

3. Check console for errors (F12)

4. Verify API URL in frontend `.env`:
   ```
   VITE_API_URL=http://localhost:3001
   ```

---

### 🔴 API Connection from Frontend

**Problem**: "Failed to fetch" or CORS errors

**Solutions**:
1. Check backend is running:
   ```bash
   curl http://localhost:3001/health
   ```

2. Check CORS settings in `backend/src/main.ts`:
   ```typescript
   app.enableCors({
     origin: 'http://localhost:3000'
   });
   ```

3. Check API URL in frontend `.env`

4. Check browser console for exact error

---

### 🔴 Docker Build Failure

**Problem**: Docker build fails

**Solutions**:
1. Check Docker is running:
   ```bash
   docker --version
   ```

2. Clean up Docker:
   ```bash
   docker system prune -a
   ```

3. Rebuild:
   ```bash
   docker-compose build --no-cache
   ```

4. Check logs:
   ```bash
   docker-compose build --no-cache 2>&1 | tail -20
   ```

---

### 🟡 Slow Startup

**Problem**: Containers take too long to start

**Solutions**:
1. Check system resources (CPU, RAM)
2. Look at logs for bottlenecks
3. Ensure SSD (not HDD)
4. Close unnecessary applications

---

### 🟡 Database Migrations

**Problem**: "Migration failed"

**Solutions**:
1. Check migration files in `backend/src/migrations`
2. Verify database schema
3. Run migrations manually:
   ```bash
   cd backend
   npm run migrate
   ```

---

### 🟡 OpenAI API Issues

**Problem**: "Invalid API key" or no AI responses

**Solutions**:
1. Verify API key in `.env`:
   ```
   OPENAI_API_KEY=sk-...
   ```

2. Check API key is valid at openai.com

3. Check rate limits and credits

4. Review API response in logs:
   ```bash
   docker-compose logs backend | grep -i "openai\|api"
   ```

---

### 🟡 Login Issues

**Problem**: "Invalid credentials"

**Solutions**:
1. Check user exists in database
2. Try demo credentials:
   - student@school.com / password123
   - counselor@school.com / password123

3. Password might be wrong - try registering new user

---

### 🔵 Performance Issues

**Problem**: App is slow or unresponsive

**Solutions**:
1. Check database queries:
   ```
   Set logging: true in database.config.ts
   ```

2. Monitor system resources:
   ```bash
   docker stats
   ```

3. Check network latency:
   ```bash
   curl -w "@curl-format.txt" http://localhost:3001/health
   ```

---

### 🔵 Permissions Issues

**Problem**: "Permission denied" errors

**Solutions**:
1. Run with sudo if needed (not recommended)
2. Check Docker daemon is running
3. Add user to docker group:
   ```bash
   sudo usermod -aG docker $USER
   ```

---

## Reset Everything

If things are broken beyond repair:

```bash
# Stop all containers
docker-compose down -v

# Remove all data
rm -rf backend/node_modules frontend/node_modules

# Clean Docker
docker system prune -a --volumes

# Start fresh
docker-compose up -d --build
```

---

## Logs & Debugging

### View Real-Time Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### View Full Logs
```bash
# Backend
docker-compose logs backend > backend.log

# Frontend
docker-compose logs frontend > frontend.log
```

### Inside Container
```bash
# Access backend shell
docker exec -it school-counselor-api sh

# Access frontend shell
docker exec -it school-counselor-web sh

# Access database
docker exec -it school-counselor-db psql -U postgres
```

---

## Testing Connectivity

```bash
# Test API endpoint
curl http://localhost:3001/health

# Test database
docker exec school-counselor-db pg_isready

# Test frontend
curl http://localhost:3000

# Test all ports
netstat -tuln | grep -E "3000|3001|5432"
```

---

## Common Error Messages

### "ENOENT: no such file or directory"
- File/folder not found
- Solution: Create missing directories or check paths

### "EADDRINUSE: address already in use"
- Port is already occupied
- Solution: Kill process using the port or change port

### "ECONNREFUSED: connection refused"
- Service not running
- Solution: Start the service and wait for it to be ready

### "CORS error in console"
- Frontend can't talk to backend
- Solution: Check CORS settings and API URL

### "TypeScript error: Cannot find module"
- Missing dependency
- Solution: Run `npm install`

---

## Best Practices

1. **Always check logs first**
   ```bash
   docker-compose logs <service>
   ```

2. **Restart services if stuck**
   ```bash
   docker-compose restart
   ```

3. **Keep Docker updated**
   ```bash
   docker --version
   ```

4. **Monitor resources**
   ```bash
   docker stats
   ```

5. **Regular backups**
   - Backup database regularly
   - Version control code

---

## When to Seek Help

If issues persist after trying these solutions:

1. Check [API.md](API.md) for endpoint reference
2. Review [ARCHITECTURE.md](ARCHITECTURE.md) for system design
3. Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment info
4. Review logs carefully for specific error messages
5. Check GitHub issues for similar problems
6. Create an issue with:
   - Exact error message
   - Steps to reproduce
   - Docker version
   - OS and system specs
   - Relevant logs

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Vite Documentation](https://vitejs.dev/)

---

**Last Updated**: January 2024  
**Maintained By**: School Counselor AI Team

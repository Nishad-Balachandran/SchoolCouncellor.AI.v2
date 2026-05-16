# API Reference

## Base URL
```
http://localhost:3001
```

## Authentication
All endpoints except `/auth/*` require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@school.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student" // optional: admin, counselor, student
}

Response 201:
{
  "user": {
    "id": "uuid",
    "email": "user@school.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student"
  },
  "token": "eyJhbGc..."
}
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@school.com",
  "password": "password123"
}

Response 200:
{
  "user": { ... },
  "token": "eyJhbGc..."
}
```

---

## Users Endpoints

### Get Profile
```
GET /users/profile
Authorization: Bearer <token>

Response 200:
{
  "id": "uuid",
  "email": "user@school.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Get Counselors List
```
GET /users/counselors
Authorization: Bearer <token>

Response 200:
[
  {
    "id": "uuid",
    "email": "counselor@school.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "counselor"
  },
  ...
]
```

### Update Profile
```
PUT /users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jonathan",
  "lastName": "Doe"
}

Response 200:
{ updated user object }
```

---

## Counseling Endpoints

### Create Session
```
POST /counseling/sessions
Authorization: Bearer <token>

Response 201:
{
  "id": "session-uuid",
  "studentId": "user-uuid",
  "status": "active",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Get Sessions
```
GET /counseling/sessions
Authorization: Bearer <token>

Response 200:
[
  {
    "id": "session-uuid",
    "studentId": "user-uuid",
    "status": "active",
    "messages": [ ... ],
    "createdAt": "2024-01-01T00:00:00Z"
  },
  ...
]
```

### Get Session Detail
```
GET /counseling/sessions/:sessionId
Authorization: Bearer <token>

Response 200:
{
  "id": "session-uuid",
  "studentId": "user-uuid",
  "status": "active",
  "messages": [ ... ],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Add Message to Session
```
POST /counseling/sessions/:sessionId/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "I'm feeling stressed about exams"
}

Response 201:
{
  "userMessage": {
    "id": "msg-uuid",
    "sessionId": "session-uuid",
    "role": "user",
    "content": "I'm feeling stressed about exams",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "aiMessage": {
    "id": "msg-uuid",
    "sessionId": "session-uuid",
    "role": "ai",
    "content": "I understand exam stress is challenging...",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Get Session Messages
```
GET /counseling/sessions/:sessionId/messages
Authorization: Bearer <token>

Response 200:
[
  {
    "id": "msg-uuid",
    "role": "user",
    "content": "...",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  ...
]
```

### Complete Session
```
POST /counseling/sessions/:sessionId/complete
Authorization: Bearer <token>
Content-Type: application/json

{
  "summary": "Discussed exam anxiety and coping strategies"
}

Response 200:
{
  "id": "session-uuid",
  "status": "completed",
  "summary": "Discussed exam anxiety and coping strategies"
}
```

---

## Appointments Endpoints

### Create Appointment
```
POST /appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "counselorId": "counselor-uuid",
  "scheduledTime": "2024-01-15T14:00:00Z"
}

Response 201:
{
  "id": "apt-uuid",
  "studentId": "student-uuid",
  "counselorId": "counselor-uuid",
  "scheduledTime": "2024-01-15T14:00:00Z",
  "status": "scheduled",
  "durationMinutes": 60,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Get Appointments
```
GET /appointments
Authorization: Bearer <token>

Response 200:
[
  {
    "id": "apt-uuid",
    "studentId": "student-uuid",
    "counselorId": "counselor-uuid",
    "scheduledTime": "2024-01-15T14:00:00Z",
    "status": "scheduled",
    "counselor": { ... },
    "createdAt": "2024-01-01T00:00:00Z"
  },
  ...
]
```

### Get Appointment Detail
```
GET /appointments/:id
Authorization: Bearer <token>

Response 200:
{
  "id": "apt-uuid",
  "studentId": "student-uuid",
  "counselorId": "counselor-uuid",
  "scheduledTime": "2024-01-15T14:00:00Z",
  "status": "scheduled",
  "student": { ... },
  "counselor": { ... }
}
```

### Cancel Appointment
```
PUT /appointments/:id/cancel
Authorization: Bearer <token>

Response 200:
{
  "id": "apt-uuid",
  "status": "cancelled"
}
```

### Complete Appointment
```
PUT /appointments/:id/complete
Authorization: Bearer <token>
Content-Type: application/json

{
  "counselorNotes": "Discussed college preparation strategies"
}

Response 200:
{
  "id": "apt-uuid",
  "status": "completed",
  "counselorNotes": "Discussed college preparation strategies"
}
```

---

## Analytics Endpoints

### Dashboard Statistics
```
GET /analytics/dashboard
Authorization: Bearer <token>

Response 200:
{
  "totalSessions": 42,
  "activeSessions": 5,
  "completedSessions": 37,
  "completionRate": "88.10"
}
```

### Student Analytics
```
GET /analytics/student
Authorization: Bearer <token>

Response 200:
{
  "studentId": "uuid",
  "totalSessions": 10,
  "completedSessions": 8,
  "activeSessions": 2,
  "completionRate": "80.00",
  "averageGoals": 3
}
```

### Counselor Analytics
```
GET /analytics/counselor
Authorization: Bearer <token>

Response 200:
{
  "counselorId": "uuid",
  "totalSessions": 45,
  "completedSessions": 42,
  "activeSessions": 3,
  "completionRate": "93.33"
}
```

### Monthly Trends
```
GET /analytics/trends
Authorization: Bearer <token>

Response 200:
{
  "2024-01": 12,
  "2024-02": 18,
  "2024-03": 25
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Invalid request data",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## Rate Limiting

Currently no rate limiting. Recommended for production:
- API: 100 requests/minute per user
- Auth endpoints: 5 attempts/minute per IP

---

## WebSocket Endpoints (Future)

For real-time counseling sessions:
```
WS ws://localhost:3001/counseling/sessions/:sessionId/live
```

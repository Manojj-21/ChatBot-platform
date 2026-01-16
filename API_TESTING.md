# API Testing Guide

## Base URL
```
http://localhost:8080/api
```

## 1. Authentication

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "userId": 1,
  "email": "test@example.com",
  "name": "Test User"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "userId": 1,
  "email": "test@example.com",
  "name": "Test User"
}
```

---

## 2. Projects

### Create Project
```http
POST /api/projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Customer Support Bot",
  "description": "AI assistant for customer inquiries"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Customer Support Bot",
  "description": "AI assistant for customer inquiries",
  "createdAt": "2024-01-15T10:30:00",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

### Get All Projects
```http
GET /api/projects
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Customer Support Bot",
    "description": "AI assistant for customer inquiries",
    "createdAt": "2024-01-15T10:30:00"
  }
]
```

### Get Project by ID
```http
GET /api/projects/1
Authorization: Bearer {token}
```

---

## 3. Prompts

### Create Prompt
```http
POST /api/prompts
Authorization: Bearer {token}
Content-Type: application/json

{
  "projectId": 1,
  "content": "You are a helpful customer support assistant. Be polite and professional."
}
```

**Response:**
```json
{
  "id": 1,
  "content": "You are a helpful customer support assistant. Be polite and professional.",
  "createdAt": "2024-01-15T10:35:00",
  "project": {
    "id": 1,
    "name": "Customer Support Bot"
  }
}
```

### Get Project Prompts
```http
GET /api/prompts/project/1
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "content": "You are a helpful customer support assistant. Be polite and professional.",
    "createdAt": "2024-01-15T10:35:00"
  }
]
```

---

## 4. Chat

### Send Message
```http
POST /api/chat
Authorization: Bearer {token}
Content-Type: application/json

{
  "projectId": 1,
  "message": "Hello, I need help with my order"
}
```

**Response:**
```json
{
  "response": "Hello! I'd be happy to help you with your order. Could you please provide me with your order number?"
}
```

### Get Chat History
```http
GET /api/chat/history/1
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "role": "user",
    "content": "Hello, I need help with my order",
    "createdAt": "2024-01-15T10:40:00"
  },
  {
    "id": 2,
    "role": "assistant",
    "content": "Hello! I'd be happy to help you with your order. Could you please provide me with your order number?",
    "createdAt": "2024-01-15T10:40:05"
  }
]
```

---

## cURL Examples

### Register
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Create Project
```bash
curl -X POST http://localhost:8080/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"My Bot","description":"Test bot"}'
```

### Send Chat Message
```bash
curl -X POST http://localhost:8080/api/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"projectId":1,"message":"Hello"}'
```

---

## Testing Workflow

1. **Register a new user**
2. **Save the token** from response
3. **Create a project** using the token
4. **Add system prompts** to the project
5. **Send chat messages** and verify responses
6. **Check chat history** to see conversation

---

## Error Responses

### 401 Unauthorized
```json
{
  "timestamp": "2024-01-15T10:40:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 400 Bad Request
```json
{
  "timestamp": "2024-01-15T10:40:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Email already exists"
}
```

### 404 Not Found
```json
{
  "timestamp": "2024-01-15T10:40:00",
  "status": 404,
  "error": "Not Found",
  "message": "Project not found"
}
```

# Chatbot Platform

A minimal, production-ready chatbot platform with user authentication, project management, and AI-powered chat capabilities.

## Features

- **Authentication**: JWT-based authentication with user registration and login
- **User Management**: Create and manage user accounts
- **Project/Agent Management**: Create multiple projects/agents per user
- **System Prompts**: Associate custom prompts with each project
- **AI Chat Interface**: Real-time chat using OpenAI API
- **Chat History**: Persistent conversation history per project
- **Responsive UI**: Clean, modern React interface

## Tech Stack

### Backend
- Spring Boot 3.2.0
- Spring Security with JWT
- Spring Data JPA
- H2 Database (dev) / PostgreSQL (prod)
- OpenAI API integration

### Frontend
- React 18
- Vite
- Axios
- React Router

## Prerequisites

- Java 17+
- Node.js 18+
- Maven 3.6+
- OpenAI API Key (optional for testing)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd chatbot-platform
```

### 2. Backend Setup

```bash
cd backend

# Set OpenAI API Key (optional)
# Windows
set OPENAI_API_KEY=your_api_key_here

# Linux/Mac
export OPENAI_API_KEY=your_api_key_here

# Run the application
mvn spring-boot:run
```

Backend will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will start on `http://localhost:3000`

## API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Projects

#### Create Project
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Chatbot",
  "description": "Customer support bot"
}
```

#### Get All Projects
```http
GET /api/projects
Authorization: Bearer <token>
```

#### Get Project by ID
```http
GET /api/projects/{id}
Authorization: Bearer <token>
```

### Prompts

#### Create Prompt
```http
POST /api/prompts
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": 1,
  "content": "You are a helpful customer support assistant."
}
```

#### Get Project Prompts
```http
GET /api/prompts/project/{projectId}
Authorization: Bearer <token>
```

### Chat

#### Send Message
```http
POST /api/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": 1,
  "message": "Hello, how can you help me?"
}
```

#### Get Chat History
```http
GET /api/chat/history/{projectId}
Authorization: Bearer <token>
```

## Configuration

### Backend Configuration (`application.properties`)

```properties
# Database
spring.datasource.url=jdbc:h2:mem:chatbotdb
spring.datasource.username=sa
spring.datasource.password=

# JWT
jwt.secret=your-secret-key
jwt.expiration=86400000

# OpenAI
openai.api.key=${OPENAI_API_KEY}
openai.api.url=https://api.openai.com/v1
```

### Production Database (PostgreSQL)

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/chatbotdb
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

## Deployment

### Backend Deployment

#### Build JAR
```bash
cd backend
mvn clean package
java -jar target/chatbot-platform-1.0.0.jar
```

#### Docker
```dockerfile
FROM openjdk:17-slim
COPY target/chatbot-platform-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Frontend Deployment

#### Build for Production
```bash
cd frontend
npm run build
```

Deploy the `dist` folder to any static hosting service (Netlify, Vercel, AWS S3, etc.)

## Environment Variables

### Backend
- `OPENAI_API_KEY`: Your OpenAI API key
- `JWT_SECRET`: Secret key for JWT signing
- `DATABASE_URL`: Database connection URL (for production)

### Frontend
- `VITE_API_URL`: Backend API URL (default: http://localhost:8080/api)

## Security Features

- Password encryption using BCrypt
- JWT-based stateless authentication
- CORS configuration for frontend access
- SQL injection prevention via JPA
- XSS protection via Spring Security

## Scalability Considerations

- Stateless JWT authentication enables horizontal scaling
- Database connection pooling for concurrent requests
- Async processing capability for chat responses
- Caching layer can be added for frequently accessed data
- Load balancer ready architecture

## Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Troubleshooting

### Backend won't start
- Check Java version: `java -version` (should be 17+)
- Verify port 8080 is available
- Check database connection

### Frontend won't connect to backend
- Verify backend is running on port 8080
- Check CORS configuration
- Verify API URL in frontend code

### OpenAI API errors
- Verify API key is set correctly
- Check API key has sufficient credits
- Ensure network can reach OpenAI servers

## Future Enhancements

- File upload support using OpenAI Files API
- Real-time chat using WebSockets
- Analytics dashboard
- Multi-language support
- Rate limiting
- API usage tracking
- Team collaboration features
- Custom model selection

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub.

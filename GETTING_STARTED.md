# Getting Started - Step by Step Guide

This guide will help you set up and run the Chatbot Platform from scratch.

## Prerequisites Installation

### 1. Install Java 17

**Windows:**
1. Download from https://adoptium.net/
2. Run installer
3. Verify: `java -version`

**Mac:**
```bash
brew install openjdk@17
```

**Linux:**
```bash
sudo apt update
sudo apt install openjdk-17-jdk
```

### 2. Install Maven

**Windows:**
1. Download from https://maven.apache.org/download.cgi
2. Extract to C:\Program Files\Maven
3. Add to PATH
4. Verify: `mvn -version`

**Mac:**
```bash
brew install maven
```

**Linux:**
```bash
sudo apt install maven
```

### 3. Install Node.js

**All Platforms:**
1. Download from https://nodejs.org/ (LTS version)
2. Run installer
3. Verify: `node -version` and `npm -version`

### 4. Get OpenAI API Key (Optional for testing)

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create new secret key
5. Copy and save it securely

## Project Setup

### Step 1: Clone or Download Project

**Option A: Git Clone**
```bash
git clone <repository-url>
cd chatbot-platform
```

**Option B: Download ZIP**
1. Download project ZIP
2. Extract to desired location
3. Open terminal in project folder

### Step 2: Configure Backend

1. **Navigate to backend**
```bash
cd backend
```

2. **Set OpenAI API Key (Optional)**

**Windows:**
```cmd
set OPENAI_API_KEY=your_api_key_here
```

**Mac/Linux:**
```bash
export OPENAI_API_KEY=your_api_key_here
```

3. **Verify Configuration**
- Open `src/main/resources/application.properties`
- Check database settings (H2 is default, no setup needed)

### Step 3: Start Backend

```bash
# From backend directory
mvn spring-boot:run
```

**Expected Output:**
```
Started ChatbotPlatformApplication in X seconds
```

**Verify Backend:**
- Open browser: http://localhost:8080
- Should see Whitelabel Error Page (this is normal)

### Step 4: Configure Frontend

1. **Open new terminal**

2. **Navigate to frontend**
```bash
cd frontend
```

3. **Install Dependencies**
```bash
npm install
```

This will take 2-3 minutes.

### Step 5: Start Frontend

```bash
npm run dev
```

**Expected Output:**
```
VITE ready in X ms
Local: http://localhost:3000
```

**Verify Frontend:**
- Open browser: http://localhost:3000
- Should see Login page

## First Use

### 1. Register Account

1. Click "Register" link
2. Fill in:
   - Name: Your Name
   - Email: test@example.com
   - Password: password123
3. Click "Register"
4. You'll be automatically logged in

### 2. Create First Project

1. Click "New Project"
2. Fill in:
   - Name: My First Bot
   - Description: Test chatbot
3. Click "Create"
4. Project appears in dashboard

### 3. Add System Prompt (Optional)

1. Click on your project
2. Click "System Prompts (0)"
3. Enter: "You are a helpful assistant"
4. Click "Add"

### 4. Start Chatting

1. Type message: "Hello, who are you?"
2. Click "Send"
3. Wait for AI response

**Note:** If OpenAI API key is not set, you'll see an error message. The app will still work for user management and project creation.

## Troubleshooting

### Backend Issues

**Problem: Port 8080 already in use**
```
Solution: Stop other applications using port 8080
Windows: netstat -ano | findstr :8080
Mac/Linux: lsof -i :8080
```

**Problem: Maven command not found**
```
Solution: Install Maven or use Maven wrapper
./mvnw spring-boot:run (Mac/Linux)
mvnw.cmd spring-boot:run (Windows)
```

**Problem: Java version error**
```
Solution: Ensure Java 17+ is installed
java -version
```

### Frontend Issues

**Problem: npm command not found**
```
Solution: Install Node.js from nodejs.org
```

**Problem: Port 3000 already in use**
```
Solution: Frontend will automatically use next available port
Or stop application using port 3000
```

**Problem: Cannot connect to backend**
```
Solution: 
1. Verify backend is running on port 8080
2. Check browser console for errors
3. Verify CORS settings in backend
```

### OpenAI Issues

**Problem: "OpenAI API key not configured"**
```
Solution: Set OPENAI_API_KEY environment variable
Restart backend after setting
```

**Problem: "Error calling OpenAI API"**
```
Solution:
1. Verify API key is correct
2. Check API key has credits
3. Verify internet connection
```

## Quick Commands Reference

### Backend
```bash
# Start backend
cd backend
mvn spring-boot:run

# Build JAR
mvn clean package

# Run tests
mvn test

# Clean build
mvn clean install
```

### Frontend
```bash
# Install dependencies
cd frontend
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

## Development Tips

### Hot Reload

**Backend:**
- Changes require restart
- Use Spring DevTools for auto-restart (optional)

**Frontend:**
- Changes auto-reload
- No restart needed

### Database Access

**H2 Console:**
1. Open: http://localhost:8080/h2-console
2. JDBC URL: `jdbc:h2:mem:chatbotdb`
3. Username: `sa`
4. Password: (leave empty)

### API Testing

**Using Browser:**
- Install REST Client extension (VS Code)
- Use API_TESTING.md examples

**Using cURL:**
```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123","name":"Test"}'
```

**Using Postman:**
1. Import API_TESTING.md examples
2. Set base URL: http://localhost:8080/api
3. Test endpoints

## Next Steps

### 1. Explore Features
- Create multiple projects
- Add different system prompts
- Test various chat scenarios

### 2. Customize
- Modify frontend styles
- Add new features
- Integrate other LLM providers

### 3. Deploy
- Follow DEPLOYMENT.md
- Choose hosting platform
- Set up production database

### 4. Learn More
- Read ARCHITECTURE.md
- Review code structure
- Check Spring Boot docs

## Common Workflows

### Daily Development

1. Start backend: `cd backend && mvn spring-boot:run`
2. Start frontend: `cd frontend && npm run dev`
3. Make changes
4. Test in browser
5. Commit changes

### Testing Changes

1. Test backend: `cd backend && mvn test`
2. Test API: Use Postman or cURL
3. Test frontend: Manual testing in browser
4. Check browser console for errors

### Preparing for Demo

1. Clean database: Restart backend
2. Create demo account
3. Create sample projects
4. Prepare chat scenarios
5. Test all features

## Getting Help

### Documentation
- README.md - Overview
- ARCHITECTURE.md - System design
- DEPLOYMENT.md - Deployment guide
- API_TESTING.md - API reference

### Debugging
1. Check backend logs in terminal
2. Check frontend console (F12)
3. Verify environment variables
4. Test API endpoints directly

### Resources
- Spring Boot: https://spring.io/guides
- React: https://react.dev
- OpenAI: https://platform.openai.com/docs

## Success Checklist

- [ ] Java 17+ installed
- [ ] Maven installed
- [ ] Node.js installed
- [ ] Backend starts successfully
- [ ] Frontend starts successfully
- [ ] Can register user
- [ ] Can create project
- [ ] Can send chat message (with API key)
- [ ] Can view chat history

## Congratulations! 🎉

You've successfully set up the Chatbot Platform. Start building your AI-powered chatbots!

For questions or issues, refer to the documentation or open a GitHub issue.

---

**Happy Coding!** 🚀

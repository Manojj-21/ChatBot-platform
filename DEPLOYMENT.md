# Deployment Guide

This guide covers deploying the Chatbot Platform to various hosting providers.

## Table of Contents
1. [Backend Deployment](#backend-deployment)
2. [Frontend Deployment](#frontend-deployment)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Backend Deployment

### Option 1: Heroku

#### Prerequisites
- Heroku account
- Heroku CLI installed

#### Steps

1. **Create Heroku App**
```bash
cd backend
heroku create chatbot-platform-api
```

2. **Add PostgreSQL**
```bash
heroku addons:create heroku-postgresql:mini
```

3. **Set Environment Variables**
```bash
heroku config:set OPENAI_API_KEY=your_api_key
heroku config:set JWT_SECRET=your_jwt_secret
```

4. **Update application.properties for Production**
```properties
spring.datasource.url=${DATABASE_URL}
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
```

5. **Deploy**
```bash
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

6. **Verify**
```bash
heroku logs --tail
heroku open
```

### Option 2: Railway

1. **Connect GitHub Repository**
   - Go to railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"

2. **Configure Build**
   - Root directory: `/backend`
   - Build command: `mvn clean package -DskipTests`
   - Start command: `java -jar target/chatbot-platform-1.0.0.jar`

3. **Add PostgreSQL**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway auto-configures DATABASE_URL

4. **Set Environment Variables**
   - OPENAI_API_KEY
   - JWT_SECRET
   - PORT=8080

5. **Deploy**
   - Railway auto-deploys on git push

### Option 3: AWS Elastic Beanstalk

1. **Install EB CLI**
```bash
pip install awsebcli
```

2. **Initialize EB**
```bash
cd backend
eb init -p java-17 chatbot-platform
```

3. **Create Environment**
```bash
eb create chatbot-platform-env
```

4. **Configure Environment Variables**
```bash
eb setenv OPENAI_API_KEY=your_api_key JWT_SECRET=your_secret
```

5. **Deploy**
```bash
mvn clean package
eb deploy
```

### Option 4: Docker + Any Cloud Provider

1. **Create Dockerfile**
```dockerfile
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/chatbot-platform-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

2. **Build Image**
```bash
docker build -t chatbot-platform-backend .
```

3. **Run Locally**
```bash
docker run -p 8080:8080 \
  -e OPENAI_API_KEY=your_key \
  -e JWT_SECRET=your_secret \
  chatbot-platform-backend
```

4. **Deploy to Cloud**
   - Push to Docker Hub / AWS ECR / Google Container Registry
   - Deploy to ECS / Cloud Run / Kubernetes

---

## Frontend Deployment

### Option 1: Vercel

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Update API URL**
Create `.env.production`:
```
VITE_API_URL=https://your-backend-url.com/api
```

3. **Deploy**
```bash
cd frontend
vercel --prod
```

### Option 2: Netlify

1. **Build Project**
```bash
cd frontend
npm run build
```

2. **Deploy via Netlify CLI**
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

3. **Or Deploy via UI**
   - Drag and drop `dist` folder to netlify.app

4. **Configure Environment**
   - Site settings → Environment variables
   - Add `VITE_API_URL`

### Option 3: AWS S3 + CloudFront

1. **Build**
```bash
npm run build
```

2. **Create S3 Bucket**
```bash
aws s3 mb s3://chatbot-platform-frontend
```

3. **Upload Files**
```bash
aws s3 sync dist/ s3://chatbot-platform-frontend --acl public-read
```

4. **Enable Static Website Hosting**
```bash
aws s3 website s3://chatbot-platform-frontend --index-document index.html
```

5. **Create CloudFront Distribution**
   - Origin: S3 bucket
   - Default root object: index.html
   - Error pages: 404 → /index.html (for SPA routing)

### Option 4: GitHub Pages

1. **Update vite.config.js**
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/chatbot-platform/'
})
```

2. **Build**
```bash
npm run build
```

3. **Deploy**
```bash
npm i -g gh-pages
gh-pages -d dist
```

---

## Database Setup

### PostgreSQL on Heroku
```bash
heroku addons:create heroku-postgresql:mini
```

### PostgreSQL on Railway
- Automatically provisioned
- Connection string in DATABASE_URL

### AWS RDS PostgreSQL

1. **Create RDS Instance**
```bash
aws rds create-db-instance \
  --db-instance-identifier chatbot-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password your_password \
  --allocated-storage 20
```

2. **Update Backend Configuration**
```properties
spring.datasource.url=jdbc:postgresql://your-rds-endpoint:5432/chatbotdb
spring.datasource.username=admin
spring.datasource.password=your_password
```

### Supabase PostgreSQL

1. Create project at supabase.com
2. Get connection string from project settings
3. Update backend configuration

---

## Environment Configuration

### Backend Environment Variables

**Required**:
- `OPENAI_API_KEY`: Your OpenAI API key
- `JWT_SECRET`: Secret for JWT signing (min 32 characters)

**Optional**:
- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (default: 8080)
- `CORS_ALLOWED_ORIGINS`: Comma-separated frontend URLs

### Frontend Environment Variables

**Required**:
- `VITE_API_URL`: Backend API URL

**Example `.env.production`**:
```
VITE_API_URL=https://api.chatbot-platform.com/api
```

---

## Complete Deployment Example (Heroku + Vercel)

### 1. Deploy Backend to Heroku

```bash
# Navigate to backend
cd backend

# Login to Heroku
heroku login

# Create app
heroku create chatbot-platform-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set OPENAI_API_KEY=sk-...
heroku config:set JWT_SECRET=your-long-secret-key-here
heroku config:set CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app

# Deploy
git init
git add .
git commit -m "Deploy backend"
heroku git:remote -a chatbot-platform-api
git push heroku main

# Get backend URL
heroku info
```

### 2. Deploy Frontend to Vercel

```bash
# Navigate to frontend
cd ../frontend

# Create .env.production
echo "VITE_API_URL=https://chatbot-platform-api.herokuapp.com/api" > .env.production

# Update CORS in backend
# Add Vercel URL to CORS_ALLOWED_ORIGINS

# Deploy
vercel --prod
```

### 3. Update CORS

```bash
# Add Vercel URL to backend CORS
heroku config:set CORS_ALLOWED_ORIGINS=https://your-app.vercel.app -a chatbot-platform-api
```

---

## Monitoring & Maintenance

### Backend Monitoring

**Heroku**:
```bash
heroku logs --tail
heroku ps
```

**Railway**:
- View logs in dashboard
- Monitor CPU/Memory usage

**AWS**:
- CloudWatch logs
- CloudWatch metrics
- X-Ray tracing

### Database Monitoring

**Check Connections**:
```sql
SELECT count(*) FROM pg_stat_activity;
```

**Check Table Sizes**:
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Performance Monitoring

**Backend Metrics**:
- Response times
- Error rates
- Database query performance
- OpenAI API latency

**Frontend Metrics**:
- Page load times
- API call latency
- Error tracking (Sentry)

### Backup Strategy

**Database Backups**:
```bash
# Heroku
heroku pg:backups:capture
heroku pg:backups:download

# Manual PostgreSQL
pg_dump -h hostname -U username dbname > backup.sql
```

**Restore**:
```bash
# Heroku
heroku pg:backups:restore backup_url DATABASE_URL

# Manual
psql -h hostname -U username dbname < backup.sql
```

---

## Troubleshooting

### Backend Issues

**App won't start**:
- Check logs: `heroku logs --tail`
- Verify Java version
- Check database connection

**Database connection failed**:
- Verify DATABASE_URL
- Check database is running
- Verify credentials

**CORS errors**:
- Add frontend URL to CORS_ALLOWED_ORIGINS
- Restart backend

### Frontend Issues

**API calls failing**:
- Verify VITE_API_URL is correct
- Check backend is running
- Verify CORS configuration

**Build fails**:
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node version
- Verify all dependencies installed

---

## Security Checklist

- [ ] Change JWT_SECRET from default
- [ ] Use HTTPS for production
- [ ] Enable database SSL
- [ ] Set secure CORS origins
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Set up monitoring/alerting
- [ ] Regular security updates
- [ ] Database backups configured
- [ ] Error logging (no sensitive data)

---

## Cost Optimization

**Free Tier Options**:
- Backend: Railway (500 hours/month), Heroku (550 hours/month)
- Frontend: Vercel (unlimited), Netlify (100GB/month)
- Database: Railway (1GB), Heroku Postgres (10k rows)

**Paid Recommendations**:
- Backend: Railway ($5/month), Heroku Eco ($5/month)
- Database: Railway ($5/month), Supabase ($25/month)
- Frontend: Usually free

---

## Next Steps

1. Set up CI/CD pipeline
2. Add automated tests
3. Configure monitoring
4. Set up error tracking (Sentry)
5. Add analytics
6. Implement rate limiting
7. Add API documentation (Swagger)
8. Set up staging environment

---

## Support

For deployment issues:
1. Check logs first
2. Verify environment variables
3. Test locally with production config
4. Check provider status pages
5. Open GitHub issue with details

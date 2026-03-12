# Deployment Guide - Moneybag Platform

This guide covers deploying the Moneyback pawn shop application to production.

## 📋 Pre-Deployment Checklist

### 1. Environment Variables
Create a `.env.local` file for local development and configure production environment variables:

```bash
# n8n Chatbot Webhook
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chatbot-xxxxx

# Add any other environment-specific URLs
VITE_API_BASE_URL=https://api.moneyback.com
```

### 2. Build the Application
```bash
# Install dependencies
npm install
# or
pnpm install

# Build for production
npm run build
# or
pnpm build
```

This creates an optimized production build in the `/dist` directory.

## 🚀 Deployment Options

### Option 1: Vercel (Recommended for Frontend)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Configure Environment Variables** in Vercel Dashboard:
   - Go to Project Settings > Environment Variables
   - Add `VITE_N8N_WEBHOOK_URL` and other variables
   - Redeploy after adding variables

4. **Custom Domain** (Optional):
   - Go to Project Settings > Domains
   - Add your custom domain (e.g., moneyback.com)

### Option 2: Netlify

1. **Install Netlify CLI**:
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

3. **Configure Environment Variables**:
   - Go to Site Settings > Build & Deploy > Environment
   - Add environment variables
   - Trigger a redeploy

### Option 3: Docker

1. **Create Dockerfile**:
   ```dockerfile
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Create nginx.conf**:
   ```nginx
   server {
       listen 80;
       server_name _;
       root /usr/share/nginx/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Cache static assets
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

3. **Build and Run**:
   ```bash
   docker build -t moneyback-app .
   docker run -p 80:80 -e VITE_N8N_WEBHOOK_URL=your-url moneyback-app
   ```

### Option 4: Static Hosting (AWS S3, Cloudflare Pages, etc.)

1. **Build the app**:
   ```bash
   npm run build
   ```

2. **Upload `/dist` folder** to your static hosting provider

3. **Configure routing**: Ensure all routes redirect to `index.html` for React Router to work

## 🔧 n8n Webhook Setup

### 1. Create n8n Workflow

1. **Login to n8n** (or self-host: https://n8n.io)

2. **Create New Workflow**

3. **Add Webhook Node**:
   - Method: POST
   - Path: `/webhook/chatbot-xxxxx`
   - Response Mode: Using 'Respond to Webhook' Node

4. **Add HTTP Request or OpenAI Node**:
   Example with OpenAI:
   ```
   Webhook → OpenAI → Respond to Webhook
   ```

5. **Configure OpenAI Node**:
   - Model: gpt-4 or gpt-3.5-turbo
   - Prompt: `{{ $json.message }}`
   - System Message: "You are a helpful assistant for Moneyback pawn shop. Answer questions about pawning items, loan processes, and provide friendly customer service."
   - Max Tokens: 500

6. **Configure Response Node**:
   - Response Body:
   ```json
   {
     "response": "{{ $json.choices[0].message.content }}"
   }
   ```

7. **Activate Workflow**

8. **Copy Webhook URL**

### 2. Test n8n Integration

```bash
curl -X POST https://your-n8n-instance.com/webhook/chatbot-xxxxx \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is Moneyback?",
    "language": "en",
    "timestamp": "2026-02-24T10:30:00.000Z"
  }'
```

Expected response:
```json
{
  "response": "Moneyback is an online pawn shop platform..."
}
```

## 🌐 Backend API Setup (Optional)

If you want to replace localStorage with a real backend:

### 1. Choose Backend Framework

**Node.js + Express** (Recommended):
```bash
mkdir moneyback-backend
cd moneyback-backend
npm init -y
npm install express pg bcrypt jsonwebtoken express-validator cors dotenv
```

### 2. Database Setup

**PostgreSQL** (Recommended):
```sql
-- Create database
CREATE DATABASE moneyback;

-- Create tables (see BACKEND.md for full schema)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ... (add other tables from BACKEND.md)
```

### 3. Backend Structure

```
moneyback-backend/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── kyc.controller.js
│   │   ├── evaluation.controller.js
│   │   └── staff.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── validation.middleware.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── kyc.routes.js
│   │   └── evaluation.routes.js
│   ├── models/
│   ├── config/
│   │   └── database.js
│   └── server.js
├── .env
└── package.json
```

### 4. Deploy Backend

**Option A: Railway**
```bash
railway login
railway init
railway up
```

**Option B: Heroku**
```bash
heroku login
heroku create moneyback-api
git push heroku main
```

**Option C: AWS EC2/ECS**
- Launch EC2 instance
- Install Node.js and PostgreSQL
- Clone backend repository
- Run with PM2: `pm2 start src/server.js`

## 🔒 Security Configuration

### 1. CORS Setup
In your backend (if using):
```javascript
const cors = require('cors');
app.use(cors({
  origin: ['https://moneyback.com', 'https://www.moneyback.com'],
  credentials: true
}));
```

### 2. HTTPS/SSL
- Use Let's Encrypt for free SSL certificates
- Or use Cloudflare for automatic HTTPS

### 3. Environment Variables
Never commit sensitive data. Use:
- `.env.local` for local development (gitignored)
- Platform-specific env var managers for production
- AWS Secrets Manager or HashiCorp Vault for production secrets

### 4. Rate Limiting
In frontend, add request debouncing:
```javascript
import { debounce } from 'lodash';
const debouncedSearch = debounce(handleSearch, 500);
```

In backend, use express-rate-limit:
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
```

## 📊 Monitoring & Analytics

### 1. Error Tracking
Use Sentry:
```bash
npm install @sentry/react @sentry/vite-plugin
```

Configure in `main.tsx`:
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production"
});
```

### 2. Analytics
Add Google Analytics or Plausible:
```html
<!-- In index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"></script>
```

### 3. Uptime Monitoring
- Use UptimeRobot or Pingdom
- Monitor your main domain and API endpoints

## 🧪 Pre-Launch Testing

### 1. Functionality Testing
- [ ] All pages load correctly
- [ ] KYC form submission works
- [ ] Evaluation form with photos works
- [ ] Verification logic works
- [ ] Staff portal functions
- [ ] Stock management displays
- [ ] Chatbot connects to n8n
- [ ] Language toggle works
- [ ] Mobile responsive

### 2. Performance Testing
```bash
# Test with Lighthouse
npm install -g lighthouse
lighthouse https://moneyback.com --view
```

Target scores:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

### 3. Security Testing
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] No exposed API keys
- [ ] Input validation works
- [ ] XSS protection enabled
- [ ] CSRF tokens (if using sessions)

## 📝 Post-Deployment

### 1. DNS Configuration
```
A Record: moneyback.com → [Your IP/Server]
CNAME: www.moneyback.com → moneyback.com
```

### 2. SEO Setup
Add `robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://moneyback.com/sitemap.xml
```

Add `sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://moneyback.com/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://moneyback.com/kyc</loc>
    <priority>0.8</priority>
  </url>
  <!-- Add other pages -->
</urlset>
```

### 3. Monitoring Dashboard
Set up monitoring for:
- Server uptime
- Response times
- Error rates
- User activity
- n8n webhook success rate

## 🔄 CI/CD Pipeline

Example GitHub Actions (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_N8N_WEBHOOK_URL: ${{ secrets.N8N_WEBHOOK_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📞 Support & Maintenance

### Backup Strategy
- Daily database backups
- Weekly full system backups
- Test restore procedures monthly

### Update Schedule
- Security patches: Immediate
- Dependencies: Monthly
- Features: Bi-weekly sprints

### Contact Information
- Support: support@moneyback.com
- Technical: dev@moneyback.com
- Emergency: [Emergency contact]

---

**Good luck with your deployment! 🚀**

# Backend Implementation Guide

This document provides guidance for implementing the backend services required for the Moneyback platform.

## Tech Stack Recommendations

### Backend Framework
- **Node.js + Express** (recommended)
- **NestJS** (for larger scale)
- **Python + FastAPI** (alternative)

### Database
- **PostgreSQL** (recommended) - Reliable, ACID compliant
- **MySQL** - Alternative relational database
- **MongoDB** - If document-based storage preferred

### Authentication
- **JWT (JSON Web Tokens)** - Stateless authentication
- **bcrypt** - Password hashing
- **express-session** - Session management (if needed)

## Database Schema

### Users Table
\`\`\`sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'customer', -- 'customer', 'staff', 'admin'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### KYC Records Table
\`\`\`sql
CREATE TABLE kyc_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  current_address TEXT NOT NULL,
  permanent_address TEXT NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  occupation VARCHAR(100) NOT NULL,
  workplace VARCHAR(200) NOT NULL,
  national_id VARCHAR(50),
  laser_id VARCHAR(50),
  bank_account VARCHAR(50),
  id_photo_url TEXT,
  consent BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  verified_at TIMESTAMP,
  verified_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### Evaluations Table
\`\`\`sql
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  category VARCHAR(100) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  item_name VARCHAR(200) NOT NULL,
  version VARCHAR(100) NOT NULL,
  request_amount DECIMAL(10,2) NOT NULL,
  damage_level VARCHAR(50) NOT NULL,
  gpt_prompt TEXT,
  gpt_response JSONB,
  market_value DECIMAL(10,2),
  recommended_offer DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### Evaluation Photos Table
\`\`\`sql
CREATE TABLE evaluation_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id UUID REFERENCES evaluations(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### Blacklist Checks Table
\`\`\`sql
CREATE TABLE blacklist_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id UUID REFERENCES evaluations(id),
  last_name VARCHAR(100) NOT NULL,
  account_number VARCHAR(50) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  is_blacklisted BOOLEAN NOT NULL,
  blacklist_reason TEXT,
  checked_at TIMESTAMP DEFAULT NOW(),
  checked_by UUID REFERENCES users(id)
);
\`\`\`

### Staff Decisions Table
\`\`\`sql
CREATE TABLE staff_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id UUID REFERENCES evaluations(id),
  staff_id UUID REFERENCES users(id),
  approved BOOLEAN NOT NULL,
  offer_amount DECIMAL(10,2),
  notes TEXT,
  decided_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### Transactions Table
\`\`\`sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id UUID REFERENCES evaluations(id),
  user_id UUID REFERENCES users(id),
  loan_amount DECIMAL(10,2) NOT NULL,
  interest_rate DECIMAL(5,2),
  loan_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'redeemed', 'overdue', 'sold'
  redeemed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### Reminders Table
\`\`\`sql
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id),
  reminder_type VARCHAR(50) NOT NULL, -- 'reminder_1', 'reminder_2', 'reminder_3'
  sent_at TIMESTAMP DEFAULT NOW(),
  channels JSONB, -- ['sms', 'email']
  delivery_status VARCHAR(50) DEFAULT 'sent' -- 'sent', 'delivered', 'failed'
);
\`\`\`

### Notifications Table
\`\`\`sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  evaluation_id UUID REFERENCES evaluations(id),
  notification_type VARCHAR(50) NOT NULL, -- 'staff_decision', 'reminder', 'contract'
  title VARCHAR(200),
  message TEXT NOT NULL,
  channels JSONB, -- ['sms', 'email', 'push']
  sent_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP
);
\`\`\`

### Chatbot Messages Table
\`\`\`sql
CREATE TABLE chatbot_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  sender VARCHAR(20) NOT NULL, -- 'user', 'bot'
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

## API Endpoints

### Authentication
\`\`\`
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
POST   /api/auth/refresh-token
\`\`\`

### KYC
\`\`\`
POST   /api/kyc                    # Submit KYC
GET    /api/kyc/:id                # Get KYC by ID
PUT    /api/kyc/:id                # Update KYC
GET    /api/kyc/user/:userId       # Get user's KYC records
POST   /api/kyc/:id/verify         # Staff verify KYC (staff only)
POST   /api/kyc/upload-photo       # Upload ID photo
\`\`\`

### Evaluations
\`\`\`
POST   /api/evaluations            # Create evaluation
GET    /api/evaluations            # List evaluations (with filters)
GET    /api/evaluations/:id        # Get evaluation by ID
PUT    /api/evaluations/:id        # Update evaluation
DELETE /api/evaluations/:id        # Delete evaluation
POST   /api/evaluations/:id/photos # Upload evaluation photos
POST   /api/evaluations/:id/gpt    # Generate GPT valuation
\`\`\`

### Verification
\`\`\`
POST   /api/verification/check     # Check blacklist
GET    /api/verification/history   # Get verification history
\`\`\`

### Staff
\`\`\`
GET    /api/staff/evaluations      # Get pending evaluations (staff only)
POST   /api/staff/decision         # Approve/reject evaluation (staff only)
GET    /api/staff/decisions        # Get all staff decisions
\`\`\`

### Transactions
\`\`\`
GET    /api/transactions           # List transactions
GET    /api/transactions/:id       # Get transaction details
POST   /api/transactions/:id/redeem # Redeem item
GET    /api/transactions/overdue   # Get overdue transactions
\`\`\`

### Reminders
\`\`\`
POST   /api/reminders/send         # Send reminder (system)
GET    /api/reminders/:transactionId # Get reminders for transaction
\`\`\`

### Notifications
\`\`\`
GET    /api/notifications          # Get user notifications
PUT    /api/notifications/:id/read # Mark as read
POST   /api/notifications/send     # Send notification (system)
\`\`\`

### Chatbot
\`\`\`
POST   /api/chatbot/message        # Send message to chatbot
GET    /api/chatbot/history        # Get chat history
\`\`\`

## Environment Variables

\`\`\`.env
# Server
NODE_ENV=production
PORT=3000
API_BASE_URL=https://api.moneyback.com

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/moneyback
DATABASE_POOL_SIZE=20

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=30d

# Encryption
BCRYPT_ROUNDS=10

# External APIs
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
BLACKLIST_API_URL=https://blacklist-api.example.com
BLACKLIST_API_KEY=your-blacklist-api-key

# SMS Service (e.g., Twilio)
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Email Service (e.g., SendGrid)
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@moneyback.com

# File Storage (e.g., AWS S3)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=moneyback-files
AWS_REGION=ap-southeast-1

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=https://moneyback.com

# n8n Webhook (if using)
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chatbot
\`\`\`

## Security Best Practices

### 1. Input Validation
\`\`\`javascript
const { body, validationResult } = require('express-validator');

app.post('/api/kyc', [
  body('email').isEmail().normalizeEmail(),
  body('mobile').matches(/^[0-9]{10}$/),
  body('firstName').trim().isLength({ min: 1, max: 100 }),
  // ... more validations
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Process request
});
\`\`\`

### 2. Authentication Middleware
\`\`\`javascript
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};
\`\`\`

### 3. Role-Based Access Control
\`\`\`javascript
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// Usage
app.post('/api/staff/decision', 
  authenticateToken, 
  requireRole(['staff', 'admin']), 
  handleStaffDecision
);
\`\`\`

### 4. Rate Limiting
\`\`\`javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
\`\`\`

### 5. File Upload Security
\`\`\`javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const uniqueName = \`\${Date.now()}-\${Math.random().toString(36).substr(2, 9)}\`;
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type'));
  }
});
\`\`\`

## Integration Examples

### 1. GPT Valuation API
\`\`\`javascript
const OpenAI = require('openai');

async function getGPTValuation(prompt) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are an expert pawn shop valuator." },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0].message.content);
}
\`\`\`

### 2. Blacklist API Check
\`\`\`javascript
const axios = require('axios');

async function checkBlacklist(lastName, accountNumber, mobile) {
  try {
    const response = await axios.post(
      process.env.BLACKLIST_API_URL,
      { lastName, accountNumber, mobile },
      {
        headers: {
          'Authorization': \`Bearer \${process.env.BLACKLIST_API_KEY}\`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }
    );

    return {
      isBlacklisted: response.data.blacklisted,
      reason: response.data.reason || null
    };
  } catch (error) {
    console.error('Blacklist check failed:', error);
    throw new Error('Verification service unavailable');
  }
}
\`\`\`

### 3. SMS Notification (Twilio)
\`\`\`javascript
const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendSMS(to, message) {
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
    return { success: true, messageId: result.sid };
  } catch (error) {
    console.error('SMS send failed:', error);
    return { success: false, error: error.message };
  }
}
\`\`\`

### 4. Email Notification (SendGrid)
\`\`\`javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(to, subject, html) {
  const msg = {
    to: to,
    from: process.env.EMAIL_FROM,
    subject: subject,
    html: html
  };

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('Email send failed:', error);
    return { success: false, error: error.message };
  }
}
\`\`\`

## Cron Jobs / Scheduled Tasks

### Reminder System
\`\`\`javascript
const cron = require('node-cron');

// Run every day at 9:00 AM
cron.schedule('0 9 * * *', async () => {
  console.log('Running reminder check...');
  
  // Get all active transactions
  const transactions = await getActiveTransactions();
  
  for (const transaction of transactions) {
    const daysPastDue = calculateDaysPastDue(transaction.due_date);
    
    if (daysPastDue === 1) {
      await sendReminder(transaction, 'reminder_1');
    } else if (daysPastDue === 3) {
      await sendReminder(transaction, 'reminder_2');
    } else if (daysPastDue === 5) {
      await sendReminder(transaction, 'reminder_3');
    } else if (daysPastDue > 7) {
      await markReadyToSell(transaction);
    }
  }
});
\`\`\`

## Deployment

### Docker Setup
\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
\`\`\`

### docker-compose.yml
\`\`\`yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    depends_on:
      - postgres

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: moneyback
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
\`\`\`

## Testing

### Unit Tests
\`\`\`javascript
const request = require('supertest');
const app = require('../app');

describe('POST /api/kyc', () => {
  it('should create KYC record', async () => {
    const response = await request(app)
      .post('/api/kyc')
      .set('Authorization', \`Bearer \${token}\`)
      .send({
        firstName: 'John',
        lastName: 'Doe',
        // ... other fields
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});
\`\`\`

---

**Note**: This is a comprehensive guide. Adapt it to your specific requirements and infrastructure.

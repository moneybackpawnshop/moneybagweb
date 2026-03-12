# Moneyback Platform - Quick Reference

## 🎯 Testing the Application

### Test Scenarios

#### 1. KYC Submission
1. Navigate to KYC section (scroll or click nav)
2. Fill in all required fields
3. Upload an ID photo
4. Check the consent checkbox
5. Submit form
6. Toast notification confirms success

#### 2. Asset Evaluation
1. Navigate to Evaluation section
2. Select category (e.g., "Electronics")
3. Enter brand (e.g., "Apple")
4. Enter item name (e.g., "iPhone 15 Pro")
5. Enter version (e.g., "256GB Space Black")
6. Enter requested amount (e.g., "30000")
7. Select damage level (e.g., "Excellent")
8. Upload at least 4 photos
9. Click "Generate AI Valuation"
10. GPT prompt appears - ready to copy and use with ChatGPT

#### 3. Blacklist Verification
**To test rejection:**
- Use lastName containing "test" OR
- Use account number starting with "999" OR
- Use mobile starting with "000"

**To test approval:**
- Use any other valid data

#### 4. Staff Decision Portal
1. Navigate to Staff Portal section
2. See all pending evaluations from step 2
3. Click on an evaluation to review
4. Enter an offer amount
5. Click "Approve Loan" or "Reject Loan"
6. Notification is logged and status updates

#### 5. Stock Management
1. After approving loans in step 4
2. Navigate to Stock Management section
3. View all active loans
4. See reminder status and due dates
5. Items are automatically categorized by overdue status

#### 6. Chatbot
1. Click floating chat icon (bottom-right)
2. Chat window opens with welcome message
3. Type a message and press Enter or click Send
4. Bot responds with helpful information
5. Click X to close, click icon again to reopen

## 🔄 Data Flow

### localStorage Keys
- `kycRecords` - Array of KYC submissions
- `evaluations` - Array of asset evaluations
- `verifications` - Array of blacklist checks
- `notifications` - Array of staff decision notifications

### Clear All Data
To reset the demo, open browser console and run:
\`\`\`javascript
localStorage.clear();
location.reload();
\`\`\`

## 🎨 Color Palette Reference

\`\`\`css
/* Primary Colors */
--midnight-navy: #0A1F44;  /* Headers, titles, primary text */
--emerald: #10B981;        /* Success, CTAs, primary actions */
--gold: #F59E0B;          /* Accents, highlights, warnings */
--soft-shell: #F3F4F6;    /* Backgrounds, subtle elements */

/* Semantic Colors */
--success: #10B981;       /* Approved, active, success states */
--warning: #F59E0B;       /* Reminders, caution */
--error: #EF4444;         /* Rejected, overdue, errors */
--info: #3B82F6;          /* Information, neutral notices */
\`\`\`

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🌐 Language Toggle

Toggle button in top-right corner:
- English (EN)
- Thai (ไทย)

All content, forms, and messages are translated.

## 🔐 Security Implementation Notes

### Environment Variables (Production)
\`\`\`bash
# .env file
BLACKLIST_API_KEY=your_blacklist_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
SMS_API_KEY=your_sms_provider_key_here
EMAIL_API_KEY=your_email_provider_key_here
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret_here
\`\`\`

### Backend API Endpoints (To Implement)
\`\`\`
POST   /api/auth/register
POST   /api/auth/login
POST   /api/kyc
GET    /api/kyc/:id
POST   /api/evaluations
GET    /api/evaluations
POST   /api/verification/check
POST   /api/staff/decision
GET    /api/stock/items
POST   /api/notifications/send
POST   /api/chatbot/message
\`\`\`

## 🎓 Component Architecture

\`\`\`
App.tsx (Main)
├── Header.tsx (Navigation + Language Toggle)
├── HeroSection.tsx (Landing/Hero)
├── KYCSection.tsx (Identity Verification)
├── EvaluationSection.tsx (AI Valuation)
├── VerificationSection.tsx (Blacklist Check)
├── StaffSection.tsx (Loan Approval)
├── StockSection.tsx (Inventory Management)
├── Chatbot.tsx (Floating Chat Widget)
└── Footer (Contact + Links)
\`\`\`

## 🚀 Deployment Checklist

- [ ] Set up backend API server
- [ ] Configure database (PostgreSQL recommended)
- [ ] Set environment variables
- [ ] Implement authentication (JWT)
- [ ] Set up email service (SendGrid, AWS SES, etc.)
- [ ] Set up SMS service (Twilio, etc.)
- [ ] Integrate real GPT API for valuations
- [ ] Integrate blacklist verification API
- [ ] Implement e-signature service
- [ ] Set up monitoring and logging
- [ ] Configure HTTPS/SSL
- [ ] Set up backup strategy
- [ ] Implement rate limiting
- [ ] Security audit
- [ ] Load testing
- [ ] Deploy to production server

## 📊 Sample Data Structures

### KYC Record
\`\`\`json
{
  "id": "1234567890",
  "firstName": "John",
  "lastName": "Doe",
  "dob": "1990-01-01",
  "mobile": "0812345678",
  "email": "john@example.com",
  "currentAddress": "123 Main St",
  "permanentAddress": "456 Home St",
  "salary": "50000",
  "occupation": "Engineer",
  "workplace": "Tech Company",
  "nationalId": "1234567890123",
  "laserId": "AB-1234567",
  "bankAccount": "1234567890",
  "consent": true,
  "submittedAt": "2026-02-24T10:30:00.000Z"
}
\`\`\`

### Evaluation Record
\`\`\`json
{
  "id": "1234567890",
  "category": "Electronics",
  "brand": "Apple",
  "itemName": "iPhone 15 Pro",
  "version": "256GB",
  "requestAmount": "30000",
  "damageLevel": "Excellent",
  "photos": ["file1", "file2", "file3", "file4"],
  "gptPrompt": "You are an expert...",
  "status": "pending",
  "createdAt": "2026-02-24T10:30:00.000Z"
}
\`\`\`

### Staff Decision
\`\`\`json
{
  "evaluationId": "1234567890",
  "approved": true,
  "offerAmount": "25000",
  "decidedAt": "2026-02-24T11:00:00.000Z",
  "staffId": "staff123"
}
\`\`\`

---

**Built with**: React, TypeScript, Tailwind CSS v4, shadcn/ui components

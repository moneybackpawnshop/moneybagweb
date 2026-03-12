# Money bag - Online Pawn Shop Platform

A comprehensive bilingual (Thai/English) digital pawn shop platform with ThaID integration, AI-powered valuation with real-time gold prices, DOPA identity verification, digital pawn ticket management, and automated LINE OA notifications.

## 🏗️ Architecture

### Multi-Page Application
The application uses React Router for navigation with separate pages:
- **Home** (`/`) - Hero section and overview
- **KYC Registration** (`/kyc`) - ThaID integration with DOPA verification
- **AI Evaluation** (`/evaluation`) - AI-powered asset valuation with real-time gold prices
- **Pawn Tickets** (`/pawn-tickets`) - Digital pawn ticket management with LINE notifications
- **Verification** (`/verification`) - Blacklist checking
- **Staff Portal** (`/staff`) - Staff decision management
- **Stock Management** (`/stock`) - Inventory and reminders

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Routing**: React Router v7 (Data Mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: React Hooks + Context API + localStorage
- **Notifications**: Sonner (toast notifications)
- **Icons**: Lucide React
- **AI Integration**: n8n webhook for chatbot responses

## 🎨 Brand Identity

### Colors
- **Midnight Navy**: `#0A1F44` - Primary brand color
- **Emerald**: `#10B981` - Success, CTA buttons
- **Gold**: `#F59E0B` - Accent, highlights
- **Soft Shell**: `#F3F4F6` - Backgrounds, subtle elements

### Typography
- **Montserrat**: Headlines, titles, brand text
- **Inter**: Body text, forms, UI elements

## 🚀 Core Features

### 1. **ThaID Registration & DOPA Verification (IAL 2.3)**

#### Features:
- **ThaID Integration**: One-click registration using Thailand's national digital identity system
- **Auto-fill Personal Data**: Name, National ID, Date of Birth, Registered Address
- **DOPA Callback**: Real-time identity verification from Department of Provincial Administration
- **IAL 2.3 Compliance**: Identity Assurance Level 2.3 certification
- **Role Management**: Support for Customer, Staff, and Admin roles

#### Data Flow:
1. User clicks "Connect with ThaID"
2. OAuth redirect to ThaID authentication
3. User approves data sharing
4. System receives: Name, National ID, DOB, Registered Address
5. DOPA verification callback confirms identity authenticity
6. IAL 2.3 status granted
7. User completes contact information (mobile, email)
8. Registration complete with verified identity

#### Implementation Notes:
```javascript
// Production ThaID OAuth Flow
const thaIdAuthUrl = 'https://imauth.bora.dopa.go.th/api/v2/oauth2/auth/';
const params = {
  response_type: 'code',
  client_id: process.env.THAID_CLIENT_ID,
  redirect_uri: process.env.THAID_REDIRECT_URI,
  scope: 'pid given_name family_name date_of_birth address',
  state: generateSecureState(),
};

// DOPA Verification Callback
POST https://api.bora.dopa.go.th/v2/verify
Headers: { 
  'Authorization': 'Bearer YOUR_API_KEY',
  'Content-Type': 'application/json'
}
Body: { 
  national_id: 'xxxxxxxxxxxxx',
  laser_id: 'xxxxxxxxxxxxxxx' 
}
```

### 2. **AI-Powered Asset Valuation with Real-Time Gold Prices**

#### Features:
- **Real-Time Gold Price API**: Live gold buy/sell prices updated every 5 minutes
- **Multi-Category Support**: Gold, Watches, Mobile Phones, Electronics, Jewelry, Luxury Items
- **AI Analysis**: Automated valuation using market data and item condition
- **Request Quotation**: Save evaluation for in-store use
- **4+ Photo Validation**: Minimum 4 photos required for accurate assessment

#### Gold Price Integration:
```javascript
// Production API Integration
const fetchGoldPrice = async () => {
  // Option 1: Thailand Gold Association API
  const response = await fetch('https://www.goldtraders.or.th/api/goldprice');
  
  // Option 2: GoldAPI.io
  const response = await fetch('https://api.goldapi.io/api/XAU/THB', {
    headers: { 'x-access-token': process.env.GOLD_API_KEY }
  });
  
  return response.json();
};
```

#### AI Prompt Generation:
Generates comprehensive prompts including:
- Real-time gold price context
- Item details and condition
- Preliminary AI assessment
- Interest rate recommendations (max 15% per year)
- Risk assessment for loan approval

#### Quotation Storage:
All quotations saved to localStorage/database with:
- Item details and photos
- Market value estimate
- Recommended loan offer (70% of market value)
- Gold price snapshot (for gold items)
- Creation timestamp
- Unique quotation ID

### 3. **Digital Pawn Ticket Management**

#### Features:
- **Digital Pawn Tickets**: Complete loan contract information
- **Interest Calculation**: Automated calculation at max 15% per year (legal compliance)
- **Due Date Tracking**: Monitor payment schedules
- **Overdue Detection**: Automatic status updates
- **Multi-Ticket View**: Customer dashboard for all active loans

#### Ticket Information:
- Ticket ID (e.g., PT-2026-0001)
- Customer details
- Item description
- Loan amount (principal)
- Interest rate
- Start date and due date
- Total amount due (principal + interest)
- Current status (Active, Overdue, Completed)

#### Interest Calculation Formula:
```javascript
// Daily interest calculation
const days = (dueDate - startDate) / (1000 * 60 * 60 * 24);
const interest = (principal * rate * days) / 365;
const total = principal + interest;

// Maximum 15% annual interest (Thai law compliance)
const maxRate = 0.15; // 15% per year
```

### 4. **Automated LINE OA Notifications**

#### Notification Schedule:
- **7 Days Before Due**: First reminder via LINE OA
- **3 Days Before Due**: Second reminder via LINE OA
- **1 Day Before Due**: Final reminder via SMS (backup)
- **Overdue**: Immediate notification

#### LINE Messaging API Integration:
```javascript
// Production LINE OA Setup
const sendLINENotification = async (userId, message) => {
  const response = await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
    },
    body: JSON.stringify({
      to: userId,
      messages: [{
        type: 'text',
        text: message
      }]
    })
  });
  return response.json();
};

// Notification Message Template (Thai)
const message = `
สวัสดีค่ะ คุณ${customerName}

🎫 ตั๋วจำนำเลขที่: ${ticketId}
📦 สินค้า: ${itemDescription}
💰 ยอดที่ต้องชำระ: ${totalAmount} บาท
📅 ครบกำหนด: ${dueDate}

เหลือเวลาอีก ${daysRemaining} วัน
กรุณาชำระเงินก่อนครบกำหนดเพื่อหลีกเลี่ยงค่าปรับค่ะ

Money bag 🏦
`;
```

#### SMS Backup Integration:
```javascript
// SMS API for critical notifications
const sendSMS = async (mobile, message) => {
  const response = await fetch('https://api.sms-provider.com/send', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.SMS_API_KEY}` },
    body: JSON.stringify({ to: mobile, message })
  });
  return response.json();
};
```

### 5. **Blacklist Verification with Auto-Rejection**

Automated fraud detection system:
- Checks Last Name, Account Number, Mobile against blacklist
- Auto-rejects matched cases
- Records verification attempts
- Displays clear approval/rejection status

### 6. **Staff Decision Portal**

Internal workflow for loan approval:
- View all pending evaluations and quotations
- Review customer requests with ThaID-verified identity
- Enter offer amount based on AI recommendations
- Approve or Reject loan applications
- Trigger automated notifications
- Set e-sign contract status

### 7. **Stock Management with 3-Stage Reminders**

Automated tracking of pawned items:
- Monitor active loans
- Track due dates
- **3-stage reminder system**:
  1. 1st Reminder (1+ days past due)
  2. 2nd Reminder (3+ days past due)
  3. 3rd Reminder (5+ days past due)
- **Ready to Sell**: Items overdue by 7+ days
- Visual status badges

### 8. **Floating Chatbot Widget**

Global AI assistant available on all pages:
- Floating button in bottom-right corner
- Opens chat panel with message history
- Bilingual support (Thai/English)
- **n8n Webhook Integration** for AI responses

## 📦 Data Storage

All data is stored in browser localStorage for prototype:

- `kycRecords`: ThaID registrations and DOPA verifications
- `quotations`: AI valuations with gold price snapshots
- `pawnTickets`: Digital pawn ticket records
- `notifications`: LINE/SMS notification history
- `verifications`: Blacklist check results
- `stockItems`: Pawned item tracking

## 🔐 Security & Compliance

### Production Requirements:

#### 1. ThaID Integration
```bash
# Environment Variables
THAID_CLIENT_ID=your_client_id
THAID_CLIENT_SECRET=your_client_secret
THAID_REDIRECT_URI=https://yourdomain.com/auth/callback
DOPA_API_KEY=your_dopa_api_key
```

#### 2. LINE OA Configuration
```bash
LINE_CHANNEL_ID=your_channel_id
LINE_CHANNEL_SECRET=your_channel_secret
LINE_CHANNEL_ACCESS_TOKEN=your_access_token
```

#### 3. Gold Price API
```bash
GOLD_API_KEY=your_gold_api_key
# Use Thailand Gold Association API or GoldAPI.io
```

#### 4. Legal Compliance
- **Interest Rate**: Max 15% per year (Thai Pawn Shop Act)
- **KYC/AML**: Comply with Anti-Money Laundering regulations
- **Personal Data Protection**: PDPA compliance for data handling
- **DOPA Verification**: IAL 2.3 identity assurance

#### 5. Security Best Practices
- HTTPS for all API calls
- JWT authentication
- Rate limiting
- Data encryption at rest and in transit
- Audit logging for all transactions
- Role-based access control (RBAC)

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation
```bash
npm install
# or
pnpm install
```

### Environment Setup
Create `.env.local`:
```bash
# n8n Chatbot
VITE_N8N_WEBHOOK_URL=https://your-n8n.com/webhook/chatbot

# ThaID (for production)
THAID_CLIENT_ID=your_client_id
THAID_CLIENT_SECRET=your_client_secret

# LINE OA (for production)
LINE_CHANNEL_ACCESS_TOKEN=your_token

# Gold Price API (for production)
GOLD_API_KEY=your_api_key
```

### Run Development Server
```bash
npm run dev
# or
pnpm dev
```

### Build for Production
```bash
npm run build
# or
pnpm build
```

## 🌐 Bilingual Support

Full Thai/English support:
- Language toggle in header
- All sections and forms translated
- Form validation messages
- Toast notifications
- Chatbot messages
- Date formatting (Thai Buddhist calendar / Gregorian)

## 📱 Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interface
- Optimized for all screen sizes

## 🎯 User Flow

### Customer Journey:
1. **Register via ThaID** → OAuth authentication → DOPA verification → IAL 2.3 granted
2. **Request Evaluation** → Upload 4+ photos → Select category → AI generates quotation
3. **View Real-Time Gold Price** → See current market rates for gold items
4. **Save Quotation** → Present at store or wait for staff review
5. **Blacklist Check** → Automatic verification → Approval/rejection
6. **Staff Approves** → Loan amount confirmed → LINE notification sent
7. **E-Sign Contract** → Digital pawn ticket created
8. **Receive Reminders** → LINE notifications at 7/3/1 days before due
9. **Make Payment** → On time or manage overdue status
10. **Item Management** → Track all active loans in dashboard

### Staff Journey:
1. **Review Quotations** → View customer requests with ThaID verification
2. **Check AI Recommendations** → Review market value and loan offer
3. **Make Decision** → Approve/reject with offer amount
4. **Trigger Notifications** → Automated LINE/SMS to customer
5. **Monitor Stock** → Track due dates and overdue items
6. **Manage Reminders** → 3-stage notification system
7. **Ready to Sell** → Items 7+ days overdue

## 🔮 Future Enhancements

- Real ThaID OAuth integration
- Production DOPA API connection
- Real-time gold price WebSocket feed
- LINE OA production deployment
- SMS gateway integration
- Payment gateway (PromptPay, credit card)
- E-signature integration (e.g., eSignature.io)
- Customer mobile app
- Staff mobile app
- Advanced analytics dashboard
- Machine learning for better valuations
- Blockchain for contract immutability

## 📄 API Documentation

### ThaID Registration
```
GET /auth/thaid/login
  → Redirect to ThaID OAuth

GET /auth/thaid/callback?code=xxx
  → Exchange code for access token
  → Fetch user profile
  → Verify with DOPA
  → Create user account
```

### LINE Notifications
```
POST /api/notifications/line
Body: {
  userId: "LINE_USER_ID",
  ticketId: "PT-2026-0001",
  type: "reminder_7days"
}
```

### Gold Price API
```
GET /api/gold-price
Response: {
  buy: 31500,
  sell: 31600,
  timestamp: "2026-03-11T10:30:00Z"
}
```

## 📞 Support

For production deployment assistance:
- ThaID integration support: [DOPA](https://www.bora.dopa.go.th/)
- LINE OA setup: [LINE Developers](https://developers.line.biz/)
- Gold price API: [Thailand Gold Association](https://www.goldtraders.or.th/)

## 📄 License

© 2026 Money bag. All rights reserved.

---

**Note**: This is a prototype application demonstrating the complete pawn shop workflow. For production deployment, implement proper backend services, ThaID OAuth integration, DOPA verification, LINE Messaging API, real-time gold price feeds, database persistence, and security measures as outlined in this documentation.

**Legal Disclaimer**: Ensure compliance with Thai Pawn Shop Act, Anti-Money Laundering regulations, and Personal Data Protection Act (PDPA) before operating a digital pawn shop service in Thailand.

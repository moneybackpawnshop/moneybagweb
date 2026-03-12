# Money bag - System Requirements Specification

## 1. Functional Requirements

### 1.1 ระบบสมาชิกและการยืนยันตัวตน (Authentication & KYC)

#### Registration via ThaID
**Requirement**: เชื่อมต่อกับแอป ThaID เพื่อดึงข้อมูล ชื่อ-นามสกุล, เลขบัตรประชาชน, และที่อยู่ตามทะเบียนราษฎรมาลงทะเบียนอัตโนมัติ

**Implementation**:
- OAuth 2.0 integration with ThaID
- Automatic data retrieval: First Name, Last Name, National ID, Date of Birth, Registered Address
- One-click registration flow
- Secure token exchange

**User Flow**:
1. User clicks "Connect with ThaID" button
2. Redirect to ThaID authentication page
3. User logs in with ThaID credentials
4. User approves data sharing consent
5. Callback to Money bag with authorization code
6. Exchange code for access token
7. Retrieve user profile data
8. Auto-fill registration form
9. User completes additional information (mobile, email)

**API Endpoints**:
```
GET /auth/thaid/login
  → Initiates OAuth flow

GET /auth/thaid/callback?code=xxx&state=yyy
  → Handles OAuth callback
  → Exchanges code for token
  → Retrieves user data
```

**Data Retrieved from ThaID**:
- `pid` - National ID Number (เลขบัตรประชาชน)
- `given_name` - First Name (ชื่อจริง)
- `family_name` - Last Name (นามสกุล)
- `date_of_birth` - Date of Birth (วันเกิด)
- `address` - Registered Address (ที่อยู่ตามทะเบียนราษฎร)

#### Identity Verification (IAL 2.3)
**Requirement**: ระบบต้องรองรับการ Callback จาก DOPA เพื่อยืนยันสถานะตัวตนที่แท้จริง

**Implementation**:
- Integration with DOPA (Department of Provincial Administration) API
- Real-time identity verification
- IAL 2.3 (Identity Assurance Level 2.3) certification
- Callback webhook handling

**Verification Process**:
1. After ThaID data retrieval, trigger DOPA verification
2. Send National ID and Laser ID to DOPA API
3. Receive verification result via webhook callback
4. Update user IAL 2.3 status
5. Display verification badge to user

**DOPA API Integration**:
```
POST https://api.bora.dopa.go.th/v2/verify
Headers: {
  'Authorization': 'Bearer YOUR_API_KEY',
  'Content-Type': 'application/json'
}
Body: {
  "national_id": "1234567890123",
  "laser_id": "AB1234567",
  "callback_url": "https://moneybag.com/api/dopa/callback"
}

Response: {
  "status": "verified",
  "ial_level": "2.3",
  "verified_at": "2026-03-11T10:30:00Z",
  "confidence_score": 0.95
}
```

**Callback Webhook**:
```
POST /api/dopa/callback
Headers: {
  'X-DOPA-Signature': 'signature_hash'
}
Body: {
  "national_id": "1234567890123",
  "verification_status": "verified",
  "ial_level": "2.3",
  "timestamp": "2026-03-11T10:30:00Z"
}
```

#### Role Management
**Requirement**: แบ่งสิทธิ์ผู้ใช้งาน (Customer, Staff, Admin)

**Roles**:
1. **Customer** (ลูกค้า)
   - Register via ThaID
   - Submit KYC
   - Request evaluations
   - View pawn tickets
   - Receive notifications

2. **Staff** (พนักงาน)
   - Review customer requests
   - Approve/reject loans
   - Access customer data
   - Manage pawn tickets
   - Send notifications

3. **Admin** (ผู้ดูแลระบบ)
   - Full system access
   - User management
   - Configure settings
   - View analytics
   - System administration

**Role Assignment**:
- Default role: Customer
- Staff/Admin roles assigned by Admin during user creation
- Role-based UI rendering
- Protected routes based on roles

### 1.2 ระบบประเมินราคาด้วย AI (AI Valuation & Agent)

#### Image Upload & Analysis
**Requirement**: รองรับการอัปโหลดรูปภาพทรัพย์สิน (ทอง, นาฬิกา, มือถือ) เพื่อให้ AI ประเมินสภาพเบื้องต้น

**Implementation**:
- Multi-file upload (minimum 4 photos required)
- Image validation (format, size, quality)
- Support for: JPEG, PNG, WebP
- Maximum file size: 5MB per image
- Maximum total: 20MB per evaluation

**Photo Requirements**:
- Front view
- Back view
- Close-up of details
- Overall condition
- Additional angles

**Image Processing**:
1. Client-side validation
2. Upload to cloud storage (S3, Google Cloud Storage)
3. Generate thumbnails
4. Extract metadata (EXIF)
5. Pass image URLs to AI analysis

**AI Analysis**:
```javascript
// AI Vision API Integration
const analyzeImages = async (imageUrls) => {
  const response = await fetch('https://api.openai.com/v1/vision', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4-vision',
      images: imageUrls,
      prompt: 'Analyze the condition of this item...'
    })
  });
  return response.json();
};
```

#### AI Agent Chatbot
**Requirement**: ระบบโต้ตอบอัตโนมัติที่คำนวณยอดเงินกู้เบื้องต้นตามราคากลาง (Real-time Gold Price API)

**Implementation**:
- Floating chatbot widget on all pages
- Real-time conversation interface
- Integration with real-time gold price API
- Automated loan calculation
- Bilingual support (Thai/English)

**Gold Price API Integration**:
```javascript
// Thailand Gold Association API
const fetchGoldPrice = async () => {
  const response = await fetch('https://www.goldtraders.or.th/api/goldprice');
  const data = await response.json();
  return {
    buy: data.price.buy,      // ราคารับซื้อ
    sell: data.price.sell,    // ราคาขาย
    timestamp: data.timestamp
  };
};

// Alternative: GoldAPI.io
const fetchGoldPriceAlternative = async () => {
  const response = await fetch('https://api.goldapi.io/api/XAU/THB', {
    headers: { 'x-access-token': GOLD_API_KEY }
  });
  return response.json();
};
```

**Chatbot Functionality**:
- Answer general questions about pawn services
- Calculate preliminary loan amount based on:
  - Item category (gold, watches, phones, etc.)
  - Real-time gold price (for gold items)
  - Item condition
  - Market value estimation
- Explain interest rates (max 15% per year)
- Guide users through the process
- Provide quotation

**Loan Calculation Logic**:
```javascript
const calculateLoan = (category, weight, condition, goldPrice) => {
  if (category === 'gold') {
    // Gold calculation based on real-time price
    const baseValue = weight * goldPrice.buy;
    const conditionFactor = getConditionFactor(condition); // 0.7-1.0
    const marketValue = baseValue * conditionFactor;
    const loanOffer = marketValue * 0.70; // 70% of market value
    return { marketValue, loanOffer };
  } else {
    // Other items: use market research data
    const baseValue = getMarketValue(category, brand, model);
    const conditionFactor = getConditionFactor(condition);
    const marketValue = baseValue * conditionFactor;
    const loanOffer = marketValue * 0.70;
    return { marketValue, loanOffer };
  }
};
```

#### Request Quotation
**Requirement**: ลูกค้าสามารถกดบันทึกราคาประเมินเพื่อนำไปใช้ที่หน้าร้านได้

**Implementation**:
- Save quotation to database
- Generate unique quotation ID
- Include timestamp and validity period
- Printable quotation format
- QR code for easy retrieval at store

**Quotation Data Structure**:
```javascript
{
  id: 'QT-2026-0001',
  customerId: 'user_123',
  customerName: 'สมชาย ใจดี',
  itemCategory: 'gold',
  itemDescription: 'สร้อยคอทองคำ 96.5%',
  weight: 2, // baht
  photos: ['url1', 'url2', 'url3', 'url4'],
  goldPriceSnapshot: {
    buy: 31500,
    sell: 31600,
    timestamp: '2026-03-11T10:00:00Z'
  },
  estimatedValue: 480000,
  loanOffer: 336000, // 70% of estimated value
  interestRate: 15, // percent per year
  validUntil: '2026-03-18T10:00:00Z', // 7 days validity
  createdAt: '2026-03-11T10:00:00Z',
  status: 'pending', // pending, approved, rejected, expired
  qrCode: 'data:image/png;base64,...'
}
```

**Quotation Display**:
- Customer name and contact
- Item details with photos
- Gold price at time of quotation (for gold items)
- Estimated market value
- Loan offer amount
- Interest rate
- Validity period
- QR code for scanning at store
- Print/PDF export functionality

### 1.3 ระบบจัดการสัญญาและแจ้งเตือน (Pawn Management & Notification)

#### Digital Pawn Ticket
**Requirement**: แสดงตั๋วจำนำออนไลน์พร้อมรายละเอียดดอกเบี้ยและวันครบกำหนด

**Implementation**:
- Digital contract system
- Unique ticket ID (e.g., PT-2026-0001)
- Customer dashboard
- Detailed ticket information
- Real-time status updates

**Pawn Ticket Structure**:
```javascript
{
  id: 'PT-2026-0001',
  customerId: 'user_123',
  customerName: 'สมชาย ใจดี',
  nationalId: '1234567890123',
  mobile: '0812345678',
  email: 'somchai@email.com',
  lineUserId: 'U1234567890abcdef', // for LINE notifications
  
  // Item Information
  itemCategory: 'gold',
  itemDescription: 'สร้อยคอทองคำ 96.5% น้ำหนัก 2 บาท',
  itemPhotos: ['url1', 'url2', 'url3', 'url4'],
  estimatedValue: 480000,
  
  // Loan Information
  principalAmount: 336000, // เงินต้น
  interestRate: 15, // อัตราดอกเบี้ย (% ต่อปี)
  loanPeriodDays: 30, // ระยะเวลากู้ (วัน)
  
  // Dates
  startDate: '2026-03-01T00:00:00Z',
  dueDate: '2026-03-31T23:59:59Z',
  extendedDueDate: null, // if extended
  
  // Calculation
  interestAmount: 4140, // ดอกเบี้ย
  totalAmount: 340140, // ยอดรวมที่ต้องชำระ
  
  // Status
  status: 'active', // active, overdue, paid, extended, forfeited
  daysOverdue: 0,
  remindersSent: ['7days', '3days', '1day'],
  
  // E-Signature
  contractSigned: true,
  signedAt: '2026-03-01T10:30:00Z',
  contractUrl: 'https://storage.com/contracts/PT-2026-0001.pdf',
  
  // Metadata
  createdAt: '2026-03-01T10:00:00Z',
  updatedAt: '2026-03-01T10:00:00Z',
  createdBy: 'staff_456',
  approvedBy: 'staff_456'
}
```

#### Automated Notification
**Requirement**: ส่งการแจ้งเตือนผ่าน LINE OA (Messaging API) หรือ SMS ก่อนวันครบกำหนด 7/3/1 วัน

**Implementation**:
- Scheduled job system (cron jobs)
- LINE Messaging API integration
- SMS backup system
- Notification tracking
- Multi-language support

**Notification Schedule**:
1. **7 Days Before Due Date**
   - Channel: LINE Official Account
   - Message: First reminder with payment details

2. **3 Days Before Due Date**
   - Channel: LINE Official Account
   - Message: Second reminder with urgency

3. **1 Day Before Due Date**
   - Channel: LINE Official Account + SMS (backup)
   - Message: Final reminder

4. **On Due Date**
   - Channel: LINE OA + SMS
   - Message: Payment due today

5. **1 Day Overdue**
   - Channel: LINE OA + SMS
   - Message: Overdue notice with grace period

**LINE Messaging API**:
```javascript
// Send LINE notification
const sendLINENotification = async (userId, ticketData, type) => {
  const message = generateMessage(ticketData, type);
  
  const response = await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
    },
    body: JSON.stringify({
      to: userId,
      messages: [{
        type: 'flex',
        altText: 'Payment Reminder',
        contents: generateFlexMessage(ticketData, type)
      }]
    })
  });
  
  // Log notification
  await logNotification({
    ticketId: ticketData.id,
    userId: userId,
    type: 'line',
    messagetype: type,
    status: response.ok ? 'sent' : 'failed',
    sentAt: new Date().toISOString()
  });
  
  return response.json();
};

// Message Templates
const generateMessage = (ticket, type) => {
  const templates = {
    '7days': `สวัสดีค่ะ คุณ${ticket.customerName}

🎫 ตั๋วจำนำเลขที่: ${ticket.id}
📦 สินค้า: ${ticket.itemDescription}
💰 ยอดที่ต้องชำระ: ${ticket.totalAmount.toLocaleString()} บาท
📅 ครบกำหนด: ${formatThaiDate(ticket.dueDate)}

⏰ เหลือเวลาอีก 7 วัน
กรุณาชำระเงินก่อนครบกำหนดเพื่อหลีกเลี่ยงค่าปรับค่ะ

Money bag 🏦`,

    '3days': `‼️ แจ้งเตือน: ครบกำหนดชำระในอีก 3 วัน

🎫 ${ticket.id}
💰 ยอดชำระ: ${ticket.totalAmount.toLocaleString()} บาท
📅 ครบกำหนด: ${formatThaiDate(ticket.dueDate)}

กรุณาเตรียมชำระเงินภายใน 3 วันค่ะ`,

    '1day': `🔔 เตือนสุดท้าย: ครบกำหนดชำระพรุ่งนี้!

🎫 ${ticket.id}
💰 ${ticket.totalAmount.toLocaleString()} บาท
📅 ครบกำหนด: พรุ่งนี้

หากไม่ชำระทันเวลา อาจมีค่าปรับเพิ่มเติมค่ะ`,

    'overdue': `⚠️ เกินกำหนดชำระแล้ว

🎫 ${ticket.id}
💰 ${ticket.totalAmount.toLocaleString()} บาท
📅 เกินกำหนด: ${ticket.daysOverdue} วัน

กรุณาติดต่อเราโดยเร็วที่สุดเพื่อหารือแนวทางการชำระค่ะ`
  };
  
  return templates[type];
};
```

**SMS Backup System**:
```javascript
// Send SMS via Thai SMS provider
const sendSMS = async (mobile, message) => {
  const response = await fetch('https://api.sms.provider.th/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SMS_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sender: 'MoneyBag',
      to: mobile,
      message: message,
      unicode: true // Support Thai characters
    })
  });
  
  return response.json();
};
```

**Cron Job Schedule**:
```javascript
// Using node-cron or similar
import cron from 'node-cron';

// Run daily at 9:00 AM
cron.schedule('0 9 * * *', async () => {
  const today = new Date();
  
  // Check for tickets due in 7 days
  const tickets7Days = await getTicketsDueIn(7);
  for (const ticket of tickets7Days) {
    if (!ticket.remindersSent.includes('7days')) {
      await sendLINENotification(ticket.lineUserId, ticket, '7days');
      await markReminderSent(ticket.id, '7days');
    }
  }
  
  // Check for tickets due in 3 days
  const tickets3Days = await getTicketsDueIn(3);
  for (const ticket of tickets3Days) {
    if (!ticket.remindersSent.includes('3days')) {
      await sendLINENotification(ticket.lineUserId, ticket, '3days');
      await markReminderSent(ticket.id, '3days');
    }
  }
  
  // Check for tickets due in 1 day
  const tickets1Day = await getTicketsDueIn(1);
  for (const ticket of tickets1Day) {
    if (!ticket.remindersSent.includes('1day')) {
      await sendLINENotification(ticket.lineUserId, ticket, '1day');
      await sendSMS(ticket.mobile, generateMessage(ticket, '1day'));
      await markReminderSent(ticket.id, '1day');
    }
  }
  
  // Check for overdue tickets
  const overdueTickets = await getOverdueTickets();
  for (const ticket of overdueTickets) {
    await sendLINENotification(ticket.lineUserId, ticket, 'overdue');
    await sendSMS(ticket.mobile, generateMessage(ticket, 'overdue'));
    await updateTicketStatus(ticket.id, 'overdue');
  }
});
```

#### Interest Calculation
**Requirement**: คำนวณดอกเบี้ยแบบอัตโนมัติตามกฎหมาย (ไม่เกิน 15% ต่อปี หรือตามที่ตกลง)

**Implementation**:
- Automated daily interest calculation
- Maximum 15% per year (Thai law compliance)
- Pro-rata calculation for partial periods
- Transparent display to customers

**Interest Calculation Formula**:
```javascript
/**
 * Calculate interest for pawn ticket
 * Thai Pawn Shop Act: Maximum 15% per year
 */
const calculateInterest = (principal, rate, startDate, dueDate) => {
  // Validate rate
  if (rate > 15) {
    throw new Error('Interest rate cannot exceed 15% per year');
  }
  
  // Calculate days
  const start = new Date(startDate);
  const due = new Date(dueDate);
  const days = Math.floor((due - start) / (1000 * 60 * 60 * 24));
  
  // Calculate interest
  // Formula: Interest = Principal × Rate × Days / 365
  const interest = (principal * (rate / 100) * days) / 365;
  
  // Round to 2 decimal places
  const interestAmount = Math.round(interest * 100) / 100;
  const totalAmount = principal + interestAmount;
  
  return {
    principal,
    rate,
    days,
    interestAmount,
    totalAmount,
    dailyRate: (rate / 365).toFixed(4),
    breakdown: {
      principal: principal.toLocaleString('th-TH'),
      interest: interestAmount.toLocaleString('th-TH'),
      total: totalAmount.toLocaleString('th-TH')
    }
  };
};

// Example usage
const result = calculateInterest(
  336000,  // Principal: 336,000 THB
  15,      // Rate: 15% per year
  '2026-03-01',
  '2026-03-31'  // 30 days
);

console.log(result);
// Output:
// {
//   principal: 336000,
//   rate: 15,
//   days: 30,
//   interestAmount: 4140,
//   totalAmount: 340140,
//   dailyRate: '0.0411',
//   breakdown: {
//     principal: '336,000',
//     interest: '4,140',
//     total: '340,140'
//   }
// }
```

**Interest Transparency**:
- Display interest calculation breakdown to customer
- Show daily interest rate
- Explain total amount due
- Provide payment schedule options
- Allow early payment (pro-rata interest)

---

## 2. Non-Functional Requirements

### 2.1 Performance
- Page load time < 3 seconds
- API response time < 500ms
- Real-time gold price update every 5 minutes
- Support 1000 concurrent users

### 2.2 Security
- HTTPS only
- ThaID OAuth 2.0 secure flow
- DOPA API secure integration
- Encrypted data storage
- JWT authentication
- Rate limiting
- CSRF protection
- XSS prevention

### 2.3 Compliance
- Thai Pawn Shop Act compliance
- Personal Data Protection Act (PDPA)
- Anti-Money Laundering (AML) regulations
- Know Your Customer (KYC) requirements
- IAL 2.3 identity assurance

### 2.4 Availability
- 99.9% uptime SLA
- Redundant systems
- Backup and disaster recovery
- Scheduled maintenance windows

### 2.5 Scalability
- Horizontal scaling capability
- Load balancing
- CDN for static assets
- Database replication
- Caching strategy (Redis)

### 2.6 Usability
- Bilingual support (Thai/English)
- Mobile responsive design
- Accessible (WCAG 2.1 AA)
- Intuitive user interface
- Clear error messages

---

## 3. Integration Requirements

### 3.1 ThaID Integration
- OAuth 2.0 provider: ThaID (DOPA)
- Scopes: pid, given_name, family_name, date_of_birth, address
- Callback URL whitelist
- Token refresh mechanism

### 3.2 DOPA Verification
- API endpoint: https://api.bora.dopa.go.th/
- Webhook callback support
- IAL 2.3 certification
- Real-time verification

### 3.3 LINE Official Account
- LINE Messaging API
- Channel setup and verification
- Rich message support (Flex Messages)
- Webhook for user interactions

### 3.4 Gold Price API
- Thailand Gold Association API
- Fallback: GoldAPI.io
- Update frequency: Every 5 minutes
- Historical data storage

### 3.5 SMS Gateway
- Thai SMS provider integration
- Unicode support for Thai language
- Delivery reports
- Cost optimization

---

## 4. Database Schema

### 4.1 Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  national_id VARCHAR(13) UNIQUE NOT NULL,
  thaid_user_id VARCHAR(255) UNIQUE,
  line_user_id VARCHAR(255),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  registered_address TEXT NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  role ENUM('customer', 'staff', 'admin') DEFAULT 'customer',
  ial_level VARCHAR(10),
  dopa_verified BOOLEAN DEFAULT FALSE,
  dopa_verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 4.2 Quotations
```sql
CREATE TABLE quotations (
  id VARCHAR(20) PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  item_category VARCHAR(50) NOT NULL,
  item_description TEXT NOT NULL,
  photos JSON,
  gold_price_snapshot JSON,
  estimated_value DECIMAL(12,2) NOT NULL,
  loan_offer DECIMAL(12,2) NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  valid_until TIMESTAMP NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'expired') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  qr_code TEXT
);
```

### 4.3 Pawn Tickets
```sql
CREATE TABLE pawn_tickets (
  id VARCHAR(20) PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  quotation_id VARCHAR(20) REFERENCES quotations(id),
  item_description TEXT NOT NULL,
  item_photos JSON,
  estimated_value DECIMAL(12,2) NOT NULL,
  principal_amount DECIMAL(12,2) NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  loan_period_days INT NOT NULL,
  start_date TIMESTAMP NOT NULL,
  due_date TIMESTAMP NOT NULL,
  interest_amount DECIMAL(12,2) NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  status ENUM('active', 'overdue', 'paid', 'extended', 'forfeited') DEFAULT 'active',
  days_overdue INT DEFAULT 0,
  reminders_sent JSON,
  contract_signed BOOLEAN DEFAULT FALSE,
  signed_at TIMESTAMP,
  contract_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id)
);
```

### 4.4 Notifications
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  ticket_id VARCHAR(20) REFERENCES pawn_tickets(id),
  user_id UUID REFERENCES users(id),
  type ENUM('line', 'sms') NOT NULL,
  message_type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
  sent_at TIMESTAMP,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 5. Deployment Architecture

```
┌─────────────────┐
│   CloudFlare    │  CDN + DDoS Protection
└────────┬────────┘
         │
┌────────▼────────┐
│  Load Balancer  │  nginx / AWS ALB
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────┐
│ Web 1 │ │ Web 2 │  Node.js / Next.js
└───┬───┘ └──┬────┘
    │        │
    └────┬───┘
         │
┌────────▼────────┐
│   Redis Cache   │  Session + Data Cache
└─────────────────┘
         │
┌────────▼────────┐
│  PostgreSQL DB  │  Primary + Replica
└─────────────────┘
         │
┌────────▼────────┐
│   File Storage  │  AWS S3 / Google Cloud Storage
└─────────────────┘

External APIs:
├── ThaID OAuth
├── DOPA Verification
├── LINE Messaging API
├── Gold Price API
└── SMS Gateway
```

---

This specification provides the complete technical requirements for the Money bag digital pawn shop platform with ThaID integration, real-time gold prices, digital pawn tickets, and LINE OA notifications.

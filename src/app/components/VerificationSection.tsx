import { useState } from 'react';
import { Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

interface VerificationSectionProps {
  language: 'en' | 'th';
}

interface VerificationData {
  lastName: string;
  accountNumber: string;
  mobile: string;
}

interface VerificationResult {
  status: 'approved' | 'rejected';
  reason?: string;
}

export function VerificationSection({ language }: VerificationSectionProps) {
  const [formData, setFormData] = useState<VerificationData>({
    lastName: '',
    accountNumber: '',
    mobile: '',
  });

  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const t = {
    en: {
      title: 'Blacklist Verification',
      subtitle: 'Automated fraud detection and risk assessment',
      lastName: 'Last Name',
      accountNumber: 'Account Number',
      mobile: 'Mobile Number',
      verify: 'Verify Customer',
      checking: 'Checking...',
      approved: 'Verification Passed',
      rejected: 'Verification Failed',
      approvedDesc: 'Customer is not in blacklist. Safe to proceed.',
      rejectedDesc: 'Customer found in blacklist. Loan request rejected.',
      reset: 'Check Another Customer',
      note: 'Note: This system checks against blacklist database for fraud prevention.',
      apiNote: 'Backend Security Note:',
      apiNoteDesc: 'In production, this should call a secure backend API that:',
      apiPoints: [
        'Stores API keys in environment variables',
        'Implements rate limiting and authentication',
        'Uses HTTPS for all requests',
        'Logs verification attempts for audit',
        'Returns structured JSON responses',
      ],
    },
    th: {
      title: 'ตรวจสอบแบล็คลิสต์',
      subtitle: 'ตรวจสอบความเสี่ยงและป้องกันการฉ้อโกงอัตโนมัติ',
      lastName: 'นามสกุล',
      accountNumber: 'เลขบัญชี',
      mobile: 'เบอร์มือถือ',
      verify: 'ตรวจสอบลูกค้า',
      checking: 'กำลังตรวจสอบ...',
      approved: 'ผ่านการตรวจสอบ',
      rejected: 'ไม่ผ่านการตรวจสอบ',
      approvedDesc: 'ลูกค้าไม่อยู่ในแบล็คลิสต์ สามารถดำเนินการได้',
      rejectedDesc: 'พบลูกค้าในแบล็คลิสต์ ปฏิเสธคำขอกู้',
      reset: 'ตรวจสอบลูกค้ารายอื่น',
      note: 'หมายเหตุ: ระบบจะตรวจสอบกับฐานข้อมูลแบล็คลิสต์เพื่อป้องกันการฉ้อโกง',
      apiNote: 'หมายเหตุด้านความปลอดภัย:',
      apiNoteDesc: 'ในการใช้งานจริง ควรเรียก API จาก backend ที่มีความปลอดภัย โดย:',
      apiPoints: [
        'เก็บ API key ใน environment variables',
        'ใช้ rate limiting และ authentication',
        'ใช้ HTTPS สำหรับการเชื่อมต่อ',
        'บันทึกการตรวจสอบเพื่อ audit',
        'ส่งคืน JSON response ที่มีโครงสร้าง',
      ],
    },
  };

  const handleVerification = async () => {
    if (!formData.lastName || !formData.accountNumber || !formData.mobile) {
      toast.error(language === 'en' ? 'Please fill in all fields' : 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setIsChecking(true);

    // Simulate API call to blacklist service
    // In production, this would call:
    // POST /api/verification/check
    // Headers: { 'Authorization': 'Bearer ${process.env.BLACKLIST_API_KEY}' }
    // Body: { lastName, accountNumber, mobile }
    
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock blacklist check
    // Simulate rejection if lastName contains "test" or account number starts with "999"
    const isBlacklisted =
      formData.lastName.toLowerCase().includes('test') ||
      formData.accountNumber.startsWith('999') ||
      formData.mobile.startsWith('000');

    const verificationResult: VerificationResult = {
      status: isBlacklisted ? 'rejected' : 'approved',
      reason: isBlacklisted
        ? language === 'en'
          ? 'Customer found in blacklist database'
          : 'พบลูกค้าในฐานข้อมูลแบล็คลิสต์'
        : undefined,
    };

    setResult(verificationResult);
    setIsChecking(false);

    // Save verification to localStorage
    const verifications = JSON.parse(localStorage.getItem('verifications') || '[]');
    verifications.push({
      ...formData,
      result: verificationResult,
      verifiedAt: new Date().toISOString(),
      id: Date.now().toString(),
    });
    localStorage.setItem('verifications', JSON.stringify(verifications));

    if (verificationResult.status === 'rejected') {
      toast.error(t[language].rejected);
    } else {
      toast.success(t[language].approved);
    }
  };

  const resetForm = () => {
    setFormData({ lastName: '', accountNumber: '', mobile: '' });
    setResult(null);
  };

  return (
    <section id="verification" className="py-20 bg-[#F3F4F6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Shield className="w-16 h-16 text-[#0A1F44] mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-[#0A1F44] mb-4 font-['Montserrat']">
            {t[language].title}
          </h2>
          <p className="text-lg text-gray-600 font-['Inter']">{t[language].subtitle}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!result ? (
            <div className="space-y-6">
              <div>
                <Label htmlFor="lastName">{t[language].lastName} *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  className="mt-2 font-['Inter']"
                />
              </div>

              <div>
                <Label htmlFor="accountNumber">{t[language].accountNumber} *</Label>
                <Input
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  required
                  className="mt-2 font-['Inter']"
                />
              </div>

              <div>
                <Label htmlFor="mobile">{t[language].mobile} *</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  required
                  className="mt-2 font-['Inter']"
                />
              </div>

              <Button
                onClick={handleVerification}
                disabled={isChecking}
                className="w-full bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white py-6 font-['Inter']"
              >
                <Shield className="mr-2 w-5 h-5" />
                {isChecking ? t[language].checking : t[language].verify}
              </Button>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-600 font-['Inter']">{t[language].note}</p>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              {result.status === 'approved' ? (
                <CheckCircle className="w-20 h-20 text-[#10B981] mx-auto" />
              ) : (
                <AlertCircle className="w-20 h-20 text-[#EF4444] mx-auto" />
              )}

              <div>
                <h3 className="text-2xl font-bold mb-2 font-['Montserrat']" style={{ color: result.status === 'approved' ? '#10B981' : '#EF4444' }}>
                  {result.status === 'approved' ? t[language].approved : t[language].rejected}
                </h3>
                <p className="text-gray-600 font-['Inter']">
                  {result.status === 'approved' ? t[language].approvedDesc : t[language].rejectedDesc}
                </p>
                {result.reason && (
                  <p className="mt-2 text-sm text-gray-500 font-['Inter']">{result.reason}</p>
                )}
              </div>

              <Button onClick={resetForm} variant="outline" className="font-['Inter']">
                {t[language].reset}
              </Button>
            </div>
          )}

          {/* Backend Security Note */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
            <h4 className="font-bold text-[#0A1F44] mb-2 font-['Montserrat']">{t[language].apiNote}</h4>
            <p className="text-sm text-gray-600 mb-3 font-['Inter']">{t[language].apiNoteDesc}</p>
            <ul className="space-y-2">
              {t[language].apiPoints.map((point, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-[#10B981] mr-2">•</span>
                  <span className="text-sm text-gray-600 font-['Inter']">{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 p-3 bg-gray-100 rounded font-mono text-xs text-gray-700">
              <div>// Example API endpoint structure:</div>
              <div className="text-[#10B981]">POST /api/verification/check</div>
              <div>Headers: &#123; Authorization: process.env.BLACKLIST_API_KEY &#125;</div>
              <div>Body: &#123; lastName, accountNumber, mobile &#125;</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

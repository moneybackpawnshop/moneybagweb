import { useState } from 'react';
import { UserCheck, Upload, Shield, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';
import { Alert, AlertDescription } from './ui/alert';

interface KYCSectionProps {
  language: 'en' | 'th';
}

interface KYCData {
  firstName: string;
  lastName: string;
  nationalId: string;
  address: string;
  dob: string;
  mobile: string;
  email: string;
  dopaVerified: boolean;
  thaIdConnected: boolean;
  ial23Verified: boolean;
  role: 'customer' | 'staff' | 'admin';
  consent: boolean;
}

export function KYCSection({ language }: KYCSectionProps) {
  const [formData, setFormData] = useState<KYCData>({
    firstName: '',
    lastName: '',
    nationalId: '',
    address: '',
    dob: '',
    mobile: '',
    email: '',
    dopaVerified: false,
    thaIdConnected: false,
    ial23Verified: false,
    role: 'customer',
    consent: false,
  });

  const t = {
    en: {
      title: 'ThaID Registration',
      subtitle: 'Verify your identity with ThaID',
      connectThaId: 'Connect with ThaID',
      thaIdConnected: 'ThaID Connected',
      firstName: 'First Name',
      lastName: 'Last Name',
      nationalId: 'National ID',
      address: 'Registered Address',
      dob: 'Date of Birth',
      mobile: 'Mobile Number',
      email: 'Email Address',
      dopaStatus: 'DOPA Verification (IAL 2.3)',
      verified: 'Verified',
      pending: 'Pending Verification',
      roleLabel: 'Account Type',
      customer: 'Customer',
      staff: 'Staff',
      admin: 'Administrator',
      consent: 'I consent to the collection and processing of my personal data',
      submit: 'Complete Registration',
      success: 'Registration completed successfully!',
      required: 'Please connect with ThaID first',
      consentRequired: 'Please consent to data processing',
      autoFilled: 'Auto-filled from ThaID',
    },
    th: {
      title: 'ลงทะเบียนด้วย ThaID',
      subtitle: 'ยืนยันตัวตนผ่าน ThaID',
      connectThaId: 'เชื่อมต่อกับ ThaID',
      thaIdConnected: 'เชื่อมต่อ ThaID แล้ว',
      firstName: 'ชื่อจริง',
      lastName: 'นามสกุล',
      nationalId: 'เลขบัตรประชาชน',
      address: 'ที่อยู่ตามทะเบียนราษฎร',
      dob: 'วันเกิด',
      mobile: 'เบอร์มือถือ',
      email: 'อีเมล',
      dopaStatus: 'การยืนยันจาก DOPA (IAL 2.3)',
      verified: 'ยืนยันแล้ว',
      pending: 'รอการยืนยัน',
      roleLabel: 'ประเภทบัญชี',
      customer: 'ลูกค้า',
      staff: 'พนักงาน',
      admin: 'ผู้ดูแลระบบ',
      consent: 'ฉันยินยอมให้เก็บรวบรวมและประมวลผลข้อมูลส่วนบุคคล',
      submit: 'ลงทะเบียน',
      success: 'ลงทะเบียนสำเร็จแล้ว!',
      required: 'กรุณาเชื่อมต่อกับ ThaID ก่อน',
      consentRequired: 'กรุณายินยอมการประมวลผลข้อมูล',
      autoFilled: 'กรอกอัตโนมัติจาก ThaID',
    },
  };

  // Simulate ThaID connection
  const handleThaIdConnect = () => {
    // In production, this would redirect to ThaID OAuth flow
    // For now, simulate auto-filling data
    setFormData({
      ...formData,
      firstName: 'สมชาย',
      lastName: 'ใจดี',
      nationalId: '1234567890123',
      address: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110',
      dob: '1990-01-15',
      thaIdConnected: true,
    });

    // Simulate DOPA callback after 2 seconds
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        dopaVerified: true,
        ial23Verified: true,
      }));
      toast.success(language === 'en' ? 'DOPA verification completed' : 'ยืนยันจาก DOPA สำเร็จ');
    }, 2000);

    toast.success(language === 'en' ? 'ThaID connected successfully' : 'เชื่อมต่อ ThaID สำเร็จ');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.thaIdConnected) {
      toast.error(t[language].required);
      return;
    }

    if (!formData.consent) {
      toast.error(t[language].consentRequired);
      return;
    }

    // Save to localStorage
    const existingKYC = JSON.parse(localStorage.getItem('kycRecords') || '[]');
    existingKYC.push({
      ...formData,
      submittedAt: new Date().toISOString(),
      id: Date.now().toString(),
    });
    localStorage.setItem('kycRecords', JSON.stringify(existingKYC));

    toast.success(t[language].success);

    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      nationalId: '',
      address: '',
      dob: '',
      mobile: '',
      email: '',
      dopaVerified: false,
      thaIdConnected: false,
      ial23Verified: false,
      role: 'customer',
      consent: false,
    });
  };

  return (
    <section id="kyc" className="py-20 bg-[#F3F4F6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <UserCheck className="w-16 h-16 text-[#10B981] mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-[#0A1F44] mb-4 font-['Montserrat']">
            {t[language].title}
          </h2>
          <p className="text-lg text-gray-600 font-['Inter']">{t[language].subtitle}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* ThaID Connection Button */}
          {!formData.thaIdConnected ? (
            <div className="text-center py-12">
              <Shield className="w-20 h-20 text-[#10B981] mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-[#0A1F44] mb-4 font-['Montserrat']">
                {language === 'en' ? 'Secure Identity Verification' : 'ยืนยันตัวตนอย่างปลอดภัย'}
              </h3>
              <p className="text-gray-600 mb-8 font-['Inter']">
                {language === 'en' 
                  ? 'Connect with ThaID to automatically import your registered information'
                  : 'เชื่อมต่อกับ ThaID เพื่อนำเข้าข้อมูลทะเบียนราษฎรอัตโนมัติ'}
              </p>
              <Button
                onClick={handleThaIdConnect}
                size="lg"
                className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-6 text-lg font-['Inter']"
              >
                <Shield className="w-5 h-5 mr-2" />
                {t[language].connectThaId}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ThaID Connected Status */}
              <Alert className="bg-[#10B981]/10 border-[#10B981]">
                <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                <AlertDescription className="text-[#059669] font-['Inter']">
                  {t[language].thaIdConnected} - {t[language].autoFilled}
                </AlertDescription>
              </Alert>

              {/* DOPA Verification Status */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className={`w-6 h-6 ${formData.ial23Verified ? 'text-[#10B981]' : 'text-gray-400'}`} />
                    <div>
                      <p className="font-bold text-[#0A1F44] font-['Inter']">{t[language].dopaStatus}</p>
                      <p className="text-sm text-gray-600 font-['Inter']">
                        {formData.ial23Verified ? t[language].verified : t[language].pending}
                      </p>
                    </div>
                  </div>
                  {formData.ial23Verified && (
                    <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
                  )}
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">{t[language].firstName} *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    required
                    disabled
                    className="mt-2 font-['Inter'] bg-gray-50"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">{t[language].lastName} *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    required
                    disabled
                    className="mt-2 font-['Inter'] bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="nationalId">{t[language].nationalId} *</Label>
                <Input
                  id="nationalId"
                  value={formData.nationalId}
                  required
                  disabled
                  className="mt-2 font-['Inter'] bg-gray-50"
                />
              </div>

              <div>
                <Label htmlFor="address">{t[language].address} *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  required
                  disabled
                  className="mt-2 font-['Inter'] bg-gray-50"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="dob">{t[language].dob} *</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  required
                  disabled
                  className="mt-2 font-['Inter'] bg-gray-50"
                />
              </div>

              {/* Contact Information - Editable */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="mobile">{t[language].mobile} *</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData({ ...formData, mobile: e.target.value })
                    }
                    required
                    className="mt-2 font-['Inter']"
                  />
                </div>
                <div>
                  <Label htmlFor="email">{t[language].email} *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="mt-2 font-['Inter']"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <Label htmlFor="role">{t[language].roleLabel}</Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as 'customer' | 'staff' | 'admin' })
                  }
                  className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 font-['Inter']"
                >
                  <option value="customer">{t[language].customer}</option>
                  <option value="staff">{t[language].staff}</option>
                  <option value="admin">{t[language].admin}</option>
                </select>
              </div>

              {/* Consent */}
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="consent"
                  checked={formData.consent}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, consent: checked as boolean })
                  }
                />
                <label
                  htmlFor="consent"
                  className="text-sm text-gray-700 cursor-pointer font-['Inter']"
                >
                  {t[language].consent}
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-6 font-['Inter']"
              >
                {t[language].submit}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
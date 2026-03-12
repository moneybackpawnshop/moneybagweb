import { Info } from 'lucide-react';

interface InfoBannerProps {
  language: 'en' | 'th';
}

export function InfoBanner({ language }: InfoBannerProps) {
  const t = {
    en: {
      title: 'Demo Application',
      message: 'This prototype simulates ThaID integration, DOPA verification, real-time gold prices, and LINE notifications. All data stored locally. Production requires secure backend with proper API integrations.',
    },
    th: {
      title: 'แอปพลิเคชันทดลอง',
      message: 'ต้นแบบนี้จำลองการเชื่อมต่อ ThaID, การยืนยัน DOPA, ราคาทองเรียลไทม์ และการแจ้งเตือนผ่าน LINE ข้อมูลเก็บในเบราว์เซอร์ การใช้จริงต้องมี backend และ API ที่ปลอดภัย',
    },
  };

  return (
    <div className="bg-blue-50 border-b border-blue-200 py-3 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-2">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <p className="text-sm text-blue-800 font-['Inter']">
            <span className="font-bold">{t[language].title}:</span> {t[language].message}
          </p>
        </div>
      </div>
    </div>
  );
}
import { Outlet } from 'react-router';
import { Header } from '../components/Header';
import { Chatbot } from '../components/Chatbot';
import { Toaster } from '../components/ui/sonner';
import { useLanguage } from '../contexts/LanguageContext';

export function Layout() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <Header language={language} onLanguageToggle={toggleLanguage} />
      
      <main className="min-h-[calc(100vh-200px)]">
        <Outlet />
      </main>

      <footer className="bg-[#0A1F44] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-[#10B981] rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl font-bold font-['Montserrat']">M</span>
                </div>
                <span className="text-white text-xl font-bold font-['Montserrat']">Moneybag</span>
              </div>
              <p className="text-gray-300 font-['Inter']">
                {language === 'en'
                  ? 'Your trusted online pawn shop with AI-powered valuation and secure transactions.'
                  : 'โรงรับจำนำออนไลน์ที่น่าเชื่อถือพร้อมการประเมินด้วย AI และธุรกรรมที่ปลอดภัย'}
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 font-['Montserrat']">
                {language === 'en' ? 'Quick Links' : 'ลิงก์ด่วน'}
              </h4>
              <ul className="space-y-2 font-['Inter']">
                <li>
                  <a href="/kyc" className="text-gray-300 hover:text-[#10B981] transition-colors">
                    {language === 'en' ? 'KYC Verification' : 'ยืนยันตัวตน'}
                  </a>
                </li>
                <li>
                  <a href="/evaluation" className="text-gray-300 hover:text-[#10B981] transition-colors">
                    {language === 'en' ? 'AI Valuation' : 'ประเมินราคา'}
                  </a>
                </li>
                <li>
                  <a href="/verification" className="text-gray-300 hover:text-[#10B981] transition-colors">
                    {language === 'en' ? 'Verification' : 'ตรวจสอบ'}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 font-['Montserrat']">
                {language === 'en' ? 'Contact' : 'ติดต่อเรา'}
              </h4>
              <p className="text-gray-300 font-['Inter']">
                {language === 'en' ? 'Email: moneybagpawnshop@gmail.com' : 'อีเมล: moneybagpawnshop@gmail.com'}
              </p>
              <p className="text-gray-300 mt-2 font-['Inter']">
                {language === 'en' ? 'Phone: 091-010-9286' : 'โทร: 091-010-9286'}
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 font-['Inter']">
            <p>© 2026 Moneybag. {language === 'en' ? 'All rights reserved.' : 'สงวนลิขสิทธิ์'}</p>
          </div>
        </div>
      </footer>

      <Chatbot language={language} />
      <Toaster position="top-center" richColors />
    </div>
  );
}
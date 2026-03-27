import { useState } from 'react';
import { Globe } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { Button } from './ui/button';
import { Logo } from './ui/Logo';
interface HeaderProps {
  language: 'en' | 'th';
  onLanguageToggle: () => void;
}

export function Header({ language, onLanguageToggle }: HeaderProps) {
  const location = useLocation();
  
  const t = {
    en: {
      home: 'Home',
      kyc: 'KYC',
      evaluation: 'Evaluation',
      pawnTickets: 'Pawn Tickets',
      verification: 'Verification',
      staff: 'Staff Portal',
      stock: 'Stock Management',
    },
    th: {
      home: 'หน้าหลัก',
      kyc: 'ยืนยันตัวตน',
      evaluation: 'ประเมินราคา',
      pawnTickets: 'ตั๋วจำนำ',
      verification: 'ตรวจสอบ',
      staff: 'พนักงาน',
      stock: 'จัดการสต็อก',
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A1F44] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/">
            <Logo />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`transition-colors font-['Inter'] ${
                isActive('/') ? 'text-[#10B981]' : 'text-white hover:text-[#10B981]'
              }`}
            >
              {t[language].home}
            </Link>
            <Link
              to="/kyc"
              className={`transition-colors font-['Inter'] ${
                isActive('/kyc') ? 'text-[#10B981]' : 'text-white hover:text-[#10B981]'
              }`}
            >
              {t[language].kyc}
            </Link>
            <Link
              to="/evaluation"
              className={`transition-colors font-['Inter'] ${
                isActive('/evaluation') ? 'text-[#10B981]' : 'text-white hover:text-[#10B981]'
              }`}
            >
              {t[language].evaluation}
            </Link>
            <Link
              to="/pawn-tickets"
              className={`transition-colors font-['Inter'] ${
                isActive('/pawn-tickets') ? 'text-[#10B981]' : 'text-white hover:text-[#10B981]'
              }`}
            >
              {t[language].pawnTickets}
            </Link>
            <Link
              to="/verification"
              className={`transition-colors font-['Inter'] ${
                isActive('/verification') ? 'text-[#10B981]' : 'text-white hover:text-[#10B981]'
              }`}
            >
              {t[language].verification}
            </Link>
            <Link
              to="/staff"
              className={`transition-colors font-['Inter'] ${
                isActive('/staff') ? 'text-[#10B981]' : 'text-white hover:text-[#10B981]'
              }`}
            >
              {t[language].staff}
            </Link>
            <Link
              to="/stock"
              className={`transition-colors font-['Inter'] ${
                isActive('/stock') ? 'text-[#10B981]' : 'text-white hover:text-[#10B981]'
              }`}
            >
              {t[language].stock}
            </Link>
          </nav>

          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onLanguageToggle}
            className="text-white hover:text-[#10B981] hover:bg-[#0A1F44]/50"
          >
            <Globe className="w-5 h-5 mr-2" />
            {language === 'en' ? 'ไทย' : 'EN'}
          </Button>
        </div>
      </div>
    </header>
  );
}
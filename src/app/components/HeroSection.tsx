import { ArrowRight, Shield, Zap, Award } from 'lucide-react';
import { Button } from './ui/button';

interface HeroSectionProps {
  language: 'en' | 'th';
}

export function HeroSection({ language }: HeroSectionProps) {
  const t = {
    en: {
      title: 'Fast Cash, Secure Pawn',
      subtitle: 'AI-powered valuation with real-time gold prices',
      description: 'Register with ThaID, get instant AI valuations using real-time market data, and manage your pawn tickets with automated LINE notifications. Money bag - Your trusted digital pawn shop.',
      cta: 'Get Started',
      features: [
        { icon: Zap, title: 'ThaID Integration', desc: 'Instant registration with DOPA verification' },
        { icon: Shield, title: 'AI Valuation', desc: 'Real-time gold prices & smart analysis' },
        { icon: Award, title: 'LINE Notifications', desc: 'Automated payment reminders via LINE OA' },
      ],
    },
    th: {
      title: 'เงินสดเร็ว ปลอดภัย',
      subtitle: 'ประเมินราคาด้วย AI พร้อมราคาทองแบบเรียลไทม์',
      description: 'ลงทะเบียนผ่าน ThaID รับการประเมินทันทีด้วย AI ที่ใช้ข้อมูลตลาดแบบเรียลไทม์ และจัดการตั๋วจำนำด้วยระบบแจ้งเตือนผ่าน LINE อัตโนมัติ Money bag - ร้านจำนำดิจิทัลที่คุณไว้วางใจ',
      cta: 'เริ่มต้น',
      features: [
        { icon: Zap, title: 'เชื่อมต่อ ThaID', desc: 'ลงทะเบียนทันทีพร้อมยืนยันจาก DOPA' },
        { icon: Shield, title: 'ประเมินด้วย AI', desc: 'ราคาทองเรียลไทม์และการวิเคราะห์อัจฉริยะ' },
        { icon: Award, title: 'แจ้งเตือนผ่าน LINE', desc: 'รับการแจ้งเตือนอัตโนมัติผ่าน LINE OA' },
      ],
    },
  };

  const scrollToKYC = () => {
    const element = document.getElementById('kyc');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-16 bg-gradient-to-br from-[#0A1F44] via-[#0A1F44] to-[#10B981]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white font-['Montserrat']">
              {t[language].title}
            </h1>
            <p className="text-xl text-[#10B981] font-['Montserrat']">
              {t[language].subtitle}
            </p>
            <p className="text-lg text-gray-300 font-['Inter']">
              {t[language].description}
            </p>
            <Button
              onClick={scrollToKYC}
              size="lg"
              className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-6 text-lg font-['Inter']"
            >
              {t[language].cta}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          <div className="grid gap-6">
            {t[language].features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all"
              >
                <feature.icon className="w-10 h-10 text-[#10B981] mb-3" />
                <h3 className="text-xl font-bold text-white mb-2 font-['Montserrat']">{feature.title}</h3>
                <p className="text-gray-300 font-['Inter']">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
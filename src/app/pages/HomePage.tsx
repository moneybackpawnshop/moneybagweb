import { HeroSection } from '../components/HeroSection';
import { InfoBanner } from '../components/InfoBanner';
import { useLanguage } from '../contexts/LanguageContext';

export function HomePage() {
  const { language } = useLanguage();
  
  return (
    <>
      <InfoBanner language={language} />
      <HeroSection language={language} />
    </>
  );
}

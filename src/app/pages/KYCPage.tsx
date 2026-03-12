import { KYCSection } from '../components/KYCSection';
import { useLanguage } from '../contexts/LanguageContext';

export function KYCPage() {
  const { language } = useLanguage();
  
  return (
    <div className="py-8">
      <KYCSection language={language} />
    </div>
  );
}

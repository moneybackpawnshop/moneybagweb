import { VerificationSection } from '../components/VerificationSection';
import { useLanguage } from '../contexts/LanguageContext';

export function VerificationPage() {
  const { language } = useLanguage();
  
  return (
    <div className="py-8">
      <VerificationSection language={language} />
    </div>
  );
}

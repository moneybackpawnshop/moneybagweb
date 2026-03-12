import { StaffSection } from '../components/StaffSection';
import { useLanguage } from '../contexts/LanguageContext';

export function StaffPage() {
  const { language } = useLanguage();
  
  return (
    <div className="py-8">
      <StaffSection language={language} />
    </div>
  );
}

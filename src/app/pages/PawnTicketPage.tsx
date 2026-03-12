import { PawnTicketSection } from '../components/PawnTicketSection';
import { useLanguage } from '../contexts/LanguageContext';

export function PawnTicketPage() {
  const { language } = useLanguage();
  
  return (
    <div className="py-8">
      <PawnTicketSection language={language} />
    </div>
  );
}

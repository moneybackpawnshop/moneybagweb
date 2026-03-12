import { StockSection } from '../components/StockSection';
import { useLanguage } from '../contexts/LanguageContext';

export function StockPage() {
  const { language } = useLanguage();
  
  return (
    <div className="py-8">
      <StockSection language={language} />
    </div>
  );
}

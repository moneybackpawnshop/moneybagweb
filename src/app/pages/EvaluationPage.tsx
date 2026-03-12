import { EvaluationSection } from '../components/EvaluationSection';
import { useLanguage } from '../contexts/LanguageContext';

export function EvaluationPage() {
  const { language } = useLanguage();
  
  return (
    <div className="py-8">
      <EvaluationSection language={language} />
    </div>
  );
}

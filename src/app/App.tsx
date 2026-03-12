import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { LanguageProvider } from './contexts/LanguageContext';
import { router } from './routes';

/**
 * Moneybag - Online Pawn Shop Application
 * 
 * Multi-page application using React Router v7 with the following routes:
 * - / (Home): Landing page with hero section
 * - /kyc: KYC verification form
 * - /evaluation: AI-powered asset evaluation
 * - /verification: Blacklist checking
 * - /staff: Staff decision portal
 * - /stock: Stock management & reminders
 * 
 * Features:
 * - Bilingual support (English/Thai)
 * - n8n webhook integration for chatbot
 * - Brand colors: Midnight Navy, Emerald, Gold, Soft Shell
 * - Fonts: Montserrat (headings), Inter (body)
 */
function App() {
  useEffect(() => {
    // Apply custom fonts to body
    document.body.style.fontFamily = "'Inter', sans-serif";
  }, []);

  return (
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  );
}

export default App;

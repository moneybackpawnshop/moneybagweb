import { createHashRouter } from 'react-router';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { KYCPage } from './pages/KYCPage';
import { EvaluationPage } from './pages/EvaluationPage';
import { VerificationPage } from './pages/VerificationPage';
import { StaffPage } from './pages/StaffPage';
import { StockPage } from './pages/StockPage';
import { PawnTicketPage } from './pages/PawnTicketPage';

export const router = createHashRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'kyc', element: <KYCPage /> },
        { path: 'evaluation', element: <EvaluationPage /> },
        { path: 'pawn-tickets', element: <PawnTicketPage /> },
        { path: 'verification', element: <VerificationPage /> },
        { path: 'staff', element: <StaffPage /> },
        { path: 'stock', element: <StockPage /> },
      ],
    },
  ],
  {
    basename: '/', // 👈 ADD THIS
  }
);
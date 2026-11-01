import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { UploadPage } from '../pages/UploadPage/UploadPage';
import { ValidatePage } from '../pages/ValidatePage/ValidatePage';
import { ResultsPage } from '../pages/ResultsPage/ResultsPage';
import { ThresholdSimulatorPage } from '../pages/ThresholdSimulatorPage/ThresholdSimulatorPage';
import { CampaignStudioPage } from '../pages/CampaignStudioPage/CampaignStudioPage';
import { CampaignHistoryPage } from '../pages/CampaignHistoryPage/CampaignHistoryPage';
import { ModelPage } from '../pages/ModelPage/ModelPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <UploadPage />,
      },
      {
        path: 'check',
        element: <ValidatePage />,
      },
      {
        path: 'results/:id',
        element: <ResultsPage />,
      },
      {
        path: 'results/:id/simulate',
        element: <ThresholdSimulatorPage />,
      },
      {
        path: 'campaign',
        element: <CampaignStudioPage />,
      },
      {
        path: 'campaigns',
        element: <CampaignHistoryPage />,
      },
      {
        path: 'model',
        element: <ModelPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

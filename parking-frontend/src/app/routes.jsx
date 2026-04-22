/**
 * Route definitions for Smart Parking system
 * Defines URL paths and their corresponding pages
 */

import DashboardPage from '../features/dashboard/pages/DashboardPage';
import GuidancePage from '../features/guidance/pages/GuidancePage';
import MonitoringPage from '../features/monitoring/pages/MonitoringPage';
import SignagePage from '../features/signage/pages/SignagePage';

export const routes = [
  {
    path: '/',
    element: <DashboardPage />,
    label: 'Dashboard'
  },
  {
    path: '/guidance',
    element: <GuidancePage />,
    label: 'Guidance'
  },
  {
    path: '/monitoring',
    element: <MonitoringPage />,
    label: 'Monitoring'
  },
  {
    path: '/signage',
    element: <SignagePage />,
    label: 'Signage'
  }
];

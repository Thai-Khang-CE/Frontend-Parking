import { useEffect, useState } from 'react';
import {
  dashboardMockData,
  generateUpdatedDashboardData,
} from '../../../mock/dashboardMock.js';

export function useDashboard(pollInterval = 10000) {
  const [data, setData] = useState(dashboardMockData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(false);
    setError(null);

    const interval = setInterval(() => {
      try {
        setData(generateUpdatedDashboardData());
      } catch (err) {
        setError('Failed to update dashboard data');
      }
    }, pollInterval);

    return () => clearInterval(interval);
  }, [pollInterval]);

  return { data, loading, error };
}

export default useDashboard;
import { useEffect, useState } from 'react';
import {
  dashboardMockData,
  generateUpdatedDashboardData,
} from '../../../mock/dashboardMock.js';

export function useDashboard(pollInterval = 10000) {
  const [data, setData] = useState(dashboardMockData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeAgo, setTimeAgo] = useState('just now');

  // Polling and data updates
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

  // Calculate and update relative time display
  useEffect(() => {
    const updateTimeAgo = () => {
      if (!data.updatedAt) return;
      
      const now = new Date();
      const updated = new Date(data.updatedAt);
      const diffSeconds = Math.floor((now - updated) / 1000);

      if (diffSeconds < 10) {
        setTimeAgo('just now');
      } else if (diffSeconds < 60) {
        setTimeAgo(`${diffSeconds}s ago`);
      } else if (diffSeconds < 3600) {
        const minutes = Math.floor(diffSeconds / 60);
        setTimeAgo(`${minutes}m ago`);
      } else {
        const hours = Math.floor(diffSeconds / 3600);
        setTimeAgo(`${hours}h ago`);
      }
    };

    updateTimeAgo();
    const timer = setInterval(updateTimeAgo, 1000);

    return () => clearInterval(timer);
  }, [data.updatedAt]);

  return { data, loading, error, timeAgo };
}

export default useDashboard;
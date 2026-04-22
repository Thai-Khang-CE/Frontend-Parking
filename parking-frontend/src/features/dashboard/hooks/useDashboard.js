import { useState, useEffect } from 'react';
import { useParkingContext } from '../../../context/ParkingContext.jsx';

export function useDashboard() {
  const ctx = useParkingContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Re-derive dashboard data whenever shared state revision increments
  useEffect(() => {
    void ctx.revision; // subscribe to context
    try {
      setError(null);
    } catch (err) {
      setError('Failed to update dashboard data');
    }
  }, [ctx.revision]);

  // Derive from shared state (reads live module data)
  const data = ctx.getDashboardData();

  return { data, loading, error, timeAgo: ctx.timeAgo };
}

export default useDashboard;
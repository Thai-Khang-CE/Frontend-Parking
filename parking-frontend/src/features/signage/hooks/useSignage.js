import { useState, useEffect } from 'react';
import { useParkingContext } from '../../../context/ParkingContext.jsx';

export function useSignage() {
  const ctx = useParkingContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Re-derive signage data whenever shared state changes
  useEffect(() => {
    void ctx.revision; // subscribe to context
    try {
      setError(null);
    } catch (err) {
      setError('Failed to update signage');
    }
  }, [ctx.revision]);

  // Derive from shared state
  const data = ctx.getSignageData();
  const display = ctx.getSignageDisplayMessage(data);

  return { data, display, loading, error, timeAgo: ctx.timeAgo };
}

export default useSignage;

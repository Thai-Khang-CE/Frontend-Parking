import { useState, useEffect } from 'react';
import { useParkingContext } from '../../../context/ParkingContext.jsx';

export function useGuidance() {
  const ctx = useParkingContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Re-derive guidance whenever shared state changes
  useEffect(() => {
    void ctx.revision; // subscribe to context
    try {
      setError(null);
    } catch (err) {
      setError('Failed to get guidance data');
    }
  }, [ctx.revision]);

  // Derive from shared state
  const data = ctx.getGuidanceData();

  return { data, loading, error };
}

export default useGuidance;

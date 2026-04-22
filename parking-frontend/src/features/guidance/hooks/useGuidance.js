import { useState, useCallback } from 'react';
import { guidanceMockData, generateGuidanceData } from '../../../mock/guidanceMock.js';

export function useGuidance() {
  const [data, setData] = useState(guidanceMockData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestGuidance = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API call with small delay for realism
      setTimeout(() => {
        const newGuidance = generateGuidanceData();
        setData(newGuidance);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Failed to get guidance data');
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    requestGuidance
  };
}

export default useGuidance;

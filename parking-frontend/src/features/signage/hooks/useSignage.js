import { useState, useEffect, useCallback } from 'react';
import {
  signageMockData,
  generateSignageData,
  updateSignageDisplay,
  getSignageDisplayMessage
} from '../../../mock/signageMock.js';

export function useSignage(pollInterval = 7000) {
  const [data, setData] = useState(signageMockData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [timeAgo, setTimeAgo] = useState('just now');

  const fetchData = useCallback(() => {
    try {
      setLoading(true);
      // simulate async fetch
      setTimeout(() => {
        const next = updateSignageDisplay();
        setData(next);
        setLastUpdated(new Date());
        setLoading(false);
      }, 250);
    } catch (err) {
      setError('Failed to update signage');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // initial
    fetchData();
    const id = setInterval(fetchData, pollInterval);
    return () => clearInterval(id);
  }, [fetchData, pollInterval]);

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const seconds = Math.floor((now - lastUpdated) / 1000);
      if (seconds < 5) return 'just now';
      if (seconds < 60) return `${seconds}s ago`;
      if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
      if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
      return `${Math.floor(seconds / 86400)}d ago`;
    };
    setTimeAgo(calc());
    const tid = setInterval(() => setTimeAgo(calc()), 1000);
    return () => clearInterval(tid);
  }, [lastUpdated]);

  const requestUpdate = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const display = getSignageDisplayMessage(data);

  return {
    data,
    display,
    loading,
    error,
    timeAgo,
    requestUpdate
  };
}

export default useSignage;

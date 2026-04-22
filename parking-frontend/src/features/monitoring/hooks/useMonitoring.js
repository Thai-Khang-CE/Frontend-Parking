import { useState, useEffect, useCallback } from 'react';
import { monitoringMockData, generateUpdatedMonitoringData } from '../../../mock/monitoringMock.js';

export function useMonitoring(pollInterval = 5000) {
  const [data, setData] = useState(monitoringMockData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedZoneId, setSelectedZoneId] = useState(monitoringMockData.selectedZoneId);
  const [timeAgo, setTimeAgo] = useState('just now');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Polling effect - updates slot data at regular intervals
  useEffect(() => {
    const pollData = () => {
      try {
        setLoading(true);
        // Simulate async API call
        setTimeout(() => {
          const updatedData = generateUpdatedMonitoringData(selectedZoneId);
          setData(updatedData);
          setLastUpdated(new Date());
          setLoading(false);
        }, 300);
      } catch (err) {
        setError('Failed to update monitoring data');
        setLoading(false);
      }
    };

    // Initial fetch
    pollData();

    // Set up polling interval
    const intervalId = setInterval(pollData, pollInterval);

    return () => clearInterval(intervalId);
  }, [selectedZoneId, pollInterval]);

  // TimeAgo update effect - updates display text every second
  useEffect(() => {
    const calculateTimeAgo = () => {
      const now = new Date();
      const seconds = Math.floor((now - lastUpdated) / 1000);

      if (seconds < 5) return 'just now';
      if (seconds < 60) return `${seconds}s ago`;
      if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
      if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
      return `${Math.floor(seconds / 86400)}d ago`;
    };

    setTimeAgo(calculateTimeAgo());
    const timeIntervalId = setInterval(() => setTimeAgo(calculateTimeAgo()), 1000);

    return () => clearInterval(timeIntervalId);
  }, [lastUpdated]);

  const selectZone = useCallback((zoneId) => {
    setSelectedZoneId(zoneId);
  }, []);

  return {
    data,
    loading,
    error,
    timeAgo,
    selectedZoneId,
    selectZone
  };
}

export default useMonitoring;

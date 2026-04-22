import { useState, useCallback } from 'react';
import { useParkingContext } from '../../../context/ParkingContext.jsx';

export function useMonitoring() {
  const ctx = useParkingContext();
  const [selectedZoneId, setSelectedZoneId] = useState('zone-b');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Derive monitoring data reactively from shared state
  const data = ctx.getMonitoringData(selectedZoneId);

  const selectZone = useCallback((zoneId) => {
    setSelectedZoneId(zoneId);
  }, []);

  // Refresh/advance action — only Monitoring can trigger this
  const refreshSlots = useCallback(() => {
    try {
      setLoading(true);
      ctx.refreshSlots();
      setLoading(false);
    } catch (err) {
      setError('Failed to refresh monitoring data');
      setLoading(false);
    }
  }, [ctx]);

  return {
    data,
    loading,
    error,
    timeAgo: ctx.timeAgo,
    selectedZoneId,
    selectZone,
    refreshSlots
  };
}

export default useMonitoring;

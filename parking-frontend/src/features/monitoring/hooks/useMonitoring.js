import { useState, useCallback } from 'react';
import { useParkingContext } from '../../../context/ParkingContext.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';

export function useMonitoring() {
  const ctx = useParkingContext();
  const { hasRole } = useAuth();
  const [selectedZoneId, setSelectedZoneId] = useState('zone-b');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const data = ctx.getMonitoringData(selectedZoneId);
  const canEditSlots = hasRole('admin');

  const selectZone = useCallback((zoneId) => {
    setSelectedZoneId(zoneId);
    setError(null);
  }, []);

  const refreshSlots = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      ctx.refreshSlots();
      setLoading(false);
    } catch (err) {
      setError('Failed to refresh monitoring data');
      setLoading(false);
    }
  }, [ctx]);

  const updateSlotStatus = useCallback((slotId, status) => {
    if (!canEditSlots) {
      return false;
    }

    try {
      setError(null);
      ctx.updateSlotStatus(selectedZoneId, slotId, status);
      return true;
    } catch (err) {
      setError('Failed to update slot status');
      return false;
    }
  }, [canEditSlots, ctx, selectedZoneId]);

  return {
    data,
    loading,
    error,
    timeAgo: ctx.timeAgo,
    selectedZoneId,
    selectZone,
    refreshSlots,
    canEditSlots,
    updateSlotStatus
  };
}

export default useMonitoring;

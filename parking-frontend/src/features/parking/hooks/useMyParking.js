/**
 * useMyParking Hook
 * Manages My Parking page state and real-time session updates
 */

import { useState, useEffect, useCallback } from 'react';
import { getMyParkingData, calculateElapsedTime, calculateEstimatedFee } from '../../../mock/myParkingMock.js';

export function useMyParking() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(1); // refresh every 1 second

  // Initialize data on mount
  useEffect(() => {
    try {
      const initialData = getMyParkingData();
      setData(initialData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load parking data');
      setLoading(false);
    }
  }, []);

  // Update elapsed time and estimated fee for active session
  useEffect(() => {
    if (!data?.currentSession) return;

    const timer = setInterval(() => {
      setData(prevData => {
        if (!prevData?.currentSession) return prevData;

        const elapsedTime = calculateElapsedTime(prevData.currentSession.entryTime);
        const estimatedFee = calculateEstimatedFee(prevData.currentSession.entryTime);

        return {
          ...prevData,
          currentSession: {
            ...prevData.currentSession,
            elapsedTime,
            estimatedFee
          }
        };
      });
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, [data?.currentSession]);

  // Calculate session statistics
  const stats = data ? {
    totalSessions: data.history.length,
    totalPaid: data.totalPaid,
    totalUnpaid: data.totalUnpaid,
    hasActiveSessions: !!data.currentSession
  } : null;

  const exitParking = useCallback(() => {
    // Mock exit functionality
    if (data?.currentSession) {
      const exitedSession = {
        ...data.currentSession,
        status: 'completed',
        exitTime: new Date(),
        duration: calculateElapsedTime(data.currentSession.entryTime),
        fee: data.currentSession.estimatedFee,
        paid: false
      };

      setData(prevData => ({
        ...prevData,
        currentSession: null,
        history: [exitedSession, ...prevData.history],
        totalUnpaid: prevData.totalUnpaid + exitedSession.fee
      }));
    }
  }, [data]);

  return {
    data,
    loading,
    error,
    stats,
    exitParking
  };
}

export default useMyParking;

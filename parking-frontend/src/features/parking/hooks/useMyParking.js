/**
 * useMyParking Hook
 * Manages My Parking page state and real-time session updates
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getMyParkingData,
  calculateElapsedTime,
  calculateEstimatedFee,
  calculateDurationHours
} from '../../../mock/myParkingMock.js';

function getInitialParkingState() {
  try {
    return {
      data: getMyParkingData(),
      error: null
    };
  } catch {
    return {
      data: null,
      error: 'Failed to load parking data'
    };
  }
}

export function useMyParking() {
  const [parkingState, setParkingState] = useState(getInitialParkingState);
  const [exitResult, setExitResult] = useState(null);
  const { data, error } = parkingState;
  const loading = false;

  useEffect(() => {
    if (!data?.currentSession?.id) return;

    const timer = setInterval(() => {
      setParkingState((prevState) => {
        if (!prevState.data?.currentSession) {
          return prevState;
        }

        const elapsedTime = calculateElapsedTime(prevState.data.currentSession.entryTime);
        const estimatedFee = calculateEstimatedFee(prevState.data.currentSession.entryTime);

        return {
          ...prevState,
          data: {
            ...prevState.data,
            currentSession: {
              ...prevState.data.currentSession,
              elapsedTime,
              estimatedFee
            },
            lastUpdated: new Date()
          }
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [data?.currentSession?.id]);

  const stats = data ? {
    totalSessions: data.history.length,
    totalPaid: data.totalPaid,
    totalUnpaid: data.totalUnpaid,
    hasActiveSessions: !!data.currentSession
  } : null;

  const exitParking = useCallback(() => {
    let completedSession = null;

    setParkingState((prevState) => {
      if (!prevState.data?.currentSession) {
        return prevState;
      }

      const exitTime = new Date();
      const activeSession = prevState.data.currentSession;
      const duration = calculateDurationHours(activeSession.entryTime, exitTime);
      const durationLabel = calculateElapsedTime(activeSession.entryTime, exitTime);
      const fee = calculateEstimatedFee(activeSession.entryTime, 10000, exitTime);

      completedSession = {
        ...activeSession,
        status: 'completed',
        exitTime,
        duration,
        durationLabel,
        fee,
        estimatedFee: fee,
        paid: false
      };

      return {
        ...prevState,
        data: {
          ...prevState.data,
          currentSession: null,
          history: [completedSession, ...prevState.data.history],
          totalUnpaid: prevState.data.totalUnpaid + fee,
          lastUpdated: exitTime
        }
      };
    });

    if (completedSession) {
      setExitResult({
        sessionId: completedSession.id,
        zoneName: completedSession.zoneName,
        slot: completedSession.slot,
        fee: completedSession.fee,
        exitTime: completedSession.exitTime,
        canGoToPayment: completedSession.fee > 0
      });
    }
  }, []);

  const dismissExitResult = useCallback(() => {
    setExitResult(null);
  }, []);

  return {
    data,
    loading,
    error,
    stats,
    exitResult,
    exitParking,
    dismissExitResult
  };
}

export default useMyParking;

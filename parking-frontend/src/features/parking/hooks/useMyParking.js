/**
 * useMyParking Hook
 * Manages My Parking page state and keeps it aligned with shared parking availability.
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useParkingContext } from '../../../context/ParkingContext.jsx';
import {
  getMyParkingData,
  exitMyParkingSession,
  extendMyParkingSession,
  getParkingSlotStateId,
  calculateElapsedTime,
  calculateSessionEstimatedFee,
  PARKING_HOURLY_RATE,
  EXTEND_INCREMENT_HOURS
} from '../../../mock/myParkingMock.js';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const hydrateParkingData = (parkingData) => {
  if (!parkingData?.currentSession) {
    return parkingData;
  }

  return {
    ...parkingData,
    currentSession: {
      ...parkingData.currentSession,
      elapsedTime: calculateElapsedTime(parkingData.currentSession.entryTime),
      estimatedFee: calculateSessionEstimatedFee(parkingData.currentSession)
    }
  };
};

function getInitialParkingState(userId) {
  try {
    return {
      data: hydrateParkingData(getMyParkingData(userId)),
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
  const { user } = useAuth();
  const parkingContext = useParkingContext();
  const userId = user?.email || 'user-001';
  const [parkingState, setParkingState] = useState(() => getInitialParkingState(userId));
  const [exitResult, setExitResult] = useState(null);
  const [extendResult, setExtendResult] = useState(null);
  const [isExtending, setIsExtending] = useState(false);
  const { data, error } = parkingState;
  const loading = false;

  const syncParkingState = useCallback(() => {
    try {
      setParkingState({
        data: hydrateParkingData(getMyParkingData(userId)),
        error: null
      });
    } catch {
      setParkingState({
        data: null,
        error: 'Failed to load parking data'
      });
    }
  }, [userId]);

  useEffect(() => {
    syncParkingState();
    setExitResult(null);
    setExtendResult(null);
    setIsExtending(false);
  }, [syncParkingState]);

  useEffect(() => {
    if (!data?.currentSession?.id) {
      return undefined;
    }

    const timer = setInterval(() => {
      syncParkingState();
    }, 1000);

    return () => clearInterval(timer);
  }, [data?.currentSession?.id, syncParkingState]);

  const stats = data ? {
    totalSessions: data.history.length,
    totalPaid: data.totalPaid,
    totalUnpaid: data.totalUnpaid,
    currentEstimatedFee: data.currentSession?.estimatedFee || 0,
    totalAmountDue: data.totalUnpaid + (data.currentSession?.estimatedFee || 0),
    hasActiveSessions: !!data.currentSession
  } : null;

  const exitParking = useCallback(() => {
    setExtendResult(null);

    const completedSession = exitMyParkingSession(userId);

    if (!completedSession) {
      return false;
    }

    const sharedSlotId = getParkingSlotStateId(completedSession.zone, completedSession.slot);
    if (sharedSlotId) {
      parkingContext.updateSlotStatus(completedSession.zone, sharedSlotId, 'FREE');
    }

    syncParkingState();

    setExitResult({
      sessionId: completedSession.id,
      zoneName: completedSession.zoneName,
      slot: completedSession.slot,
      fee: completedSession.fee,
      exitTime: completedSession.exitTime,
      canGoToPayment: completedSession.fee > 0
    });

    return true;
  }, [parkingContext, syncParkingState, userId]);

  const extendParkingTime = useCallback(async () => {
    if (!data?.currentSession || isExtending) {
      return false;
    }

    setIsExtending(true);
    setExitResult(null);
    setExtendResult(null);

    try {
      await wait(700);

      const updatedSession = extendMyParkingSession(userId, EXTEND_INCREMENT_HOURS);

      if (!updatedSession) {
        return false;
      }

      syncParkingState();

      setExtendResult({
        sessionId: updatedSession.id,
        zoneName: updatedSession.zoneName,
        slot: updatedSession.slot,
        addedHours: EXTEND_INCREMENT_HOURS,
        extensionHours: updatedSession.extensionHours,
        addedFee: PARKING_HOURLY_RATE * EXTEND_INCREMENT_HOURS,
        estimatedFee: calculateSessionEstimatedFee(updatedSession),
        extendedUntil: updatedSession.extendedUntil
      });

      return true;
    } finally {
      setIsExtending(false);
    }
  }, [data?.currentSession, isExtending, syncParkingState, userId]);

  const dismissExitResult = useCallback(() => {
    setExitResult(null);
  }, []);

  const dismissExtendResult = useCallback(() => {
    setExtendResult(null);
  }, []);

  return {
    data,
    loading,
    error,
    stats,
    exitResult,
    extendResult,
    isExtending,
    exitParking,
    extendParkingTime,
    dismissExitResult,
    dismissExtendResult
  };
}

export default useMyParking;

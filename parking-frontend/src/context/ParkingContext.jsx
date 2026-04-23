/**
 * ParkingContext - Shared Parking State via React Context
 * Singleton source of truth accessible across all feature hooks and pages.
 * Provides one shared parking state that all pages subscribe to.
 * Monitoring is the operator page that can refresh or edit slot state.
 */

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  advanceParkingState as advanceState,
  setSlotStatus as setSharedSlotStatus,
  getZone,
  getAllZones,
  getDashboardSummary,
  getDashboardData,
  getZoneDetailData,
  getMonitoringData,
  getGuidanceData,
  getSignageData,
  getSignageDisplayMessage,
} from '../mock/parkingState.js';

const ParkingContext = createContext(null);

/**
 * Provider component - place in app root
 * Holds shared parking state for the entire app
 */
export function ParkingProvider({ children }) {
  const [revision, setRevision] = useState(0);
  const [timeAgo, setTimeAgo] = useState('just now');
  const lastUpdatedRef = useRef(new Date());

  useEffect(() => {
    let lastAt = lastUpdatedRef.current.toISOString();

    const interval = setInterval(() => {
      const currentAt = window.__parkingStateUpdatedAt || lastAt;
      if (currentAt !== lastAt) {
        lastAt = currentAt;
        lastUpdatedRef.current = new Date();
        setRevision((r) => r + 1);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const seconds = Math.floor(
        (new Date() - lastUpdatedRef.current) / 1000
      );
      if (seconds < 5) setTimeAgo('just now');
      else if (seconds < 60) setTimeAgo(`${seconds}s ago`);
      else setTimeAgo(`${Math.floor(seconds / 60)}m ago`);
    }, 1000);

    return () => clearInterval(timer);
  }, [revision]);

  const markSharedStateUpdated = useCallback(() => {
    lastUpdatedRef.current = new Date();
    window.__parkingStateUpdatedAt = lastUpdatedRef.current.toISOString();
    setRevision((r) => r + 1);
  }, []);

  const refreshSlots = useCallback(() => {
    advanceState();
    markSharedStateUpdated();
  }, [markSharedStateUpdated]);

  const updateSlotStatus = useCallback((zoneId, slotId, status) => {
    const result = setSharedSlotStatus(zoneId, slotId, status);
    markSharedStateUpdated();
    return result;
  }, [markSharedStateUpdated]);

  const value = {
    revision,
    timeAgo,
    refreshSlots,
    updateSlotStatus,
    getZone: (id) => {
      void revision;
      return getZone(id);
    },
    getAllZones: () => {
      void revision;
      return getAllZones();
    },
    getDashboardSummary: () => {
      void revision;
      return getDashboardSummary();
    },
    getDashboardData: () => {
      void revision;
      return getDashboardData();
    },
    getZoneDetailData: (zoneId) => {
      void revision;
      return getZoneDetailData(zoneId);
    },
    getMonitoringData: (zoneId) => {
      void revision;
      return getMonitoringData(zoneId);
    },
    getGuidanceData: () => {
      void revision;
      return getGuidanceData();
    },
    getSignageData: () => {
      void revision;
      return getSignageData();
    },
    getSignageDisplayMessage: (data) => getSignageDisplayMessage(data),
  };

  return (
    <ParkingContext.Provider value={value}>
      {children}
    </ParkingContext.Provider>
  );
}

/**
 * useParkingContext - Access shared parking state from any component/hook
 */
export function useParkingContext() {
  const ctx = useContext(ParkingContext);
  if (!ctx) {
    throw new Error(
      'useParkingContext must be used inside <ParkingProvider>'
    );
  }
  return ctx;
}

export default ParkingContext;

/**
 * ParkingContext - Shared Parking State via React Context
 * Singleton source of truth accessible across all feature hooks and pages.
 * Provides one shared parking state that all pages subscribe to.
 * Monitoring is the only page that can advance/refresh the state.
 */

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  advanceParkingState as advanceState,
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

  // Subscribe to global parking state changes
  // The useEffect polls the parkingState module-level variable
  useEffect(() => {
    let lastAt = lastUpdatedRef.current.toISOString();

    const interval = setInterval(() => {
      const currentAt = window.__parkingStateUpdatedAt || lastAt;
      if (currentAt !== lastAt) {
        lastAt = currentAt;
        lastUpdatedRef.current = new Date();
        setRevision((r) => r + 1);
      }
    }, 300); // check every 300ms

    return () => clearInterval(interval);
  }, []);

  // Update timeAgo display
  useEffect(() => {
    const timer = setInterval(() => {
      const seconds = Math.floor(
        (new Date() - lastUpdatedRef.current
      ) / 1000);
      if (seconds < 5) setTimeAgo('just now');
      else if (seconds < 60) setTimeAgo(`${seconds}s ago`);
      else setTimeAgo(`${Math.floor(seconds / 60)}m ago`);
    }, 1000);
    return () => clearInterval(timer);
  }, [revision]);

  // Advance the shared parking state
  // Called ONLY by Monitoring when user clicks refresh
  const refreshSlots = useCallback(() => {
    advanceState();
    lastUpdatedRef.current = new Date();
    window.__parkingStateUpdatedAt = lastUpdatedRef.current.toISOString();
    setRevision((r) => r + 1);
  }, []);

  const value = {
    revision,     // increments on every state change — use as useEffect dep
    timeAgo,     // relative time string
    refreshSlots, // ONLY way to advance the state
    // Derive helpers (all read from current module state)
    getZone: (id) => {
      void revision; // subscribe to context
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

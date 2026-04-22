/**
 * parkingState - Shared Parking Engine
 * Single source of truth for all parking data across the application.
 * Replaces isolated mock files with a unified state management approach.
 *
 * Architecture:
 * - parkingState holds the live zone data
 * - generateParkingUpdate() simulates real-time occupancy changes
 * - getDashboardData() derives dashboard view
 * - getMonitoringData() derives monitoring view for a zone
 * - getGuidanceData() derives parking guidance
 * - getSignageData() derives signage display
 */

import { useState, useEffect, useCallback } from 'react';

// ─── Zone Configuration ────────────────────────────────────────────────────────
const ZONE_CONFIG = {
  'zone-a': { name: 'Zone A', totalSlots: 25, outdoor: true },
  'zone-b': { name: 'Zone B', totalSlots: 25, covered: true },
  'zone-c': { name: 'Zone C', totalSlots: 30, indoor: true },
  'zone-d': { name: 'Zone D', totalSlots: 20, indoor: true },
};

// ─── Initial State ───────────────────────────────────────────────────────────
const INITIAL_STATE = {
  zones: {
    'zone-a': { occupiedSlots: 25 },
    'zone-b': { occupiedSlots: 15 },
    'zone-c': { occupiedSlots: 22 },
    'zone-d': { occupiedSlots: 11 },
  },
  updatedAt: new Date().toISOString(),
};

// ─── Shared Mutable State (single source of truth) ───────────────────────────
let _parkingState = JSON.parse(JSON.stringify(INITIAL_STATE));

// Deep clone helper
const clone = (obj) => JSON.parse(JSON.stringify(obj));

// ─── Core Engine ─────────────────────────────────────────────────────────────

/**
 * Get current parking state
 * @returns {Object} Current zone occupancy data
 */
export const getParkingState = () => _parkingState;

/**
 * Get zone details with computed availability
 * @param {string} zoneId
 * @returns {Object} Zone with computed fields
 */
export const getZone = (zoneId) => {
  const config = ZONE_CONFIG[zoneId];
  const zone = _parkingState.zones[zoneId];
  if (!config || !zone) return null;

  const occupiedSlots = zone.occupiedSlots;
  const totalSlots = config.totalSlots;
  const availableSlots = totalSlots - occupiedSlots;
  const occupancyPercentage = Number(
    ((occupiedSlots / totalSlots) * 100).toFixed(2)
  );
  const status = availableSlots === 0 ? 'FULL' : 'AVAILABLE';

  return {
    id: zoneId,
    name: config.name,
    totalSlots,
    occupiedSlots,
    availableSlots,
    occupancyPercentage,
    status,
  };
};

/**
 * Get all zones as array
 * @returns {Array} All zone details
 */
export const getAllZones = () =>
  Object.keys(ZONE_CONFIG).map((id) => getZone(id));

/**
 * Get dashboard summary (totals across all zones)
 * @returns {Object} Summary totals
 */
export const getDashboardSummary = () => {
  const zones = getAllZones();
  const totalSlots = zones.reduce((s, z) => s + z.totalSlots, 0);
  const occupiedSlots = zones.reduce((s, z) => s + z.occupiedSlots, 0);
  const availableSlots = totalSlots - occupiedSlots;
  const occupancyPercentage = Number(
    ((occupiedSlots / totalSlots) * 100).toFixed(2)
  );

  return { totalSlots, occupiedSlots, availableSlots, occupancyPercentage };
};

/**
 * Simulate one random slot change across all zones
 * One random slot in a random zone toggles FREE/OCCUPIED
 */
const simulateSlotChange = () => {
  const state = _parkingState;
  const zoneIds = Object.keys(state.zones);
  const randomZone = zoneIds[Math.floor(Math.random() * zoneIds.length)];
  const config = ZONE_CONFIG[randomZone];
  const currentOccupied = state.zones[randomZone].occupiedSlots;

  // 60% chance a car arrives (slot taken), 40% chance leaves (slot freed)
  // But respect min/max bounds
  if (currentOccupied < config.totalSlots && Math.random() < 0.6) {
    state.zones[randomZone].occupiedSlots += 1;
  } else if (currentOccupied > 0) {
    state.zones[randomZone].occupiedSlots -= 1;
  }
};

/**
 * Advance parking state by one tick (simulates real-time update)
 * @returns {Object} Updated state
 */
export const advanceParkingState = () => {
  simulateSlotChange();
  _parkingState.updatedAt = new Date().toISOString();
  return clone(_parkingState);
};

/**
 * Get parking data derived for Dashboard view
 * @returns {Object} Dashboard-compatible data
 */
export const getDashboardData = () => {
  const zones = getAllZones();
  const summary = getDashboardSummary();
  return {
    summary,
    zones,
    updatedAt: _parkingState.updatedAt,
  };
};

/**
 * Get parking data derived for Monitoring view
 * @param {string} zoneId
 * @returns {Object} Monitoring-compatible data
 */
export const getMonitoringData = (zoneId) => {
  const zone = getZone(zoneId);
  const config = ZONE_CONFIG[zoneId];

  // Generate slot grid from current state
  const slots = [];
  const occupied = _parkingState.zones[zoneId].occupiedSlots;
  for (let i = 0; i < config.totalSlots; i++) {
    const isOccupied = i < occupied;
    slots.push({
      id: `${zoneId}-slot-${i + 1}`,
      number: String.fromCharCode(65 + Math.floor(i / 25)) + ((i % 25) + 1),
      status: isOccupied ? 'OCCUPIED' : 'FREE',
      occupiedSince: isOccupied ? new Date().toISOString() : null,
      occupancyDuration: null,
    });
  }

  // Notification logic: detect transitions
  const available = zone.availableSlots;
  const fullNotification = available === 0;
  const availableNotification = false;

  return {
    selectedZoneId: zoneId,
    zone,
    slots,
    totalFreeSlots: available,
    fullNotification,
    availableNotification,
    updatedAt: _parkingState.updatedAt,
  };
};

/**
 * Get parking data derived for Guidance view
 * Zones sorted by availability — most available is preferred
 * @returns {Object} Guidance-compatible data
 */
export const getGuidanceData = () => {
  const zones = getAllZones();

  // Sort by available slots descending (most available first)
  const sorted = [...zones].sort(
    (a, b) => b.availableSlots - a.availableSlots
  );

  const preferredZone = sorted.find((z) => z.availableSlots > 0) || sorted[0];
  const alternatives = sorted
    .filter((z) => z.id !== preferredZone?.id && z.availableSlots > 0)
    .slice(0, 2)
    .map((z, i) => ({ ...z, rank: i + 1 }));

  const status = preferredZone?.availableSlots > 0 ? 'AVAILABLE' : 'FULL';
  const guidanceMessage = preferredZone
    ? `Proceed to ${preferredZone.name}. ${preferredZone.availableSlots} spots available. Follow directional signage.`
    : 'Parking lot is full. Please try again later.';

  const bestAlternative = alternatives[0];
  const signageMessage = bestAlternative
    ? `${bestAlternative.name} → ${bestAlternative.availableSlots} Spots`
    : 'No alternatives available';

  return {
    preferredZone,
    alternativeZones: alternatives,
    guidanceMessage,
    signageMessage,
    status,
    updatedAt: _parkingState.updatedAt,
  };
};

/**
 * Get parking data derived for Signage display view
 * @returns {Object} Signage-compatible data
 */
export const getSignageData = () => {
  const zones = getAllZones();
  const sorted = [...zones].sort(
    (a, b) => b.availableSlots - a.availableSlots
  );

  const preferredZone = sorted.find((z) => z.availableSlots > 0);
  const totalAvailable = zones.reduce((s, z) => s + z.availableSlots, 0);
  const allFull = totalAvailable === 0;

  if (allFull) {
    return {
      recommendedZone: 'LOT FULL',
      availableSlots: 0,
      guidanceMessage: 'Parking is currently full',
      status: 'FULL',
      alternatives: null,
      displayData: {
        primaryText: 'LOT FULL',
        primarySubtext: 'Please try later',
        secondaryText: 'Street parking nearby',
        statusIcon: 'FULL',
      },
      updatedAt: _parkingState.updatedAt,
    };
  }

  const bestAlternative = sorted.find(
    (z) => z.id !== preferredZone?.id && z.availableSlots > 0
  );

  return {
    recommendedZone: preferredZone.name,
    availableSlots: preferredZone.availableSlots,
    guidanceMessage: `Follow signs to ${preferredZone.name}`,
    status: 'GO',
    alternatives: bestAlternative
      ? `${bestAlternative.name} has ${bestAlternative.availableSlots} spots`
      : null,
    displayData: {
      primaryText: preferredZone.name,
      primarySubtext: `${preferredZone.availableSlots} Spots Available`,
      secondaryText: bestAlternative
        ? `If full, try ${bestAlternative.name}`
        : `Follow signs to ${preferredZone.name}`,
      statusIcon: 'GO',
    },
    updatedAt: _parkingState.updatedAt,
  };
};

/**
 * Get signage display message formatted for the sign component
 * @param {Object} signageData
 * @returns {Object} Formatted display lines
 */
export const getSignageDisplayMessage = (signageData) => ({
  line1: signageData.displayData.primaryText,
  line2: signageData.displayData.primarySubtext,
  line3: signageData.displayData.secondaryText,
  status: signageData.displayData.statusIcon,
});

// ─── React Hook ────────────────────────────────────────────────────────────────────

/**
 * Shared parking state hook
 * Manages one shared parking state that all features read from
 * @param {number} pollInterval - ms between state updates
 * @returns {Object} Shared parking state + advance function
 */
export function useParkingState(pollInterval = 7000) {
  const [state, setState] = useState(() => getParkingState());
  const [timeAgo, setTimeAgo] = useState('just now');

  useEffect(() => {
    const tick = () => {
      advanceParkingState();
      setState(getParkingState());
    };

    tick(); // initial tick
    const id = setInterval(tick, pollInterval);
    return () => clearInterval(id);
  }, [pollInterval]);

  useEffect(() => {
    const calc = () => {
      const seconds = Math.floor((new Date() - new Date(state.updatedAt)) / 1000);
      if (seconds < 5) setTimeAgo('just now');
      else if (seconds < 60) setTimeAgo(`${seconds}s ago`);
      else setTimeAgo(`${Math.floor(seconds / 60)}m ago`);
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [state.updatedAt]);

  const advance = useCallback(() => {
    advanceParkingState();
    setState(getParkingState());
  }, []);

  return { state, timeAgo, advance };
}
/**
 * Shared parking engine used by dashboard, monitoring, guidance, signage,
 * and the zone detail flow.
 */

import { useState, useEffect, useCallback } from 'react';

const ZONE_CONFIG = {
  'zone-a': {
    name: 'Zone A',
    code: 'A',
    totalSlots: 25,
    environment: 'Outdoor',
    accessNote: 'Open-air lot closest to the main gate',
    layoutLabel: '2 parking rows with 1 lane between rows',
    detailSummary: 'Outdoor surface zone with a single central drive lane.',
    miniMapVariant: 'outdoor',
    rows: [
      { id: 'zone-a-row-1', label: 'Row 1', slotCount: 12, surface: 'outdoor' },
      { id: 'zone-a-row-2', label: 'Row 2', slotCount: 13, surface: 'outdoor' },
    ],
    lanes: [{ id: 'zone-a-lane-1', label: 'Central Lane', afterRow: 0 }],
  },
  'zone-b': {
    name: 'Zone B',
    code: 'B',
    totalSlots: 25,
    environment: 'Covered',
    accessNote: 'Roofed structure intended for all-weather parking',
    layoutLabel: '4 parking rows with a central lane between row pairs',
    detailSummary: 'Covered zone grouped into two parking row pairs divided by one central drive lane.',
    miniMapVariant: 'covered',
    rows: [
      { id: 'zone-b-row-1', label: 'Row 1', slotCount: 6, surface: 'covered' },
      { id: 'zone-b-row-2', label: 'Row 2', slotCount: 6, surface: 'covered' },
      { id: 'zone-b-row-3', label: 'Row 3', slotCount: 6, surface: 'covered' },
      { id: 'zone-b-row-4', label: 'Row 4', slotCount: 7, surface: 'covered' },
    ],
    lanes: [{ id: 'zone-b-lane-1', label: 'Central Covered Lane', afterRow: 1 }],
  },
  'zone-c': {
    name: 'Zone C',
    code: 'C',
    totalSlots: 30,
    environment: 'Mixed',
    accessNote: 'Transition zone connecting indoor and outdoor parking',
    layoutLabel: '3 parking rows split across indoor and outdoor sections',
    detailSummary: 'Hybrid zone with indoor, transition, and outdoor parking rows.',
    miniMapVariant: 'hybrid',
    rows: [
      { id: 'zone-c-row-1', label: 'Indoor Row', slotCount: 10, surface: 'indoor' },
      { id: 'zone-c-row-2', label: 'Transition Row', slotCount: 10, surface: 'mixed' },
      { id: 'zone-c-row-3', label: 'Outdoor Row', slotCount: 10, surface: 'outdoor' },
    ],
    lanes: [
      { id: 'zone-c-lane-1', label: 'Indoor Aisle', afterRow: 0 },
      { id: 'zone-c-lane-2', label: 'Outdoor Aisle', afterRow: 1 },
    ],
  },
};

const SLOT_PATTERN = {
  'zone-a': { step: 7, offset: 2 },
  'zone-b': { step: 11, offset: 3 },
  'zone-c': { step: 7, offset: 5 },
};

const INITIAL_OCCUPIED_COUNTS = {
  'zone-a': 25,
  'zone-b': 15,
  'zone-c': 22,
};

const SLOT_STATUSES = new Set(['FREE', 'OCCUPIED', 'UNAVAILABLE']);
const INITIAL_UPDATED_AT = new Date().toISOString();

const clone = (obj) => JSON.parse(JSON.stringify(obj));

const getOrderedZoneIds = () => Object.keys(ZONE_CONFIG);

const getOrderedIndexesForZone = (zoneId, totalSlots) => {
  const pattern = SLOT_PATTERN[zoneId];

  return Array.from(
    { length: totalSlots },
    (_, index) => (pattern.offset + index * pattern.step) % totalSlots
  );
};

const createInitialZoneSlots = (zoneId, updatedAt = INITIAL_UPDATED_AT) => {
  const config = ZONE_CONFIG[zoneId];
  const occupiedCount = INITIAL_OCCUPIED_COUNTS[zoneId] || 0;
  const orderedIndexes = getOrderedIndexesForZone(zoneId, config.totalSlots);
  const occupiedIndexes = new Set(orderedIndexes.slice(0, occupiedCount));

  return Array.from({ length: config.totalSlots }, (_, index) => ({
    id: `${zoneId}-slot-${index + 1}`,
    status: occupiedIndexes.has(index) ? 'OCCUPIED' : 'FREE',
    occupiedSince: occupiedIndexes.has(index) ? updatedAt : null,
  }));
};

const INITIAL_STATE = {
  zones: {
    'zone-a': { slots: createInitialZoneSlots('zone-a') },
    'zone-b': { slots: createInitialZoneSlots('zone-b') },
    'zone-c': { slots: createInitialZoneSlots('zone-c') },
  },
  updatedAt: INITIAL_UPDATED_AT,
};

let _parkingState = clone(INITIAL_STATE);

export const getParkingState = () => clone(_parkingState);

const getZoneSlotStates = (zoneId) => _parkingState.zones[zoneId]?.slots || [];

const getZoneMetrics = (zoneId) => {
  const config = ZONE_CONFIG[zoneId];
  const zoneSlots = getZoneSlotStates(zoneId);

  if (!config || zoneSlots.length === 0) {
    return null;
  }

  const totalSlots = config.totalSlots;
  const occupiedSlots = zoneSlots.filter((slot) => slot.status === 'OCCUPIED').length;
  const unavailableSlots = zoneSlots.filter((slot) => slot.status === 'UNAVAILABLE').length;
  const availableSlots = zoneSlots.filter((slot) => slot.status === 'FREE').length;
  const occupancyPercentage = Number(
    ((occupiedSlots / totalSlots) * 100).toFixed(2)
  );

  return {
    occupiedSlots,
    unavailableSlots,
    totalSlots,
    availableSlots,
    occupancyPercentage,
    status: availableSlots === 0 ? 'FULL' : 'AVAILABLE',
  };
};

const buildZoneRows = (zoneId) => {
  const config = ZONE_CONFIG[zoneId];
  const metrics = getZoneMetrics(zoneId);
  const zoneSlots = getZoneSlotStates(zoneId);

  if (!config || !metrics || zoneSlots.length === 0) {
    return [];
  }

  let globalSlotIndex = 0;

  return config.rows.map((row, rowIndex) => {
    const slots = Array.from({ length: row.slotCount }, (_, slotIndex) => {
      const slotState = zoneSlots[globalSlotIndex];
      const slotNumber = `${config.code}${String(globalSlotIndex + 1).padStart(2, '0')}`;
      const occupancyDuration =
        slotState.status === 'OCCUPIED' && slotState.occupiedSince
          ? Math.floor(
              (new Date() - new Date(slotState.occupiedSince)) / 1000
            )
          : null;

      const slot = {
        id: slotState.id,
        number: slotNumber,
        status: slotState.status,
        occupiedSince:
          slotState.status === 'OCCUPIED' ? slotState.occupiedSince : null,
        occupancyDuration,
        rowId: row.id,
        rowLabel: row.label,
        rowIndex,
        positionInRow: slotIndex,
        surface: row.surface,
      };

      globalSlotIndex += 1;
      return slot;
    });

    return {
      ...row,
      slots,
      occupiedSlots: slots.filter((slot) => slot.status === 'OCCUPIED').length,
      freeSlots: slots.filter((slot) => slot.status === 'FREE').length,
      unavailableSlots: slots.filter((slot) => slot.status === 'UNAVAILABLE').length,
    };
  });
};

export const getZone = (zoneId) => {
  const config = ZONE_CONFIG[zoneId];
  const metrics = getZoneMetrics(zoneId);

  if (!config || !metrics) {
    return null;
  }

  return {
    id: zoneId,
    name: config.name,
    code: config.code,
    environment: config.environment,
    accessNote: config.accessNote,
    layoutLabel: config.layoutLabel,
    detailSummary: config.detailSummary,
    miniMapVariant: config.miniMapVariant,
    rowCount: config.rows.length,
    laneCount: config.lanes.length,
    ...metrics,
  };
};

export const getAllZones = () => getOrderedZoneIds().map((zoneId) => getZone(zoneId));

export const getDashboardSummary = () => {
  const zones = getAllZones();
  const totalSlots = zones.reduce((sum, zone) => sum + zone.totalSlots, 0);
  const occupiedSlots = zones.reduce((sum, zone) => sum + zone.occupiedSlots, 0);
  const availableSlots = zones.reduce((sum, zone) => sum + zone.availableSlots, 0);
  const occupancyPercentage = Number(
    ((occupiedSlots / totalSlots) * 100).toFixed(2)
  );

  return { totalSlots, occupiedSlots, availableSlots, occupancyPercentage };
};

const simulateSlotChange = () => {
  const zoneIds = getOrderedZoneIds();
  const randomZoneId = zoneIds[Math.floor(Math.random() * zoneIds.length)];
  const zoneSlots = getZoneSlotStates(randomZoneId);
  const freeSlots = zoneSlots.filter((slot) => slot.status === 'FREE');
  const occupiedSlots = zoneSlots.filter((slot) => slot.status === 'OCCUPIED');
  const timestamp = new Date().toISOString();

  if (freeSlots.length > 0 && (occupiedSlots.length === 0 || Math.random() < 0.6)) {
    const targetSlot = freeSlots[Math.floor(Math.random() * freeSlots.length)];
    targetSlot.status = 'OCCUPIED';
    targetSlot.occupiedSince = timestamp;
    return;
  }

  if (occupiedSlots.length > 0) {
    const targetSlot = occupiedSlots[Math.floor(Math.random() * occupiedSlots.length)];
    targetSlot.status = 'FREE';
    targetSlot.occupiedSince = null;
  }
};

export const advanceParkingState = () => {
  simulateSlotChange();
  _parkingState.updatedAt = new Date().toISOString();
  return clone(_parkingState);
};

export const setSlotStatus = (zoneId, slotId, nextStatus) => {
  const zoneSlots = getZoneSlotStates(zoneId);
  const normalizedStatus = String(nextStatus || '').toUpperCase();

  if (!zoneSlots.length || !SLOT_STATUSES.has(normalizedStatus)) {
    return null;
  }

  const targetSlot = zoneSlots.find((slot) => slot.id === slotId);
  if (!targetSlot) {
    return null;
  }

  if (targetSlot.status === normalizedStatus) {
    return getMonitoringData(zoneId);
  }

  const timestamp = new Date().toISOString();

  targetSlot.status = normalizedStatus;
  targetSlot.occupiedSince = normalizedStatus === 'OCCUPIED' ? timestamp : null;
  _parkingState.updatedAt = timestamp;

  return getMonitoringData(zoneId);
};

export const getDashboardData = () => ({
  summary: getDashboardSummary(),
  zones: getAllZones(),
  updatedAt: _parkingState.updatedAt,
});

export const getZoneDetailData = (zoneId) => {
  const zone = getZone(zoneId);
  const config = ZONE_CONFIG[zoneId];

  if (!zone || !config) {
    return null;
  }

  const rows = buildZoneRows(zoneId);
  const slots = rows.flatMap((row) => row.slots);

  return {
    zone,
    rows,
    lanes: config.lanes,
    slots,
    updatedAt: _parkingState.updatedAt,
    statusBreakdown: {
      free: slots.filter((slot) => slot.status === 'FREE').length,
      occupied: slots.filter((slot) => slot.status === 'OCCUPIED').length,
      unavailable: slots.filter((slot) => slot.status === 'UNAVAILABLE').length,
    },
  };
};

export const getMonitoringData = (zoneId) => {
  const detail = getZoneDetailData(zoneId);

  if (!detail) {
    return null;
  }

  return {
    selectedZoneId: zoneId,
    zone: detail.zone,
    slots: detail.slots,
    totalFreeSlots: detail.zone.availableSlots,
    fullNotification: detail.zone.availableSlots === 0,
    availableNotification: false,
    updatedAt: _parkingState.updatedAt,
  };
};

export const getGuidanceData = () => {
  const zones = getAllZones();
  const sorted = [...zones].sort((left, right) => right.availableSlots - left.availableSlots);

  const preferredZone = sorted.find((zone) => zone.availableSlots > 0) || sorted[0];
  const alternatives = sorted
    .filter((zone) => zone.id !== preferredZone?.id && zone.availableSlots > 0)
    .slice(0, 2)
    .map((zone, index) => ({ ...zone, rank: index + 1 }));

  const status = preferredZone?.availableSlots > 0 ? 'AVAILABLE' : 'FULL';
  const guidanceMessage = preferredZone
    ? `Proceed to ${preferredZone.name}. ${preferredZone.availableSlots} spots available. Follow directional signage.`
    : 'Parking lot is full. Please try again later.';

  const bestAlternative = alternatives[0];
  const signageMessage = bestAlternative
    ? `${bestAlternative.name} -> ${bestAlternative.availableSlots} Spots`
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

export const getSignageData = () => {
  const zones = getAllZones();
  const sorted = [...zones].sort((left, right) => right.availableSlots - left.availableSlots);
  const preferredZone = sorted.find((zone) => zone.availableSlots > 0);
  const totalAvailable = zones.reduce((sum, zone) => sum + zone.availableSlots, 0);

  if (totalAvailable === 0) {
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
    (zone) => zone.id !== preferredZone?.id && zone.availableSlots > 0
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

export const getSignageDisplayMessage = (signageData) => ({
  line1: signageData.displayData.primaryText,
  line2: signageData.displayData.primarySubtext,
  line3: signageData.displayData.secondaryText,
  status: signageData.displayData.statusIcon,
});

export function useParkingState(pollInterval = 7000) {
  const [state, setState] = useState(() => getParkingState());
  const [timeAgo, setTimeAgo] = useState('just now');

  useEffect(() => {
    const tick = () => {
      advanceParkingState();
      setState(getParkingState());
    };

    tick();
    const timerId = setInterval(tick, pollInterval);
    return () => clearInterval(timerId);
  }, [pollInterval]);

  useEffect(() => {
    const updateTimeAgo = () => {
      const seconds = Math.floor((new Date() - new Date(state.updatedAt)) / 1000);

      if (seconds < 5) {
        setTimeAgo('just now');
      } else if (seconds < 60) {
        setTimeAgo(`${seconds}s ago`);
      } else {
        setTimeAgo(`${Math.floor(seconds / 60)}m ago`);
      }
    };

    updateTimeAgo();
    const timerId = setInterval(updateTimeAgo, 1000);
    return () => clearInterval(timerId);
  }, [state.updatedAt]);

  const advance = useCallback(() => {
    advanceParkingState();
    setState(getParkingState());
  }, []);

  return { state, timeAgo, advance };
}

/**
 * Mock data for Monitoring page
 * Used during development before real API integration
 * Structure: { selectedZoneId, zone, slots, totalFreeSlots, fullNotification, availableNotification, updatedAt }
 */

// Helper function to calculate occupancy duration
const calculateDuration = (occupiedSinceISO) => {
  if (!occupiedSinceISO) return null;
  const now = new Date();
  const occupiedSince = new Date(occupiedSinceISO);
  return Math.floor((now - occupiedSince) / 1000); // in seconds
};

// Helper to generate occupied timestamp (random past time)
const getRandomOccupiedTime = () => {
  const randomMinutesAgo = Math.floor(Math.random() * 120) + 5; // 5-125 minutes ago
  const time = new Date();
  time.setMinutes(time.getMinutes() - randomMinutesAgo);
  return time.toISOString();
};

// Generate slots for a zone
const generateSlotsForZone = (zoneId, totalSlots, occupiedCount) => {
  const slots = [];
  // Create slots with realistic distribution
  for (let i = 0; i < totalSlots; i++) {
    const isOccupied = i < occupiedCount;
    const occupiedSinceTime = isOccupied ? getRandomOccupiedTime() : null;
    
    slots.push({
      id: `${zoneId}-slot-${i + 1}`,
      number: String.fromCharCode(65 + Math.floor(i / 25)) + ((i % 25) + 1), // A1, A2, ..., B1, etc.
      status: isOccupied ? 'OCCUPIED' : 'FREE',
      occupiedSince: occupiedSinceTime,
      occupancyDuration: isOccupied ? calculateDuration(occupiedSinceTime) : null
    });
  }
  return slots;
};

export const monitoringMockData = {
  selectedZoneId: 'zone-b',
  zone: {
    id: 'zone-b',
    name: 'Zone B',
    totalSlots: 25,
    occupiedSlots: 15,
    availableSlots: 10,
    occupancyPercentage: 60.0
  },
  slots: generateSlotsForZone('zone-b', 25, 15),
  totalFreeSlots: 10,
  fullNotification: false,
  availableNotification: false,
  updatedAt: new Date().toISOString()
};

/**
 * Simulate full zone scenario
 */
export const monitoringMockDataFullZone = {
  selectedZoneId: 'zone-a',
  zone: {
    id: 'zone-a',
    name: 'Zone A',
    totalSlots: 30,
    occupiedSlots: 30,
    availableSlots: 0,
    occupancyPercentage: 100.0
  },
  slots: generateSlotsForZone('zone-a', 30, 30),
  totalFreeSlots: 0,
  fullNotification: true,
  availableNotification: false,
  updatedAt: new Date().toISOString()
};

/**
 * Simulate zone with mostly free slots
 */
export const monitoringMockDataManyFree = {
  selectedZoneId: 'zone-d',
  zone: {
    id: 'zone-d',
    name: 'Zone D',
    totalSlots: 20,
    occupiedSlots: 3,
    availableSlots: 17,
    occupancyPercentage: 15.0
  },
  slots: generateSlotsForZone('zone-d', 20, 3),
  totalFreeSlots: 17,
  fullNotification: false,
  availableNotification: true, // Just transitioned from full
  updatedAt: new Date().toISOString()
};

/**
 * Generate updated monitoring data (simulates real-time slot changes)
 * @param {string} zoneId - Zone to update
 * @returns {Object} Updated monitoring data
 */
export const generateUpdatedMonitoringData = (zoneId = 'zone-b') => {
  let baseData;
  
  // Select base data based on zone
  switch (zoneId) {
    case 'zone-a':
      baseData = monitoringMockDataFullZone;
      break;
    case 'zone-d':
      baseData = monitoringMockDataManyFree;
      break;
    default:
      baseData = monitoringMockData;
  }
  
  const currentData = JSON.parse(JSON.stringify(baseData)); // Deep copy
  
  // Simulate random slot state change
  const randomSlotIndex = Math.floor(Math.random() * currentData.slots.length);
  const slot = currentData.slots[randomSlotIndex];
  
  if (slot.status === 'FREE') {
    // Slot becomes occupied
    slot.status = 'OCCUPIED';
    slot.occupiedSince = new Date().toISOString();
    slot.occupancyDuration = 0;
    currentData.zone.occupiedSlots += 1;
    currentData.zone.availableSlots -= 1;
  } else {
    // Slot becomes free
    slot.status = 'FREE';
    slot.occupiedSince = null;
    slot.occupancyDuration = null;
    currentData.zone.occupiedSlots -= 1;
    currentData.zone.availableSlots += 1;
  }
  
  currentData.zone.occupancyPercentage = parseFloat(
    ((currentData.zone.occupiedSlots / currentData.zone.totalSlots) * 100).toFixed(2)
  );
  currentData.totalFreeSlots = currentData.zone.availableSlots;
  
  // Update full/available notifications
  const isNowFull = currentData.zone.availableSlots === 0;
  const wasFullBefore = baseData.fullNotification;
  currentData.fullNotification = isNowFull;
  currentData.availableNotification = wasFullBefore && !isNowFull;
  
  currentData.updatedAt = new Date().toISOString();
  
  return currentData;
};

/**
 * Get all available zones for zone selector
 * @returns {Array} Zone options
 */
export const getMonitoringZoneOptions = () => {
  return [
    { id: 'zone-a', name: 'Zone A' },
    { id: 'zone-b', name: 'Zone B' },
    { id: 'zone-c', name: 'Zone C' },
    { id: 'zone-d', name: 'Zone D' }
  ];
};

/**
 * Get monitoring data for a specific zone
 * @param {string} zoneId - Zone ID
 * @returns {Object} Monitoring data for zone
 */
export const getMonitoringDataByZone = (zoneId) => {
  switch (zoneId) {
    case 'zone-a':
      return monitoringMockDataFullZone;
    case 'zone-d':
      return monitoringMockDataManyFree;
    case 'zone-b':
    case 'zone-c':
    default:
      return monitoringMockData;
  }
};

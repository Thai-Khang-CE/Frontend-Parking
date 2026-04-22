/**
 * Mock data for Guidance page
 * Used during development before real API integration
 * Structure: { preferredZone, alternativeZones, guidanceMessage, signageMessage, status, updatedAt }
 */

export const guidanceMockData = {
  preferredZone: {
    id: 'zone-b',
    name: 'Zone B',
    availableSlots: 10,
    totalSlots: 25,
    occupancyPercentage: 60.0
  },
  alternativeZones: [
    {
      id: 'zone-c',
      name: 'Zone C',
      availableSlots: 5,
      totalSlots: 25,
      occupancyPercentage: 80.0,
      rank: 1
    },
    {
      id: 'zone-d',
      name: 'Zone D',
      availableSlots: 10,
      totalSlots: 20,
      occupancyPercentage: 50.0,
      rank: 2
    }
  ],
  guidanceMessage: 'Proceed to Zone B. 10 spots available. Follow directional signage to parking area.',
  signageMessage: 'Zone B → 10 Spots',
  status: 'AVAILABLE',
  updatedAt: new Date().toISOString()
};

/**
 * Simulate zone full scenario - return guidance with alternatives only
 * @returns {Object} Guidance data when preferred zone is full
 */
export const guidanceMockDataFullZone = {
  preferredZone: {
    id: 'zone-a',
    name: 'Zone A',
    availableSlots: 0,
    totalSlots: 30,
    occupancyPercentage: 100.0
  },
  alternativeZones: [
    {
      id: 'zone-b',
      name: 'Zone B',
      availableSlots: 10,
      totalSlots: 25,
      occupancyPercentage: 60.0,
      rank: 1
    },
    {
      id: 'zone-d',
      name: 'Zone D',
      availableSlots: 10,
      totalSlots: 20,
      occupancyPercentage: 50.0,
      rank: 2
    }
  ],
  guidanceMessage: 'Zone A is full. Try Zone B (10 spots) or Zone D (10 spots). Follow directional signage.',
  signageMessage: 'Zone A Full → Try Zone B or D',
  status: 'FULL',
  updatedAt: new Date().toISOString()
};

/**
 * Simulate guidance request with random zone recommendation
 * @returns {Object} Fresh guidance data
 */
export const generateGuidanceData = () => {
  // 80% chance of normal zone, 20% chance of full zone scenario
  const useFullScenario = Math.random() < 0.2;
  
  if (useFullScenario) {
    return {
      ...guidanceMockDataFullZone,
      updatedAt: new Date().toISOString()
    };
  }
  
  return {
    ...guidanceMockData,
    updatedAt: new Date().toISOString()
  };
};

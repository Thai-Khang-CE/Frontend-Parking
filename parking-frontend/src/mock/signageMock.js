/**
 * Mock data for Signage page (Driver-facing Large Display)
 * Used during development before real API integration
 * Structure: { recommendedZone, availableSlots, guidanceMessage, status, alternatives, displayData, updatedAt }
 */

export const signageMockData = {
  recommendedZone: 'Zone B',
  availableSlots: 10,
  guidanceMessage: 'Follow signs to Zone B',
  status: 'GO',
  alternatives: 'Zone D has 10 spots',
  displayData: {
    primaryText: 'Zone B',
    primarySubtext: '10 Spots Available',
    secondaryText: 'If full, try Zone D',
    statusIcon: 'GO'
  },
  updatedAt: new Date().toISOString()
};

/**
 * Simulate signage when lot is full
 */
export const signageMockDataFull = {
  recommendedZone: 'LOT FULL',
  availableSlots: 0,
  guidanceMessage: 'Street parking available nearby',
  status: 'FULL',
  alternatives: null,
  displayData: {
    primaryText: 'LOT FULL',
    primarySubtext: 'Check back in 15 min',
    secondaryText: 'Street parking available nearby',
    statusIcon: 'FULL'
  },
  updatedAt: new Date().toISOString()
};

/**
 * Simulate alternative zone recommendation (preferred full)
 */
export const signageMockDataAlternative = {
  recommendedZone: 'Zone D',
  availableSlots: 10,
  guidanceMessage: 'Zone A full. Proceed to Zone D',
  status: 'GO',
  alternatives: 'Zone B has 5 spots',
  displayData: {
    primaryText: 'Zone D',
    primarySubtext: '10 Spots Available',
    secondaryText: 'Zone A is full',
    statusIcon: 'GO'
  },
  updatedAt: new Date().toISOString()
};

/**
 * Generate random signage display data
 * Simulates getting latest guidance and availability
 * @returns {Object} Signage data
 */
export const generateSignageData = () => {
  const random = Math.random();
  
  if (random < 0.15) {
    // 15% chance lot is full
    return {
      ...signageMockDataFull,
      updatedAt: new Date().toISOString()
    };
  } else if (random < 0.35) {
    // 20% chance showing alternative zone
    return {
      ...signageMockDataAlternative,
      updatedAt: new Date().toISOString()
    };
  } else {
    // 65% chance showing normal guidance
    return {
      ...signageMockData,
      updatedAt: new Date().toISOString()
    };
  }
};

/**
 * Simulate real-time updates for signage display
 * Updates every 5-10 seconds typically
 * @returns {Object} Updated signage data
 */
export const updateSignageDisplay = () => {
  const current = generateSignageData();
  
  // Simulate minor occupancy changes affecting display
  if (current.status === 'GO' && current.availableSlots > 0) {
    const change = Math.random() > 0.5 ? 1 : -1;
    current.availableSlots = Math.max(0, current.availableSlots + change);
    
    // Update display text
    if (current.availableSlots === 0) {
      current.status = 'FULL';
      current.displayData.statusIcon = 'FULL';
    }
    current.displayData.primarySubtext = `${current.availableSlots} Spots Available`;
  }
  
  current.updatedAt = new Date().toISOString();
  return current;
};

/**
 * Get signage message for high-readability display
 * Pre-formatted for large screens
 */
export const getSignageDisplayMessage = (signageData) => {
  return {
    line1: signageData.displayData.primaryText,
    line2: signageData.displayData.primarySubtext,
    line3: signageData.displayData.secondaryText,
    status: signageData.displayData.statusIcon
  };
};

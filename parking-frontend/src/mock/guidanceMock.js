/**
 * Guidance Mock - Now delegates to shared parking state
 * @deprecated Use parkingState.js directly
 */
import { getGuidanceData } from './parkingState.js';

export const guidanceMockData = getGuidanceData();
export const guidanceMockDataFullZone = getGuidanceData();
export const generateGuidanceData = getGuidanceData;

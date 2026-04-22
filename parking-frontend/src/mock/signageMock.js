/**
 * Signage Mock - Now delegates to shared parking state
 * @deprecated Use parkingState.js directly
 */
import { getSignageData, getSignageDisplayMessage } from './parkingState.js';

export const signageMockData = getSignageData();
export const signageMockDataFull = getSignageData();
export const signageMockDataAlternative = getSignageData();
export const generateSignageData = getSignageData;
export const updateSignageDisplay = getSignageData;
export const getSignageDisplayMessage = getSignageDisplayMessage;

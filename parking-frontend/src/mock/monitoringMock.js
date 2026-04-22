/**
 * Monitoring Mock - Now delegates to shared parking state
 * @deprecated Use parkingState.js directly
 */
import { getMonitoringData, getAllZones } from './parkingState.js';

export const monitoringMockData = getMonitoringData('zone-b');
export const monitoringMockDataFullZone = getMonitoringData('zone-a');
export const monitoringMockDataManyFree = getMonitoringData('zone-d');
export const generateUpdatedMonitoringData = (zoneId) => getMonitoringData(zoneId);
export const getMonitoringDataByZone = (zoneId) => getMonitoringData(zoneId);
export const getMonitoringZoneOptions = () =>
  getAllZones().map((z) => ({ id: z.id, name: z.name }));

/**
 * Dashboard Mock - Now delegates to shared parking state
 * @deprecated Use parkingState.js directly
 */
import { getDashboardData } from './parkingState.js';

export const dashboardMockData = getDashboardData();
export const generateUpdatedDashboardData = getDashboardData;
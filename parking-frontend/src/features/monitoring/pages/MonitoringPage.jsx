/**
 * Monitoring Page
 * Real-time occupancy tracking - detailed view of slot/zone status
 */

import { useMonitoring } from '../hooks';
import {
  ZoneSelectorBar,
  ZoneSummaryCards,
  SlotGrid,
  NotificationBanner
} from '../components';
import { getMonitoringZoneOptions } from '../../../mock/monitoringMock.js';
import styles from './MonitoringPage.module.css';

function MonitoringPage() {
  const { data, loading, error, timeAgo, selectedZoneId, selectZone } = useMonitoring();
  const zoneOptions = getMonitoringZoneOptions();

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>Parking Monitoring</h1>
          <p className={styles.subtitle}>Real-time occupancy tracking and availability</p>
        </div>
        <div className={styles.error}>
          <p>Error loading monitoring data: {error}</p>
        </div>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>Parking Monitoring</h1>
          <p className={styles.subtitle}>Real-time occupancy tracking and availability</p>
        </div>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading monitoring data...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.zone) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>Parking Monitoring</h1>
          <p className={styles.subtitle}>Real-time occupancy tracking and availability</p>
        </div>
        <div className={styles.error}>
          <p>No monitoring data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Parking Monitoring</h1>
        <p className={styles.subtitle}>Real-time occupancy tracking and availability</p>
      </div>

      {/* Notifications */}
      <NotificationBanner
        fullNotification={data.fullNotification}
        availableNotification={data.availableNotification}
      />

      <div className={styles.content}>
        {/* Zone Selector */}
        <div className={styles.section}>
          <ZoneSelectorBar
            zones={zoneOptions}
            selectedZoneId={selectedZoneId}
            onSelectZone={selectZone}
          />
        </div>

        {/* Zone Summary */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>{data.zone.name} Summary</h2>
          <ZoneSummaryCards zone={data.zone} />
        </div>

        {/* Slot Grid */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Slot Status</h2>
          <SlotGrid slots={data.slots} />
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          <span>Last updated: <strong>{timeAgo}</strong></span>
          <span className={styles.badge}>Auto-refresh: 5s</span>
        </div>
        <div className={styles.footerRight}>
          <span>{data.totalFreeSlots} free</span>
          <span>•</span>
          <span>{data.zone.occupiedSlots} occupied</span>
        </div>
      </div>
    </div>
  );
}

export default MonitoringPage;

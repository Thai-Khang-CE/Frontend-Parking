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
  const { data, loading, error, timeAgo, selectedZoneId, selectZone, refreshSlots } = useMonitoring();
  const zoneOptions = getMonitoringZoneOptions();

  if (error) {
    return (
      <div className={`${styles.page} app-page`}>
        <div className="app-page-header">
          <div className="app-page-title-wrap">
            <h1 className="app-page-title">Parking Monitoring</h1>
            <p className="app-page-subtitle">
              Real-time occupancy tracking and slot availability monitoring.
            </p>
          </div>
        </div>
        <div className="app-state app-state--error">
          <p>Error loading monitoring data: {error}</p>
        </div>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className={`${styles.page} app-page`}>
        <div className="app-page-header">
          <div className="app-page-title-wrap">
            <h1 className="app-page-title">Parking Monitoring</h1>
            <p className="app-page-subtitle">
              Real-time occupancy tracking and slot availability monitoring.
            </p>
          </div>
        </div>
        <div className="app-state app-state--loading">
          <div className="app-spinner" />
          <p>Loading monitoring data...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.zone) {
    return (
      <div className={`${styles.page} app-page`}>
        <div className="app-page-header">
          <div className="app-page-title-wrap">
            <h1 className="app-page-title">Parking Monitoring</h1>
            <p className="app-page-subtitle">
              Real-time occupancy tracking and slot availability monitoring.
            </p>
          </div>
        </div>
        <div className="app-state app-state--empty">
          <p>No monitoring data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.page} app-page`}>
      <div className="app-page-header">
        <div className="app-page-title-wrap">
          <h1 className="app-page-title">Parking Monitoring</h1>
          <p className="app-page-subtitle">
            Real-time occupancy tracking, per-zone slot status, and operator refresh controls.
          </p>
        </div>
        <div className="app-page-meta">
          <span className="app-pill">{zoneOptions.length} zones</span>
          {loading && (
            <span className="app-pill app-pill--live">
              <span className="app-pill-dot" />
              Refreshing
            </span>
          )}
          <span className="app-pill">Updated {timeAgo}</span>
        </div>
      </div>

      <NotificationBanner
        fullNotification={data.fullNotification}
        availableNotification={data.availableNotification}
      />

      <div className={styles.content}>
        <div className={styles.section}>
          <ZoneSelectorBar
            zones={zoneOptions}
            selectedZoneId={selectedZoneId}
            onSelectZone={selectZone}
          />
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>{data.zone.name} Summary</h2>
          <ZoneSummaryCards zone={data.zone} />
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Slot Status</h2>
          <SlotGrid slots={data.slots} />
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          <span>Last updated: <strong>{timeAgo}</strong></span>
        </div>
        <div className={styles.footerRight}>
          <span>{data.totalFreeSlots} free</span>
          <span>|</span>
          <span>{data.zone.occupiedSlots} occupied</span>
          <button
            className={`${styles.refreshBtn} app-button app-button--secondary`}
            onClick={refreshSlots}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Slots'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MonitoringPage;

/**
 * Dashboard Page
 * Shows parking facility overview, zone summary, and real-time statistics
 */

import { useDashboard } from '../hooks';
import { SummaryCard, ZoneCard } from '../components';
import styles from './DashboardPage.module.css';

function DashboardPage() {
  const { data, loading, error, timeAgo } = useDashboard(10000); // Poll every 10 seconds

  if (error) {
    return (
      <div className={styles.page}>
        <h1>Dashboard</h1>
        <div className={styles.error}>
          <p>Error loading dashboard data: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Dashboard</h1>
          <p className={styles.subtitle}>Parking Facility Real-Time Overview</p>
        </div>
        <div className={styles.status}>
          {loading && <span className={styles.loading}>Updating...</span>}
          <span className={styles.lastUpdated}>Last updated: {timeAgo}</span>
        </div>
      </div>

      {/* Summary Section */}
      <section className={styles.section}>
        <h2>Parking Summary</h2>
        <div className={styles.summaryGrid}>
          <SummaryCard
            label="Total Slots"
            value={data.summary.totalSlots}
            icon="🅿️"
            color="total"
          />
          <SummaryCard
            label="Occupied"
            value={data.summary.occupiedSlots}
            icon="🚗"
            color="occupied"
          />
          <SummaryCard
            label="Available"
            value={data.summary.availableSlots}
            icon="✓"
            color="available"
          />
          <SummaryCard
            label="Occupancy Rate"
            value={data.summary.occupancyPercentage}
            unit="%"
            icon="📊"
            color="occupancy"
          />
        </div>
      </section>

      {/* Zone Overview Section */}
      <section className={styles.section}>
        <h2>Zone Overview</h2>
        <div className={styles.zoneGrid}>
          {data.zones.map((zone) => (
            <ZoneCard key={zone.id} zone={zone} />
          ))}
        </div>
      </section>

      {/* Quick Summary Stats */}
      <section className={styles.section}>
        <h2>Quick Summary</h2>
        <div className={styles.quickStats}>
          <div className={styles.statBox}>
            <span className={styles.statTitle}>Zones Available</span>
            <span className={styles.statValue}>
              {data.zones.filter((z) => z.status === 'AVAILABLE').length}
            </span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statTitle}>Zones Full</span>
            <span className={styles.statValue}>
              {data.zones.filter((z) => z.status === 'FULL').length}
            </span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statTitle}>Next Best Zone</span>
            <span className={styles.statValue}>
              {data.zones.reduce((best, zone) => {
                return zone.availableSlots > best.availableSlots ? zone : best;
              }).name}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;

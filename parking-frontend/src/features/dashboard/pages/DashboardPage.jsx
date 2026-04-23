/**
 * Dashboard Page
 * Shows parking facility overview, zone summary, and real-time statistics
 */

import { useDashboard } from '../hooks';
import { SummaryCard, ZoneCard } from '../components';
import styles from './DashboardPage.module.css';

function DashboardPage() {
  const { data, loading, error, timeAgo } = useDashboard(10000);

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>
          <p>Error loading dashboard data: {error}</p>
        </div>
      </div>
    );
  }

  const zonesAvailable  = data.zones.filter((z) => z.status === 'AVAILABLE').length;
  const zonesFull       = data.zones.filter((z) => z.status === 'FULL').length;
  const nextBest        = data.zones.reduce((b, z) => z.availableSlots > b.availableSlots ? z : b);

  return (
    <div className={styles.page}>

      {/* ─��� Hero header — dark gradient panel, page anchor ── */}
      <div className={styles.heroHeader}>
        <div className={styles.heroInner}>
          <div className={styles.heroLeft}>
            <h1 className={styles.heroTitle}>Parking Dashboard</h1>
            <p className={styles.heroSubtitle}>Live facility overview — {data.zones.length} zones tracked</p>
          </div>
          <div className={styles.heroMeta}>
            {loading && (
              <span className={styles.heroLive}>
                <span className={styles.heroLiveDot} />
                Live
              </span>
            )}
            <span className={styles.heroTime}>Updated {timeAgo}</span>
          </div>
        </div>
      </div>

      {/* ── Parking Summary ── */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionLabel}>Parking Summary</h2>
          <div className={styles.sectionRule} />
        </div>
        <div className={styles.summaryGrid}>
          <SummaryCard
            label="Total Slots"
            value={data.summary.totalSlots}
            icon="🅿"
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
            icon="✔"
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

      {/* ── Zone Overview ── */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionLabel}>Zone Overview</h2>
          <div className={styles.sectionRule} />
        </div>
        <div className={styles.zoneGrid}>
          {data.zones.map((zone) => (
            <ZoneCard key={zone.id} zone={zone} />
          ))}
        </div>
      </section>

      {/* ── Quick Summary ── */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionLabel}>Quick Summary</h2>
          <div className={styles.sectionRule} />
        </div>
        <div className={styles.quickGrid}>
          <div className={styles.quickCard}>
            <div className={styles.quickIcon}>🟢</div>
            <div className={styles.quickBody}>
              <p className={styles.quickLabel}>Zones Available</p>
              <div className={styles.quickValue}>{zonesAvailable}</div>
            </div>
          </div>
          <div className={styles.quickCard}>
            <div className={styles.quickIcon}>🔴</div>
            <div className={styles.quickBody}>
              <p className={styles.quickLabel}>Zones Full</p>
              <div className={styles.quickValue}>{zonesFull}</div>
            </div>
          </div>
          <div className={styles.quickCard}>
            <div className={styles.quickIcon}>⭐</div>
            <div className={styles.quickBody}>
              <p className={styles.quickLabel}>Best Zone</p>
              <div className={styles.quickValue}><span>{nextBest.name}</span></div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default DashboardPage;
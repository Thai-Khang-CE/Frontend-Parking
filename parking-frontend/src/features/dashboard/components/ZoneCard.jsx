/**
 * ZoneCard Component
 * Displays zone information and occupancy status
 */

import styles from './ZoneCard.module.css';

function ZoneCard({ zone }) {
  const statusClass = zone.status === 'FULL' ? styles.statusFull : styles.statusAvailable;
  const occupancyColor = zone.occupancyPercentage > 80 ? 'high' : zone.occupancyPercentage > 50 ? 'medium' : 'low';

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.zoneName}>{zone.name}</h3>
        <span className={`${styles.status} ${statusClass}`}>
          {zone.status === 'FULL' ? '🔴 FULL' : '🟢 AVAILABLE'}
        </span>
      </div>

      <div className={styles.progressContainer}>
        <div className={styles.progressLabel}>
          <span className={styles.occupied}>{zone.occupiedSlots} occupied</span>
          <span className={styles.percent}>{zone.occupancyPercentage}%</span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={`${styles.progressFill} ${styles[`color-${occupancyColor}`]}`}
            style={{ width: `${zone.occupancyPercentage}%` }}
          />
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{zone.availableSlots}</div>
          <div className={styles.statLabel}>Available</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{zone.totalSlots}</div>
          <div className={styles.statLabel}>Total</div>
        </div>
      </div>
    </div>
  );
}

export default ZoneCard;

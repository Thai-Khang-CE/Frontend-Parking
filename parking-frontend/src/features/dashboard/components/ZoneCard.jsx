/**
 * ZoneCard Component
 * Displays zone information and occupancy status
 */

import styles from './ZoneCard.module.css';

function ZoneCard({ zone }) {
  const isFull = zone.status === 'FULL';
  const occupancyColor =
    zone.occupancyPercentage > 80 ? 'high' : zone.occupancyPercentage > 50 ? 'medium' : 'low';

  return (
    <div className={`${styles.card} ${isFull ? styles.statusFull : styles.statusAvailable}`}>
      {/* Header: zone name + status badge */}
      <div className={styles.header}>
        <div className={styles.zoneInfo}>
          <h3 className={styles.zoneName}>{zone.name}</h3>
          <p className={styles.zoneOccupiedLabel}>{zone.occupiedSlots} slots occupied</p>
        </div>
        <span className={`${styles.status} ${isFull ? styles.statusFull : styles.statusAvailable}`}>
          <span className={styles.statusDot} />
          {isFull ? 'Full' : 'Available'}
        </span>
      </div>

      {/* Large occupancy % — hero number */}
      <div className={styles.occupancyBig}>{zone.occupancyPercentage}%</div>

      {/* Progress bar */}
      <div className={styles.progressSection}>
        <div className={styles.progressBar}>
          <div
            className={`${styles.progressFill} ${styles[`color-${occupancyColor}`]}`}
            style={{ width: `${zone.occupancyPercentage}%` }}
          />
        </div>
      </div>

      {/* Available / Total mini-stats */}
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
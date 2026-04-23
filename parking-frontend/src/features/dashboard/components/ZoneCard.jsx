/**
 * ZoneCard Component
 * Displays zone information and occupancy status.
 */

import styles from './ZoneCard.module.css';

function ZoneCard({ zone, onClick }) {
  const isFull = zone.status === 'FULL';
  const occupancyColor =
    zone.occupancyPercentage > 80 ? 'high' : zone.occupancyPercentage > 50 ? 'medium' : 'low';
  const CardTag = onClick ? 'button' : 'div';

  return (
    <CardTag
      type={onClick ? 'button' : undefined}
      className={`${styles.card} ${isFull ? styles.statusFull : styles.statusAvailable} ${onClick ? styles.clickable : ''}`}
      onClick={onClick}
    >
      <div className={styles.header}>
        <div className={styles.zoneInfo}>
          <h3 className={styles.zoneName}>{zone.name}</h3>
          <p className={styles.zoneOccupiedLabel}>
            {zone.environment} zone - {zone.layoutLabel}
          </p>
        </div>
        <span className={`${styles.status} ${isFull ? styles.statusFull : styles.statusAvailable}`}>
          <span className={styles.statusDot} />
          {isFull ? 'Full' : 'Available'}
        </span>
      </div>

      <div className={styles.occupancyBig}>{zone.occupancyPercentage}%</div>

      <div className={styles.progressSection}>
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

      {onClick && (
        <div className={styles.cardAction}>
          <span>View zone detail</span>
          <span className={styles.cardActionArrow}>{'->'}</span>
        </div>
      )}
    </CardTag>
  );
}

export default ZoneCard;

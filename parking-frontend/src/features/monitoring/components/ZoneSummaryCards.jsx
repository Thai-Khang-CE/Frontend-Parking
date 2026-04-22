/**
 * ZoneSummaryCards Component
 * Displays zone metrics: total, occupied, available, occupancy %
 */

import styles from './ZoneSummaryCards.module.css';

function ZoneSummaryCards({ zone }) {
  const availableSlots = zone.availableSlots;
  const occupiedSlots = zone.occupiedSlots;
  const totalSlots = zone.totalSlots;
  const occupancyPercent = zone.occupancyPercentage;

  return (
    <div className={styles.grid}>
      <div className={`${styles.card} ${styles.total}`}>
        <div className={styles.value}>{totalSlots}</div>
        <div className={styles.label}>Total Slots</div>
      </div>

      <div className={`${styles.card} ${styles.occupied}`}>
        <div className={styles.value}>{occupiedSlots}</div>
        <div className={styles.label}>Occupied</div>
      </div>

      <div className={`${styles.card} ${styles.available}`}>
        <div className={styles.value}>{availableSlots}</div>
        <div className={styles.label}>Available</div>
      </div>

      <div className={`${styles.card} ${styles.occupancy}`}>
        <div className={styles.value}>{occupancyPercent.toFixed(1)}%</div>
        <div className={styles.label}>Occupancy</div>
      </div>
    </div>
  );
}

export default ZoneSummaryCards;

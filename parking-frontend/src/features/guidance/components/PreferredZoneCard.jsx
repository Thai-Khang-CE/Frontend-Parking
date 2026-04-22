/**
 * PreferredZoneCard Component
 * Displays the recommended parking zone prominently
 */

import styles from './PreferredZoneCard.module.css';

function PreferredZoneCard({ zone, status }) {
  const isFull = status === 'FULL';
  const statusClass = isFull ? styles.statusFull : styles.statusAvailable;

  return (
    <div className={`${styles.card} ${statusClass}`}>
      <div className={styles.label}>Recommended Zone</div>
      
      <div className={styles.zoneName}>{zone.name}</div>
      
      <div className={styles.availability}>
        <span className={styles.availableSlots}>{zone.availableSlots}</span>
        <span className={styles.slotsLabel}>spots available</span>
      </div>

      <div className={styles.occupancyBar}>
        <div className={styles.occupancyFill} style={{ width: `${zone.occupancyPercentage}%` }} />
      </div>
      <div className={styles.occupancyText}>{zone.occupancyPercentage}% full</div>

      <div className={styles.status}>
        {isFull ? '🔴 FULL' : '🟢 AVAILABLE'}
      </div>
    </div>
  );
}

export default PreferredZoneCard;

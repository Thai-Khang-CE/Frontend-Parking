/**
 * SlotGrid Component
 * Displays individual parking slot status in grid layout
 */

import styles from './SlotGrid.module.css';

function SlotGrid({ slots }) {
  if (!slots || slots.length === 0) {
    return <div className={styles.empty}>No slots available</div>;
  }

  const getOccupancyDurationText = (durationSeconds) => {
    if (!durationSeconds) return '';
    if (durationSeconds < 60) return `${durationSeconds}s`;
    if (durationSeconds < 3600) return `${Math.floor(durationSeconds / 60)}m`;
    return `${Math.floor(durationSeconds / 3600)}h`;
  };

  return (
    <div className={styles.grid}>
      {slots.map((slot) => (
        <div
          key={slot.id}
          className={`${styles.slot} ${styles[`status-${slot.status.toLowerCase()}`]}`}
          title={`Slot ${slot.number} - ${slot.status}`}
        >
          <div className={styles.slotNumber}>{slot.number}</div>
          <div className={styles.slotStatus}>
            {slot.status === 'FREE' && '✓'}
            {slot.status === 'OCCUPIED' && '✕'}
          </div>
          {slot.occupancyDuration && slot.status === 'OCCUPIED' && (
            <div className={styles.duration}>{getOccupancyDurationText(slot.occupancyDuration)}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default SlotGrid;

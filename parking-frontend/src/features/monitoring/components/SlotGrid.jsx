/**
 * SlotGrid Component
 * Displays individual parking slot status in grid layout
 */

import styles from './SlotGrid.module.css';

function SlotGrid({ slots, canEdit = false, onChangeStatus }) {
  if (!slots || slots.length === 0) {
    return <div className={styles.empty}>No slots available</div>;
  }

  const getOccupancyDurationText = (durationSeconds) => {
    if (!durationSeconds) return '';
    if (durationSeconds < 60) return `${durationSeconds}s`;
    if (durationSeconds < 3600) return `${Math.floor(durationSeconds / 60)}m`;
    return `${Math.floor(durationSeconds / 3600)}h`;
  };

  const getStatusIcon = (status) => {
    if (status === 'FREE') return 'OK';
    if (status === 'OCCUPIED') return 'X';
    if (status === 'UNAVAILABLE') return '-';
    return '?';
  };

  const getStatusLabel = (status) => {
    if (status === 'FREE') return 'Free';
    if (status === 'OCCUPIED') return 'Occupied';
    if (status === 'UNAVAILABLE') return 'Unavailable';
    return status;
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
          <div className={styles.slotStatus}>{getStatusIcon(slot.status)}</div>
          <div className={styles.statusLabel}>{getStatusLabel(slot.status)}</div>
          {slot.occupancyDuration && slot.status === 'OCCUPIED' && (
            <div className={styles.duration}>
              {getOccupancyDurationText(slot.occupancyDuration)}
            </div>
          )}
          {canEdit && (
            <select
              className={styles.statusSelect}
              value={slot.status}
              onChange={(event) => onChangeStatus?.(slot.id, event.target.value)}
              aria-label={`Change status for ${slot.number}`}
            >
              <option value="FREE">Free</option>
              <option value="OCCUPIED">Occupied</option>
              <option value="UNAVAILABLE">Unavailable</option>
            </select>
          )}
        </div>
      ))}
    </div>
  );
}

export default SlotGrid;

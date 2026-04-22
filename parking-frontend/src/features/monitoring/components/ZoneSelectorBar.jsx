/**
 * ZoneSelectorBar Component
 * Button bar to select active monitoring zone
 */

import styles from './ZoneSelectorBar.module.css';

function ZoneSelectorBar({ zones, selectedZoneId, onSelectZone }) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>Select Zone</label>
      <div className={styles.buttonGroup}>
        {zones.map((zone) => (
          <button
            key={zone.id}
            className={`${styles.button} ${selectedZoneId === zone.id ? styles.active : ''}`}
            onClick={() => onSelectZone(zone.id)}
          >
            {zone.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ZoneSelectorBar;

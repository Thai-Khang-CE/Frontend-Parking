/**
 * AlternativeZonesGrid Component
 * Displays alternative parking zone options
 */

import styles from './AlternativeZonesGrid.module.css';

function AlternativeZonesGrid({ zones }) {
  if (!zones || zones.length === 0) {
    return null;
  }

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>Alternative Options</h3>
      <div className={styles.grid}>
        {zones.map((zone) => (
          <div key={zone.id} className={styles.card}>
            <div className={styles.rank}>Option {zone.rank}</div>
            <div className={styles.zoneName}>{zone.name}</div>
            
            <div className={styles.stats}>
              <div className={styles.stat}>
                <div className={styles.statValue}>{zone.availableSlots}</div>
                <div className={styles.statLabel}>Available</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>{zone.totalSlots}</div>
                <div className={styles.statLabel}>Total</div>
              </div>
            </div>

            <div className={styles.occupancy}>
              <div className={styles.occupancyBar}>
                <div
                  className={styles.occupancyFill}
                  style={{ width: `${zone.occupancyPercentage}%` }}
                />
              </div>
              <div className={styles.occupancyPercent}>{zone.occupancyPercentage}% full</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AlternativeZonesGrid;

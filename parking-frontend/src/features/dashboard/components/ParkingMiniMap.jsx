import styles from './ParkingMiniMap.module.css';

function ZoneRowsPreview({ zone }) {
  return (
    <div className={styles.rowsPreview} aria-hidden="true">
      {Array.from({ length: zone.rowCount }, (_, index) => (
        <div key={`${zone.id}-row-${index}`} className={styles.rowLine} />
      ))}
    </div>
  );
}

function ParkingMiniMap({ zones, onSelectZone }) {
  return (
    <div className={styles.mapCard}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Mini Parking Map</h3>
          <p className={styles.subtitle}>Select a zone to inspect the physical layout and slot status.</p>
        </div>
        <div className={styles.legend}>
          <span><i className={`${styles.legendDot} ${styles.available}`} /> Available</span>
          <span><i className={`${styles.legendDot} ${styles.full}`} /> Full</span>
        </div>
      </div>

      <div className={styles.mapSurface}>
        <div className={styles.entryRoad}>
          <span>Main Gate</span>
          <div className={styles.roadLine} />
        </div>

        <div className={styles.zoneLayout}>
          {zones.map((zone) => (
            <button
              key={zone.id}
              type="button"
              className={`${styles.zoneBlock} ${styles[zone.miniMapVariant]} ${zone.status === 'FULL' ? styles.blockFull : styles.blockAvailable}`}
              onClick={() => onSelectZone(zone.id)}
            >
              <div className={styles.zoneTop}>
                <div>
                  <div className={styles.zoneName}>{zone.name}</div>
                  <div className={styles.zoneMeta}>{zone.environment}</div>
                </div>
                <div className={styles.zoneCount}>{zone.availableSlots} free</div>
              </div>

              <ZoneRowsPreview zone={zone} />

              <div className={styles.zoneFoot}>
                <span>{zone.layoutLabel}</span>
                <span>{zone.occupancyPercentage}% full</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ParkingMiniMap;

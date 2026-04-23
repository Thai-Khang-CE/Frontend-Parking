import { useNavigate, useParams } from 'react-router-dom';
import { useParkingContext } from '../../../context/ParkingContext.jsx';
import styles from './ZoneDetailPage.module.css';

const HERO_CLASS_MAP = {
  outdoor: 'heroOutdoor',
  covered: 'heroCovered',
  hybrid: 'heroHybrid',
};

const MAP_CLASS_MAP = {
  outdoor: 'mapOutdoor',
  covered: 'mapCovered',
  hybrid: 'mapHybrid',
};

const STATUS_ITEMS = [
  { key: 'free', label: 'Free', className: 'legendFree' },
  { key: 'occupied', label: 'Occupied', className: 'legendOccupied' },
  { key: 'unavailable', label: 'Unavailable', className: 'legendUnavailable' },
];

function ZoneDetailPage() {
  const navigate = useNavigate();
  const { zoneId } = useParams();
  const parking = useParkingContext();
  const detail = parking.getZoneDetailData(zoneId);

  if (!detail) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <h1>Zone not found</h1>
          <p>The requested zone is not available in the current parking model.</p>
          <button type="button" className={styles.backButton} onClick={() => navigate('/')}>
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  const heroClass = styles[HERO_CLASS_MAP[detail.zone.miniMapVariant]];
  const mapClass = styles[MAP_CLASS_MAP[detail.zone.miniMapVariant]];

  return (
    <div className={styles.page}>
      <section className={`${styles.hero} ${heroClass}`}>
        <div className={styles.heroTop}>
          <button type="button" className={styles.backButton} onClick={() => navigate('/')}>
            Back to dashboard
          </button>
          <div className={styles.heroMeta}>Updated {parking.timeAgo}</div>
        </div>

        <div className={styles.heroBody}>
          <div>
            <div className={styles.eyebrow}>{detail.zone.environment} Zone Detail</div>
            <h1 className={styles.title}>{detail.zone.name}</h1>
            <p className={styles.subtitle}>{detail.zone.detailSummary}</p>
          </div>
          <div className={styles.heroFacts}>
            <span>{detail.zone.layoutLabel}</span>
            <span>{detail.zone.accessNote}</span>
          </div>
        </div>
      </section>

      <section className={styles.metricsGrid}>
        <article className={styles.metricCard}>
          <span className={styles.metricLabel}>Total Slots</span>
          <strong className={styles.metricValue}>{detail.zone.totalSlots}</strong>
        </article>
        <article className={styles.metricCard}>
          <span className={styles.metricLabel}>Occupied</span>
          <strong className={styles.metricValue}>{detail.zone.occupiedSlots}</strong>
        </article>
        <article className={styles.metricCard}>
          <span className={styles.metricLabel}>Free</span>
          <strong className={styles.metricValue}>{detail.zone.availableSlots}</strong>
        </article>
        <article className={styles.metricCard}>
          <span className={styles.metricLabel}>Occupancy</span>
          <strong className={styles.metricValue}>{detail.zone.occupancyPercentage}%</strong>
        </article>
      </section>

      <div className={styles.contentGrid}>
        <section className={styles.mapCard}>
          <div className={styles.sectionHead}>
            <div>
              <h2 className={styles.sectionTitle}>Mini Parking Map</h2>
              <p className={styles.sectionText}>Slot positions follow the physical row and lane layout defined for this zone.</p>
            </div>
            <div className={styles.statusBadge}>{detail.zone.status}</div>
          </div>

          <div className={`${styles.mapShell} ${mapClass}`}>
            {detail.rows.map((row, rowIndex) => (
              <div key={row.id} className={styles.mapRowGroup}>
                <div className={`${styles.rowCard} ${styles[`surface-${row.surface}`]}`}>
                  <div className={styles.rowHeader}>
                    <div>
                      <div className={styles.rowTitle}>{row.label}</div>
                      <div className={styles.rowMeta}>{row.surface} section</div>
                    </div>
                    <div className={styles.rowSummary}>
                      {row.freeSlots} free / {row.occupiedSlots} occupied
                    </div>
                  </div>

                  <div className={styles.slotGrid}>
                    {row.slots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`${styles.slot} ${styles[`slot-${slot.status.toLowerCase()}`]}`}
                        title={`${slot.number} - ${slot.status}`}
                      >
                        {slot.number}
                      </div>
                    ))}
                  </div>
                </div>

                {detail.lanes
                  .filter((lane) => lane.afterRow === rowIndex)
                  .map((lane) => (
                    <div key={lane.id} className={styles.lane}>
                      <span>{lane.label}</span>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </section>

        <aside className={styles.sidebar}>
          <section className={styles.infoCard}>
            <h2 className={styles.sideTitle}>Zone Notes</h2>
            <p className={styles.sideText}>{detail.zone.accessNote}</p>
            <div className={styles.tagList}>
              <span className={styles.tag}>{detail.zone.environment}</span>
              <span className={styles.tag}>{detail.zone.rowCount} rows</span>
              <span className={styles.tag}>{detail.zone.laneCount} lane{detail.zone.laneCount > 1 ? 's' : ''}</span>
            </div>
          </section>

          <section className={styles.infoCard}>
            <h2 className={styles.sideTitle}>Status Legend</h2>
            <div className={styles.legendList}>
              {STATUS_ITEMS.map((item) => (
                <div key={item.key} className={styles.legendItem}>
                  <span className={`${styles.legendSwatch} ${styles[item.className]}`} />
                  <span>{item.label}</span>
                  <strong>{detail.statusBreakdown[item.key]}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.infoCard}>
            <h2 className={styles.sideTitle}>Row Summary</h2>
            <div className={styles.rowList}>
              {detail.rows.map((row) => (
                <div key={row.id} className={styles.rowListItem}>
                  <span>{row.label}</span>
                  <strong>{row.freeSlots} free</strong>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default ZoneDetailPage;

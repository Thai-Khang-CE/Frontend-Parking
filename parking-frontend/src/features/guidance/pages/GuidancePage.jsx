/**
 * Guidance Page
 * Driver guidance interface - shows parking recommendations
 * Updates automatically when shared parking state changes (via Monitoring refresh)
 */

import { useGuidance } from '../hooks';
import { PreferredZoneCard, GuidanceMessageBox, AlternativeZonesGrid } from '../components';
import styles from './GuidancePage.module.css';

function GuidancePage() {
  const { data, loading, error } = useGuidance();

  if (error) {
    return (
      <div className={`${styles.page} app-page`}>
        <div className="app-page-header">
          <div className="app-page-title-wrap">
            <h1 className="app-page-title">Parking Guidance</h1>
            <p className="app-page-subtitle">
              Driver recommendation flow based on current parking availability.
            </p>
          </div>
        </div>
        <div className="app-state app-state--error">
          <p>Error loading guidance: {error}</p>
        </div>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className={`${styles.page} app-page`}>
        <div className="app-page-header">
          <div className="app-page-title-wrap">
            <h1 className="app-page-title">Parking Guidance</h1>
            <p className="app-page-subtitle">
              Driver recommendation flow based on current parking availability.
            </p>
          </div>
        </div>
        <div className="app-state app-state--loading">
          <div className="app-spinner" />
          <p>Loading guidance...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`${styles.page} app-page`}>
        <div className="app-page-header">
          <div className="app-page-title-wrap">
            <h1 className="app-page-title">Parking Guidance</h1>
            <p className="app-page-subtitle">
              Driver recommendation flow based on current parking availability.
            </p>
          </div>
        </div>
        <div className="app-state app-state--empty">
          <p>No guidance available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.page} app-page`}>
      <div className="app-page-header">
        <div className="app-page-title-wrap">
          <h1 className="app-page-title">Parking Guidance</h1>
          <p className="app-page-subtitle">
            Find the most suitable zone based on live occupancy and route updates.
          </p>
        </div>
        <div className="app-page-meta">
          <span className="app-pill">{data.status}</span>
        </div>
      </div>

      <div className={styles.content}>
        <PreferredZoneCard zone={data.preferredZone} status={data.status} />
        <GuidanceMessageBox message={data.guidanceMessage} signageMessage={data.signageMessage} />
        {data.alternativeZones && data.alternativeZones.length > 0 && (
          <AlternativeZonesGrid zones={data.alternativeZones} />
        )}
      </div>

      <div className={styles.actions}>
        <p className={`app-note ${styles.note}`}>
          Guidance updates automatically when Monitoring refreshes zone availability.
        </p>
      </div>
    </div>
  );
}

export default GuidancePage;

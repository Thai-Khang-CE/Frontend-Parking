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
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>Parking Guidance</h1>
        </div>
        <div className={styles.error}>
          <p>Error loading guidance: {error}</p>
        </div>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>Parking Guidance</h1>
        </div>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading guidance...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>Parking Guidance</h1>
        </div>
        <div className={styles.empty}>
          <p>No guidance available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Parking Guidance</h1>
        <p className={styles.subtitle}>Find your perfect parking spot</p>
      </div>

      <div className={styles.content}>
        {/* Preferred Zone - Prominent Display */}
        <PreferredZoneCard zone={data.preferredZone} status={data.status} />

        {/* Main Guidance Message */}
        <GuidanceMessageBox message={data.guidanceMessage} signageMessage={data.signageMessage} />

        {/* Alternative Zones */}
        {data.alternativeZones && data.alternativeZones.length > 0 && (
          <AlternativeZonesGrid zones={data.alternativeZones} />
        )}
      </div>

      {/* Info note - guidance driven from Monitoring */}
      <div className={styles.actions}>
        <p className={styles.note}>
          Guidance updates automatically when Monitoring refreshes slots
        </p>
      </div>
    </div>
  );
}

export default GuidancePage;
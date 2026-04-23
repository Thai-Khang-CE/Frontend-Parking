/**
 * Signage Page
 * Driver-facing large display - simple, readable guidance + quick info
 * Uses useSignage hook and SignageDisplay component
 */

import { useSignage } from '../hooks';
import { SignageDisplay } from '../components';
import styles from './SignagePage.module.css';

function SignagePage() {
  const { data, display, loading, error, timeAgo } = useSignage();

  if (loading && !data) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Parking Signage</h1>
          <p className={styles.subtitle}>Driver display view</p>
        </div>
        <div className="app-state app-state--loading">
          <div className="app-spinner" />
          <p>Loading parking data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Parking Signage</h1>
          <p className={styles.subtitle}>Driver display view</p>
        </div>
        <div className="app-state app-state--error">
          <p>Error loading signage: {error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Parking Signage</h1>
          <p className={styles.subtitle}>Driver display view</p>
        </div>
        <div className="app-state app-state--empty">
          <p>No signage data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Parking Signage</h1>
        <span className={styles.subtitle}>{loading ? 'updating...' : `Updated ${timeAgo}`}</span>
      </div>

      <div className={styles.displayWrapper}>
        <SignageDisplay data={data} display={display} />
      </div>

      <div className={styles.footer}>
        <div className={styles.footerInfo}>
          <span className={`${styles.statusDot} ${loading ? styles.pulse : ''}`} />
          <span>{loading ? 'Refreshing data' : 'Display live'}</span>
        </div>
      </div>
    </div>
  );
}

export default SignagePage;

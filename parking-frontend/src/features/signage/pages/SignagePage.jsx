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

  // Handle loading state
  if (loading && !data) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Parking Signage</h1>
          <p className={styles.subtitle}>Driver Display View</p>
        </div>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading parking data...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Parking Signage</h1>
          <p className={styles.subtitle}>Driver Display View</p>
        </div>
        <div className={styles.error}>
          <p>Error loading signage: {error}</p>
        </div>
      </div>
    );
  }

  // Handle empty data state
  if (!data) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Parking Signage</h1>
          <p className={styles.subtitle}>Driver Display View</p>
        </div>
        <div className={styles.empty}>
          <p>No signage data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Minimal header - hidden by default, shows in browser tab */}
      <div className={styles.header}>
        <h1 className={styles.title}>Parking Signage</h1>
        <span className={styles.subtitle}>{loading ? 'updating...' : `Updated ${timeAgo}`}</span>
      </div>

      {/* Full driver-facing display */}
      <div className={styles.displayWrapper}>
        <SignageDisplay data={data} display={display} />
      </div>

      {/* Minimal footer */}
      <div className={styles.footer}>
        <div className={styles.footerInfo}>
          <span className={`${styles.statusDot} ${loading ? styles.pulse : ''}`} />
        </div>
      </div>
    </div>
  );
}

export default SignagePage;
/**
 * NotificationBanner Component
 * Displays system notifications (full zone, became available, etc.)
 */

import styles from './NotificationBanner.module.css';

function NotificationBanner({ fullNotification, availableNotification }) {
  if (!fullNotification && !availableNotification) {
    return null;
  }

  return (
    <div className={styles.container}>
      {fullNotification && (
        <div className={`${styles.banner} ${styles.full}`}>
          <span className={styles.icon}>⚠️</span>
          <span className={styles.message}>Zone is at full capacity!</span>
        </div>
      )}

      {availableNotification && (
        <div className={`${styles.banner} ${styles.available}`}>
          <span className={styles.icon}>✓</span>
          <span className={styles.message}>Zone is now available again</span>
        </div>
      )}
    </div>
  );
}

export default NotificationBanner;

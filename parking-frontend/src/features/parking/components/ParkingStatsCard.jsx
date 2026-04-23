/**
 * Parking Statistics Card Component
 * Displays summary of parking stats
 */

import { formatCurrency } from '../../../mock/myParkingMock';
import styles from './ParkingStatsCard.module.css';

function ParkingStatsCard({ stats = {} }) {
  const {
    totalSessions = 0,
    totalPaid = 0,
    totalUnpaid = 0,
    hasActiveSessions = false
  } = stats;

  return (
    <div className={styles.container}>
      <div className={styles.statsGrid}>
        {/* Total Sessions */}
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <h4 className={styles.statLabel}>Total Sessions</h4>
            <p className={styles.statValue}>{totalSessions}</p>
          </div>
        </div>

        {/* Total Paid */}
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <h4 className={styles.statLabel}>Total Paid</h4>
            <p className={styles.statValue}>{formatCurrency(totalPaid)}</p>
          </div>
        </div>

        {/* Total Unpaid */}
        <div className={`${styles.statCard} ${totalUnpaid > 0 ? styles.warning : ''}`}>
          <div className={styles.statIcon}>⚠️</div>
          <div className={styles.statContent}>
            <h4 className={styles.statLabel}>Outstanding Fees</h4>
            <p className={`${styles.statValue} ${totalUnpaid > 0 ? styles.unpaid : ''}`}>
              {formatCurrency(totalUnpaid)}
            </p>
          </div>
        </div>

        {/* Active Session Status */}
        <div className={`${styles.statCard} ${hasActiveSessions ? styles.active : styles.inactive}`}>
          <div className={styles.statIcon}>{hasActiveSessions ? '🟢' : '⭕'}</div>
          <div className={styles.statContent}>
            <h4 className={styles.statLabel}>Active Session</h4>
            <p className={styles.statValue}>{hasActiveSessions ? 'In Progress' : 'None'}</p>
          </div>
        </div>
      </div>

      {/* Alert for unpaid fees */}
      {totalUnpaid > 0 && (
        <div className={styles.alert}>
          <span className={styles.alertIcon}>⚠️</span>
          <div className={styles.alertContent}>
            <p className={styles.alertTitle}>Outstanding Payment</p>
            <p className={styles.alertMessage}>
              You have unpaid parking fees of {formatCurrency(totalUnpaid)}. Please settle your account.
            </p>
          </div>
          <button className={styles.payButton}>Pay Now</button>
        </div>
      )}
    </div>
  );
}

export default ParkingStatsCard;

/**
 * Parking Statistics Card Component
 * Displays summary of parking stats
 */

import { formatCurrency } from '../../../mock/myParkingMock';
import styles from './ParkingStatsCard.module.css';

function ParkingStatsCard({ stats = {}, onPayNow }) {
  const {
    totalSessions = 0,
    totalPaid = 0,
    totalUnpaid = 0,
    currentEstimatedFee = 0,
    totalAmountDue = totalUnpaid,
    hasActiveSessions = false
  } = stats;

  return (
    <div className={styles.container}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>LOG</div>
          <div className={styles.statContent}>
            <h4 className={styles.statLabel}>Total Sessions</h4>
            <p className={styles.statValue}>{totalSessions}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>OK</div>
          <div className={styles.statContent}>
            <h4 className={styles.statLabel}>Total Paid</h4>
            <p className={styles.statValue}>{formatCurrency(totalPaid)}</p>
          </div>
        </div>

        <div className={`${styles.statCard} ${totalAmountDue > 0 ? styles.warning : ''}`}>
          <div className={styles.statIcon}>DUE</div>
          <div className={styles.statContent}>
            <h4 className={styles.statLabel}>Total Amount Due</h4>
            <p className={`${styles.statValue} ${totalAmountDue > 0 ? styles.unpaid : ''}`}>
              {formatCurrency(totalAmountDue)}
            </p>
          </div>
        </div>

        <div className={`${styles.statCard} ${hasActiveSessions ? styles.active : styles.inactive}`}>
          <div className={styles.statIcon}>{hasActiveSessions ? 'ON' : '--'}</div>
          <div className={styles.statContent}>
            <h4 className={styles.statLabel}>
              {hasActiveSessions ? 'Current Estimate' : 'Active Session'}
            </h4>
            <p className={styles.statValue}>
              {hasActiveSessions ? formatCurrency(currentEstimatedFee) : 'None'}
            </p>
          </div>
        </div>
      </div>

      {totalAmountDue > 0 && (
        <div className={styles.alert}>
          <span className={styles.alertIcon}>DUE</span>
          <div className={styles.alertContent}>
            <p className={styles.alertTitle}>Payment Summary</p>
            <p className={styles.alertMessage}>
              {hasActiveSessions && currentEstimatedFee > 0
                ? `Confirmed extensions update your current session estimate to ${formatCurrency(currentEstimatedFee)}. Total amount due is now ${formatCurrency(totalAmountDue)}.`
                : `You have unpaid parking fees of ${formatCurrency(totalUnpaid)}. Please settle your account.`}
            </p>
          </div>
          <button
            type="button"
            className={styles.payButton}
            onClick={onPayNow}
            disabled={!onPayNow}
          >
            Pay Now
          </button>
        </div>
      )}
    </div>
  );
}

export default ParkingStatsCard;

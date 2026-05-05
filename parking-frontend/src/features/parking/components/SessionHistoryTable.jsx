/**
 * Session History Table Component
 * Displays past parking sessions
 */

import {
  formatCurrency,
  formatSessionBillingPeriod,
  getSessionBillingMonthDisplay
} from '../../../mock/myParkingMock';
import styles from './SessionHistoryTable.module.css';

function formatDuration(session) {
  return formatSessionBillingPeriod(session);
}

function SessionHistoryTable({ sessions = [], highlightSessionId = null }) {
  if (sessions.length === 0) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Parking History</h3>
        <div className={styles.empty}>
          <p>No parking history available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Parking History</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thDate}>Billing Month</th>
              <th className={styles.thZone}>Zone</th>
              <th className={styles.thSlot}>Slot</th>
              <th className={styles.thDuration}>Billing Period</th>
              <th className={styles.thFee}>Fee</th>
              <th className={styles.thStatus}>Status</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => {
              const isHighlighted = session.id === highlightSessionId;
              const billingDate = getSessionBillingMonthDisplay(session);

              return (
                <tr
                  key={session.id}
                  className={`${styles.row} ${isHighlighted ? styles.recentRow : ''}`}
                >
                  <td className={styles.tdDate}>
                    <div className={styles.dateGroup}>
                      <div className={styles.dateFull}>{billingDate.primary}</div>
                      <div className={styles.timeRange}>{billingDate.secondary}</div>
                    </div>
                  </td>
                  <td className={styles.tdZone}>
                    <span className={styles.zoneBadge}>{session.zoneName}</span>
                  </td>
                  <td className={styles.tdSlot}>{session.slot}</td>
                  <td className={styles.tdDuration}>{formatDuration(session)}</td>
                  <td className={styles.tdFee}>
                    <div className={styles.feeGroup}>
                      <span className={styles.amount}>{formatCurrency(session.fee)}</span>
                      <span className={`${styles.paymentBadge} ${session.paid ? styles.paid : styles.unpaid}`}>
                        {session.paid ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                  </td>
                  <td className={styles.tdStatus}>
                    <span className={`${styles.statusBadge} ${isHighlighted ? styles.recent : styles.completed}`}>
                      {isHighlighted ? 'Recently exited' : 'Completed'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SessionHistoryTable;

/**
 * Session History Table Component
 * Displays past parking sessions
 */

import { formatDate, formatCurrency, formatTime } from '../../../mock/myParkingMock';
import styles from './SessionHistoryTable.module.css';

function formatDuration(session) {
  if (session.durationLabel) {
    return session.durationLabel;
  }

  if (typeof session.duration === 'number') {
    return `${session.duration.toFixed(2)}h`;
  }

  if (session.duration) {
    return String(session.duration);
  }

  return '--';
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
              <th className={styles.thDate}>Date</th>
              <th className={styles.thZone}>Zone</th>
              <th className={styles.thSlot}>Slot</th>
              <th className={styles.thDuration}>Duration</th>
              <th className={styles.thFee}>Fee</th>
              <th className={styles.thStatus}>Status</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => {
              const isHighlighted = session.id === highlightSessionId;

              return (
                <tr
                  key={session.id}
                  className={`${styles.row} ${isHighlighted ? styles.recentRow : ''}`}
                >
                  <td className={styles.tdDate}>
                    <div className={styles.dateGroup}>
                      <div className={styles.dateFull}>{formatDate(session.entryTime)}</div>
                      <div className={styles.timeRange}>
                        {formatTime(session.entryTime)} - {formatTime(session.exitTime)}
                      </div>
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

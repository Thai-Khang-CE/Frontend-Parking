/**
 * Active Session Card Component
 * Displays current active parking session
 */

import { formatCurrency, formatTime } from '../../../mock/myParkingMock';
import styles from './ActiveSessionCard.module.css';

function ActiveSessionCard({
  session,
  onExit,
  onExtend,
  isExtending = false,
  isAwaitingConfirmation = false
}) {
  if (!session) return null;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Active Parking Session</h3>
        <span className={styles.badge}>ACTIVE</span>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Vehicle</h4>
          <div className={styles.vehicleInfo}>
            <div className={styles.vehicleRow}>
              <span className={styles.label}>License Plate:</span>
              <span className={styles.value}>{session.vehicle.licensePlate}</span>
            </div>
            <div className={styles.vehicleRow}>
              <span className={styles.label}>Model:</span>
              <span className={styles.value}>{session.vehicle.make} {session.vehicle.model} ({session.vehicle.color})</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Parking Location</h4>
          <div className={styles.locationInfo}>
            <div className={styles.locationRow}>
              <span className={styles.label}>Zone:</span>
              <span className={styles.value}>{session.zoneName}</span>
            </div>
            <div className={styles.locationRow}>
              <span className={styles.label}>Slot:</span>
              <span className={styles.value}>{session.slot}</span>
            </div>
            {session.notes && (
              <div className={styles.locationRow}>
                <span className={styles.label}>Notes:</span>
                <span className={styles.value}>{session.notes}</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Timing and Fees</h4>
          <div className={styles.timingInfo}>
            <div className={styles.timingRow}>
              <span className={styles.label}>Entry Time:</span>
              <span className={styles.value}>{formatTime(session.entryTime)}</span>
            </div>
            <div className={styles.timingRow}>
              <span className={styles.label}>Elapsed Time:</span>
              <span className={`${styles.value} ${styles.elapsed}`}>{session.elapsedTime || 'calculating...'}</span>
            </div>
            <div className={`${styles.timingRow} ${styles.feeRow}`}>
              <span className={styles.label}>Estimated Fee:</span>
              <span className={styles.value}>{formatCurrency(session.estimatedFee, session.currency)}</span>
            </div>
            {session.extensionHours > 0 && (
              <>
                <div className={styles.timingRow}>
                  <span className={styles.label}>Extended By:</span>
                  <span className={styles.value}>
                    {session.extensionHours} hour{session.extensionHours > 1 ? 's' : ''}
                  </span>
                </div>
                <div className={styles.timingRow}>
                  <span className={styles.label}>Extended Until:</span>
                  <span className={styles.value}>{formatTime(session.extendedUntil)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.exitButton} onClick={onExit}>
            Exit Parking
          </button>
          <button
            type="button"
            className={styles.extendButton}
            onClick={onExtend}
            disabled={isExtending || isAwaitingConfirmation}
          >
            {isExtending
              ? 'Extending...'
              : isAwaitingConfirmation
                ? 'Awaiting Confirmation...'
                : 'Extend Time'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActiveSessionCard;

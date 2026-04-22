/* Signage Display - Driver-facing parking zone display */

import styles from './SignageDisplay.module.css';

function SignageDisplay({ data, display }) {
  if (!data || !display) return null;

  const status = display.status || data.status;
  const isFull = status === 'FULL' || data.status === 'FULL';

  return (
    <div className={`${styles.display} ${isFull ? styles.full : ''}`}>
      {/* Status Badge - GO or FULL */}
      <div className={styles.statusRow}>
        <div className={`${styles.statusBadge} ${isFull ? styles.fullStatus : styles.go}`}>
          {isFull ? 'FULL' : 'GO'}
        </div>
      </div>

      {/* Primary Zone Name - Most Dominant */}
      <div className={styles.primary}>
        <div className={styles.primaryText}>{display.line1}</div>
        <div className={styles.primarySub}>{display.line2}</div>
      </div>

      {/* Secondary Guidance */}
      {display.line3 && (
        <div className={styles.secondary}>
          {display.line3}
        </div>
      )}

      {/* Alternative Zone Suggestion */}
      {data.alternatives && !isFull && (
        <div className={styles.alternatives}>
          {data.alternatives}
        </div>
      )}
    </div>
  );
}

export default SignageDisplay;

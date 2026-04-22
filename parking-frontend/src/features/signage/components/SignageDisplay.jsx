import styles from './SignageDisplay.module.css';

function SignageDisplay({ data, display }) {
  if (!data || !display) return null;

  const status = display.status || data.status;
  const isFull = status === 'FULL' || data.status === 'FULL';

  return (
    <div className={`${styles.display} ${isFull ? styles.full : ''}`}>
      <div className={styles.statusRow}>
        <div className={styles.statusBadge}>{status === 'GO' ? '✓ GO' : 'FULL'}</div>
      </div>

      <div className={styles.primary}>
        <div className={styles.primaryText}>{display.line1}</div>
        <div className={styles.primarySub}>{display.line2}</div>
      </div>

      {display.line3 && (
        <div className={styles.secondary}>
          {display.line3}
        </div>
      )}

      {data.alternatives && !isFull && (
        <div className={styles.alternatives}>{data.alternatives}</div>
      )}
    </div>
  );
}

export default SignageDisplay;

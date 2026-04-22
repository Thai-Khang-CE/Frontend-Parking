/**
 * GuidanceMessageBox Component
 * Displays main guidance instruction text
 */

import styles from './GuidanceMessageBox.module.css';

function GuidanceMessageBox({ message, signageMessage }) {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.label}>Direction</div>
        <p className={styles.message}>{message}</p>
      </div>

      {signageMessage && (
        <div className={styles.signage}>
          <div className={styles.label}>Driver Display</div>
          <div className={styles.signageText}>{signageMessage}</div>
        </div>
      )}
    </div>
  );
}

export default GuidanceMessageBox;

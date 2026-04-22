/**
 * SummaryCard Component
 * Displays a single summary metric (total, occupied, available, occupancy)
 */

import styles from './SummaryCard.module.css';

function SummaryCard({ label, value, unit = '', icon = null, color = 'default' }) {
  return (
    <div className={`${styles.card} ${styles[`color-${color}`]}`}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.value}>{value}</div>
      {unit && <div className={styles.unit}>{unit}</div>}
      <div className={styles.label}>{label}</div>
    </div>
  );
}

export default SummaryCard;

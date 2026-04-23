/**
 * Bills Page
 * Allows admins to view and manage parking bills
 * Available to: admin only
 */

import styles from './BillsPage.module.css';

function BillsPage() {
  return (
    <div className={styles.container}>
      <h1>Bills Management</h1>
      <p>View and manage parking bills</p>
      
      <div className={styles.section}>
        <h2>Outstanding Bills</h2>
        <div className={styles.placeholder}>
          <p>Bills management interface coming soon</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Billing History</h2>
        <div className={styles.placeholder}>
          <p>Billing history will appear here</p>
        </div>
      </div>
    </div>
  );
}

export default BillsPage;

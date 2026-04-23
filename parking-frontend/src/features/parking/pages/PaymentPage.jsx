/**
 * Payment Page
 * Allows users to view parking fees and make payments
 * Available to: student, staff
 */

import styles from './PaymentPage.module.css';

function PaymentPage() {
  return (
    <div className={styles.container}>
      <h1>Parking Fees & Payments</h1>
      <p>View your parking fees and manage payments</p>
      
      <div className={styles.section}>
        <h2>Outstanding Fees</h2>
        <div className={styles.placeholder}>
          <p>No outstanding fees</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Payment History</h2>
        <div className={styles.placeholder}>
          <p>Your payment history will appear here</p>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;

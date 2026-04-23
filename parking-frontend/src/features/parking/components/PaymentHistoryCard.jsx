/**
 * Payment History Card Component
 * Displays past payment transactions
 */

import { formatCurrency } from "../../../mock/paymentMock";
import styles from "./PaymentHistoryCard.module.css";

function PaymentHistoryCard({ transactions = [] }) {
  if (transactions.length === 0) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Payment History</h3>
        <div className={styles.empty}>
          <p className={styles.emptyIcon}>LOG</p>
          <p>No payment transactions yet</p>
          <p className={styles.emptyText}>
            Your completed payments will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Payment History</h3>
      <div className={styles.transactionsList}>
        {transactions.map((txn) => (
          <div key={txn.id} className={styles.transactionItem}>
            <div className={styles.left}>
              <div className={styles.icon}>
                {txn.status === "completed" ? "OK" : "!"}
              </div>
              <div className={styles.txnInfo}>
                <div className={styles.txnDate}>
                  {new Date(txn.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className={styles.txnMethod}>
                  {txn.paymentMethod} | {txn.sessions.length} session
                  {txn.sessions.length > 1 ? "s" : ""}
                </div>
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.amount}>{formatCurrency(txn.amount)}</div>
              <div className={styles.txnId}>{txn.transactionId}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PaymentHistoryCard;

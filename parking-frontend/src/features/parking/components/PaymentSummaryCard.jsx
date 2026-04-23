/**
 * Payment Summary Card Component
 * Shows total amount due and payment summary
 */

import { formatCurrency } from "../../../mock/paymentMock";
import styles from "./PaymentSummaryCard.module.css";

function PaymentSummaryCard({
  stats,
  selectedCount,
  amountToPay,
}) {
  if (!stats) return null;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Payment Summary</h2>
      </div>

      <div className={styles.content}>
        <div className={styles.row}>
          <span className={styles.label}>Total Unpaid Amount:</span>
          <span className={styles.amount}>
            {formatCurrency(stats.totalUnpaid)}
          </span>
        </div>

        {selectedCount > 0 && (
          <>
            <div className={styles.divider}></div>
            <div className={styles.row}>
              <span className={styles.label}>Sessions Selected:</span>
              <span className={styles.value}>
                {selectedCount} of {stats.unpaidCount}
              </span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Amount to Pay:</span>
              <span className={styles.amountToPay}>
                {formatCurrency(amountToPay)}
              </span>
            </div>
          </>
        )}

        {selectedCount === 0 && stats.unpaidCount > 0 && (
          <div className={styles.note}>
            <p>Select sessions to proceed with payment.</p>
          </div>
        )}

        {stats.unpaidCount === 0 && (
          <div className={styles.note}>
            <p>No unpaid parking sessions.</p>
          </div>
        )}
      </div>

      {selectedCount > 0 && (
        <div className={styles.info}>
          <p>
            Info: you are about to pay for {selectedCount} parking session
            {selectedCount > 1 ? "s" : ""}.
          </p>
        </div>
      )}
    </div>
  );
}

export default PaymentSummaryCard;

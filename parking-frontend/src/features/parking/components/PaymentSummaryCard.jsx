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
        {stats.currentEstimatedFee > 0 && (
          <div className={styles.row}>
            <span className={styles.label}>Current Session Monthly Estimate:</span>
            <span className={styles.value}>
              {formatCurrency(stats.currentEstimatedFee)}
            </span>
          </div>
        )}

        <div className={styles.row}>
          <span className={styles.label}>Payable Unpaid Sessions:</span>
          <span className={styles.value}>
            {formatCurrency(stats.payableUnpaidAmount)}
          </span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>Total Amount Due:</span>
          <span className={styles.amount}>
            {formatCurrency(stats.totalAmountDue)}
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
              <span className={styles.label}>Amount to Pay Now:</span>
              <span className={styles.amountToPay}>
                {formatCurrency(amountToPay)}
              </span>
            </div>
          </>
        )}

        {selectedCount === 0 && stats.unpaidCount > 0 && (
          <div className={styles.note}>
            <p>Select completed unpaid sessions to proceed with payment.</p>
          </div>
        )}

        {stats.unpaidCount === 0 && stats.currentEstimatedFee > 0 && (
          <div className={styles.note}>
            <p>
              Your current monthly session estimate is shown above. It will become payable
              after the parking session is exited.
            </p>
          </div>
        )}

        {stats.unpaidCount === 0 && stats.currentEstimatedFee === 0 && (
          <div className={styles.note}>
            <p>No unpaid parking sessions.</p>
          </div>
        )}
      </div>

      {(selectedCount > 0 || stats.currentEstimatedFee > 0) && (
        <div className={styles.info}>
          <p>
            {selectedCount > 0
              ? `Info: you are about to pay for ${selectedCount} parking session${selectedCount > 1 ? "s" : ""}.`
              : "Info: the current session estimate updates automatically with the monthly billing unit."}
          </p>
        </div>
      )}
    </div>
  );
}

export default PaymentSummaryCard;

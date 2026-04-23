/**
 * Receipt Modal Component
 * Displays payment success/failure receipt
 */

import { formatCurrency } from "../../../mock/paymentMock";
import styles from "./ReceiptModal.module.css";

function ReceiptModal({ result, onClose }) {
  if (!result) return null;

  const isSuccess = result.success;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          x
        </button>

        <div className={styles.content}>
          {isSuccess ? (
            <>
              <div className={styles.successIcon}>OK</div>
              <h2 className={styles.title}>Payment Successful</h2>
              <p className={styles.subtitle}>Your payment has been processed.</p>

              <div className={styles.details}>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Transaction ID:</span>
                  <span className={styles.value}>{result.transactionId}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Amount Paid:</span>
                  <span className={styles.value}>
                    {formatCurrency(result.amount)}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Payment Method:</span>
                  <span className={styles.value}>{result.paymentMethod}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Sessions Paid:</span>
                  <span className={styles.value}>{result.sessionsCount}</span>
                </div>
                {result.receipt && (
                  <>
                    <div className={styles.detailRow}>
                      <span className={styles.label}>Reference:</span>
                      <span className={styles.value}>
                        {result.receipt.reference}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.label}>Time:</span>
                      <span className={styles.value}>
                        {new Date(result.receipt.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <p className={styles.message}>
                A receipt has been sent to your email. You can access it anytime
                from your account.
              </p>
            </>
          ) : (
            <>
              <div className={styles.errorIcon}>!</div>
              <h2 className={styles.title}>Payment Failed</h2>
              <p className={styles.subtitle}>Unable to process payment.</p>

              <div className={styles.errorDetails}>
                <p className={styles.errorMessage}>
                  {result.error ||
                    "An error occurred during payment processing."}
                </p>
              </div>

              <p className={styles.message}>
                Please check your payment method and try again, or contact
                support if the problem persists.
              </p>
            </>
          )}

          <button className={styles.closeModalBtn} onClick={onClose}>
            {isSuccess ? "Return to Payment" : "Try Again"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReceiptModal;

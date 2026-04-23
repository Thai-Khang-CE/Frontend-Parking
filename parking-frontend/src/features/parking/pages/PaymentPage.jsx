/**
 * Payment Page
 * Allows users to view parking fees and make payments
 * Available to: student, staff
 */

import { useLocation } from 'react-router-dom';
import { usePayment } from '../hooks';
import {
  BillingDetailsTable,
  PaymentMethodSelector,
  PaymentSummaryCard,
  PaymentHistoryCard,
  ReceiptModal,
} from '../components';
import styles from './PaymentPage.module.css';

function PaymentPage() {
  const location = useLocation();
  const {
    data,
    loading,
    error,
    stats,
    selectedMethod,
    setSelectedMethod,
    isProcessing,
    paymentResult,
    clearPaymentResult,
    selectedSessions,
    toggleSessionSelection,
    selectAllSessions,
    deselectAllSessions,
    handlePayment,
    calculateAmount,
  } = usePayment();
  const arrivedFromMyParking = location.state?.source === 'my-parking';

  if (error) {
    return (
      <div className={`${styles.page} app-page`}>
        <div className="app-page-header">
          <div className="app-page-title-wrap">
            <h1 className="app-page-title">Parking Fees and Payments</h1>
            <p className="app-page-subtitle">
              Review outstanding sessions, select a payment method, and confirm payment.
            </p>
          </div>
        </div>
        <div className="app-state app-state--error">
          <p>Error loading payment data: {error}</p>
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className={`${styles.page} app-page`}>
        <div className="app-page-header">
          <div className="app-page-title-wrap">
            <h1 className="app-page-title">Parking Fees and Payments</h1>
            <p className="app-page-subtitle">
              Review outstanding sessions, select a payment method, and confirm payment.
            </p>
          </div>
        </div>
        <div className="app-state app-state--loading">
          <div className="app-spinner" />
          <p>Loading payment information...</p>
        </div>
      </div>
    );
  }

  const hasUnpaidSessions =
    data.unpaidSessions && data.unpaidSessions.length > 0;
  const hasCurrentEstimate = (stats?.currentEstimatedFee || 0) > 0;

  return (
    <div className={`${styles.page} app-page`}>
      <div className="app-page-header">
        <div className="app-page-title-wrap">
          <h1 className="app-page-title">Parking Fees and Payments</h1>
          <p className="app-page-subtitle">
            Manage your parking payments and review completed transactions.
          </p>
        </div>
        <div className="app-page-meta">
          <span className="app-pill">{data.unpaidSessions.length} unpaid sessions</span>
          <span className="app-pill">{data.transactionHistory.length} transactions</span>
        </div>
      </div>

      <PaymentSummaryCard
        stats={stats}
        selectedCount={selectedSessions.length}
        amountToPay={calculateAmount()}
      />

      {arrivedFromMyParking && hasUnpaidSessions && (
        <section className={styles.entryNotice}>
          <p className={styles.entryNoticeTitle}>Payment flow ready</p>
          <p className={styles.entryNoticeText}>
            Outstanding parking sessions are preselected. Choose a payment method and click
            <strong> Pay Now</strong> to complete the transaction.
          </p>
        </section>
      )}

      {hasCurrentEstimate && (
        <section className={styles.estimateNotice}>
          <p className={styles.estimateNoticeTitle}>Current session estimate</p>
          <p className={styles.estimateNoticeText}>
            The total amount due includes your active parking session estimate. It updates when
            you extend time, and the session becomes directly payable after exit.
          </p>
        </section>
      )}

      <div className={styles.mainContent}>
        <div className={styles.leftColumn}>
          {hasUnpaidSessions && (
            <BillingDetailsTable
              sessions={data.unpaidSessions}
              selectedIds={selectedSessions}
              onToggleSelection={toggleSessionSelection}
              onSelectAll={selectAllSessions}
              onDeselectAll={deselectAllSessions}
            />
          )}

          {hasUnpaidSessions && (
            <PaymentMethodSelector
              selectedMethod={selectedMethod}
              onSelect={setSelectedMethod}
              disabled={isProcessing || selectedSessions.length === 0}
            />
          )}

          {hasUnpaidSessions && (
            <div className={styles.paymentActionSection}>
              <button
                className={`${styles.payButton} app-button app-button--primary ${
                  !selectedMethod ||
                  selectedSessions.length === 0 ||
                  isProcessing
                    ? styles.disabled
                    : ''
                }`}
                onClick={() => handlePayment(selectedMethod)}
                disabled={
                  !selectedMethod ||
                  selectedSessions.length === 0 ||
                  isProcessing
                }
                >
                  {isProcessing ? (
                  <>
                    <span className={styles.spinner} /> Processing Payment...
                  </>
                ) : (
                  <>Pay Now - VND {calculateAmount().toLocaleString()}</>
                )}
              </button>

              {!selectedMethod && selectedSessions.length > 0 && (
                <p className={styles.warning}>Please select a payment method.</p>
              )}
            </div>
          )}

          {!hasUnpaidSessions && !hasCurrentEstimate && (
            <div className={`${styles.noPayment} app-state app-state--empty`}>
              <p className={styles.noPaymentIcon}>OK</p>
              <h3>All Paid Up</h3>
              <p>You do not have any unpaid parking sessions. Your account is up to date.</p>
            </div>
          )}

          {!hasUnpaidSessions && hasCurrentEstimate && (
            <div className={`${styles.noPayment} app-state app-state--empty`}>
              <p className={styles.noPaymentIcon}>EST</p>
              <h3>Estimate Available</h3>
              <p>
                Your active parking session has an updated estimated fee. Exit the parking session
                to convert it into a payable bill.
              </p>
            </div>
          )}
        </div>

        <div className={styles.rightColumn}>
          <PaymentHistoryCard transactions={data.transactionHistory || []} />
        </div>
      </div>

      <ReceiptModal
        result={paymentResult}
        onClose={clearPaymentResult}
      />
    </div>
  );
}

export default PaymentPage;

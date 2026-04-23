/**
 * Payment Page
 * Allows users to view parking fees and make payments
 * Available to: student, staff
 */

import { useState, useEffect } from "react";
import { usePayment } from "../hooks";
import {
  BillingDetailsTable,
  PaymentMethodSelector,
  PaymentSummaryCard,
  PaymentHistoryCard,
  ReceiptModal,
} from "../components";
import styles from "./PaymentPage.module.css";

function PaymentPage() {
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

  const [showReceipt, setShowReceipt] = useState(false);

  // Show receipt modal when payment result is available
  useEffect(() => {
    if (paymentResult) {
      setShowReceipt(true);
    }
  }, [paymentResult]);

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>Parking Fees & Payments</h1>
          <p className={styles.subtitle}>Manage your parking payments</p>
        </div>
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>
            Error loading payment data: {error}
          </p>
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>Parking Fees & Payments</h1>
          <p className={styles.subtitle}>Manage your parking payments</p>
        </div>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>Loading payment information...</p>
        </div>
      </div>
    );
  }

  const hasUnpaidSessions =
    data.unpaidSessions && data.unpaidSessions.length > 0;

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <div className={styles.header}>
        <h1>Parking Fees & Payments</h1>
        <p className={styles.subtitle}>
          Manage your parking payments and view payment history
        </p>
      </div>

      {/* Payment Summary */}
      <PaymentSummaryCard
        stats={stats}
        selectedCount={selectedSessions.length}
        amountToPay={calculateAmount()}
        isProcessing={isProcessing}
      />

      {/* Main Content - Two Column Layout */}
      <div className={styles.mainContent}>
        {/* Left Column - Billing & Payment */}
        <div className={styles.leftColumn}>
          {/* Billing Details Table */}
          {hasUnpaidSessions && (
            <BillingDetailsTable
              sessions={data.unpaidSessions}
              selectedIds={selectedSessions}
              onToggleSelection={toggleSessionSelection}
              onSelectAll={selectAllSessions}
              onDeselectAll={deselectAllSessions}
            />
          )}

          {/* Payment Method Selector */}
          {hasUnpaidSessions && (
            <PaymentMethodSelector
              selectedMethod={selectedMethod}
              onSelect={setSelectedMethod}
              disabled={isProcessing || selectedSessions.length === 0}
            />
          )}

          {/* Payment Action Button */}
          {hasUnpaidSessions && (
            <div className={styles.paymentActionSection}>
              <button
                className={`${styles.payButton} ${
                  !selectedMethod ||
                  selectedSessions.length === 0 ||
                  isProcessing
                    ? styles.disabled
                    : ""
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
                  <>
                    Pay{" "}
                    {stats ? "₫" + calculateAmount().toLocaleString() : "Now"}
                  </>
                )}
              </button>

              {!selectedMethod && selectedSessions.length > 0 && (
                <p className={styles.warning}>Please select a payment method</p>
              )}
            </div>
          )}

          {!hasUnpaidSessions && (
            <div className={styles.noPayment}>
              <p className={styles.noPaymentIcon}>✅</p>
              <h3>All Paid Up!</h3>
              <p>
                You don't have any unpaid parking sessions. Your account is up
                to date.
              </p>
            </div>
          )}
        </div>

        {/* Right Column - Payment History */}
        <div className={styles.rightColumn}>
          <PaymentHistoryCard transactions={data.transactionHistory || []} />
        </div>
      </div>

      {/* Receipt Modal */}
      <ReceiptModal
        result={paymentResult}
        onClose={() => {
          setShowReceipt(false);
          clearPaymentResult();
        }}
      />
    </div>
  );
}

export default PaymentPage;

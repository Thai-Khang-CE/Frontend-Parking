/**
 * Bills Page
 * Allows admins to view and manage parking bills
 * Displays billing statistics and detailed bill information
 * Available to: admin only
 */

import { useState, useEffect } from "react";
import {
  getBillingData,
  getBillStatusInfo,
} from "../../../mock/adminBillingMock";
import styles from "./BillsPage.module.css";

function BillsPage() {
  const [billingData, setBillingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filteredBills, setFilteredBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);

  // Load billing data on mount
  useEffect(() => {
    const data = getBillingData();
    setBillingData(data);
    setFilteredBills(data.bills);
    setLoading(false);
  }, []);

  // Handle status filter
  useEffect(() => {
    if (billingData) {
      if (filterStatus === "all") {
        setFilteredBills(billingData.bills);
      } else {
        setFilteredBills(
          billingData.bills.filter((bill) => bill.status === filterStatus),
        );
      }
    }
  }, [filterStatus, billingData]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>Bills Management</h1>
        </div>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>Loading bills information...</p>
        </div>
      </div>
    );
  }

  if (!billingData) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>Bills Management</h1>
        </div>
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>Failed to load bills data</p>
        </div>
      </div>
    );
  }

  const stats = billingData.stats;
  const collectionRate =
    stats.totalGenerated > 0
      ? Math.round((stats.totalPaid / stats.totalGenerated) * 100)
      : 0;

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <div className={styles.header}>
        <h1>Bills Management</h1>
        <p className={styles.subtitle}>
          View and manage parking bills for {billingData.billingCycle}
        </p>
      </div>

      {/* Statistics Cards */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          {/* Total Generated */}
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📊</div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Total Generated</div>
              <div className={styles.statValue}>
                ₫{stats.totalGenerated.toLocaleString()}
              </div>
              <div className={styles.statMeta}>{stats.totalBills} bills</div>
            </div>
          </div>

          {/* Total Paid */}
          <div className={`${styles.statCard} ${styles.paid}`}>
            <div className={styles.statIcon}>✓</div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Total Paid</div>
              <div className={styles.statValue}>
                ₫{stats.totalPaid.toLocaleString()}
              </div>
              <div className={styles.statMeta}>
                {stats.paidCount} bills paid
              </div>
            </div>
          </div>

          {/* Total Unpaid */}
          <div className={`${styles.statCard} ${styles.unpaid}`}>
            <div className={styles.statIcon}>⚠️</div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Total Unpaid</div>
              <div className={styles.statValue}>
                ₫{stats.totalUnpaid.toLocaleString()}
              </div>
              <div className={styles.statMeta}>
                {stats.unpaidCount + stats.partialCount} outstanding
              </div>
            </div>
          </div>

          {/* Collection Rate */}
          <div className={`${styles.statCard} ${styles.rate}`}>
            <div className={styles.statIcon}>📈</div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Collection Rate</div>
              <div className={styles.statValue}>{collectionRate}%</div>
              <div className={styles.statMeta}>of billed amount</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bills Section */}
      <section className={styles.billsSection}>
        {/* Filter Controls */}
        <div className={styles.filterBar}>
          <div className={styles.filterLabel}>Filter by Status:</div>
          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterBtn} ${filterStatus === "all" ? styles.active : ""}`}
              onClick={() => setFilterStatus("all")}
            >
              All ({stats.totalBills})
            </button>
            <button
              className={`${styles.filterBtn} ${filterStatus === "paid" ? styles.active : ""}`}
              onClick={() => setFilterStatus("paid")}
            >
              Paid ({stats.paidCount})
            </button>
            <button
              className={`${styles.filterBtn} ${filterStatus === "unpaid" ? styles.active : ""}`}
              onClick={() => setFilterStatus("unpaid")}
            >
              Unpaid ({stats.unpaidCount})
            </button>
            <button
              className={`${styles.filterBtn} ${filterStatus === "partial" ? styles.active : ""}`}
              onClick={() => setFilterStatus("partial")}
            >
              Partial ({stats.partialCount})
            </button>
          </div>
        </div>

        {/* Bills Table */}
        {filteredBills.length > 0 ? (
          <div className={styles.billsTable}>
            <table>
              <thead>
                <tr>
                  <th className={styles.billNumberCol}>Bill #</th>
                  <th className={styles.userCol}>User</th>
                  <th className={styles.emailCol}>Email</th>
                  <th className={styles.typeCol}>Type</th>
                  <th className={styles.sessionsCol}>Sessions</th>
                  <th className={styles.amountCol}>Amount</th>
                  <th className={styles.paidCol}>Paid</th>
                  <th className={styles.statusCol}>Status</th>
                  <th className={styles.dateCol}>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.map((bill) => {
                  const statusInfo = getBillStatusInfo(bill.status);
                  return (
                    <tr
                      key={bill.id}
                      onClick={() => setSelectedBill(bill)}
                      className={styles.billRow}
                    >
                      <td className={styles.billNumber}>{bill.billNumber}</td>
                      <td className={styles.userName}>{bill.userName}</td>
                      <td className={styles.email}>{bill.email}</td>
                      <td className={styles.userType}>
                        <span
                          className={`${styles.typeBadge} ${styles[bill.userType.toLowerCase()]}`}
                        >
                          {bill.userType}
                        </span>
                      </td>
                      <td className={styles.sessions}>{bill.sessionsCount}</td>
                      <td className={styles.amount}>
                        ₫{bill.totalFee.toLocaleString()}
                      </td>
                      <td className={styles.paid}>
                        ₫{bill.paidAmount.toLocaleString()}
                      </td>
                      <td className={styles.statusCell}>
                        <span
                          className={styles.statusBadge}
                          style={{
                            backgroundColor: statusInfo.bgColor,
                            color: statusInfo.color,
                          }}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className={styles.date}>
                        {bill.generatedDate.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.noBills}>
            <div className={styles.noBillsIcon}>📭</div>
            <h3>No Bills Found</h3>
            <p>No bills match the current filter criteria</p>
          </div>
        )}
      </section>

      {/* Bill Details Modal */}
      {selectedBill && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedBill(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Bill Details</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setSelectedBill(null)}
              >
                ×
              </button>
            </div>

            <div className={styles.modalContent}>
              {/* Bill Header */}
              <div className={styles.billDetailHeader}>
                <div className={styles.billDetailItem}>
                  <span className={styles.label}>Bill Number:</span>
                  <span className={styles.value}>
                    {selectedBill.billNumber}
                  </span>
                </div>
                <div className={styles.billDetailItem}>
                  <span className={styles.label}>Billing Cycle:</span>
                  <span className={styles.value}>
                    {selectedBill.billingCycle}
                  </span>
                </div>
              </div>

              {/* User Info */}
              <div className={styles.section}>
                <h3>User Information</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Name:</span>
                    <span className={styles.value}>
                      {selectedBill.userName}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Email:</span>
                    <span className={styles.value}>{selectedBill.email}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Type:</span>
                    <span className={styles.value}>
                      {selectedBill.userType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Billing Details */}
              <div className={styles.section}>
                <h3>Billing Details</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Generated:</span>
                    <span className={styles.value}>
                      {selectedBill.generatedDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Due Date:</span>
                    <span className={styles.value}>
                      {selectedBill.dueDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Sessions:</span>
                    <span className={styles.value}>
                      {selectedBill.sessionsCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className={styles.section}>
                <h3>Payment Summary</h3>
                <div className={styles.paymentSummary}>
                  <div className={styles.summaryRow}>
                    <span>Total Fee:</span>
                    <span className={styles.amount}>
                      ₫{selectedBill.totalFee.toLocaleString()}
                    </span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Paid Amount:</span>
                    <span className={styles.paidAmount}>
                      ₫{selectedBill.paidAmount.toLocaleString()}
                    </span>
                  </div>
                  <div
                    className={styles.summaryRow}
                    style={{
                      borderTop: "2px solid #e0e0e0",
                      paddingTop: "12px",
                      marginTop: "12px",
                    }}
                  >
                    <span>Outstanding:</span>
                    <span className={styles.outstandingAmount}>
                      ₫
                      {(
                        selectedBill.totalFee - selectedBill.paidAmount
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className={styles.section}>
                <div className={styles.statusSection}>
                  <span className={styles.label}>Current Status:</span>
                  {(() => {
                    const statusInfo = getBillStatusInfo(selectedBill.status);
                    return (
                      <span
                        className={styles.statusBadgeLarge}
                        style={{
                          backgroundColor: statusInfo.bgColor,
                          color: statusInfo.color,
                        }}
                      >
                        {statusInfo.label}
                      </span>
                    );
                  })()}
                </div>
                {selectedBill.paidDate && (
                  <p className={styles.paidInfo}>
                    Paid on{" "}
                    {selectedBill.paidDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    via {selectedBill.paymentMethod || "Unknown method"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BillsPage;

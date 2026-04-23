/**
 * Fee Calculation Page
 * Allows admins to manage parking fees and tariffs
 * Supports viewing current tariffs and running fee calculations
 * Available to: admin only
 */

import { useState, useEffect } from "react";
import {
  getCurrentTariffs,
  runFeeCalculation,
  getCalculationHistory,
} from "../../../mock/adminBillingMock";
import styles from "./FeeCalculationPage.module.css";

function FeeCalculationPage() {
  const [tariffs, setTariffs] = useState(null);
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load tariffs and history on mount
  useEffect(() => {
    const tariffData = getCurrentTariffs();
    setTariffs(tariffData);
    setCalculationHistory(getCalculationHistory());
    setLoading(false);
  }, []);

  // Handle fee calculation trigger
  const handleRunCalculation = async () => {
    setIsCalculating(true);
    try {
      const result = await runFeeCalculation();
      setCalculationResult(result);
      setShowResult(true);
      // Update history
      const historyAfterCalc = [
        {
          id: `calc-new-${Date.now()}`,
          billingCycle: result.billingCycle,
          ranDate: result.details.timestamp,
          usersProcessed: result.details.totalUsersProcessed,
          sessionsCalculated: result.details.totalSessionsCalculated,
          totalFees: result.details.totalFeesGenerated,
          billsGenerated: result.details.billsGenerated,
          status: "completed",
        },
        ...calculationHistory,
      ];
      setCalculationHistory(historyAfterCalc);
    } catch (error) {
      console.error("Error running fee calculation:", error);
      setCalculationResult({
        success: false,
        error: "Failed to run calculation",
      });
      setShowResult(true);
    } finally {
      setIsCalculating(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>Fee Calculation & Tariffs</h1>
        </div>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>Loading fee calculation settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <div className={styles.header}>
        <h1>Fee Calculation & Tariffs</h1>
        <p className={styles.subtitle}>
          Manage parking fees and run billing calculations
        </p>
      </div>

      {/* Fee Calculation Section */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Run Fee Calculation</h2>
          <div className={styles.sectionRule} />
        </div>

        <div className={styles.calculationCard}>
          <div className={styles.calculationInfo}>
            <h3>April 2024 Billing Cycle</h3>
            <p>
              Click the button below to calculate parking fees for all users
              based on current tariffs and parking sessions. This will generate
              bills for the April 2024 billing cycle.
            </p>
            <div className={styles.cautionBox}>
              <span className={styles.cautionIcon}>⚠️</span>
              <span>
                This action will process all parking sessions and generate
                bills. Existing bills will not be overwritten.
              </span>
            </div>
          </div>
          <button
            className={`${styles.calculateButton} ${isCalculating ? styles.calculating : ""}`}
            onClick={handleRunCalculation}
            disabled={isCalculating}
          >
            {isCalculating ? (
              <>
                <span className={styles.buttonSpinner} />
                Calculating...
              </>
            ) : (
              "▶ Run Fee Calculation"
            )}
          </button>
        </div>

        {/* Calculation Result Modal */}
        {showResult && calculationResult && (
          <div className={styles.resultModal}>
            <div
              className={`${styles.resultCard} ${calculationResult.success ? styles.success : styles.error}`}
            >
              <div className={styles.resultHeader}>
                <span className={styles.resultIcon}>
                  {calculationResult.success ? "✓" : "✗"}
                </span>
                <h4>
                  {calculationResult.success
                    ? "Calculation Completed"
                    : "Calculation Failed"}
                </h4>
              </div>

              {calculationResult.success && (
                <div className={styles.resultDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Billing Cycle:</span>
                    <span className={styles.detailValue}>
                      {calculationResult.billingCycle}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Users Processed:</span>
                    <span className={styles.detailValue}>
                      {calculationResult.details.totalUsersProcessed}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>
                      Sessions Calculated:
                    </span>
                    <span className={styles.detailValue}>
                      {calculationResult.details.totalSessionsCalculated}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Bills Generated:</span>
                    <span className={styles.detailValue}>
                      {calculationResult.details.billsGenerated}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Total Fees:</span>
                    <span className={styles.detailValue}>
                      ₫
                      {calculationResult.details.totalFeesGenerated.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <button
                className={styles.closeButton}
                onClick={() => setShowResult(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Current Tariffs Section */}
      {tariffs && (
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Current Tariffs</h2>
            <div className={styles.sectionRule} />
          </div>

          <div className={styles.tariffGrid}>
            {tariffs.tariffs.map((tariff) => (
              <div key={tariff.id} className={styles.tariffCard}>
                <div className={styles.tariffHeader}>
                  <h4>{tariff.zoneName}</h4>
                  <div className={styles.capacity}>{tariff.capacity} slots</div>
                </div>
                <p className={styles.tariffDescription}>{tariff.description}</p>
                <div className={styles.tariffDetails}>
                  <div className={styles.tariffItem}>
                    <span className={styles.tariffLabel}>Hourly Rate:</span>
                    <span className={styles.tariffValue}>
                      ₫{tariff.hourlyRate.toLocaleString()}
                    </span>
                  </div>
                  <div className={styles.tariffItem}>
                    <span className={styles.tariffLabel}>Daily Max:</span>
                    <span className={styles.tariffValue}>
                      ₫{tariff.dailyMax.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Special Rates */}
          <div className={styles.specialRatesSection}>
            <h3>Special Rates & Passes</h3>
            <div className={styles.specialRatesGrid}>
              {tariffs.specialRates.map((rate) => (
                <div key={rate.id} className={styles.specialRateCard}>
                  <h5>{rate.name}</h5>
                  <div className={styles.specialPrice}>
                    ₫{rate.price.toLocaleString()}
                  </div>
                  <p className={styles.specialDescription}>
                    {rate.description}
                  </p>
                  <ul className={styles.specialBenefits}>
                    {rate.benefits.map((benefit, idx) => (
                      <li key={idx}>
                        <span className={styles.benefitCheck}>✓</span> {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.lastUpdated}>
            Last updated:{" "}
            {tariffs.lastUpdated.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </section>
      )}

      {/* Calculation History Section */}
      {calculationHistory && calculationHistory.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Calculation History</h2>
            <div className={styles.sectionRule} />
          </div>

          <div className={styles.historyTable}>
            <table>
              <thead>
                <tr>
                  <th>Billing Cycle</th>
                  <th>Ran Date</th>
                  <th>Users Processed</th>
                  <th>Sessions</th>
                  <th>Bills Generated</th>
                  <th>Total Fees</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {calculationHistory.map((calc) => (
                  <tr key={calc.id}>
                    <td className={styles.cycleCell}>{calc.billingCycle}</td>
                    <td className={styles.dateCell}>
                      {calc.ranDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className={styles.numberCell}>{calc.usersProcessed}</td>
                    <td className={styles.numberCell}>
                      {calc.sessionsCalculated}
                    </td>
                    <td className={styles.numberCell}>{calc.billsGenerated}</td>
                    <td className={styles.moneyCell}>
                      ₫{calc.totalFees.toLocaleString()}
                    </td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${styles[calc.status]}`}
                      >
                        {calc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

export default FeeCalculationPage;

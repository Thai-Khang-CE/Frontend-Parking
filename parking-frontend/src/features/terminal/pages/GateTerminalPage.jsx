/**
 * Gate Terminal Page
 * Simulates parking gate terminal operations with 3 modes:
 * 1. Card Access - Validate university ID card
 * 2. Temporary Entry - Issue temporary pass for visitors
 * 3. Temporary Exit - Process payment and gate exit
 */

import { useState } from "react";
import {
  validateCard,
  processEntry,
  issueTemporaryPass,
  retrieveSession,
  processExitPayment,
  getGateStatus,
  EXIT_PAYMENT_METHODS,
} from "../../../mock/gateTerminalMock";
import styles from "./GateTerminalPage.module.css";

function GateTerminalPage() {
  const [mode, setMode] = useState("menu");

  const [cardId, setCardId] = useState("");
  const [cardValidation, setCardValidation] = useState(null);
  const [cardLoading, setCardLoading] = useState(false);

  const [tempVisitorName, setTempVisitorName] = useState("");
  const [tempVisitorEmail, setTempVisitorEmail] = useState("");
  const [tempVisitorPhone, setTempVisitorPhone] = useState("");
  const [tempPass, setTempPass] = useState(null);
  const [tempLoading, setTempLoading] = useState(false);

  const [exitTicket, setExitTicket] = useState("");
  const [exitSession, setExitSession] = useState(null);
  const [exitLoading, setExitLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [exitPaymentResult, setExitPaymentResult] = useState(null);
  const [exitProcessing, setExitProcessing] = useState(false);

  const [gateStatus] = useState(() => getGateStatus());

  const handleCardInput = (e) => {
    setCardId(e.target.value.toUpperCase());
  };

  const handleCardValidate = async () => {
    if (!cardId.trim()) return;

    setCardLoading(true);
    setCardValidation(null);

    try {
      const result = await validateCard(cardId);
      setCardValidation(result);
    } catch {
      setCardValidation({ valid: false, reason: "Error validating card" });
    } finally {
      setCardLoading(false);
    }
  };

  const handleCardEntry = async () => {
    if (!cardValidation || !cardValidation.valid) return;

    setCardLoading(true);
    try {
      const entryResult = await processEntry(cardId, cardValidation);
      setCardValidation({ ...cardValidation, ...entryResult });
    } catch (error) {
      console.error("Entry error:", error);
    } finally {
      setCardLoading(false);
    }
  };

  const resetCardMode = () => {
    setCardId("");
    setCardValidation(null);
    setMode("menu");
  };

  const handleTempEntrySubmit = async (e) => {
    e.preventDefault();
    if (!tempVisitorName || !tempVisitorEmail || !tempVisitorPhone) return;

    setTempLoading(true);
    try {
      const pass = await issueTemporaryPass(
        tempVisitorName,
        tempVisitorEmail,
        tempVisitorPhone,
      );
      setTempPass(pass);
    } catch {
      setTempPass({ success: false, error: "Failed to issue temporary pass" });
    } finally {
      setTempLoading(false);
    }
  };

  const resetTempEntry = () => {
    setTempVisitorName("");
    setTempVisitorEmail("");
    setTempVisitorPhone("");
    setTempPass(null);
    setMode("menu");
  };

  const handleExitTicketInput = (e) => {
    setExitTicket(e.target.value.toUpperCase());
  };

  const handleRetrieveSession = async () => {
    if (!exitTicket.trim()) return;

    setExitLoading(true);
    setExitSession(null);
    setExitPaymentResult(null);

    try {
      const result = await retrieveSession(exitTicket);
      if (result.success) {
        setExitSession(result.session);
      } else {
        setExitSession({ error: result.reason });
      }
    } catch {
      setExitSession({ error: "Error retrieving session" });
    } finally {
      setExitLoading(false);
    }
  };

  const handleExitPayment = async () => {
    if (!exitSession || !selectedPaymentMethod) return;

    setExitProcessing(true);
    try {
      const paymentResult = await processExitPayment(
        exitSession.sessionId,
        exitSession.estimatedFee,
        selectedPaymentMethod,
      );
      setExitPaymentResult(paymentResult);
    } catch {
      setExitPaymentResult({
        success: false,
        error: "Payment processing error",
      });
    } finally {
      setExitProcessing(false);
    }
  };

  const resetExitMode = () => {
    setExitTicket("");
    setExitSession(null);
    setSelectedPaymentMethod(null);
    setExitPaymentResult(null);
    setMode("menu");
  };

  if (mode === "menu") {
    return (
      <div className={styles.terminal}>
        <div className={styles.screen}>
          <div className={styles.header}>
            <div className={styles.headerTitle}>
              <span className={styles.headerIcon}>P</span>
              <h1>PARKING GATE TERMINAL</h1>
            </div>
            <div className={styles.headerMeta}>
              {gateStatus && (
                <>
                  <span className={styles.gateId}>{gateStatus.gateId}</span>
                  <span className={styles.gateStatus}>
                    <span className={styles.statusDot} />
                    {gateStatus.status.toUpperCase()}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className={styles.menuContainer}>
            <h2>SELECT OPERATION</h2>

            <div className={styles.menuGrid}>
              <button
                className={`${styles.menuButton} ${styles.cardMode}`}
                onClick={() => setMode("cardAccess")}
              >
                <span className={styles.modeIcon}>ID</span>
                <span className={styles.modeName}>Card Access</span>
                <span className={styles.modeDesc}>Scan University ID</span>
              </button>

              <button
                className={`${styles.menuButton} ${styles.tempEntry}`}
                onClick={() => setMode("tempEntry")}
              >
                <span className={styles.modeIcon}>IN</span>
                <span className={styles.modeName}>Temporary Entry</span>
                <span className={styles.modeDesc}>Issue Visitor Pass</span>
              </button>

              <button
                className={`${styles.menuButton} ${styles.tempExit}`}
                onClick={() => setMode("tempExit")}
              >
                <span className={styles.modeIcon}>EX</span>
                <span className={styles.modeName}>Exit Payment</span>
                <span className={styles.modeDesc}>Process Exit and Payment</span>
              </button>
            </div>
          </div>

          {gateStatus && (
            <div className={styles.footer}>
              <div className={styles.footerContent}>
                <div className={styles.zoneStatusSmall}>
                  {gateStatus.zones.slice(0, 3).map((zone) => (
                    <div key={zone.id} className={styles.zoneItem}>
                      <span className={styles.zoneName}>{zone.name}</span>
                      <span
                        className={`${styles.zoneBar} ${zone.occupancyPercent > 90 ? styles.full : zone.occupancyPercent > 70 ? styles.busy : styles.available}`}
                      >
                        {zone.availableSlots} slots
                      </span>
                    </div>
                  ))}
                </div>
                <span className={styles.time}>
                  {new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (mode === "cardAccess") {
    return (
      <div className={styles.terminal}>
        <div className={styles.screen}>
          <div className={styles.header}>
            <button className={styles.backBtn} onClick={resetCardMode}>
              {"<"}
            </button>
            <h1>CARD ACCESS</h1>
            <div style={{ width: "44px" }} />
          </div>

          <div className={styles.content}>
            {!cardValidation ? (
              <div className={styles.inputForm}>
                <label>Scan or Enter Card ID:</label>
                <input
                  type="text"
                  placeholder="ID-XXX-2024"
                  value={cardId}
                  onChange={handleCardInput}
                  onKeyDown={(e) => e.key === "Enter" && handleCardValidate()}
                  autoFocus
                  className={styles.cardInput}
                />
                <button
                  className={`${styles.actionBtn} ${cardLoading ? styles.loading : ""}`}
                  onClick={handleCardValidate}
                  disabled={cardLoading || !cardId.trim()}
                >
                  {cardLoading ? "VALIDATING..." : "VALIDATE CARD"}
                </button>
              </div>
            ) : cardValidation.valid && !cardValidation.gateStatus ? (
              <div className={`${styles.result} ${styles.success}`}>
                <div className={styles.resultIcon}>OK</div>
                <h3>Card Valid</h3>
                <div className={styles.resultInfo}>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Name:</span>
                    <span className={styles.value}>{cardValidation.name}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Type:</span>
                    <span className={styles.value}>{cardValidation.type}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Assigned Zone:</span>
                    <span className={styles.value}>
                      {cardValidation.zoneName}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Available Slots:</span>
                    <span className={`${styles.value} ${styles.green}`}>
                      {cardValidation.availableSlots} slots
                    </span>
                  </div>
                </div>
                <button
                  className={`${styles.actionBtn} ${cardLoading ? styles.loading : ""}`}
                  onClick={handleCardEntry}
                  disabled={cardLoading}
                >
                  {cardLoading ? "OPENING GATE..." : "OPEN GATE AND ENTER"}
                </button>
              </div>
            ) : cardValidation.gateStatus === "OPEN" ? (
              <div className={`${styles.result} ${styles.success}`}>
                <div className={styles.resultIcon}>GO</div>
                <h3>Access Granted</h3>
                <p className={styles.message}>Gate is opening...</p>
                <div className={styles.resultInfo}>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Name:</span>
                    <span className={styles.value}>{cardValidation.name}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Entry Time:</span>
                    <span className={styles.value}>
                      {cardValidation.timestamp?.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Access Code:</span>
                    <span className={`${styles.value} ${styles.mono}`}>
                      {cardValidation.accessCode}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Session ID:</span>
                    <span
                      className={`${styles.value} ${styles.mono} ${styles.small}`}
                    >
                      {cardValidation.sessionId}
                    </span>
                  </div>
                </div>
                <p className={styles.successMsg}>
                  Welcome. Please proceed through the gate.
                </p>
                <button
                  className={`${styles.actionBtn} ${styles.secondary}`}
                  onClick={resetCardMode}
                >
                  RETURN TO MENU
                </button>
              </div>
            ) : (
              <div className={`${styles.result} ${styles.error}`}>
                <div className={styles.resultIcon}>X</div>
                <h3>Access Denied</h3>
                <p className={styles.errorMsg}>{cardValidation.reason}</p>
                {cardValidation.name && (
                  <div className={styles.resultInfo}>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Name:</span>
                      <span className={styles.value}>
                        {cardValidation.name}
                      </span>
                    </div>
                  </div>
                )}
                <p className={styles.helpText}>
                  Please contact the parking office for assistance.
                </p>
                <button
                  className={`${styles.actionBtn} ${styles.secondary}`}
                  onClick={() => {
                    setCardId("");
                    setCardValidation(null);
                  }}
                >
                  TRY AGAIN
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (mode === "tempEntry") {
    return (
      <div className={styles.terminal}>
        <div className={styles.screen}>
          <div className={styles.header}>
            <button className={styles.backBtn} onClick={resetTempEntry}>
              {"<"}
            </button>
            <h1>TEMPORARY ENTRY</h1>
            <div style={{ width: "44px" }} />
          </div>

          <div className={styles.content}>
            {!tempPass ? (
              <form
                className={styles.inputForm}
                onSubmit={handleTempEntrySubmit}
              >
                <label>Visitor Name:</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={tempVisitorName}
                  onChange={(e) => setTempVisitorName(e.target.value)}
                  className={styles.textInput}
                  required
                />

                <label>Email Address:</label>
                <input
                  type="email"
                  placeholder="visitor@example.com"
                  value={tempVisitorEmail}
                  onChange={(e) => setTempVisitorEmail(e.target.value)}
                  className={styles.textInput}
                  required
                />

                <label>Phone Number:</label>
                <input
                  type="tel"
                  placeholder="+84 XXX XXX XXX"
                  value={tempVisitorPhone}
                  onChange={(e) => setTempVisitorPhone(e.target.value)}
                  className={styles.textInput}
                  required
                />

                <button
                  type="submit"
                  className={`${styles.actionBtn} ${tempLoading ? styles.loading : ""}`}
                  disabled={
                    tempLoading ||
                    !tempVisitorName ||
                    !tempVisitorEmail ||
                    !tempVisitorPhone
                  }
                >
                  {tempLoading ? "ISSUING PASS..." : "ISSUE VISITOR PASS"}
                </button>
              </form>
            ) : tempPass.success ? (
              <div className={`${styles.result} ${styles.success}`}>
                <div className={styles.resultIcon}>PASS</div>
                <h3>Temporary Pass Issued</h3>
                <div className={styles.ticketBox}>
                  <div className={styles.ticketContent}>
                    <div className={styles.ticketNumber}>
                      {tempPass.ticketNumber}
                    </div>
                    <div className={styles.ticketDetail}>
                      <strong>{tempPass.visitorName}</strong>
                    </div>
                    <div className={styles.ticketDetail}>
                      Zone: <strong>{tempPass.zoneName}</strong>
                    </div>
                    <div className={styles.ticketDetail}>
                      Valid: <strong>24 Hours</strong>
                    </div>
                  </div>
                </div>
                <div className={styles.resultInfo}>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Issue Time:</span>
                    <span className={styles.value}>
                      {tempPass.issueTime?.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Expiry Time:</span>
                    <span className={styles.value}>
                      {tempPass.expiryTime?.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Session ID:</span>
                    <span
                      className={`${styles.value} ${styles.mono} ${styles.small}`}
                    >
                      {tempPass.sessionId}
                    </span>
                  </div>
                </div>
                <p className={styles.successMsg}>
                  Pass issued. Gate is opening...
                </p>
                <button
                  className={`${styles.actionBtn} ${styles.secondary}`}
                  onClick={resetTempEntry}
                >
                  RETURN TO MENU
                </button>
              </div>
            ) : (
              <div className={`${styles.result} ${styles.error}`}>
                <div className={styles.resultIcon}>X</div>
                <h3>Pass Issuance Failed</h3>
                <p className={styles.errorMsg}>
                  {tempPass.error || "Unable to issue temporary pass"}
                </p>
                <button
                  className={`${styles.actionBtn} ${styles.secondary}`}
                  onClick={() => setTempPass(null)}
                >
                  TRY AGAIN
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (mode === "tempExit") {
    return (
      <div className={styles.terminal}>
        <div className={styles.screen}>
          <div className={styles.header}>
            <button className={styles.backBtn} onClick={resetExitMode}>
              {"<"}
            </button>
            <h1>EXIT PAYMENT</h1>
            <div style={{ width: "44px" }} />
          </div>

          <div className={styles.content}>
            {!exitSession && !exitPaymentResult ? (
              <div className={styles.inputForm}>
                <label>Scan or Enter Ticket Number:</label>
                <input
                  type="text"
                  placeholder="TMP-XXXXXXXX"
                  value={exitTicket}
                  onChange={handleExitTicketInput}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleRetrieveSession()
                  }
                  autoFocus
                  className={styles.cardInput}
                />
                <button
                  className={`${styles.actionBtn} ${exitLoading ? styles.loading : ""}`}
                  onClick={handleRetrieveSession}
                  disabled={exitLoading || !exitTicket.trim()}
                >
                  {exitLoading ? "RETRIEVING..." : "RETRIEVE SESSION"}
                </button>
              </div>
            ) : exitSession?.error && !exitPaymentResult ? (
              <div className={`${styles.result} ${styles.error}`}>
                <div className={styles.resultIcon}>X</div>
                <h3>Session Not Found</h3>
                <p className={styles.errorMsg}>{exitSession.error}</p>
                <button
                  className={`${styles.actionBtn} ${styles.secondary}`}
                  onClick={() => {
                    setExitTicket("");
                    setExitSession(null);
                  }}
                >
                  TRY AGAIN
                </button>
              </div>
            ) : exitSession && !exitPaymentResult ? (
              <div className={styles.paymentForm}>
                <div className={styles.sessionInfo}>
                  <h3>Parking Summary</h3>
                  <div className={styles.resultInfo}>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Ticket:</span>
                      <span className={styles.value}>
                        {exitSession.ticketNumber}
                      </span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Visitor:</span>
                      <span className={styles.value}>
                        {exitSession.visitorName}
                      </span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Zone:</span>
                      <span className={styles.value}>
                        {exitSession.zoneName}
                      </span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Entry Time:</span>
                      <span className={styles.value}>
                        {exitSession.entryTime?.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Duration:</span>
                      <span className={styles.value}>
                        <strong>{exitSession.duration} hours</strong>
                      </span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Amount Due:</span>
                      <span className={`${styles.value} ${styles.green}`}>
                        <strong>
                          VND {exitSession.estimatedFee.toLocaleString()}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.paymentMethodSection}>
                  <label>Select Payment Method:</label>
                  <div className={styles.paymentGrid}>
                    {EXIT_PAYMENT_METHODS.map((method) => (
                      <button
                        key={method.id}
                        className={`${styles.paymentBtn} ${selectedPaymentMethod === method.id ? styles.selected : ""}`}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                      >
                        <span className={styles.paymentIcon}>
                          {method.icon}
                        </span>
                        <span>{method.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  className={`${styles.actionBtn} ${exitProcessing ? styles.loading : ""}`}
                  onClick={handleExitPayment}
                  disabled={exitProcessing || !selectedPaymentMethod}
                >
                  {exitProcessing
                    ? "PROCESSING PAYMENT..."
                    : `PROCESS PAYMENT VND ${exitSession.estimatedFee.toLocaleString()}`}
                </button>
              </div>
            ) : exitPaymentResult?.success ? (
              <div className={`${styles.result} ${styles.success}`}>
                <div className={styles.resultIcon}>OK</div>
                <h3>Exit Approved</h3>
                <p className={styles.message}>
                  Payment processed successfully.
                </p>
                <div className={styles.resultInfo}>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Transaction ID:</span>
                    <span
                      className={`${styles.value} ${styles.mono} ${styles.small}`}
                    >
                      {exitPaymentResult.transactionId}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Amount Paid:</span>
                    <span className={styles.value}>
                      VND {exitPaymentResult.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Method:</span>
                    <span className={styles.value}>
                      {exitPaymentResult.paymentMethod}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Time:</span>
                    <span className={styles.value}>
                      {exitPaymentResult.timestamp?.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <p className={styles.successMsg}>
                  Gate is opening. Please proceed.
                </p>
                <button
                  className={`${styles.actionBtn} ${styles.secondary}`}
                  onClick={resetExitMode}
                >
                  RETURN TO MENU
                </button>
              </div>
            ) : (
              <div className={`${styles.result} ${styles.error}`}>
                <div className={styles.resultIcon}>X</div>
                <h3>Payment Failed</h3>
                <p className={styles.errorMsg}>
                  {exitPaymentResult?.error || "Payment processing error"}
                </p>
                <button
                  className={`${styles.actionBtn} ${styles.secondary}`}
                  onClick={() => {
                    setExitPaymentResult(null);
                    setSelectedPaymentMethod(null);
                  }}
                >
                  TRY AGAIN
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default GateTerminalPage;

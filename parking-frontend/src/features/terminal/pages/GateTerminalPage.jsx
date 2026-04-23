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

const terminalDateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const MODE_DETAILS = {
  menu: {
    title: "Gate Terminal",
    subtitle:
      "Select an entry or exit workflow. This kiosk is optimized for fast operator and driver-facing interactions.",
    label: "Terminal Menu",
  },
  cardAccess: {
    title: "Card Access",
    subtitle:
      "Validate university ID cards, confirm the assigned zone, and authorize gate entry.",
    label: "Member Entry",
  },
  tempEntry: {
    title: "Temporary Entry",
    subtitle:
      "Register a visitor, issue a temporary pass, and provide a ticket for later retrieval at exit.",
    label: "Visitor Entry",
  },
  tempExit: {
    title: "Exit Payment",
    subtitle:
      "Retrieve a visitor session, collect payment, and approve gate exit.",
    label: "Visitor Exit",
  },
};

const formatTerminalDateTime = (value) => {
  if (!value) {
    return "--";
  }

  return terminalDateTimeFormatter.format(new Date(value));
};

function getToneClass(stylesMap, tone) {
  if (tone === "success") return stylesMap.toneSuccess;
  if (tone === "error") return stylesMap.toneError;
  if (tone === "warning") return stylesMap.toneWarning;
  return stylesMap.toneInfo;
}

function getCardFlowState(cardLoading, cardValidation) {
  if (cardLoading && !cardValidation) {
    return {
      title: "Verifying Card",
      detail: "Checking card status, assigned zone, and live capacity.",
      tone: "warning",
    };
  }

  if (!cardValidation) {
    return {
      title: "Ready to Scan",
      detail: "Scan a member card or enter a card ID to begin validation.",
      tone: "info",
    };
  }

  if (cardValidation.valid && !cardValidation.gateStatus) {
    return {
      title: "Card Verified",
      detail: "Card is valid. Review the assignment and open the gate.",
      tone: "success",
    };
  }

  if (cardValidation.gateStatus === "OPEN") {
    return {
      title: "Gate Opening",
      detail: "Entry has been approved. The kiosk is ready for the vehicle to proceed.",
      tone: "success",
    };
  }

  return {
    title: "Access Denied",
    detail: "This card cannot be used for entry. Review the reason below.",
    tone: "error",
  };
}

function getTempEntryState(tempLoading, tempPass) {
  if (tempLoading && !tempPass) {
    return {
      title: "Issuing Pass",
      detail: "Creating a temporary ticket and visitor session.",
      tone: "warning",
    };
  }

  if (!tempPass) {
    return {
      title: "Visitor Registration",
      detail: "Capture visitor details and issue a valid temporary pass.",
      tone: "info",
    };
  }

  if (tempPass.success) {
    return {
      title: "Pass Issued",
      detail: "The ticket is ready and can be used later in the exit flow.",
      tone: "success",
    };
  }

  return {
    title: "Issuance Failed",
    detail: "The kiosk could not issue a temporary pass. Try again.",
    tone: "error",
  };
}

function getTempExitState(exitLoading, exitSession, exitProcessing, exitPaymentResult) {
  if (exitLoading && !exitSession) {
    return {
      title: "Retrieving Session",
      detail: "Looking up the ticket and active visitor session.",
      tone: "warning",
    };
  }

  if (exitProcessing && !exitPaymentResult) {
    return {
      title: "Processing Payment",
      detail: "Completing the exit payment and preparing the gate.",
      tone: "warning",
    };
  }

  if (!exitSession && !exitPaymentResult) {
    return {
      title: "Ready for Exit",
      detail: "Scan the ticket number to load the visitor session.",
      tone: "info",
    };
  }

  if (exitSession?.error) {
    return {
      title: "Ticket Not Found",
      detail: "The kiosk could not find a valid active session for this ticket.",
      tone: "error",
    };
  }

  if (exitPaymentResult?.success) {
    return {
      title: "Exit Approved",
      detail: "Payment is complete and the gate is opening for departure.",
      tone: "success",
    };
  }

  if (exitPaymentResult && !exitPaymentResult.success) {
    return {
      title: "Payment Failed",
      detail: "Payment could not be completed. Retry or choose a different method.",
      tone: "error",
    };
  }

  return {
    title: "Awaiting Payment",
    detail: "Review the session and choose a payment method to continue.",
    tone: "warning",
  };
}

function KioskHeader({ title, subtitle, label, gateStatus, showBack = false, onBack }) {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {showBack ? (
            <button className={styles.backBtn} onClick={onBack} aria-label="Back to terminal menu">
              {"<"}
            </button>
          ) : (
            <div className={styles.brandMark}>P</div>
          )}
          <div className={styles.headerCopy}>
            <span className={styles.headerLabel}>{label}</span>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
        </div>

        <div className={styles.headerMeta}>
          {gateStatus && (
            <>
              <div className={styles.metaCard}>
                <span className={styles.metaLabel}>Gate</span>
                <span className={styles.metaValue}>{gateStatus.gateId}</span>
              </div>
              <div className={styles.metaCard}>
                <span className={styles.metaLabel}>Status</span>
                <span className={styles.liveStatus}>
                  <span className={styles.statusDot} />
                  {gateStatus.status.toUpperCase()}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function StatusPanel({ state }) {
  return (
    <div className={`${styles.statusPanel} ${getToneClass(styles, state.tone)}`}>
      <span className={styles.statusPanelLabel}>Kiosk State</span>
      <strong className={styles.statusPanelTitle}>{state.title}</strong>
      <p className={styles.statusPanelText}>{state.detail}</p>
    </div>
  );
}

function GateSidePanel({ gateStatus }) {
  return (
    <aside className={styles.sidePanel}>
      <div className={styles.sideCard}>
        <span className={styles.sideLabel}>Terminal</span>
        <h2 className={styles.sideTitle}>Main Entrance Gate</h2>
        <p className={styles.sideText}>
          This kiosk simulates entry and exit handling for members and visitors.
        </p>
      </div>

      {gateStatus && (
        <div className={styles.sideCard}>
          <span className={styles.sideLabel}>Live Capacity</span>
          <div className={styles.capacityList}>
            {gateStatus.zones.slice(0, 3).map((zone) => (
              <div key={zone.id} className={styles.capacityItem}>
                <div className={styles.capacityHead}>
                  <span className={styles.capacityZone}>{zone.name}</span>
                  <span className={styles.capacityValue}>{zone.availableSlots} free</span>
                </div>
                <div className={styles.capacityTrack}>
                  <span
                    className={`${styles.capacityFill} ${
                      zone.occupancyPercent > 90
                        ? styles.capacityFull
                        : zone.occupancyPercent > 70
                          ? styles.capacityBusy
                          : styles.capacityOpen
                    }`}
                    style={{ width: `${Math.max(zone.occupancyPercent, 8)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.sideCard}>
        <span className={styles.sideLabel}>Operator Notes</span>
        <ul className={styles.noteList}>
          <li>Use Card Access for student and staff entry.</li>
          <li>Use Temporary Entry to issue visitor tickets.</li>
          <li>Use Exit Payment to retrieve tickets and complete exit.</li>
        </ul>
      </div>
    </aside>
  );
}

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

  const openIssuedTicketInExitFlow = async () => {
    if (!tempPass?.ticketNumber) return;

    const ticketNumber = tempPass.ticketNumber;

    setTempVisitorName("");
    setTempVisitorEmail("");
    setTempVisitorPhone("");
    setTempPass(null);
    setMode("tempExit");

    await handleRetrieveSession(ticketNumber);
  };

  const handleExitTicketInput = (e) => {
    setExitTicket(e.target.value.toUpperCase());
  };

  const handleRetrieveSession = async (ticketValue = exitTicket) => {
    const normalizedTicket = ticketValue.trim().toUpperCase();
    if (!normalizedTicket) return;

    setExitLoading(true);
    setExitTicket(normalizedTicket);
    setExitSession(null);
    setExitPaymentResult(null);
    setSelectedPaymentMethod(null);

    try {
      const result = await retrieveSession(normalizedTicket);
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

  const modeMeta = MODE_DETAILS[mode];
  const cardFlowState = getCardFlowState(cardLoading, cardValidation);
  const tempEntryState = getTempEntryState(tempLoading, tempPass);
  const tempExitState = getTempExitState(
    exitLoading,
    exitSession,
    exitProcessing,
    exitPaymentResult,
  );

  const renderMenu = () => (
    <div className={styles.menuLayout}>
      <div className={styles.heroPanel}>
        <div className={styles.heroCopy}>
          <span className={styles.heroEyebrow}>Kiosk Control</span>
          <h2>Choose the terminal workflow</h2>
          <p>
            This interface is designed for large touch targets, quick operator
            decisions, and clear gate-entry outcomes during demos.
          </p>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <span className={styles.heroStatLabel}>Gate</span>
            <strong>{gateStatus?.gateId || "--"}</strong>
          </div>
          <div className={styles.heroStat}>
            <span className={styles.heroStatLabel}>Hours</span>
            <strong>{gateStatus?.operatingHours || "24/7"}</strong>
          </div>
          <div className={styles.heroStat}>
            <span className={styles.heroStatLabel}>Updated</span>
            <strong>
              {new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </strong>
          </div>
        </div>
      </div>

      <div className={styles.menuGrid}>
        <button
          className={`${styles.menuButton} ${styles.cardMode}`}
          onClick={() => setMode("cardAccess")}
        >
          <span className={styles.menuStep}>01</span>
          <span className={styles.modeIcon}>ID</span>
          <span className={styles.modeName}>Card Access</span>
          <span className={styles.modeDesc}>Validate university ID and open the gate.</span>
        </button>

        <button
          className={`${styles.menuButton} ${styles.tempEntry}`}
          onClick={() => setMode("tempEntry")}
        >
          <span className={styles.menuStep}>02</span>
          <span className={styles.modeIcon}>IN</span>
          <span className={styles.modeName}>Temporary Entry</span>
          <span className={styles.modeDesc}>Issue a visitor ticket with expiry details.</span>
        </button>

        <button
          className={`${styles.menuButton} ${styles.tempExit}`}
          onClick={() => setMode("tempExit")}
        >
          <span className={styles.menuStep}>03</span>
          <span className={styles.modeIcon}>EX</span>
          <span className={styles.modeName}>Exit Payment</span>
          <span className={styles.modeDesc}>Retrieve ticket, collect payment, and approve exit.</span>
        </button>
      </div>
    </div>
  );

  const renderCardAccess = () => (
    <div className={styles.modeLayout}>
      <GateSidePanel gateStatus={gateStatus} />

      <section className={styles.mainPanel}>
        <StatusPanel state={cardFlowState} />

        {!cardValidation ? (
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelEyebrow}>Scan Input</span>
              <h3 className={styles.panelTitle}>Scan or enter member card ID</h3>
            </div>

            <div className={styles.inputGroup}>
              <label>Card ID</label>
              <input
                type="text"
                placeholder="ID-XXX-2024"
                value={cardId}
                onChange={handleCardInput}
                onKeyDown={(e) => e.key === "Enter" && handleCardValidate()}
                autoFocus
                className={styles.cardInput}
              />
            </div>

            <button
              className={`${styles.actionBtn} ${cardLoading ? styles.loading : ""}`}
              onClick={handleCardValidate}
              disabled={cardLoading || !cardId.trim()}
            >
              {cardLoading ? "Verifying Card..." : "Validate Card"}
            </button>
          </div>
        ) : cardValidation.valid && !cardValidation.gateStatus ? (
          <div className={`${styles.resultCard} ${styles.resultSuccess}`}>
            <div className={styles.resultTop}>
              <div className={styles.resultIcon}>OK</div>
              <div>
                <h3>Card Verified</h3>
                <p className={styles.resultLead}>
                  Member credentials are valid. Review the assignment below and open the gate.
                </p>
              </div>
            </div>

            <div className={styles.resultInfo}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Name</span>
                <span className={styles.value}>{cardValidation.name}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Role</span>
                <span className={styles.value}>{cardValidation.type}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Assigned Zone</span>
                <span className={styles.value}>{cardValidation.zoneName}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Available Slots</span>
                <span className={`${styles.value} ${styles.valuePositive}`}>
                  {cardValidation.availableSlots} slots
                </span>
              </div>
            </div>

            <div className={styles.actionStack}>
              <button
                className={`${styles.actionBtn} ${cardLoading ? styles.loading : ""}`}
                onClick={handleCardEntry}
                disabled={cardLoading}
              >
                {cardLoading ? "Opening Gate..." : "Open Gate and Enter"}
              </button>
              <button className={styles.secondaryBtn} onClick={resetCardMode}>
                Return to Menu
              </button>
            </div>
          </div>
        ) : cardValidation.gateStatus === "OPEN" ? (
          <div className={`${styles.resultCard} ${styles.resultSuccess}`}>
            <div className={styles.resultTop}>
              <div className={styles.resultIcon}>GO</div>
              <div>
                <h3>Access Granted</h3>
                <p className={styles.resultLead}>
                  Gate is opening. The driver may proceed through the terminal.
                </p>
              </div>
            </div>

            <div className={styles.resultInfo}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Name</span>
                <span className={styles.value}>{cardValidation.name}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Entry Time</span>
                <span className={styles.value}>
                  {formatTerminalDateTime(cardValidation.timestamp)}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Access Code</span>
                <span className={`${styles.value} ${styles.mono}`}>
                  {cardValidation.accessCode}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Session ID</span>
                <span className={`${styles.value} ${styles.mono} ${styles.small}`}>
                  {cardValidation.sessionId}
                </span>
              </div>
            </div>

            <p className={styles.successMsg}>Welcome. Please proceed through the gate.</p>

            <button className={styles.secondaryBtn} onClick={resetCardMode}>
              Return to Menu
            </button>
          </div>
        ) : (
          <div className={`${styles.resultCard} ${styles.resultError}`}>
            <div className={styles.resultTop}>
              <div className={styles.resultIcon}>X</div>
              <div>
                <h3>Access Denied</h3>
                <p className={styles.resultLead}>
                  The card could not be approved for gate entry.
                </p>
              </div>
            </div>

            <p className={styles.errorMsg}>{cardValidation.reason}</p>

            {cardValidation.name && (
              <div className={styles.resultInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Card Holder</span>
                  <span className={styles.value}>{cardValidation.name}</span>
                </div>
              </div>
            )}

            <p className={styles.helpText}>
              Review credentials or contact the parking office for assistance.
            </p>

            <div className={styles.actionStack}>
              <button
                className={styles.actionBtn}
                onClick={() => {
                  setCardId("");
                  setCardValidation(null);
                }}
              >
                Try Again
              </button>
              <button className={styles.secondaryBtn} onClick={resetCardMode}>
                Return to Menu
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );

  const renderTempEntry = () => (
    <div className={styles.modeLayout}>
      <GateSidePanel gateStatus={gateStatus} />

      <section className={styles.mainPanel}>
        <StatusPanel state={tempEntryState} />

        {!tempPass ? (
          <form className={styles.panel} onSubmit={handleTempEntrySubmit}>
            <div className={styles.panelHeader}>
              <span className={styles.panelEyebrow}>Visitor Check-In</span>
              <h3 className={styles.panelTitle}>Create a temporary parking pass</h3>
            </div>

            <div className={styles.inputGroup}>
              <label>Visitor Name</label>
              <input
                type="text"
                placeholder="Full Name"
                value={tempVisitorName}
                onChange={(e) => setTempVisitorName(e.target.value)}
                className={styles.textInput}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <input
                type="email"
                placeholder="visitor@example.com"
                value={tempVisitorEmail}
                onChange={(e) => setTempVisitorEmail(e.target.value)}
                className={styles.textInput}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="+84 XXX XXX XXX"
                value={tempVisitorPhone}
                onChange={(e) => setTempVisitorPhone(e.target.value)}
                className={styles.textInput}
                required
              />
            </div>

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
              {tempLoading ? "Issuing Pass..." : "Issue Visitor Pass"}
            </button>
          </form>
        ) : tempPass.success ? (
          <div className={`${styles.resultCard} ${styles.resultSuccess}`}>
            <div className={styles.resultTop}>
              <div className={styles.resultIcon}>PASS</div>
              <div>
                <h3>Temporary Pass Issued</h3>
                <p className={styles.resultLead}>
                  The visitor can enter now. Save the ticket number for exit retrieval later.
                </p>
              </div>
            </div>

            <div className={styles.ticketBox}>
              <div className={styles.ticketContent}>
                <div className={styles.ticketNumber}>{tempPass.ticketNumber}</div>
                <div className={styles.ticketDetail}>
                  <strong>{tempPass.visitorName}</strong>
                </div>
                <div className={styles.ticketDetail}>
                  Zone <strong>{tempPass.zoneName}</strong>
                </div>
                <div className={styles.ticketDetail}>
                  Valid until <strong>{formatTerminalDateTime(tempPass.expiryTime)}</strong>
                </div>
              </div>
            </div>

            <div className={styles.resultInfo}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Issue Time</span>
                <span className={styles.value}>{formatTerminalDateTime(tempPass.issueTime)}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Expiry Time</span>
                <span className={styles.value}>{formatTerminalDateTime(tempPass.expiryTime)}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Session ID</span>
                <span className={`${styles.value} ${styles.mono} ${styles.small}`}>
                  {tempPass.sessionId}
                </span>
              </div>
            </div>

            <p className={styles.successMsg}>Pass issued and stored. Gate is opening.</p>
            <p className={styles.message}>
              Use this exact ticket number in Exit Payment when the visitor leaves.
            </p>

            <div className={styles.actionStack}>
              <button className={styles.actionBtn} onClick={openIssuedTicketInExitFlow}>
                Open Exit Flow with This Ticket
              </button>
              <button className={styles.secondaryBtn} onClick={resetTempEntry}>
                Return to Menu
              </button>
            </div>
          </div>
        ) : (
          <div className={`${styles.resultCard} ${styles.resultError}`}>
            <div className={styles.resultTop}>
              <div className={styles.resultIcon}>X</div>
              <div>
                <h3>Pass Issuance Failed</h3>
                <p className={styles.resultLead}>
                  The kiosk could not create a valid visitor pass.
                </p>
              </div>
            </div>

            <p className={styles.errorMsg}>
              {tempPass.error || "Unable to issue temporary pass"}
            </p>

            <div className={styles.actionStack}>
              <button className={styles.actionBtn} onClick={() => setTempPass(null)}>
                Try Again
              </button>
              <button className={styles.secondaryBtn} onClick={resetTempEntry}>
                Return to Menu
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );

  const renderTempExit = () => (
    <div className={styles.modeLayout}>
      <GateSidePanel gateStatus={gateStatus} />

      <section className={styles.mainPanel}>
        <StatusPanel state={tempExitState} />

        {!exitSession && !exitPaymentResult ? (
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelEyebrow}>Ticket Retrieval</span>
              <h3 className={styles.panelTitle}>Scan or enter a visitor ticket</h3>
            </div>

            <div className={styles.inputGroup}>
              <label>Ticket Number</label>
              <input
                type="text"
                placeholder="TMP-XXXXXXXX"
                value={exitTicket}
                onChange={handleExitTicketInput}
                onKeyDown={(e) => e.key === "Enter" && handleRetrieveSession()}
                autoFocus
                className={styles.cardInput}
              />
            </div>

            <button
              className={`${styles.actionBtn} ${exitLoading ? styles.loading : ""}`}
              onClick={handleRetrieveSession}
              disabled={exitLoading || !exitTicket.trim()}
            >
              {exitLoading ? "Retrieving Session..." : "Retrieve Session"}
            </button>
          </div>
        ) : exitSession?.error && !exitPaymentResult ? (
          <div className={`${styles.resultCard} ${styles.resultError}`}>
            <div className={styles.resultTop}>
              <div className={styles.resultIcon}>X</div>
              <div>
                <h3>Session Not Found</h3>
                <p className={styles.resultLead}>
                  The provided ticket did not match an active exit session.
                </p>
              </div>
            </div>

            <p className={styles.errorMsg}>{exitSession.error}</p>

            <div className={styles.actionStack}>
              <button
                className={styles.actionBtn}
                onClick={() => {
                  setExitTicket("");
                  setExitSession(null);
                }}
              >
                Try Again
              </button>
              <button className={styles.secondaryBtn} onClick={resetExitMode}>
                Return to Menu
              </button>
            </div>
          </div>
        ) : exitSession && !exitPaymentResult ? (
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelEyebrow}>Payment Review</span>
              <h3 className={styles.panelTitle}>Confirm payment and release the vehicle</h3>
            </div>

            <div className={styles.resultInfo}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Ticket</span>
                <span className={styles.value}>{exitSession.ticketNumber}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Visitor</span>
                <span className={styles.value}>{exitSession.visitorName}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Zone</span>
                <span className={styles.value}>{exitSession.zoneName}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Entry Time</span>
                <span className={styles.value}>
                  {formatTerminalDateTime(exitSession.entryTime)}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Valid Until</span>
                <span className={styles.value}>
                  {formatTerminalDateTime(exitSession.expiryTime)}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Duration</span>
                <span className={styles.value}>
                  {typeof exitSession.duration === "number"
                    ? exitSession.duration.toFixed(2)
                    : exitSession.duration}{" "}
                  hours
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Amount Due</span>
                <span className={`${styles.value} ${styles.valuePositive}`}>
                  VND {exitSession.estimatedFee.toLocaleString()}
                </span>
              </div>
            </div>

            <div className={styles.paymentMethodSection}>
              <label>Select Payment Method</label>
              <div className={styles.paymentGrid}>
                {EXIT_PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    className={`${styles.paymentBtn} ${
                      selectedPaymentMethod === method.id ? styles.selected : ""
                    }`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <span className={styles.paymentIcon}>{method.icon}</span>
                    <span className={styles.paymentLabel}>{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.actionStack}>
              <button
                className={`${styles.actionBtn} ${exitProcessing ? styles.loading : ""}`}
                onClick={handleExitPayment}
                disabled={exitProcessing || !selectedPaymentMethod}
              >
                {exitProcessing
                  ? "Processing Payment..."
                  : `Process Payment - VND ${exitSession.estimatedFee.toLocaleString()}`}
              </button>
              <button className={styles.secondaryBtn} onClick={resetExitMode}>
                Cancel and Return
              </button>
            </div>
          </div>
        ) : exitPaymentResult?.success ? (
          <div className={`${styles.resultCard} ${styles.resultSuccess}`}>
            <div className={styles.resultTop}>
              <div className={styles.resultIcon}>OK</div>
              <div>
                <h3>Exit Approved</h3>
                <p className={styles.resultLead}>
                  Payment was accepted and the gate is ready to open.
                </p>
              </div>
            </div>

            <div className={styles.resultInfo}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Transaction ID</span>
                <span className={`${styles.value} ${styles.mono} ${styles.small}`}>
                  {exitPaymentResult.transactionId}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Amount Paid</span>
                <span className={styles.value}>
                  VND {exitPaymentResult.amount.toLocaleString()}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Method</span>
                <span className={styles.value}>{exitPaymentResult.paymentMethod}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Paid At</span>
                <span className={styles.value}>
                  {formatTerminalDateTime(exitPaymentResult.timestamp)}
                </span>
              </div>
            </div>

            <p className={styles.successMsg}>Gate is opening. Please proceed.</p>

            <button className={styles.secondaryBtn} onClick={resetExitMode}>
              Return to Menu
            </button>
          </div>
        ) : (
          <div className={`${styles.resultCard} ${styles.resultError}`}>
            <div className={styles.resultTop}>
              <div className={styles.resultIcon}>X</div>
              <div>
                <h3>Payment Failed</h3>
                <p className={styles.resultLead}>
                  The exit payment could not be completed.
                </p>
              </div>
            </div>

            <p className={styles.errorMsg}>
              {exitPaymentResult?.error || "Payment processing error"}
            </p>

            <div className={styles.actionStack}>
              <button
                className={styles.actionBtn}
                onClick={() => {
                  setExitPaymentResult(null);
                  setSelectedPaymentMethod(null);
                }}
              >
                Try Again
              </button>
              <button className={styles.secondaryBtn} onClick={resetExitMode}>
                Return to Menu
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );

  return (
    <div className={styles.terminal}>
      <div className={styles.screen}>
        <div className={styles.scanline} />

        <KioskHeader
          title={modeMeta.title}
          subtitle={modeMeta.subtitle}
          label={modeMeta.label}
          gateStatus={gateStatus}
          showBack={mode !== "menu"}
          onBack={
            mode === "cardAccess"
              ? resetCardMode
              : mode === "tempEntry"
                ? resetTempEntry
                : resetExitMode
          }
        />

        <div className={styles.content}>
          {mode === "menu" && renderMenu()}
          {mode === "cardAccess" && renderCardAccess()}
          {mode === "tempEntry" && renderTempEntry()}
          {mode === "tempExit" && renderTempExit()}
        </div>

        {gateStatus && (
          <div className={styles.footer}>
            <div className={styles.footerContent}>
              <div className={styles.footerStatus}>
                <span className={styles.footerLabel}>Gate Location</span>
                <strong>{gateStatus.location}</strong>
              </div>
              <div className={styles.footerStatus}>
                <span className={styles.footerLabel}>Operating Hours</span>
                <strong>{gateStatus.operatingHours}</strong>
              </div>
              <div className={styles.footerStatus}>
                <span className={styles.footerLabel}>Terminal Time</span>
                <strong>
                  {new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GateTerminalPage;

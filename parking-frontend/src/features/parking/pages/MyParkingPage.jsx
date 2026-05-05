/**
 * My Parking Page
 * Displays user's current parking session and parking history
 * Available to: student, staff
 */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyParking } from '../hooks';
import { ActiveSessionCard, SessionHistoryTable, ParkingStatsCard } from '../components';
import {
  formatCurrency,
  formatDate,
  formatTime,
  PARKING_MONTHLY_RATE,
  EXTEND_INCREMENT_MONTHS
} from '../../../mock/myParkingMock.js';
import styles from './MyParkingPage.module.css';

function getExtendPreview(session) {
  if (!session) {
    return null;
  }

  const extensionBaseTime = session.extendedUntil
    ? new Date(session.extendedUntil)
    : new Date();
  const extendedUntil = new Date(extensionBaseTime);
  extendedUntil.setMonth(extendedUntil.getMonth() + EXTEND_INCREMENT_MONTHS);
  const addedFee = PARKING_MONTHLY_RATE * EXTEND_INCREMENT_MONTHS;

  return {
    addedMonths: EXTEND_INCREMENT_MONTHS,
    addedFee,
    estimatedFee: (session.estimatedFee || 0) + addedFee,
    extendedUntil,
  };
}

function MyParkingPage() {
  const navigate = useNavigate();
  const [isAwaitingExtendConfirmation, setIsAwaitingExtendConfirmation] = useState(false);
  const {
    data,
    loading,
    error,
    stats,
    exitResult,
    extendResult,
    isExtending,
    exitParking,
    extendParkingTime,
    dismissExitResult,
    dismissExtendResult
  } = useMyParking();

  const extendPreview = useMemo(
    () => getExtendPreview(data?.currentSession),
    [data?.currentSession]
  );

  const handleRequestExtend = () => {
    if (!data?.currentSession || isExtending) {
      return;
    }

    dismissExtendResult();
    setIsAwaitingExtendConfirmation(true);
  };

  const handleCancelExtend = () => {
    setIsAwaitingExtendConfirmation(false);
  };

  const handleConfirmExtend = async () => {
    const wasExtended = await extendParkingTime();

    if (wasExtended) {
      setIsAwaitingExtendConfirmation(false);
    }
  };

  const handleExitParking = () => {
    setIsAwaitingExtendConfirmation(false);
    exitParking();
  };

  if (error) {
    return (
      <div className={`${styles.page} app-page`}>
        <div className="app-page-header">
          <div className="app-page-title-wrap">
            <h1 className="app-page-title">My Parking</h1>
            <p className="app-page-subtitle">
              Manage your current session, exit flow, and parking history.
            </p>
          </div>
        </div>
        <div className="app-state app-state--error">
          <p>Error loading parking data: {error}</p>
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className={`${styles.page} app-page`}>
        <div className="app-page-header">
          <div className="app-page-title-wrap">
            <h1 className="app-page-title">My Parking</h1>
            <p className="app-page-subtitle">
              Manage your current session, exit flow, and parking history.
            </p>
          </div>
        </div>
        <div className="app-state app-state--loading">
          <div className="app-spinner" />
          <p>Loading parking information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.page} app-page`}>
      <div className="app-page-header">
        <div className="app-page-title-wrap">
          <h1 className="app-page-title">My Parking</h1>
          <p className="app-page-subtitle">
            Manage your active parking session and review previous visits.
          </p>
        </div>
        <div className="app-page-meta">
          <span className="app-pill">{data.history.length} history records</span>
          <span className="app-pill">
            {data.currentSession ? 'Active session' : 'No active session'}
          </span>
        </div>
      </div>

      {exitResult && (
        <section className={styles.successBanner}>
          <div className={styles.successContent}>
            <span className={styles.successIcon}>OK</span>
            <div className={styles.successText}>
              <h2>Parking session ended successfully</h2>
              <p>
                Slot {exitResult.slot} in {exitResult.zoneName} was exited at{' '}
                {formatTime(exitResult.exitTime)}. The session has been moved to
                the top of parking history and {formatCurrency(exitResult.fee)} was
                added to your unpaid total.
              </p>
            </div>
          </div>
          <div className={styles.successActions}>
            {exitResult.canGoToPayment && (
              <button
                type="button"
                className={`${styles.paymentButton} app-button app-button--primary`}
                onClick={() => navigate('/payment')}
              >
                Go to Payment
              </button>
            )}
            <button
              type="button"
              className={`${styles.dismissButton} app-button app-button--secondary`}
              onClick={dismissExitResult}
            >
              Dismiss
            </button>
          </div>
        </section>
      )}

      {extendResult && (
        <section className={styles.successBanner}>
          <div className={styles.successContent}>
            <span className={styles.successIcon}>OK</span>
            <div className={styles.successText}>
              <h2>Parking session extended</h2>
              <p>
                Slot {extendResult.slot} in {extendResult.zoneName} was extended by{' '}
                {extendResult.addedMonths} month{extendResult.addedMonths > 1 ? 's' : ''}. The session is now reserved until{' '}
                {formatDate(extendResult.extendedUntil)} and the estimated monthly fee is{' '}
                {formatCurrency(extendResult.estimatedFee)}.
              </p>
            </div>
          </div>
          <div className={styles.successActions}>
            <button
              type="button"
              className={`${styles.dismissButton} app-button app-button--secondary`}
              onClick={dismissExtendResult}
            >
              Dismiss
            </button>
          </div>
        </section>
      )}

      {isAwaitingExtendConfirmation && data.currentSession && extendPreview && (
        <section className={styles.confirmBanner}>
          <div className={styles.confirmContent}>
            <span className={styles.confirmIcon}>?</span>
            <div className={styles.confirmText}>
              <h2>Confirm monthly extension</h2>
              <p>
                Extend parking for slot {data.currentSession.slot} in {data.currentSession.zoneName}
                {' '}by {extendPreview.addedMonths} month{extendPreview.addedMonths > 1 ? 's' : ''}. This adds approximately{' '}
                {formatCurrency(extendPreview.addedFee)} and updates the current
                total due to {formatCurrency((stats?.totalUnpaid || 0) + extendPreview.estimatedFee)}.
              </p>
            </div>
          </div>
          <div className={styles.confirmMeta}>
            <span className={styles.confirmPill}>
              New reserved time: {formatDate(extendPreview.extendedUntil)}
            </span>
            <span className={styles.confirmPill}>
              New current estimate: {formatCurrency(extendPreview.estimatedFee)}
            </span>
          </div>
          <div className={styles.successActions}>
            <button
              type="button"
              className={`${styles.paymentButton} app-button app-button--primary`}
              onClick={handleConfirmExtend}
              disabled={isExtending}
            >
              {isExtending ? 'Applying...' : 'Confirm Extension'}
            </button>
            <button
              type="button"
              className={`${styles.dismissButton} app-button app-button--secondary`}
              onClick={handleCancelExtend}
              disabled={isExtending}
            >
              Cancel
            </button>
          </div>
        </section>
      )}

      <ParkingStatsCard
        stats={stats}
        onPayNow={() =>
          navigate('/payment', {
            state: {
              source: 'my-parking',
              reason: 'outstanding-fees'
            }
          })
        }
      />

      {data.currentSession ? (
        <ActiveSessionCard
          session={{
            ...data.currentSession,
            elapsedTime: data.currentSession.elapsedTime || 'calculating...'
          }}
          onExit={handleExitParking}
          onExtend={handleRequestExtend}
          isExtending={isExtending}
          isAwaitingConfirmation={isAwaitingExtendConfirmation}
        />
      ) : (
        <div className={`${styles.noActiveSession} app-state app-state--empty`}>
          <p className={styles.noActiveIcon}>{exitResult ? 'OK' : 'P'}</p>
          <h3>{exitResult ? 'Parking Exit Completed' : 'No Active Parking Session'}</h3>
          <p>
            {exitResult
              ? 'Your latest exited session is now visible at the top of parking history.'
              : "You don't have an active parking session at the moment."}
          </p>
        </div>
      )}

      <SessionHistoryTable
        sessions={data.history}
        highlightSessionId={exitResult?.sessionId}
      />
    </div>
  );
}

export default MyParkingPage;

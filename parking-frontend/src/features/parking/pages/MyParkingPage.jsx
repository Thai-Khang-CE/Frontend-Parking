/**
 * My Parking Page
 * Displays user's current parking session and parking history
 * Available to: student, staff
 */

import { useNavigate } from 'react-router-dom';
import { useMyParking } from '../hooks';
import { ActiveSessionCard, SessionHistoryTable, ParkingStatsCard } from '../components';
import { formatCurrency, formatTime } from '../../../mock/myParkingMock.js';
import styles from './MyParkingPage.module.css';

function MyParkingPage() {
  const navigate = useNavigate();
  const {
    data,
    loading,
    error,
    stats,
    exitResult,
    exitParking,
    dismissExitResult
  } = useMyParking();

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

      <ParkingStatsCard stats={stats} />

      {data.currentSession ? (
        <ActiveSessionCard
          session={{
            ...data.currentSession,
            elapsedTime: data.currentSession.elapsedTime || 'calculating...'
          }}
          onExit={exitParking}
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

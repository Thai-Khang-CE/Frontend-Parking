/**
 * My Parking Page
 * Displays user's current parking session and parking history
 * Available to: student, staff
 */

import { useMyParking } from '../hooks';
import { ActiveSessionCard, SessionHistoryTable, ParkingStatsCard } from '../components';
import styles from './MyParkingPage.module.css';

function MyParkingPage() {
  const { data, loading, error, stats, exitParking } = useMyParking();

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>My Parking</h1>
          <p className={styles.subtitle}>Manage your parking sessions</p>
        </div>
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>Error loading parking data: {error}</p>
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>My Parking</h1>
          <p className={styles.subtitle}>Manage your parking sessions</p>
        </div>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>Loading parking information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <div className={styles.header}>
        <h1>My Parking</h1>
        <p className={styles.subtitle}>Manage your parking sessions and view history</p>
      </div>

      {/* Statistics Summary */}
      <ParkingStatsCard stats={stats} />

      {/* Active Session */}
      {data.currentSession ? (
        <ActiveSessionCard 
          session={{
            ...data.currentSession,
            elapsedTime: data.currentSession.elapsedTime || 'calculating...'
          }}
          onExit={exitParking}
        />
      ) : (
        <div className={styles.noActiveSession}>
          <p className={styles.noActiveIcon}>🅿️</p>
          <h3>No Active Parking Session</h3>
          <p>You don't have an active parking session at the moment.</p>
        </div>
      )}

      {/* Parking History */}
      <SessionHistoryTable sessions={data.history} />
    </div>
  );
}

export default MyParkingPage;

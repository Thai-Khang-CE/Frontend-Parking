/**
 * MainLayout Component
 * Shared layout wrapper for all pages
 * Includes Header and Navigation
 */

import Header from './Header';
import Navigation from './Navigation';
import styles from './MainLayout.module.css';

function MainLayout({ children }) {
  return (
    <div className={styles.layout}>
      <Header />
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          {children}
        </div>
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2026 Smart Parking System. HCMUT Software Engineering Project.</p>
      </footer>
    </div>
  );
}

export default MainLayout;

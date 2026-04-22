/**
 * Header Component
 * Displays app title and branding
 */

import styles from './Header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.title}>Smart Parking System</h1>
        <p className={styles.subtitle}>HCMUT Software Engineering Project</p>
      </div>
    </header>
  );
}

export default Header;

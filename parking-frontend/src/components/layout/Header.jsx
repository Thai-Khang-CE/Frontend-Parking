/**
 * Header Component
 * Displays app title and branding
 * Shows user info and logout button if authenticated
 */

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.css';

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Smart Parking System</h1>
          <p className={styles.subtitle}>HCMUT Software Engineering Project</p>
        </div>
        {user && (
          <div className={styles.userSection}>
            <span className={styles.userInfo}>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userRole}>{user.role}</span>
            </span>
            <button className={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;

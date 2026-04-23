/**
 * Navigation Component
 * Main navigation bar with role-based links
 * Only displayed when user is authenticated
 */

import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Navigation.module.css';

function Navigation() {
  const { isAuthenticated, user } = useAuth();

  // Define all navigation items with role access
  const allNavItems = [
    { path: '/', label: 'Dashboard', roles: ['student', 'staff', 'admin', 'visitor'] },
    { path: '/guidance', label: 'Guidance', roles: ['student', 'staff', 'admin', 'visitor'] },
    { path: '/signage', label: 'Signage', roles: ['student', 'staff', 'admin', 'visitor'] },
    { path: '/my-parking', label: 'My Parking', roles: ['student', 'staff'] },
    { path: '/payment', label: 'Payment', roles: ['student', 'staff'] },
    { path: '/monitoring', label: 'Monitoring', roles: ['staff', 'admin'] },
    { path: '/fee-calculation', label: 'Fee Calculation', roles: ['admin'] },
    { path: '/bills', label: 'Bills', roles: ['admin'] }
  ];

  if (!isAuthenticated || !user) {
    return null;
  }

  // Filter navigation items based on user role
  const visibleNavItems = allNavItems.filter((item) =>
    item.roles.includes(user.role)
  );

  return (
    <nav className={styles.navigation}>
      <div className={styles.container}>
        <div className={styles.navWrapper}>
          <ul className={styles.navList}>
            {visibleNavItems.map((item) => (
              <li key={item.path} className={styles.navItem}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className={styles.roleIndicator}>
            <span className={styles.roleLabel}>{user.role.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;

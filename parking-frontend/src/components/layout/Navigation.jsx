/**
 * Navigation Component
 * Main navigation bar with links to all pages
 */

import { NavLink } from 'react-router-dom';
import styles from './Navigation.module.css';

function Navigation() {
  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/guidance', label: 'Guidance' },
    { path: '/monitoring', label: 'Monitoring' },
    { path: '/signage', label: 'Signage' }
  ];

  return (
    <nav className={styles.navigation}>
      <div className={styles.container}>
        <ul className={styles.navList}>
          {navItems.map((item) => (
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
      </div>
    </nav>
  );
}

export default Navigation;

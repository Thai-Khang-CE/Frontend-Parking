/**
 * LoginPage Component
 * Main login page with mock authentication
 * Supports multiple login methods: email/password, role-based, visitor
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import styles from './LoginPage.module.css';

function LoginPage() {
  const navigate = useNavigate();
  const { login, loginAsVisitor } = useAuth();

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const ROLES = [
    { id: 'student', label: 'Student', email: 'student@hcmut.edu.vn' },
    { id: 'staff', label: 'Staff', email: 'staff@hcmut.edu.vn' },
    { id: 'admin', label: 'Administrator', email: 'admin@hcmut.edu.vn' }
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!emailOrUsername || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    const result = login(emailOrUsername, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  const handleQuickLogin = async (role) => {
    setError('');
    setLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const roleConfig = ROLES.find(r => r.id === role);
    const result = login(roleConfig.email, 'password123', role);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  const handleVisitorLogin = async () => {
    setError('');
    setLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    loginAsVisitor();
    navigate('/');
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Smart Parking System</h1>
          <p className={styles.subtitle}>HCMUT Software Engineering Project</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className={styles.errorMessage}>
            <span className={styles.errorIcon}>⚠️</span>
            {error}
          </div>
        )}

        {/* Main Login Form */}
        <form onSubmit={handleLogin} className={styles.form}>
          <h2 className={styles.formTitle}>Login</h2>

          <div className={styles.formGroup}>
            <label htmlFor="emailOrUsername" className={styles.label}>
              Email or Username
            </label>
            <input
              id="emailOrUsername"
              type="text"
              className={styles.input}
              placeholder="e.g., student@hcmut.edu.vn"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              className={styles.input}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={styles.primaryButton}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Divider */}
        <div className={styles.divider}>
          <span>Or try as a different role</span>
        </div>

        {/* Quick Login Buttons */}
        <div className={styles.quickLoginSection}>
          <p className={styles.quickLoginTitle}>Mock Login (for testing)</p>
          <div className={styles.roleButtons}>
            {ROLES.map((role) => (
              <button
                key={role.id}
                type="button"
                className={`${styles.roleButton} ${
                  selectedRole === role.id ? styles.selected : ''
                }`}
                onClick={() => handleQuickLogin(role.id)}
                disabled={loading}
              >
                <span className={styles.roleIcon}>👤</span>
                {role.label}
              </button>
            ))}
          </div>
        </div>

        {/* SSO Section */}
        <div className={styles.ssoSection}>
          <button
            type="button"
            className={styles.ssoButton}
            disabled={loading}
            onClick={() => setError('SSO integration coming soon')}
          >
            <span className={styles.ssoIcon}>🔐</span>
            Login with SSO
          </button>
        </div>

        {/* Visitor Button */}
        <button
          type="button"
          className={styles.visitorButton}
          disabled={loading}
          onClick={handleVisitorLogin}
        >
          <span className={styles.visitorIcon}>👁️</span>
          Continue as Visitor
        </button>

        {/* Test Credentials Info */}
        <div className={styles.credentialsInfo}>
          <p className={styles.infoTitle}>Test Credentials:</p>
          <ul className={styles.credentialsList}>
            <li><strong>Student:</strong> student@hcmut.edu.vn / student123</li>
            <li><strong>Staff:</strong> staff@hcmut.edu.vn / staff123</li>
            <li><strong>Admin:</strong> admin@hcmut.edu.vn / admin123</li>
          </ul>
        </div>

        {/* Footer */}
        <p className={styles.footer}>
          © 2026 Smart Parking System. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

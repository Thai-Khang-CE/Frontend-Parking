/**
 * AuthContext - Authentication State Management
 * Handles user login, logout, and role-based access
 * Mock authentication for university project
 */

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

/**
 * Mock user database
 * In production, this would be replaced with actual backend auth
 */
const MOCK_USERS = {
  'student@hcmut.edu.vn': { password: 'student123', role: 'student', name: 'Student User' },
  'staff@hcmut.edu.vn': { password: 'staff123', role: 'staff', name: 'Staff Member' },
  'admin@hcmut.edu.vn': { password: 'admin123', role: 'admin', name: 'Administrator' },
  'visitor': { password: 'visitor123', role: 'visitor', name: 'Visitor' }
};

/**
 * AuthProvider component - place at app root
 * Provides authentication state and login/logout methods
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('parkingUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem('parkingUser');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Mock login with email/username and password
   * Returns success/error
   */
  const login = (emailOrUsername, password, role = null) => {
    // Try normal login
    if (MOCK_USERS[emailOrUsername]) {
      const mockUser = MOCK_USERS[emailOrUsername];
      if (mockUser.password === password) {
        const userData = {
          email: emailOrUsername,
          role: mockUser.role,
          name: mockUser.name,
          loginTime: new Date().toISOString()
        };
        setUser(userData);
        localStorage.setItem('parkingUser', JSON.stringify(userData));
        return { success: true };
      }
      return { success: false, error: 'Invalid password' };
    }

    // Try login as specific role
    if (role && MOCK_USERS[role]) {
      const userData = {
        email: emailOrUsername || role,
        role: role,
        name: MOCK_USERS[role].name,
        loginTime: new Date().toISOString()
      };
      setUser(userData);
      localStorage.setItem('parkingUser', JSON.stringify(userData));
      return { success: true };
    }

    return { success: false, error: 'Invalid credentials' };
  };

  /**
   * Continue as visitor (no password needed)
   */
  const loginAsVisitor = () => {
    const userData = {
      email: 'visitor',
      role: 'visitor',
      name: 'Visitor',
      loginTime: new Date().toISOString()
    };
    setUser(userData);
    localStorage.setItem('parkingUser', JSON.stringify(userData));
    return { success: true };
  };

  /**
   * Logout and clear session
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('parkingUser');
  };

  const value = {
    user,
    loading,
    login,
    loginAsVisitor,
    logout,
    isAuthenticated: !!user,
    hasRole: (role) => user?.role === role,
    hasAnyRole: (roles) => roles.includes(user?.role)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth hook - access auth context from any component
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

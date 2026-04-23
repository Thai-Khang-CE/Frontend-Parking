/**
 * Main App component
 * Sets up React Router with route definitions, shared layout, and auth protection
 * Includes role-based route access control
 */

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { MainLayout } from "../components/layout";
import { routes } from "./routes";

/**
 * Protected route wrapper
 * - Redirects to login if not authenticated
 * - Redirects to dashboard if user doesn't have required role
 */
function ProtectedRoute({ element, requiresAuth, allowedRoles }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>
    );
  }

  if (requiresAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (allowedRoles && isAuthenticated && user) {
    if (!allowedRoles.includes(user.role)) {
      // User doesn't have permission - redirect to dashboard
      return <Navigate to="/" replace />;
    }
  }

  return element;
}

/**
 * App content - inside AuthProvider
 */
function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {routes.map((route) => {
        const element = (
          <ProtectedRoute
            element={route.element}
            requiresAuth={route.requiresAuth}
            allowedRoles={route.allowedRoles}
          />
        );

        // Login and Terminal pages render outside MainLayout
        if (route.path === "/login" || route.path === "/terminal") {
          return <Route key={route.path} path={route.path} element={element} />;
        }

        // All other pages render inside MainLayout
        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              isAuthenticated ? (
                <MainLayout>{element}</MainLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        );
      })}

      {/* Catch-all: redirect to dashboard if authenticated, else to login */}
      <Route
        path="*"
        element={
          isAuthenticated ? (
            <Navigate to="/" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

/**
 * Main App with AuthProvider wrapper
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;

/**
 * Route definitions for Smart Parking system
 * Defines URL paths and their corresponding pages with role-based access
 *
 * Routes with requiresAuth: true are protected and require login
 * Routes with allowedRoles array are restricted to specific roles
 * All other routes are public
 */

import DashboardPage from "../features/dashboard/pages/DashboardPage";
import GuidancePage from "../features/guidance/pages/GuidancePage";
import MonitoringPage from "../features/monitoring/pages/MonitoringPage";
import SignagePage from "../features/signage/pages/SignagePage";
import LoginPage from "../features/auth/pages/LoginPage";
import { MyParkingPage, PaymentPage } from "../features/parking";
import { FeeCalculationPage, BillsPage } from "../features/admin";
import { GateTerminalPage } from "../features/terminal";

/**
 * Role definitions:
 * - student: Can access parking, guidance, dashboard
 * - staff: Can access parking, guidance, monitoring, dashboard
 * - admin: Can access all admin features (monitoring, fees, bills)
 * - visitor: Can access limited features (guidance, signage, dashboard)
 */

export const routes = [
  {
    path: "/login",
    element: <LoginPage />,
    label: "Login",
    requiresAuth: false,
    hideInNav: true,
  },
  // Public dashboard - accessible to all authenticated users
  {
    path: "/",
    element: <DashboardPage />,
    label: "Dashboard",
    requiresAuth: true,
    showInNav: true,
  },
  // Guidance - accessible to all authenticated users
  {
    path: "/guidance",
    element: <GuidancePage />,
    label: "Guidance",
    requiresAuth: true,
    showInNav: true,
  },
  // Signage - accessible to all authenticated users
  {
    path: "/signage",
    element: <SignagePage />,
    label: "Signage",
    requiresAuth: true,
    showInNav: true,
  },
  // Member routes (student, staff)
  {
    path: "/my-parking",
    element: <MyParkingPage />,
    label: "My Parking",
    requiresAuth: true,
    allowedRoles: ["student", "staff"],
    showInNav: true,
  },
  {
    path: "/payment",
    element: <PaymentPage />,
    label: "Payment",
    requiresAuth: true,
    allowedRoles: ["student", "staff"],
    showInNav: true,
  },
  // Admin routes
  {
    path: "/monitoring",
    element: <MonitoringPage />,
    label: "Monitoring",
    requiresAuth: true,
    allowedRoles: ["staff", "admin"],
    showInNav: true,
  },
  {
    path: "/fee-calculation",
    element: <FeeCalculationPage />,
    label: "Fee Calculation",
    requiresAuth: true,
    allowedRoles: ["admin"],
    showInNav: true,
  },
  {
    path: "/bills",
    element: <BillsPage />,
    label: "Bills",
    requiresAuth: true,
    allowedRoles: ["admin"],
    showInNav: true,
  },
  // Gate Terminal - public simulation page
  {
    path: "/terminal",
    element: <GateTerminalPage />,
    label: "Gate Terminal",
    requiresAuth: false,
    hideInNav: true,
  },
];

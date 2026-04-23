# Smart Parking System Frontend

## Overview

This repository contains the frontend for a Smart Parking / IoT Smart Parking System developed as a Software Engineering project at Ho Chi Minh City University of Technology (HCMUT).

The application focuses on parking visibility, role-based workflows, and demo-ready user flows for campus parking operations. It is built as a React single-page application with a feature-based structure, shared layout components, and mock-data-first implementation for development and presentation.

## Key Features

- Mock authentication with role-based access control for `student`, `staff`, `admin`, and `visitor`
- Protected routes with a shared application shell for authenticated pages
- Parking dashboard with summary cards, zone status, and mini parking map
- Parking guidance page with preferred zone recommendation and alternatives
- Monitoring page for zone-level slot visibility and controlled shared-state refresh
- Driver-facing signage page for simplified parking direction display
- My Parking page with active session tracking, exit flow, and session history
- Payment page with unpaid session selection, payment method flow, and receipt modal
- Admin fee calculation page with tariff overview and calculation history
- Admin bills management page with status filtering and bill details
- Gate terminal simulation for card access, temporary entry, and exit payment
- Zone detail page with status breakdown, row/slot layout, and mini parking map

## User Roles

| Role | Main Access |
| --- | --- |
| `visitor` | Dashboard, Guidance, Signage |
| `student` | Dashboard, Guidance, Signage, My Parking, Payment |
| `staff` | Dashboard, Guidance, Signage, My Parking, Payment, Monitoring |
| `admin` | Dashboard, Guidance, Signage, Monitoring, Fee Calculation, Bills |

## Main Modules

### Login
- Mock login page with seeded test accounts
- Quick role-based login buttons for demo use
- Visitor entry flow

### Dashboard
- Campus parking overview
- Zone summary cards
- Mini parking map and navigation to zone detail

### Guidance
- Preferred parking zone recommendation
- Alternative zone suggestions
- Guidance message derived from shared parking state

### Monitoring
- Zone selection and slot visibility
- Notification banner and status summaries
- Manual refresh action that advances the shared parking state

### Signage
- Full-screen driver-facing parking message display
- Simplified recommended zone and availability messaging

### My Parking
- Current parking session display
- Exit parking flow with visible completion state
- Parking history and summary statistics

### Payment
- Outstanding fee selection
- Payment method selection
- Payment result and receipt modal
- Transaction history

### Admin
- Fee Calculation and Tariffs
  - Current tariff overview
  - Fee calculation action and calculation history
- Bills Management
  - Bill status filters
  - Bill details and payment summary

### Gate Terminal Simulation
- Card access flow
- Temporary entry flow
- Exit payment flow for kiosk-style interaction

### Zone Detail
- Per-zone detail page
- Slot breakdown and occupancy status
- Parking mini map for layout visibility

## Tech Stack

- ReactJS
- Vite
- JavaScript
- React Router DOM
- Axios
- CSS Modules

## Project Structure

```text
parking-frontend/
├─ public/
├─ docs/
│  └─ frontend-demo-prep.md
├─ src/
│  ├─ app/
│  │  ├─ App.jsx
│  │  └─ routes.jsx
│  ├─ components/
│  │  └─ layout/
│  ├─ context/
│  │  ├─ AuthContext.jsx
│  │  └─ ParkingContext.jsx
│  ├─ features/
│  │  ├─ admin/
│  │  ├─ auth/
│  │  ├─ dashboard/
│  │  ├─ guidance/
│  │  ├─ monitoring/
│  │  ├─ parking/
│  │  ├─ signage/
│  │  ├─ terminal/
│  │  └─ zones/
│  ├─ mock/
│  │  ├─ parkingState.js
│  │  ├─ myParkingMock.js
│  │  ├─ paymentMock.js
│  │  ├─ adminBillingMock.js
│  │  └─ gateTerminalMock.js
│  ├─ index.css
│  └─ main.jsx
├─ index.html
├─ package.json
└─ vite.config.js
```

## Architecture Notes

- The frontend follows a feature-based structure to keep pages, hooks, and components grouped by domain.
- Shared layout components provide the authenticated shell, header, and navigation.
- `ParkingContext` acts as the shared parking-state access layer for dashboard, guidance, monitoring, signage, and zone detail.
- The current implementation is mock-data-first, which makes the project easier to run locally and present without backend dependencies.

## Installation

### Prerequisites

- Node.js 18+ recommended
- npm

### Install dependencies

```bash
npm install
```

## Run Locally

### Start the development server

```bash
npm run dev
```

### Create a production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

### Run ESLint

```bash
npm run lint
```

## Demo Accounts

The current frontend includes mock accounts for local testing and demonstrations:

- `student@hcmut.edu.vn` / `student123`
- `staff@hcmut.edu.vn` / `staff123`
- `admin@hcmut.edu.vn` / `admin123`
- `visitor` / `visitor123`

## Demo / Usage Flow

A practical presentation flow for the current implementation:

1. Log in as `visitor` and present the Dashboard, Zone Detail, Guidance, and Signage pages.
2. Log in as `student` and demonstrate My Parking, Exit Parking, and Payment.
3. Log in as `staff` and demonstrate Monitoring with zone switching and refresh.
4. Log in as `admin` and demonstrate Fee Calculation and Bills Management.
5. Open `/terminal` to demonstrate the gate terminal simulation flows.

For a more detailed presentation checklist, see `docs/frontend-demo-prep.md`.

## Routing Overview

Current primary routes in the application:

- `/login`
- `/`
- `/zones/:zoneId`
- `/guidance`
- `/signage`
- `/my-parking`
- `/payment`
- `/monitoring`
- `/fee-calculation`
- `/bills`
- `/terminal`

## Mock Data and Current Limitations

- Authentication is mock-based and stored in `localStorage`.
- Parking availability, guidance, signage, payment, billing, and terminal flows currently rely on local mock data.
- Monitoring is the page that advances the shared parking availability state for other dependent pages.
- Axios is included in the stack, but the current project state is still mock-data-first rather than backend-connected.
- The app is designed for frontend demonstration and interaction flow validation, not production deployment.

## Future Improvements

- Connect the frontend to real parking, billing, and authentication APIs
- Replace mock credentials with secure authentication and authorization flows
- Add automated unit, integration, and end-to-end testing
- Introduce real-time updates with WebSocket or event-based backend messaging
- Improve accessibility coverage and keyboard navigation
- Add analytics, audit logs, and admin reporting features
- Prepare the application for deployment with environment-based configuration

## Acknowledgment

This project was built as a university Software Engineering frontend project to demonstrate structured React development, role-based workflows, and a practical Smart Parking user experience for demo and review.

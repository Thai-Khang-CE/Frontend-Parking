# Frontend Demo Prep

## Assumptions

- The frontend continues to use mock data and local state only.
- Demo accounts come from `src/context/AuthContext.jsx`.
- `/terminal` remains the standalone kiosk simulation route outside the main shell.

## Demo Accounts

- Student: `student@hcmut.edu.vn` / `student123`
- Staff: `staff@hcmut.edu.vn` / `staff123`
- Admin: `admin@hcmut.edu.vn` / `admin123`
- Visitor: `visitor` / `visitor123`

## Manual Testing Checklist

- Login: verify each role can sign in and lands on the correct allowed navigation set.
- Dashboard: verify summary cards, facility map, zone cards, and zone detail navigation render without layout overflow.
- Guidance: verify preferred zone, signage message, and alternative zones render; confirm loading and empty/error states look consistent.
- Monitoring: verify zone switching, refresh action, notification banner, and slot grid update correctly.
- Signage: verify full-screen display, timestamp, and loading/error states are readable at presentation distance.
- My Parking: verify active-session state, no-active-session state, session history, and exit action.
- Payment: verify session selection, partial select-all state, payment method selection, processing state, receipt modal, and no-unpaid state.
- Fee Calculation: verify tariff cards, calculation action, success modal, and history table.
- Bills: verify filter buttons, bill table rows, details modal, and empty filter result state.
- Gate Terminal: verify card access, temporary entry, and temporary exit flows from start to completion.

## Demo Flow Script

1. Login as `visitor` and show the dashboard, zone detail page, guidance page, and signage page.
2. Login as `student` and show `My Parking`, then move into `Payment` to demonstrate unpaid session selection and payment receipt.
3. Login as `staff` and show `Monitoring`, switch zones, and trigger one refresh to demonstrate live updates.
4. Login as `admin` and show `Fee Calculation`, current tariffs, then `Bills` with a detail modal.
5. Open `/terminal` directly and run one quick card access flow plus one temporary exit payment flow.

## Browser Verification

- Run `npm run dev` and verify desktop layouts at approximately `1440px` and `1024px` widths.
- Use responsive mode to verify key pages at `768px` and `390px` widths.
- Smoke-check in Chrome or Edge, then do a second pass in Firefox for layout wrapping, table overflow, and modal behavior.
- Before presenting, run `npm run build` and `npm run lint`.

/**
 * Payment Mock Data
 * Shared mock billing state synchronized with My Parking session history.
 */

import {
  getMyParkingData,
  calculateDurationHours,
  calculateSessionEstimatedFee,
  markMyParkingSessionsPaid,
  PARKING_MONTHLY_RATE,
} from "./myParkingMock";

const paymentStore = new Map();

const cloneDate = (date) => (date ? new Date(date) : null);

const cloneSession = (session) => ({
  ...session,
  entryTime: cloneDate(session.entryTime),
  exitTime: cloneDate(session.exitTime),
  paidAt: cloneDate(session.paidAt),
});

const cloneTransaction = (transaction) => ({
  ...transaction,
  date: cloneDate(transaction.date),
  receipt: transaction.receipt
    ? {
        ...transaction.receipt,
        timestamp: cloneDate(transaction.receipt.timestamp),
      }
    : null,
});

const createInitialExternalSessions = () => [
  {
    id: "session-2024-016",
    zone: "zone-a",
    zoneName: "Zone A",
    slot: "A-08",
    entryTime: new Date("2024-04-17T14:00:00"),
    exitTime: new Date("2024-04-17T17:45:00"),
    duration: 3.75,
    fee: PARKING_MONTHLY_RATE,
    paid: false,
    paymentMethod: null,
  },
  {
    id: "session-2024-015",
    zone: "zone-c",
    zoneName: "Zone C",
    slot: "C-12",
    entryTime: new Date("2024-04-16T08:30:00"),
    exitTime: new Date("2024-04-16T16:20:00"),
    duration: 7.83,
    fee: PARKING_MONTHLY_RATE,
    paid: false,
    paymentMethod: null,
  },
];

const createInitialTransactions = () => [
  {
    id: "txn-2024-001",
    date: new Date("2024-04-20T13:30:00"),
    sessions: ["session-2024-020"],
    amount: PARKING_MONTHLY_RATE,
    paymentMethod: "Credit Card",
    status: "completed",
    transactionId: "TXN-2024-000001",
    receipt: {
      reference: "REC-2024-001",
      timestamp: new Date("2024-04-20T13:30:00"),
      method: "VISA ending in 4242",
    },
  },
  {
    id: "txn-2024-002",
    date: new Date("2024-04-19T14:45:00"),
    sessions: ["session-2024-019"],
    amount: PARKING_MONTHLY_RATE,
    paymentMethod: "Mobile Wallet",
    status: "completed",
    transactionId: "TXN-2024-000002",
    receipt: {
      reference: "REC-2024-002",
      timestamp: new Date("2024-04-19T14:45:00"),
      method: "Momo Wallet",
    },
  },
];

const ensurePaymentStore = (userId = "user-001") => {
  if (!paymentStore.has(userId)) {
    paymentStore.set(userId, {
      externalSessions: createInitialExternalSessions(),
      transactionHistory: createInitialTransactions(),
      lastUpdated: new Date(),
    });
  }

  return paymentStore.get(userId);
};

const compareNewestFirst = (left, right) => {
  const leftTime = new Date(left.exitTime || left.entryTime || 0).getTime();
  const rightTime = new Date(right.exitTime || right.entryTime || 0).getTime();
  return rightTime - leftTime;
};

const buildActiveEstimate = (parkingData) => {
  if (!parkingData.currentSession) {
    return null;
  }

  return {
    sessionId: parkingData.currentSession.id,
    zone: parkingData.currentSession.zone,
    zoneName: parkingData.currentSession.zoneName,
    slot: parkingData.currentSession.slot,
    entryTime: cloneDate(parkingData.currentSession.entryTime),
    duration: calculateDurationHours(parkingData.currentSession.entryTime),
    fee: calculateSessionEstimatedFee(parkingData.currentSession),
    extensionHours: parkingData.currentSession.extensionHours || 0,
  };
};

export const getPaymentData = (userId = "user-001") => {
  const paymentData = ensurePaymentStore(userId);
  const parkingData = getMyParkingData(userId);

  const historyUnpaidSessions = parkingData.history
    .filter((session) => !session.paid)
    .map(cloneSession);

  const externalUnpaidSessions = paymentData.externalSessions
    .filter((session) => !session.paid)
    .map(cloneSession);

  const unpaidSessions = [...historyUnpaidSessions, ...externalUnpaidSessions].sort(
    compareNewestFirst,
  );

  const totalUnpaid = unpaidSessions.reduce(
    (sum, session) => sum + session.fee,
    0,
  );

  const activeEstimate = buildActiveEstimate(parkingData);
  const totalAmountDue = totalUnpaid + (activeEstimate?.fee || 0);

  return {
    userId,
    unpaidSessions,
    totalUnpaid,
    totalAmountDue,
    activeEstimate,
    transactionHistory: paymentData.transactionHistory.map(cloneTransaction),
    lastUpdated: cloneDate(paymentData.lastUpdated),
  };
};

/**
 * Available payment methods
 */
export const PAYMENT_METHODS = [
  {
    id: "credit-card",
    label: "Credit/Debit Card",
    icon: "CC",
    description: "Visa, MasterCard, or other card",
    fee: 0,
    processingTime: "1-2 minutes",
  },
  {
    id: "mobile-wallet",
    label: "Mobile Wallet",
    icon: "APP",
    description: "Momo, ZaloPay, GCash",
    fee: 0,
    processingTime: "1-2 minutes",
  },
  {
    id: "bank-transfer",
    label: "Bank Transfer",
    icon: "BANK",
    description: "Direct bank account transfer",
    fee: 0,
    processingTime: "1-3 business days",
  },
  {
    id: "student-account",
    label: "Deduct from Student Account",
    icon: "ID",
    description: "Deduct from your university account",
    fee: 0,
    processingTime: "Immediate",
  },
];

const getPaymentMethodLabel = (paymentMethod) =>
  PAYMENT_METHODS.find((method) => method.id === paymentMethod)?.label || paymentMethod;

/**
 * Mock payment processing
 * Simulates processing a payment and updates shared payment history.
 */
export const processPayment = async (
  userId = "user-001",
  sessionIds = [],
  amount,
  paymentMethod,
) => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const success = Math.random() < 0.95;

  if (!success) {
    return {
      success: false,
      message:
        "Payment failed. Please check your payment method and try again.",
      error: "PAYMENT_DECLINED",
    };
  }

  const paymentData = ensurePaymentStore(userId);
  const paymentMethodLabel = getPaymentMethodLabel(paymentMethod);
  const timestamp = new Date();
  const transactionId = `TXN-${Date.now()}`;
  const paidSessionIds = new Set(sessionIds);

  markMyParkingSessionsPaid(userId, sessionIds, paymentMethodLabel, timestamp);

  paymentData.externalSessions = paymentData.externalSessions.map((session) => {
    if (!paidSessionIds.has(session.id) || session.paid) {
      return session;
    }

    return {
      ...session,
      paid: true,
      paymentMethod: paymentMethodLabel,
      paidAt: cloneDate(timestamp),
    };
  });

  paymentData.transactionHistory = [
    {
      id: `txn-${Date.now()}`,
      date: cloneDate(timestamp),
      sessions: [...sessionIds],
      amount,
      paymentMethod: paymentMethodLabel,
      status: "completed",
      transactionId,
      receipt: {
        reference: `REC-${Date.now()}`,
        timestamp: cloneDate(timestamp),
        method: paymentMethodLabel,
      },
    },
    ...paymentData.transactionHistory,
  ];

  paymentData.lastUpdated = cloneDate(timestamp);

  return {
    success: true,
    transactionId,
    message: "Payment processed successfully",
    receipt: {
      reference: `REC-${Date.now()}`,
      timestamp,
      method: paymentMethodLabel,
      amount,
    },
  };
};

/**
 * Format currency
 */
export const formatCurrency = (amount, currency = "VND") => {
  if (currency === "VND") {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  }
  return `${currency} ${amount}`;
};

/**
 * Format date
 */
export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

/**
 * Format time only
 */
export const formatTime = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

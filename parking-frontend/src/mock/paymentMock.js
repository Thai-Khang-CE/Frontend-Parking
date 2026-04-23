/**
 * Payment Mock Data
 * Mock payment sessions and transaction history
 */

export const getPaymentData = (userId = 'user-001') => {
  // Get unpaid sessions from My Parking mock
  const unpaidSessions = [
    {
      id: 'session-2024-018',
      zone: 'zone-b',
      zoneName: 'Zone B',
      slot: 'B-15',
      entryTime: new Date('2024-04-18T07:00:00'),
      exitTime: new Date('2024-04-18T18:30:00'),
      duration: 11.5,
      fee: 138000,
      paid: false,
      paymentMethod: null
    },
    // Additional unpaid sessions can be added here
  ];

  // Payment transaction history
  const transactionHistory = [
    {
      id: 'txn-2024-001',
      date: new Date('2024-04-20T13:30:00'),
      sessions: ['session-2024-020'],
      amount: 52000,
      paymentMethod: 'Credit Card',
      status: 'completed',
      transactionId: 'TXN-2024-000001',
      receipt: {
        reference: 'REC-2024-001',
        timestamp: new Date('2024-04-20T13:30:00'),
        method: 'VISA ending in 4242'
      }
    },
    {
      id: 'txn-2024-002',
      date: new Date('2024-04-19T14:45:00'),
      sessions: ['session-2024-019'],
      amount: 48000,
      paymentMethod: 'Mobile Wallet',
      status: 'completed',
      transactionId: 'TXN-2024-000002',
      receipt: {
        reference: 'REC-2024-002',
        timestamp: new Date('2024-04-19T14:45:00'),
        method: 'Momo Wallet'
      }
    }
  ];

  const totalUnpaid = unpaidSessions.reduce((sum, session) => sum + session.fee, 0);

  return {
    userId,
    unpaidSessions,
    totalUnpaid,
    transactionHistory,
    lastUpdated: new Date()
  };
};

/**
 * Available payment methods
 */
export const PAYMENT_METHODS = [
  {
    id: 'credit-card',
    label: 'Credit/Debit Card',
    icon: '💳',
    description: 'Visa, MasterCard, or other card',
    fee: 0,
    processingTime: '1-2 minutes'
  },
  {
    id: 'mobile-wallet',
    label: 'Mobile Wallet',
    icon: '📱',
    description: 'Momo, ZaloPay, GCash',
    fee: 0,
    processingTime: '1-2 minutes'
  },
  {
    id: 'bank-transfer',
    label: 'Bank Transfer',
    icon: '🏦',
    description: 'Direct bank account transfer',
    fee: 0,
    processingTime: '1-3 business days'
  },
  {
    id: 'student-account',
    label: 'Deduct from Student Account',
    icon: '🎓',
    description: 'Deduct from your university account',
    fee: 0,
    processingTime: 'Immediate'
  }
];

/**
 * Mock payment processing
 * Simulates processing a payment and returns success/failure
 */
export const processPayment = async (amount, paymentMethod) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock: 95% success rate
  const success = Math.random() < 0.95;

  if (success) {
    return {
      success: true,
      transactionId: `TXN-${Date.now()}`,
      message: 'Payment processed successfully',
      receipt: {
        reference: `REC-${Date.now()}`,
        timestamp: new Date(),
        method: paymentMethod,
        amount
      }
    };
  } else {
    return {
      success: false,
      message: 'Payment failed. Please check your payment method and try again.',
      error: 'PAYMENT_DECLINED'
    };
  }
};

/**
 * Format currency
 */
export const formatCurrency = (amount, currency = 'VND') => {
  if (currency === 'VND') {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  }
  return `${currency} ${amount}`;
};

/**
 * Format date
 */
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

/**
 * Format time only
 */
export const formatTime = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

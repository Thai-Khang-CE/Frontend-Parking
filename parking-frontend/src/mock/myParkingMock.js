/**
 * My Parking Mock Data
 * Mock user parking sessions and history
 */

export const getMyParkingData = (userId = 'user-001') => {
  // Mock current session (active parking)
  const currentSession = {
    id: 'session-2024-001',
    status: 'active',
    zone: 'zone-b',
    zoneName: 'Zone B',
    slot: 'B-12',
    vehicle: {
      make: 'Honda',
      model: 'Civic',
      licensePlate: 'ABC-1234',
      color: 'Silver'
    },
    entryTime: new Date(new Date().getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
    estimatedFee: 45000, // in VND
    currency: 'VND',
    notes: 'Covered parking, near entrance'
  };

  // Mock parking history
  const parkingHistory = [
    {
      id: 'session-2024-020',
      status: 'completed',
      zone: 'zone-c',
      zoneName: 'Zone C',
      slot: 'C-08',
      vehicle: {
        make: 'Honda',
        model: 'Civic',
        licensePlate: 'ABC-1234',
        color: 'Silver'
      },
      entryTime: new Date('2024-04-20T08:30:00'),
      exitTime: new Date('2024-04-20T12:45:00'),
      duration: 4.25, // hours
      fee: 52000,
      paid: true,
      paymentMethod: 'Credit Card'
    },
    {
      id: 'session-2024-019',
      status: 'completed',
      zone: 'zone-a',
      zoneName: 'Zone A',
      slot: 'A-05',
      vehicle: {
        make: 'Honda',
        model: 'Civic',
        licensePlate: 'ABC-1234',
        color: 'Silver'
      },
      entryTime: new Date('2024-04-19T10:15:00'),
      exitTime: new Date('2024-04-19T14:20:00'),
      duration: 4.08, // hours
      fee: 48000,
      paid: true,
      paymentMethod: 'Mobile Wallet'
    },
    {
      id: 'session-2024-018',
      status: 'completed',
      zone: 'zone-b',
      zoneName: 'Zone B',
      slot: 'B-15',
      vehicle: {
        make: 'Honda',
        model: 'Civic',
        licensePlate: 'ABC-1234',
        color: 'Silver'
      },
      entryTime: new Date('2024-04-18T07:00:00'),
      exitTime: new Date('2024-04-18T18:30:00'),
      duration: 11.5, // hours
      fee: 138000,
      paid: false,
      paymentMethod: null
    },
    {
      id: 'session-2024-017',
      status: 'completed',
      zone: 'zone-d',
      zoneName: 'Zone D',
      slot: 'D-10',
      vehicle: {
        make: 'Honda',
        model: 'Civic',
        licensePlate: 'ABC-1234',
        color: 'Silver'
      },
      entryTime: new Date('2024-04-17T09:45:00'),
      exitTime: new Date('2024-04-17T13:10:00'),
      duration: 3.42, // hours
      fee: 36000,
      paid: true,
      paymentMethod: 'Credit Card'
    }
  ];

  return {
    userId,
    currentSession: currentSession.status === 'active' ? currentSession : null,
    history: parkingHistory,
    totalPaid: parkingHistory.filter(s => s.paid).reduce((sum, s) => sum + s.fee, 0),
    totalUnpaid: parkingHistory.filter(s => !s.paid).reduce((sum, s) => sum + s.fee, 0),
    lastUpdated: new Date()
  };
};

/**
 * Calculate elapsed time in human-readable format
 */
export const calculateElapsedTime = (entryTime) => {
  const now = new Date();
  const elapsedMs = now - new Date(entryTime);
  const elapsedHours = Math.floor(elapsedMs / (1000 * 60 * 60));
  const elapsedMinutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (elapsedHours > 0) {
    return `${elapsedHours}h ${elapsedMinutes}m`;
  }
  return `${elapsedMinutes}m`;
};

/**
 * Calculate estimated fee based on duration and rate
 * Mock rate: 10,000 VND per hour
 */
export const calculateEstimatedFee = (entryTime, hourlyRate = 10000) => {
  const now = new Date();
  const elapsedMs = now - new Date(entryTime);
  const elapsedHours = elapsedMs / (1000 * 60 * 60);
  const roundedHours = Math.ceil(elapsedHours);
  return roundedHours * hourlyRate;
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

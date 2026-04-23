/**
 * My Parking Mock Data
 * Shared in-memory store for active parking session and parking history.
 */

export const PARKING_HOURLY_RATE = 10000;
export const EXTEND_INCREMENT_HOURS = 1;

const parkingStore = new Map();

const cloneDate = (date) => (date ? new Date(date) : null);

const cloneVehicle = (vehicle) => ({
  ...vehicle,
});

const cloneSession = (session) => {
  if (!session) {
    return null;
  }

  return {
    ...session,
    vehicle: cloneVehicle(session.vehicle),
    entryTime: cloneDate(session.entryTime),
    exitTime: cloneDate(session.exitTime),
    extendedUntil: cloneDate(session.extendedUntil),
  };
};

const cloneParkingData = (data) => ({
  ...data,
  currentSession: cloneSession(data.currentSession),
  history: data.history.map(cloneSession),
  lastUpdated: cloneDate(data.lastUpdated),
});

const createInitialCurrentSession = () => ({
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
  entryTime: new Date(new Date().getTime() - 2 * 60 * 60 * 1000),
  estimatedFee: 45000,
  currency: 'VND',
  notes: 'Covered parking, near entrance',
  extensionHours: 0,
  extendedUntil: null
});

const createInitialParkingHistory = () => ([
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
    duration: 4.25,
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
    duration: 4.08,
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
    duration: 11.5,
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
    duration: 3.42,
    fee: 36000,
    paid: true,
    paymentMethod: 'Credit Card'
  }
]);

const createInitialParkingData = (userId = 'user-001') => {
  const history = createInitialParkingHistory();

  return {
    userId,
    currentSession: createInitialCurrentSession(),
    history,
    totalPaid: history.filter((session) => session.paid).reduce((sum, session) => sum + session.fee, 0),
    totalUnpaid: history.filter((session) => !session.paid).reduce((sum, session) => sum + session.fee, 0),
    lastUpdated: new Date()
  };
};

const ensureParkingData = (userId = 'user-001') => {
  if (!parkingStore.has(userId)) {
    parkingStore.set(userId, createInitialParkingData(userId));
  }

  return parkingStore.get(userId);
};

export const getMyParkingData = (userId = 'user-001') => {
  return cloneParkingData(ensureParkingData(userId));
};

export const getParkingSlotStateId = (zoneId, slotLabel) => {
  const slotNumber = Number.parseInt(String(slotLabel).split('-').pop(), 10);

  if (!zoneId || Number.isNaN(slotNumber) || slotNumber < 1) {
    return null;
  }

  return `${zoneId}-slot-${slotNumber}`;
};

/**
 * Calculate raw duration in hours
 */
export const calculateDurationHours = (entryTime, endTime = new Date()) => {
  const start = new Date(entryTime);
  const end = new Date(endTime);
  const elapsedMs = Math.max(0, end - start);
  return Number((elapsedMs / (1000 * 60 * 60)).toFixed(2));
};

/**
 * Calculate elapsed time in human-readable format
 */
export const calculateElapsedTime = (entryTime, endTime = new Date()) => {
  const elapsedMs = Math.max(0, new Date(endTime) - new Date(entryTime));
  const elapsedHours = Math.floor(elapsedMs / (1000 * 60 * 60));
  const elapsedMinutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));

  if (elapsedHours > 0) {
    return `${elapsedHours}h ${elapsedMinutes}m`;
  }
  return `${elapsedMinutes}m`;
};

/**
 * Calculate estimated fee based on duration and rate
 */
export const calculateEstimatedFee = (entryTime, hourlyRate = PARKING_HOURLY_RATE, endTime = new Date()) => {
  const elapsedMs = Math.max(0, new Date(endTime) - new Date(entryTime));
  const elapsedHours = elapsedMs / (1000 * 60 * 60);
  const roundedHours = Math.ceil(elapsedHours);
  return roundedHours * hourlyRate;
};

export const calculateSessionEstimatedFee = (session, endTime = new Date()) => {
  const baseFee = calculateEstimatedFee(session.entryTime, PARKING_HOURLY_RATE, endTime);
  const extensionCharge = (session.extensionHours || 0) * PARKING_HOURLY_RATE;
  return baseFee + extensionCharge;
};

export const exitMyParkingSession = (userId = 'user-001', exitTime = new Date()) => {
  const parkingData = ensureParkingData(userId);

  if (!parkingData.currentSession) {
    return null;
  }

  const activeSession = parkingData.currentSession;
  const fee = calculateSessionEstimatedFee(activeSession, exitTime);
  const completedSession = {
    ...cloneSession(activeSession),
    status: 'completed',
    exitTime: cloneDate(exitTime),
    duration: calculateDurationHours(activeSession.entryTime, exitTime),
    durationLabel: calculateElapsedTime(activeSession.entryTime, exitTime),
    fee,
    estimatedFee: fee,
    paid: false
  };

  parkingData.currentSession = null;
  parkingData.history = [completedSession, ...parkingData.history];
  parkingData.totalUnpaid += fee;
  parkingData.lastUpdated = cloneDate(exitTime);

  return cloneSession(completedSession);
};

export const extendMyParkingSession = (
  userId = 'user-001',
  addedHours = EXTEND_INCREMENT_HOURS,
  updatedAt = new Date()
) => {
  const parkingData = ensureParkingData(userId);

  if (!parkingData.currentSession) {
    return null;
  }

  const activeSession = parkingData.currentSession;
  const extensionBaseTime = activeSession.extendedUntil
    ? new Date(activeSession.extendedUntil)
    : new Date(updatedAt);

  activeSession.extensionHours = (activeSession.extensionHours || 0) + addedHours;
  activeSession.extendedUntil = new Date(
    extensionBaseTime.getTime() + addedHours * 60 * 60 * 1000
  );
  activeSession.estimatedFee = calculateSessionEstimatedFee(activeSession, updatedAt);
  parkingData.lastUpdated = cloneDate(updatedAt);

  return cloneSession(activeSession);
};

export const markMyParkingSessionsPaid = (
  userId = 'user-001',
  sessionIds = [],
  paymentMethod = null,
  paidAt = new Date()
) => {
  const parkingData = ensureParkingData(userId);
  const sessionIdSet = new Set(sessionIds);
  let paidAmount = 0;
  let paidCount = 0;

  parkingData.history = parkingData.history.map((session) => {
    if (!sessionIdSet.has(session.id) || session.paid) {
      return session;
    }

    paidAmount += session.fee || 0;
    paidCount += 1;

    return {
      ...session,
      paid: true,
      paymentMethod: paymentMethod || session.paymentMethod || null,
      paidAt: cloneDate(paidAt),
    };
  });

  if (paidAmount > 0) {
    parkingData.totalPaid += paidAmount;
    parkingData.totalUnpaid = Math.max(0, parkingData.totalUnpaid - paidAmount);
    parkingData.lastUpdated = cloneDate(paidAt);
  }

  return {
    paidAmount,
    paidCount,
  };
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

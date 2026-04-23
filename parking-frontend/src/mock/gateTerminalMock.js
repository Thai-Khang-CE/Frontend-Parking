/**
 * Gate Terminal Mock Data
 * Mock data for parking gate terminal operations
 * Simulates card access, temporary entry, and temporary exit flows
 */

const MOCK_CARDS = {
  "ID-001-2024": {
    name: "Nguyen Van A",
    type: "Student",
    status: "active",
    zone: "zone-a",
  },
  "ID-002-2024": {
    name: "Tran Thi B",
    type: "Staff",
    status: "active",
    zone: "zone-b",
  },
  "ID-003-2024": {
    name: "Pham Minh C",
    type: "Student",
    status: "active",
    zone: "zone-c",
  },
  "ID-004-2024": {
    name: "Le Quoc D",
    type: "Staff",
    status: "suspended",
    zone: null,
  },
  "ID-005-2024": {
    name: "Hoang Huong E",
    type: "Visitor",
    status: "active",
    zone: "zone-a",
  },
};

const PARKING_ZONES = [
  { id: "zone-a", name: "Zone A", capacity: 150, occupied: 120 },
  { id: "zone-b", name: "Zone B", capacity: 200, occupied: 180 },
  { id: "zone-c", name: "Zone C", capacity: 100, occupied: 95 },
];

const TEMP_PASS_VALIDITY_HOURS = 24;
const TEMP_RATE_PER_HOUR = 12000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const addHours = (date, hours) =>
  new Date(new Date(date).getTime() + hours * 60 * 60 * 1000);

const cloneDate = (date) => new Date(date);

const cloneSessionRecord = (record) => ({
  ...record,
  issueTime: cloneDate(record.issueTime),
  expiryTime: cloneDate(record.expiryTime),
  entryTime: cloneDate(record.entryTime),
  exitTime: record.exitTime ? cloneDate(record.exitTime) : null,
});

const calculateDurationHours = (entryTime, endTime = new Date()) => {
  const elapsedHours =
    (new Date(endTime).getTime() - new Date(entryTime).getTime()) /
    (1000 * 60 * 60);

  return Number(Math.max(0.01, elapsedHours).toFixed(2));
};

const calculateEstimatedFee = (entryTime, endTime = new Date()) => {
  const billedHours = Math.max(
    1,
    Math.ceil(calculateDurationHours(entryTime, endTime)),
  );

  return billedHours * TEMP_RATE_PER_HOUR;
};

const buildSessionSummary = (record, endTime = new Date()) => ({
  ...cloneSessionRecord(record),
  duration: calculateDurationHours(record.entryTime, endTime),
  estimatedFee: calculateEstimatedFee(record.entryTime, endTime),
});

const createSeededTemporarySession = ({
  ticketNumber,
  visitorName,
  visitorEmail,
  visitorPhone,
  zone,
  zoneName,
  hoursAgo,
  sessionId,
}) => {
  const entryTime = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

  return {
    ticketNumber,
    visitorName,
    visitorEmail,
    visitorPhone,
    zone,
    zoneName,
    issueTime: cloneDate(entryTime),
    expiryTime: addHours(entryTime, TEMP_PASS_VALIDITY_HOURS),
    sessionId,
    entryTime,
    status: "active",
    printable: true,
  };
};

const TEMPORARY_SESSIONS = {
  "TMP-12345678": createSeededTemporarySession({
    ticketNumber: "TMP-12345678",
    visitorName: "John Doe",
    visitorEmail: "john.doe@example.com",
    visitorPhone: "+84 912 345 678",
    zone: "zone-a",
    zoneName: "Zone A",
    hoursAgo: 2,
    sessionId: "SESSION-001",
  }),
  "TMP-87654321": createSeededTemporarySession({
    ticketNumber: "TMP-87654321",
    visitorName: "Jane Smith",
    visitorEmail: "jane.smith@example.com",
    visitorPhone: "+84 933 456 789",
    zone: "zone-b",
    zoneName: "Zone B",
    hoursAgo: 5,
    sessionId: "SESSION-002",
  }),
};

const generateTicketNumber = () => {
  let ticketNumber = "";

  do {
    const suffix = `${Date.now().toString().slice(-6)}${Math.floor(
      Math.random() * 90 + 10,
    )}`;
    ticketNumber = `TMP-${suffix}`;
  } while (TEMPORARY_SESSIONS[ticketNumber]);

  return ticketNumber;
};

const findTemporarySessionById = (sessionId) =>
  Object.values(TEMPORARY_SESSIONS).find(
    (session) => session.sessionId === sessionId,
  );

export const validateCard = async (cardId) => {
  await wait(1500);

  if (MOCK_CARDS[cardId]) {
    const cardInfo = MOCK_CARDS[cardId];
    if (cardInfo.status === "suspended") {
      return {
        valid: false,
        cardId,
        reason: "Card suspended - contact parking office",
      };
    }

    const zone = PARKING_ZONES.find((z) => z.id === cardInfo.zone);
    const hasSpace = zone && zone.occupied < zone.capacity;

    if (!hasSpace) {
      return {
        valid: false,
        cardId,
        name: cardInfo.name,
        reason: "Assigned zone is full",
      };
    }

    return {
      valid: true,
      cardId,
      name: cardInfo.name,
      type: cardInfo.type,
      zone: cardInfo.zone,
      zoneName: zone?.name,
      availableSlots: zone?.capacity - zone?.occupied,
      timestamp: new Date(),
    };
  }

  return {
    valid: false,
    cardId,
    reason: "Invalid card ID",
  };
};

export const processEntry = async (cardId, cardInfo) => {
  await wait(1000);

  return {
    success: true,
    cardId,
    sessionId: `SESSION-${Date.now()}`,
    entryTime: new Date(),
    message: `Welcome ${cardInfo.name}!`,
    gateStatus: "OPEN",
    accessCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
  };
};

export const issueTemporaryPass = async (
  visitorName,
  visitorEmail,
  visitorPhone,
) => {
  await wait(2000);

  const issuedAt = new Date();
  const ticketNumber = generateTicketNumber();
  const sessionId = `SESSION-${issuedAt.getTime()}-${Math.floor(
    Math.random() * 900 + 100,
  )}`;

  const passRecord = {
    ticketNumber,
    visitorName,
    visitorEmail,
    visitorPhone,
    issueTime: issuedAt,
    expiryTime: addHours(issuedAt, TEMP_PASS_VALIDITY_HOURS),
    zone: "zone-a",
    zoneName: "Zone A",
    sessionId,
    entryTime: cloneDate(issuedAt),
    status: "active",
    printable: true,
  };

  TEMPORARY_SESSIONS[ticketNumber] = passRecord;

  return {
    success: true,
    ...cloneSessionRecord(passRecord),
    message: "Temporary pass issued. Valid for 24 hours.",
  };
};

export const retrieveSession = async (ticketNumber) => {
  await wait(1200);

  const normalizedTicket = ticketNumber.trim().toUpperCase();
  const sessionRecord = TEMPORARY_SESSIONS[normalizedTicket];

  if (!sessionRecord) {
    return {
      success: false,
      reason: "Ticket not found",
    };
  }

  if (sessionRecord.status === "closed") {
    return {
      success: false,
      reason: "Ticket has already been used for exit",
    };
  }

  if (new Date() > sessionRecord.expiryTime) {
    return {
      success: false,
      reason: "Ticket has expired",
    };
  }

  return {
    success: true,
    session: buildSessionSummary(sessionRecord),
  };
};

export const processExitPayment = async (sessionId, amount, paymentMethod) => {
  await wait(1800);

  const sessionRecord = findTemporarySessionById(sessionId);

  if (!sessionRecord) {
    return {
      success: false,
      error: "Active temporary session not found",
    };
  }

  if (sessionRecord.status === "closed") {
    return {
      success: false,
      error: "This ticket has already been processed",
    };
  }

  const success = Math.random() < 0.92;

  if (success) {
    const timestamp = new Date();
    const paymentMethodLabel =
      EXIT_PAYMENT_METHODS.find((method) => method.id === paymentMethod)
        ?.label || paymentMethod;

    sessionRecord.status = "closed";
    sessionRecord.exitTime = timestamp;
    sessionRecord.paymentMethod = paymentMethodLabel;
    sessionRecord.paidAmount = amount;

    return {
      success: true,
      sessionId,
      ticketNumber: sessionRecord.ticketNumber,
      transactionId: `TXN-${Date.now()}`,
      amount,
      paymentMethod: paymentMethodLabel,
      timestamp,
      receipt: {
        reference: `REC-${Date.now().toString().slice(-6)}`,
        message: "Payment processed successfully",
        gateStatus: "OPENING",
      },
    };
  }

  return {
    success: false,
    error: "Payment processing failed. Please try again.",
  };
};

export const getAvailableZones = () => {
  return PARKING_ZONES.map((zone) => ({
    ...zone,
    occupancyPercent: Math.round((zone.occupied / zone.capacity) * 100),
    availableSlots: zone.capacity - zone.occupied,
  }));
};

export const EXIT_PAYMENT_METHODS = [
  { id: "card", label: "Credit Card", icon: "CC", available: true },
  { id: "mobile", label: "Mobile Wallet", icon: "APP", available: true },
  { id: "cash", label: "Cash", icon: "$", available: true },
];

export const getGateStatus = () => {
  return {
    gateId: "GATE-001",
    location: "Main Parking Entrance",
    status: "operational",
    lastSync: new Date(),
    operatingHours: "24/7",
    zones: getAvailableZones(),
  };
};

export const getRecentEntries = () => {
  return [
    {
      time: new Date(Date.now() - 5 * 60000),
      name: "User 1",
      type: "Card",
      zone: "Zone A",
    },
    {
      time: new Date(Date.now() - 12 * 60000),
      name: "User 2",
      type: "Temporary",
      zone: "Zone B",
    },
    {
      time: new Date(Date.now() - 28 * 60000),
      name: "User 3",
      type: "Card",
      zone: "Zone C",
    },
  ];
};

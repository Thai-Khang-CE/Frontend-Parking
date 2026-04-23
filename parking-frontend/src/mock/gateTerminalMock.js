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

export const validateCard = async (cardId) => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

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
  await new Promise((resolve) => setTimeout(resolve, 1000));

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
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const ticketNumber = `TMP-${Date.now().toString().slice(-8)}`;
  const expiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000);

  return {
    success: true,
    ticketNumber,
    visitorName,
    visitorEmail,
    visitorPhone,
    issueTime: new Date(),
    expiryTime,
    zone: "zone-a",
    zoneName: "Zone A",
    sessionId: `SESSION-${Date.now()}`,
    entryTime: new Date(),
    message: "Temporary pass issued. Valid for 24 hours.",
    printable: true,
  };
};

export const retrieveSession = async (ticketNumber) => {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const sessions = {
    "TMP-12345678": {
      ticketNumber: "TMP-12345678",
      visitorName: "John Doe",
      entryTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      zone: "zone-a",
      zoneName: "Zone A",
      duration: 2,
      estimatedFee: 24000,
      status: "active",
      sessionId: "SESSION-001",
    },
    "TMP-87654321": {
      ticketNumber: "TMP-87654321",
      visitorName: "Jane Smith",
      entryTime: new Date(Date.now() - 5 * 60 * 60 * 1000),
      zone: "zone-b",
      zoneName: "Zone B",
      duration: 5,
      estimatedFee: 60000,
      status: "active",
      sessionId: "SESSION-002",
    },
  };

  if (sessions[ticketNumber]) {
    return {
      success: true,
      session: sessions[ticketNumber],
    };
  }

  return {
    success: false,
    reason: "Ticket not found or expired",
  };
};

export const processExitPayment = async (sessionId, amount, paymentMethod) => {
  await new Promise((resolve) => setTimeout(resolve, 1800));

  const success = Math.random() < 0.92;

  if (success) {
    return {
      success: true,
      sessionId,
      transactionId: `TXN-${Date.now()}`,
      amount,
      paymentMethod,
      timestamp: new Date(),
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

/**
 * Gate Terminal Mock Data
 * Mock data for parking gate terminal operations
 * Simulates card access, temporary entry, and temporary exit flows
 */

/**
 * Mock card database - valid university IDs
 */
const MOCK_CARDS = {
  "ID-001-2024": {
    name: "Nguyễn Văn A",
    type: "Student",
    status: "active",
    zone: "zone-a",
  },
  "ID-002-2024": {
    name: "Trần Thị B",
    type: "Staff",
    status: "active",
    zone: "zone-b",
  },
  "ID-003-2024": {
    name: "Phạm Minh C",
    type: "Student",
    status: "active",
    zone: "zone-c",
  },
  "ID-004-2024": {
    name: "Lê Quốc D",
    type: "Staff",
    status: "suspended",
    zone: null,
  },
  "ID-005-2024": {
    name: "Hoàng Hương E",
    type: "Visitor",
    status: "active",
    zone: "zone-a",
  },
};

/**
 * Mock parking zones
 */
const PARKING_ZONES = [
  { id: "zone-a", name: "Zone A", capacity: 150, occupied: 120 },
  { id: "zone-b", name: "Zone B", capacity: 200, occupied: 180 },
  { id: "zone-c", name: "Zone C", capacity: 100, occupied: 95 },
];

/**
 * Validate card and return card info
 */
export const validateCard = async (cardId) => {
  // Simulate card reader delay
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

    // Find zone availability
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

/**
 * Process entry after successful card validation
 */
export const processEntry = async (cardId, cardInfo) => {
  // Simulate gate opening
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

/**
 * Issue temporary access pass for visitor
 */
export const issueTemporaryPass = async (
  visitorName,
  visitorEmail,
  visitorPhone,
) => {
  // Simulate ticket printing
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const ticketNumber = `TMP-${Date.now().toString().slice(-8)}`;
  const expiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

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
    message: `Temporary pass issued. Valid for 24 hours.`,
    printable: true,
  };
};

/**
 * Retrieve parking session by ticket
 */
export const retrieveSession = async (ticketNumber) => {
  // Simulate ticket reader
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Mock session data
  const sessions = {
    "TMP-12345678": {
      ticketNumber: "TMP-12345678",
      visitorName: "John Doe",
      entryTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      zone: "zone-a",
      zoneName: "Zone A",
      duration: 2, // hours
      estimatedFee: 24000, // 2 * 12000 per hour
      status: "active",
      sessionId: "SESSION-001",
    },
    "TMP-87654321": {
      ticketNumber: "TMP-87654321",
      visitorName: "Jane Smith",
      entryTime: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      zone: "zone-b",
      zoneName: "Zone B",
      duration: 5,
      estimatedFee: 60000, // 5 * 12000 per hour (capped at daily max)
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

/**
 * Process exit payment
 */
export const processExitPayment = async (sessionId, amount, paymentMethod) => {
  // Simulate payment processing
  await new Promise((resolve) => setTimeout(resolve, 1800));

  // Mock: 92% success rate
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

/**
 * Get available zones with occupancy
 */
export const getAvailableZones = () => {
  return PARKING_ZONES.map((zone) => ({
    ...zone,
    occupancyPercent: Math.round((zone.occupied / zone.capacity) * 100),
    availableSlots: zone.capacity - zone.occupied,
  }));
};

/**
 * Mock payment methods for exit
 */
export const EXIT_PAYMENT_METHODS = [
  { id: "card", label: "Credit Card", icon: "💳", available: true },
  { id: "mobile", label: "Mobile Wallet", icon: "📱", available: true },
  { id: "cash", label: "Cash", icon: "💵", available: true },
];

/**
 * Get gate terminal status
 */
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

/**
 * Mock successful entry history
 */
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

/**
 * Admin Billing Mock Data
 * Mock data for billing cycles, bills, tariffs, and fee calculations
 */

/**
 * Tariff structure for parking fees
 */
export const getCurrentTariffs = () => {
  return {
    billingCycle: {
      startDate: new Date("2024-04-01"),
      endDate: new Date("2024-04-30"),
      periodLabel: "April 2024",
    },
    tariffs: [
      {
        id: "tariff-zone-a",
        zoneName: "Zone A",
        monthlyRate: 900000, // VND
        dailyMax: 100000,
        description: "Premium parking near main campus",
        capacity: 150,
      },
      {
        id: "tariff-zone-b",
        zoneName: "Zone B",
        monthlyRate: 800000,
        dailyMax: 100000,
        description: "Standard parking near library",
        capacity: 200,
      },
      {
        id: "tariff-zone-c",
        zoneName: "Zone C",
        monthlyRate: 650000,
        dailyMax: 80000,
        description: "Economy parking near sports complex",
        capacity: 100,
      },
    ],
    specialRates: [
      {
        id: "special-monthly",
        name: "Monthly Pass",
        price: 800000,
        description: "Unlimited parking for entire month",
        benefits: ["Unlimited entries", "All zones", "Priority support"],
      },
      {
        id: "special-staff",
        name: "Staff Benefit",
        price: 600000,
        description: "Discounted monthly rate for staff members",
        benefits: ["25% off standard monthly rates", "Priority support"],
      },
    ],
    lastUpdated: new Date("2024-04-20"),
  };
};

/**
 * Generate mock bills for a billing cycle
 */
export const getBillingData = (billingCycleId = "cycle-2024-04") => {
  const bills = [
    {
      id: "bill-2024-001",
      billNumber: "BL-2024-00001",
      userId: "user-001",
      userName: "Nguyễn Văn A",
      email: "user001@hcmut.edu.vn",
      userType: "Student",
      billingCycle: "April 2024",
      generatedDate: new Date("2024-05-01"),
      dueDate: new Date("2024-05-15"),
      sessionsCount: 15,
      totalFee: 538000,
      paidAmount: 0,
      status: "unpaid",
      paymentStatus: "pending",
      createdAt: new Date("2024-05-01"),
    },
    {
      id: "bill-2024-002",
      billNumber: "BL-2024-00002",
      userId: "user-002",
      userName: "Trần Thị B",
      email: "user002@hcmut.edu.vn",
      userType: "Staff",
      billingCycle: "April 2024",
      generatedDate: new Date("2024-05-01"),
      dueDate: new Date("2024-05-15"),
      sessionsCount: 22,
      totalFee: 724000,
      paidAmount: 724000,
      status: "paid",
      paymentStatus: "completed",
      paidDate: new Date("2024-05-10"),
      paymentMethod: "Bank Transfer",
      createdAt: new Date("2024-05-01"),
    },
    {
      id: "bill-2024-003",
      billNumber: "BL-2024-00003",
      userId: "user-003",
      userName: "Phạm Minh C",
      email: "user003@hcmut.edu.vn",
      userType: "Student",
      billingCycle: "April 2024",
      generatedDate: new Date("2024-05-01"),
      dueDate: new Date("2024-05-15"),
      sessionsCount: 8,
      totalFee: 245000,
      paidAmount: 100000,
      status: "partial",
      paymentStatus: "partial",
      lastPaymentDate: new Date("2024-05-08"),
      lastPaymentAmount: 100000,
      createdAt: new Date("2024-05-01"),
    },
    {
      id: "bill-2024-004",
      billNumber: "BL-2024-00004",
      userId: "user-004",
      userName: "Lê Quốc D",
      email: "user004@hcmut.edu.vn",
      userType: "Staff",
      billingCycle: "April 2024",
      generatedDate: new Date("2024-05-01"),
      dueDate: new Date("2024-05-15"),
      sessionsCount: 18,
      totalFee: 612000,
      paidAmount: 0,
      status: "unpaid",
      paymentStatus: "pending",
      createdAt: new Date("2024-05-01"),
    },
    {
      id: "bill-2024-005",
      billNumber: "BL-2024-00005",
      userId: "user-005",
      userName: "Hoàng Hương E",
      email: "user005@hcmut.edu.vn",
      userType: "Student",
      billingCycle: "April 2024",
      generatedDate: new Date("2024-05-01"),
      dueDate: new Date("2024-05-15"),
      sessionsCount: 12,
      totalFee: 428000,
      paidAmount: 428000,
      status: "paid",
      paymentStatus: "completed",
      paidDate: new Date("2024-05-05"),
      paymentMethod: "Credit Card",
      createdAt: new Date("2024-05-01"),
    },
    {
      id: "bill-2024-006",
      billNumber: "BL-2024-00006",
      userId: "user-006",
      userName: "Vũ Thanh F",
      email: "user006@hcmut.edu.vn",
      userType: "Staff",
      billingCycle: "April 2024",
      generatedDate: new Date("2024-05-01"),
      dueDate: new Date("2024-05-15"),
      sessionsCount: 25,
      totalFee: 890000,
      paidAmount: 0,
      status: "unpaid",
      paymentStatus: "pending",
      createdAt: new Date("2024-05-01"),
    },
    {
      id: "bill-2024-007",
      billNumber: "BL-2024-00007",
      userId: "user-007",
      userName: "Đặng Ngọc G",
      email: "user007@hcmut.edu.vn",
      userType: "Student",
      billingCycle: "April 2024",
      generatedDate: new Date("2024-05-01"),
      dueDate: new Date("2024-05-15"),
      sessionsCount: 10,
      totalFee: 356000,
      paidAmount: 356000,
      status: "paid",
      paymentStatus: "completed",
      paidDate: new Date("2024-05-12"),
      paymentMethod: "Mobile Wallet",
      createdAt: new Date("2024-05-01"),
    },
    {
      id: "bill-2024-008",
      billNumber: "BL-2024-00008",
      userId: "user-008",
      userName: "Bùi Thảo H",
      email: "user008@hcmut.edu.vn",
      userType: "Staff",
      billingCycle: "April 2024",
      generatedDate: new Date("2024-05-01"),
      dueDate: new Date("2024-05-15"),
      sessionsCount: 20,
      totalFee: 745000,
      paidAmount: 0,
      status: "unpaid",
      paymentStatus: "pending",
      createdAt: new Date("2024-05-01"),
    },
  ];

  // Calculate statistics
  const stats = {
    totalBills: bills.length,
    totalGenerated: bills.reduce((sum, b) => sum + b.totalFee, 0),
    totalPaid: bills
      .filter((b) => b.status === "paid")
      .reduce((sum, b) => sum + b.paidAmount, 0),
    totalUnpaid: bills
      .filter((b) => b.status === "unpaid" || b.status === "partial")
      .reduce((sum, b) => sum + (b.totalFee - b.paidAmount), 0),
    paidCount: bills.filter((b) => b.status === "paid").length,
    unpaidCount: bills.filter((b) => b.status === "unpaid").length,
    partialCount: bills.filter((b) => b.status === "partial").length,
  };

  return {
    billingCycleId,
    billingCycle: "April 2024",
    bills,
    stats,
    lastUpdated: new Date(),
  };
};

/**
 * Mock fee calculation result
 */
export const runFeeCalculation = async (billingCycleId = "cycle-2024-04") => {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    success: true,
    billingCycleId,
    billingCycle: "April 2024",
    message: "Fee calculation completed successfully",
    details: {
      totalUsersProcessed: 87,
      totalSessionsCalculated: 1243,
      totalFeesGenerated: 45890000,
      billsGenerated: 87,
      timestamp: new Date(),
    },
  };
};

/**
 * Get calculation history
 */
export const getCalculationHistory = () => {
  return [
    {
      id: "calc-2024-04",
      billingCycle: "April 2024",
      ranDate: new Date("2024-05-01T10:30:00"),
      usersProcessed: 87,
      sessionsCalculated: 1243,
      totalFees: 45890000,
      billsGenerated: 87,
      status: "completed",
    },
    {
      id: "calc-2024-03",
      billingCycle: "March 2024",
      ranDate: new Date("2024-04-01T10:45:00"),
      usersProcessed: 85,
      sessionsCalculated: 1156,
      totalFees: 42350000,
      billsGenerated: 85,
      status: "completed",
    },
    {
      id: "calc-2024-02",
      billingCycle: "February 2024",
      ranDate: new Date("2024-03-01T11:15:00"),
      usersProcessed: 82,
      sessionsCalculated: 1089,
      totalFees: 39780000,
      billsGenerated: 82,
      status: "completed",
    },
  ];
};

/**
 * Mock status badge styling
 */
export const getBillStatusInfo = (status) => {
  const statusMap = {
    paid: { label: "Paid", color: "#27ae60", bgColor: "#e8f8f5" },
    unpaid: { label: "Unpaid", color: "#e74c3c", bgColor: "#fadbd8" },
    partial: { label: "Partial", color: "#f39c12", bgColor: "#fef5e7" },
    generated: { label: "Generated", color: "#3498db", bgColor: "#eaf2f8" },
  };
  return (
    statusMap[status] || { label: status, color: "#95a5a6", bgColor: "#ecf0f1" }
  );
};

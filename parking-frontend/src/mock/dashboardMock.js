const baseDashboardData = {
  summary: {
    totalSlots: 100,
    occupiedSlots: 73,
    availableSlots: 27,
    occupancyPercentage: 73,
  },
  zones: [
    {
      id: 'zone-a',
      name: 'Zone A',
      totalSlots: 25,
      occupiedSlots: 25,
      availableSlots: 0,
      occupancyPercentage: 100,
      status: 'FULL',
    },
    {
      id: 'zone-b',
      name: 'Zone B',
      totalSlots: 25,
      occupiedSlots: 15,
      availableSlots: 10,
      occupancyPercentage: 60,
      status: 'AVAILABLE',
    },
    {
      id: 'zone-c',
      name: 'Zone C',
      totalSlots: 30,
      occupiedSlots: 22,
      availableSlots: 8,
      occupancyPercentage: 73.33,
      status: 'AVAILABLE',
    },
    {
      id: 'zone-d',
      name: 'Zone D',
      totalSlots: 20,
      occupiedSlots: 11,
      availableSlots: 9,
      occupancyPercentage: 55,
      status: 'AVAILABLE',
    },
  ],
  updatedAt: new Date().toISOString(),
};

export const dashboardMockData = baseDashboardData;

export const generateUpdatedDashboardData = () => {
  const zones = baseDashboardData.zones.map((zone) => {
    const randomChange = Math.floor(Math.random() * 3) - 1;
    let occupiedSlots = zone.occupiedSlots + randomChange;

    if (occupiedSlots < 0) occupiedSlots = 0;
    if (occupiedSlots > zone.totalSlots) occupiedSlots = zone.totalSlots;

    const availableSlots = zone.totalSlots - occupiedSlots;
    const occupancyPercentage = Number(
      ((occupiedSlots / zone.totalSlots) * 100).toFixed(2)
    );

    return {
      ...zone,
      occupiedSlots,
      availableSlots,
      occupancyPercentage,
      status: availableSlots === 0 ? 'FULL' : 'AVAILABLE',
    };
  });

  const totalSlots = zones.reduce((sum, zone) => sum + zone.totalSlots, 0);
  const occupiedSlots = zones.reduce((sum, zone) => sum + zone.occupiedSlots, 0);
  const availableSlots = totalSlots - occupiedSlots;
  const occupancyPercentage = Number(
    ((occupiedSlots / totalSlots) * 100).toFixed(2)
  );

  return {
    summary: {
      totalSlots,
      occupiedSlots,
      availableSlots,
      occupancyPercentage,
    },
    zones,
    updatedAt: new Date().toISOString(),
  };
};
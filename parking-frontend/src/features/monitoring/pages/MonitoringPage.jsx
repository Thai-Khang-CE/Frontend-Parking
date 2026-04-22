/**
 * Monitoring Page
 * Real-time occupancy tracking - detailed view of slot/zone status
 */

import { useState } from 'react';

function MonitoringPage() {
  const [selectedZone, setSelectedZone] = useState('Zone B');

  const zones = ['Zone A', 'Zone B', 'Zone C', 'Zone D'];
  const slotData = {
    'Zone A': { occupied: 28, total: 30 },
    'Zone B': { occupied: 15, total: 25 },
    'Zone C': { occupied: 20, total: 25 },
    'Zone D': { occupied: 10, total: 20 }
  };

  const currentZone = slotData[selectedZone];
  const occupancyPercent = ((currentZone.occupied / currentZone.total) * 100).toFixed(1);

  return (
    <div>
      <h1>Parking Monitoring</h1>
      <p>Real-time occupancy tracking and availability</p>

      {/* Zone Selector */}
      <section style={{ marginTop: '30px', padding: '20px', backgroundColor: '#ecf0f1', borderRadius: '6px' }}>
        <h2>Select Zone</h2>
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
          {zones.map((zone) => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              style={{
                padding: '10px 16px',
                backgroundColor: selectedZone === zone ? '#3498db' : '#fff',
                color: selectedZone === zone ? '#fff' : '#2c3e50',
                border: '1px solid #bdc3c7',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: selectedZone === zone ? 'bold' : 'normal',
                transition: 'all 0.3s ease'
              }}
            >
              {zone}
            </button>
          ))}
        </div>
      </section>

      {/* Zone Summary */}
      <section style={{ marginTop: '20px', padding: '20px', backgroundColor: '#fff', border: '1px solid #ecf0f1', borderRadius: '6px' }}>
        <h2>{selectedZone} Summary</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginTop: '15px' }}>
          <div style={{ padding: '15px', backgroundColor: '#ecf0f1', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>{currentZone.total}</div>
            <div style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '5px' }}>Total Slots</div>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#ffe8e8', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c' }}>{currentZone.occupied}</div>
            <div style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '5px' }}>Occupied</div>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#e8f8e8', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2ecc71' }}>{currentZone.total - currentZone.occupied}</div>
            <div style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '5px' }}>Available</div>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#e8f4ff', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db' }}>{occupancyPercent}%</div>
            <div style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '5px' }}>Occupancy</div>
          </div>
        </div>
      </section>

      {/* Slot Grid */}
      <section style={{ marginTop: '20px', padding: '20px', backgroundColor: '#fff', border: '1px solid #ecf0f1', borderRadius: '6px' }}>
        <h2>Slot Status</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '10px', marginTop: '15px' }}>
          {Array.from({ length: currentZone.total }).map((_, i) => {
            const isOccupied = i < currentZone.occupied;
            return (
              <div
                key={i}
                style={{
                  padding: '20px',
                  backgroundColor: isOccupied ? '#e74c3c' : '#2ecc71',
                  color: '#fff',
                  textAlign: 'center',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: 0.85,
                  userSelect: 'none'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '1'}
                onMouseLeave={(e) => e.target.style.opacity = '0.85'}
              >
                {isOccupied ? 'Occ' : 'Free'}
              </div>
            );
          })}
        </div>
      </section>

      <p style={{ marginTop: '20px', color: '#7f8c8d', fontSize: '14px' }}>
        Last updated: just now • Refreshing every 5 seconds
      </p>
    </div>
  );
}

export default MonitoringPage;

/**
 * Guidance Page
 * Driver guidance interface - shows parking recommendations
 */

function GuidancePage() {
  return (
    <div>
      <h1>Parking Guidance</h1>
      <p>Get parking recommendations and directions</p>

      <section style={{ marginTop: '30px', padding: '20px', backgroundColor: '#d4edda', borderRadius: '6px', borderLeft: '4px solid #28a745' }}>
        <h2>Recommended Zone</h2>
        <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#2ecc71', margin: '20px 0' }}>
          Zone B
        </div>
        <p style={{ fontSize: '18px', color: '#2c3e50' }}>10 spots available</p>
      </section>

      <section style={{ marginTop: '20px', padding: '20px', backgroundColor: '#d1ecf1', borderRadius: '6px', borderLeft: '4px solid #17a2b8' }}>
        <h2>Guidance Message</h2>
        <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
          Proceed to Zone B. 10 spots available. Follow directional signage to parking area.
        </p>
      </section>

      <section style={{ marginTop: '20px', padding: '20px', backgroundColor: '#ecf0f1', borderRadius: '6px' }}>
        <h2>Alternative Zones</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginTop: '15px' }}>
          <div style={{ padding: '15px', backgroundColor: '#fff', border: '1px solid #bdc3c7', borderRadius: '4px' }}>
            <div style={{ fontWeight: 'bold' }}>Zone C</div>
            <div style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '5px' }}>5 spots available</div>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#fff', border: '1px solid #bdc3c7', borderRadius: '4px' }}>
            <div style={{ fontWeight: 'bold' }}>Zone D</div>
            <div style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '5px' }}>10 spots available</div>
          </div>
        </div>
      </section>

      <button
        style={{
          marginTop: '30px',
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: 'bold',
          backgroundColor: '#3498db',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
      >
        Get Guidance
      </button>
    </div>
  );
}

export default GuidancePage;

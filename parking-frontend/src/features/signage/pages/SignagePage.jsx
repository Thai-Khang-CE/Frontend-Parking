/**
 * Signage Page
 * Driver-facing large display - simple, readable guidance + quick info
 */

function SignagePage() {
  return (
    <div>
      <h1 style={{ fontSize: '20px', color: '#7f8c8d', marginBottom: '10px' }}>
        Signage Display (Staff View)
      </h1>
      <p style={{ fontSize: '14px', color: '#95a5a6', marginBottom: '30px' }}>
        The display below simulates what drivers see at the parking entrance
      </p>

      {/* Driver Display - Large Format */}
      <div
        style={{
          padding: '60px',
          backgroundColor: '#2c3e50',
          color: '#fff',
          textAlign: 'center',
          borderRadius: '8px',
          minHeight: '600px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'Arial, sans-serif',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
        }}
      >
        {/* Primary Status Indicator */}
        <div
          style={{
            fontSize: '56px',
            fontWeight: 'bold',
            marginBottom: '30px',
            color: '#2ecc71',
            animation: 'pulse 1s infinite'
          }}
        >
          ✓ GO
        </div>

        {/* Recommended Zone (Large) */}
        <div
          style={{
            fontSize: '140px',
            fontWeight: 'bold',
            marginBottom: '20px',
            color: '#fff',
            letterSpacing: '4px'
          }}
        >
          Zone B
        </div>

        {/* Available Slots (Prominent) */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            marginBottom: '40px',
            color: '#f39c12'
          }}
        >
          10 Spots
        </div>

        {/* Guidance Message */}
        <div
          style={{
            fontSize: '36px',
            marginBottom: '40px',
            color: '#bdc3c7',
            lineHeight: '1.4'
          }}
        >
          Follow signs to Zone B
        </div>

        {/* Alternative Info */}
        <div
          style={{
            fontSize: '28px',
            color: '#95a5a6',
            marginTop: '40px',
            borderTop: '2px solid #34495e',
            paddingTop: '30px'
          }}
        >
          Zone D: 10 spots available
        </div>
      </div>

      {/* Status Footer */}
      <div style={{ marginTop: '40px', fontSize: '14px', color: '#7f8c8d', textAlign: 'center' }}>
        <p>Real-time parking availability • Last updated: 5 seconds ago</p>
      </div>
    </div>
  );
}

export default SignagePage;

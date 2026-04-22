import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App.jsx'
import { ParkingProvider } from './context/ParkingContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ParkingProvider>
      <App />
    </ParkingProvider>
  </StrictMode>,
)

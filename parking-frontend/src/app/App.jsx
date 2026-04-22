/**
 * Main App component
 * Sets up React Router with route definitions and shared layout
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from '../components/layout';
import { routes } from './routes';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;

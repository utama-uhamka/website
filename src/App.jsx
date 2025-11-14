import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuth } from './store/authSlice';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BuildingManagement from './pages/BuildingManagement';
import BillingPage from './pages/Billing';
import EmployeePage from './pages/AssetManagement/Employee';
import AssetPage from './pages/AssetManagement/Assets';
import Settings from './pages/Settings';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/building-management/*"
          element={
            <ProtectedRoute>
              <BuildingManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/asset-management"
          element={
            <ProtectedRoute>
              <AssetPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee"
          element={
            <ProtectedRoute>
              <EmployeePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <BillingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

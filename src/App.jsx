import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuth } from './store/authSlice';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Billing from './pages/Billing';
import Ukm from './pages/Ukm';
import Issue from './pages/Issue';
import Event from './pages/Event';

// Master Data Pages
import Campuses from './pages/master/Campuses';
import Buildings from './pages/master/Buildings';
import Floors from './pages/master/Floors';
import Rooms from './pages/master/Rooms';
import CategoryItems from './pages/master/CategoryItems';
import Roles from './pages/master/Roles';
import Shifts from './pages/master/Shifts';
import EventCategories from './pages/master/EventCategories';

// Detail Pages
import UnitDetail from './pages/master/UnitDetail';
import BuildingDetail from './pages/master/BuildingDetail';
import FloorDetail from './pages/master/FloorDetail';
import RoomDetail from './pages/master/RoomDetail';
import CategoryItemDetail from './pages/master/CategoryItemDetail';
import AccountDetail from './pages/AccountDetail';

// Error Pages
import NotFound from './pages/NotFound';

// User Management
import Users from './pages/Users';
import Employees from './pages/Employees';

// Inventory Pages
import Items from './pages/inventory/Items';

// Activity Pages
import Activities from './pages/activity/Activities';
import TaskLogs from './pages/activity/TaskLogs';

// Other Pages
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';
import Trainings from './pages/Trainings';
import Evaluations from './pages/Evaluations';
import Profile from './pages/Profile';
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

        {/* Dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* Master Data */}
        <Route path="/master/units" element={<ProtectedRoute><Campuses /></ProtectedRoute>} />
        <Route path="/master/units/:id" element={<ProtectedRoute><UnitDetail /></ProtectedRoute>} />
        <Route path="/master/buildings" element={<ProtectedRoute><Buildings /></ProtectedRoute>} />
        <Route path="/master/buildings/:id" element={<ProtectedRoute><BuildingDetail /></ProtectedRoute>} />
        <Route path="/master/floors" element={<ProtectedRoute><Floors /></ProtectedRoute>} />
        <Route path="/master/floors/:id" element={<ProtectedRoute><FloorDetail /></ProtectedRoute>} />
        <Route path="/master/rooms" element={<ProtectedRoute><Rooms /></ProtectedRoute>} />
        <Route path="/master/rooms/:id" element={<ProtectedRoute><RoomDetail /></ProtectedRoute>} />
        <Route path="/master/category-items" element={<ProtectedRoute><CategoryItems /></ProtectedRoute>} />
        <Route path="/master/category-items/:id" element={<ProtectedRoute><CategoryItemDetail /></ProtectedRoute>} />
        <Route path="/master/roles" element={<ProtectedRoute><Roles /></ProtectedRoute>} />
        <Route path="/master/shifts" element={<ProtectedRoute><Shifts /></ProtectedRoute>} />
        <Route path="/master/event-categories" element={<ProtectedRoute><EventCategories /></ProtectedRoute>} />

        {/* User Management */}
        <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />

        {/* Account Detail */}
        <Route path="/account/:id" element={<ProtectedRoute><AccountDetail /></ProtectedRoute>} />

        {/* Inventory */}
        <Route path="/inventory/items" element={<ProtectedRoute><Items /></ProtectedRoute>} />

        {/* Main Features */}
        <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
        <Route path="/issue" element={<ProtectedRoute><Issue /></ProtectedRoute>} />
        <Route path="/event" element={<ProtectedRoute><Event /></ProtectedRoute>} />
        <Route path="/ukm" element={<ProtectedRoute><Ukm /></ProtectedRoute>} />

        {/* Activity */}
        <Route path="/activity/activities" element={<ProtectedRoute><Activities /></ProtectedRoute>} />
        <Route path="/activity/task-logs" element={<ProtectedRoute><TaskLogs /></ProtectedRoute>} />

        {/* Attendance */}
        <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />

        {/* Leave & Training */}
        <Route path="/leaves" element={<ProtectedRoute><Leaves /></ProtectedRoute>} />
        <Route path="/trainings" element={<ProtectedRoute><Trainings /></ProtectedRoute>} />

        {/* Profile & Settings */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        {/* Evaluation */}
        <Route path="/evaluations" element={<ProtectedRoute><Evaluations /></ProtectedRoute>} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

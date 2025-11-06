import { FiHome, FiFileText, FiTrendingUp, FiPackage, FiBarChart2, FiCalendar, FiSettings, FiLogOut } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.ui);

  const menuItems = [
    { icon: FiHome, label: 'Dashboard', path: '/dashboard' },
    { icon: FiFileText, label: 'Billing', path: '/billing' },
    { icon: FiTrendingUp, label: 'UKM', path: '/ukm' },
    { icon: FiPackage, label: 'Inventory', path: '/inventory' },
    { icon: FiBarChart2, label: 'Issue', path: '/issue' },
    { icon: FiCalendar, label: 'Event', path: '/event' },
    { icon: FiSettings, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className={`bg-white h-screen w-64 fixed left-0 top-0 shadow-lg flex flex-col transition-transform duration-300 z-20 ${!sidebarOpen ? '-translate-x-full' : 'translate-x-0'}`}>
      {/* Logo - Height sama dengan header (h-16) */}
      <div className="h-16 px-6 flex items-center gap-3 border-b">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">U</span>
        </div>
        <span className="font-bold text-xl">Utama</span>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="px-4 pb-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <FiLogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

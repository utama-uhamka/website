import { FiHome, FiFileText, FiGrid, FiPackage, FiUsers, FiSettings, FiLogOut } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { showErrorAlert } from '../utils/alerts';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.ui);

  const menuItems = [
    { icon: FiHome, label: 'Dashboard', path: '/dashboard', enabled: true },
    { icon: FiGrid, label: 'Building Management', path: '/building-management', enabled: false },
    { icon: FiPackage, label: 'Asset Management', path: '/asset-management', enabled: false },
    { icon: FiUsers, label: 'Karyawan', path: '/employee', enabled: false },
    { icon: FiFileText, label: 'Billing', path: '/billing', enabled: false },
    { icon: FiSettings, label: 'Settings', path: '/settings', enabled: false },
  ];

  const handleMenuClick = (item) => {
    if (item.enabled) {
      navigate(item.path);
    } else {
      showErrorAlert.topRight('Under Development', 'Fitur ini masih dalam pengembangan');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className={`bg-white h-screen w-64 fixed left-0 top-0 shadow-lg flex flex-col transition-transform duration-300 z-20 ${!sidebarOpen ? '-translate-x-full' : 'translate-x-0'}`}>
      {/* Logo - Height sama dengan header (h-16) */}
      <div className="h-16 px-6 flex items-center gap-3 border-b">
        <div className="w-10 h-10 flex items-center justify-center">
          <span className="text-white font-bold text-xl"><img src='/logo.png' className='w-10'/></span>
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
              onClick={() => handleMenuClick(item)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 text-sm transition-colors ${
                isActive
                  ? 'bg-primary text-white font-semibold'
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

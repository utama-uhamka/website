import { useState, useEffect } from 'react';
import {
  FiHome, FiLogOut, FiDatabase, FiChevronDown, FiChevronRight, FiMap,
  FiTag, FiShield, FiClock, FiFolder, FiAlertCircle, FiPackage,
  FiUserCheck, FiCalendar, FiUsers, FiBell, FiImage
} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import logo from '../assets/logo.png';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const [expandedMenus, setExpandedMenus] = useState([]);

  const menuItems = [
    { icon: FiHome, label: 'Dashboard', path: '/dashboard' },
    {
      icon: FiDatabase,
      label: 'Master Data',
      id: 'master-data',
      children: [
        { icon: FiMap, label: 'Unit', path: '/master/units' },
        { icon: FiShield, label: 'Roles', path: '/master/roles' },
        { icon: FiFolder, label: 'Kategori Event', path: '/master/event-categories' },
        { icon: FiClock, label: 'Shift Masuk', path: '/master/shifts' },
      ],
    },
    {
      icon: FiPackage,
      label: 'Inventaris',
      id: 'inventaris',
      children: [
        { icon: FiTag, label: 'Kategori Item', path: '/master/category-items' },
        { icon: FiAlertCircle, label: 'Issue', path: '/issue' },
      ],
    },
    {
      icon: FiUserCheck,
      label: 'Kepegawaian',
      id: 'kepegawaian',
      children: [
        { icon: FiUsers, label: 'Karyawan', path: '/employees' },
        { icon: FiUserCheck, label: 'Absensi', path: '/attendance' },
        { icon: FiCalendar, label: 'Cuti', path: '/leaves' },
      ],
    },
    { icon: FiImage, label: 'Banner', path: '/banners' },
    { icon: FiBell, label: 'Push Notification', path: '/push-notification' },
  ];

  // Helper function to check if path matches (including detail pages)
  const isPathActive = (menuPath) => {
    const currentPath = location.pathname;

    // Exact match
    if (currentPath === menuPath) return true;

    // Handle detail pages - map detail routes to their parent menu paths
    const detailMappings = [
      // Master Data -> Unit detail pages
      { pattern: /^\/master\/units\/\d+$/, menuPath: '/master/units' },
      { pattern: /^\/master\/buildings\/\d+$/, menuPath: '/master/units' },
      { pattern: /^\/master\/floors\/\d+$/, menuPath: '/master/units' },
      { pattern: /^\/master\/rooms\/\d+$/, menuPath: '/master/units' },
      // Inventaris -> Kategori Item detail
      { pattern: /^\/master\/category-items\/\d+$/, menuPath: '/master/category-items' },
      // Kepegawaian -> Account detail (from Karyawan)
      { pattern: /^\/account\/\d+$/, menuPath: '/employees' },
    ];

    for (const mapping of detailMappings) {
      if (mapping.pattern.test(currentPath) && mapping.menuPath === menuPath) {
        return true;
      }
    }

    return false;
  };

  // Auto-expand menu when child is active
  useEffect(() => {
    const activeParentIds = [];
    menuItems.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(child => isPathActive(child.path));
        if (hasActiveChild && !expandedMenus.includes(item.id)) {
          activeParentIds.push(item.id);
        }
      }
    });

    if (activeParentIds.length > 0) {
      setExpandedMenus(prev => [...new Set([...prev, ...activeParentIds])]);
    }
  }, [location.pathname]);

  const toggleMenu = (menuId) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const isActive = (path) => isPathActive(path);
  const isParentActive = (children) => children?.some(child => isPathActive(child.path));

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const renderMenuItem = (item) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.id);
    const active = hasChildren ? isParentActive(item.children) : isActive(item.path);

    if (hasChildren) {
      return (
        <div key={item.id}>
          <button
            onClick={() => toggleMenu(item.id)}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg mb-1 transition-colors ${
              active
                ? 'bg-primary/10 text-primary'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon size={18} />
              <span className="font-medium text-sm">{item.label}</span>
            </div>
            {isExpanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
          </button>

          {isExpanded && (
            <div className="ml-4 pl-4 border-l border-gray-200">
              {item.children.map((child) => {
                const ChildIcon = child.icon;
                const childActive = isActive(child.path);
                return (
                  <button
                    key={child.path}
                    onClick={() => navigate(child.path)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg mb-1 transition-colors ${
                      childActive
                        ? 'bg-primary text-white'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                    }`}
                  >
                    <ChildIcon size={16} />
                    <span className="text-sm">{child.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        key={item.path}
        onClick={() => navigate(item.path)}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg mb-1 transition-colors ${
          active
            ? 'bg-primary text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <Icon size={18} />
        <span className="font-medium text-sm">{item.label}</span>
      </button>
    );
  };

  return (
    <div className={`bg-white h-screen w-64 fixed left-0 top-0 shadow-lg flex flex-col transition-transform duration-300 z-20 ${!sidebarOpen ? '-translate-x-full' : 'translate-x-0'}`}>
      {/* Logo */}
      <div className="h-16 px-6 flex items-center gap-3 border-b flex-shrink-0">
        <img src={logo} alt="Utama Logo" className="h-10 w-auto" />
        <span className="font-bold text-xl text-primary">Utama</span>
      </div>

      {/* Menu Items - Scrollable */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        {menuItems.map(renderMenuItem)}
      </nav>

      {/* Sign Out */}
      <div className="px-4 pb-4 border-t pt-4 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <FiLogOut size={18} />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

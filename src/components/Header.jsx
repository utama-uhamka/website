import { useState, useRef, useEffect } from 'react';
import { FiSearch, FiBell, FiChevronDown, FiMenu, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toggleSidebar } from '../store/uiSlice';
import { logout } from '../store/authSlice';

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const { sidebarOpen } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4A22AD',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        navigate('/login');
        Swal.fire({
          title: 'Logged Out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
    setDropdownOpen(false);
  };

  return (
    <div className={`bg-white h-16 fixed top-0 right-0 shadow-sm z-10 flex items-center justify-between px-8 transition-all duration-300 ${sidebarOpen ? 'left-64' : 'left-0'}`}>
      {/* Left Section: Menu Toggle + Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiMenu size={24} className="text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <FiBell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.name?.charAt(0) || 'M'}
              </span>
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">{user?.name || 'Muzifa'}</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
            <FiChevronDown className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} size={16} />
          </div>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <button
                onClick={() => {
                  navigate('/profile');
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <FiUser size={18} className="text-gray-600" />
                <div>
                  <div className="text-sm font-medium text-gray-800">Profile</div>
                  <div className="text-xs text-gray-500">View your profile</div>
                </div>
              </button>

              <button
                onClick={() => {
                  navigate('/settings');
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <FiSettings size={18} className="text-gray-600" />
                <div>
                  <div className="text-sm font-medium text-gray-800">Settings</div>
                  <div className="text-xs text-gray-500">Account settings</div>
                </div>
              </button>

              <div className="border-t border-gray-200 my-2"></div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left"
              >
                <FiLogOut size={18} className="text-red-600" />
                <div>
                  <div className="text-sm font-medium text-red-600">Logout</div>
                  <div className="text-xs text-red-400">Sign out from account</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;

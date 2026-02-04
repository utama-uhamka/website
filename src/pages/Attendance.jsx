import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import {
  DataTable,
  Modal,
  SearchFilter,
  PageHeader,
  AvatarWithFallback,
} from '../components/ui';
import {
  FiUser,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiLoader,
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiLogIn,
  FiLogOut,
  FiCheckCircle,
} from 'react-icons/fi';
import { attendancesAPI, usersAPI } from '../services/api';

const Attendance = () => {
  // Data states
  const [attendances, setAttendances] = useState({ data: [], pagination: {} });
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Filter states
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState(() => {
    // Default to today
    const today = new Date();
    const formatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return { start: formatted, end: formatted };
  });

  // Modal states
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const itemsPerPage = 10;

  // Load attendances (grouped by date)
  const loadAttendances = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };
      if (dateRange.start) params.start_date = dateRange.start;
      if (dateRange.end) params.end_date = dateRange.end;
      if (filterValues.user_id) params.user_id = filterValues.user_id;
      if (searchValue) params.search = searchValue;

      const response = await attendancesAPI.getGrouped(params);
      if (response.data?.success) {
        setAttendances({
          data: response.data.data || [],
          pagination: response.data.pagination || {},
        });
      }
    } catch (err) {
      console.error('Error loading attendances:', err);
      toast.error('Gagal memuat data absensi');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterValues, dateRange, searchValue]);

  // Load stats
  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const params = {};
      if (dateRange.start) params.start_date = dateRange.start;
      if (dateRange.end) params.end_date = dateRange.end;

      const response = await attendancesAPI.getStats(params);
      if (response.data?.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, [dateRange]);

  // Load users for filter
  const loadUsers = useCallback(async () => {
    try {
      const response = await usersAPI.getAll({ limit: 100 });
      if (response.data?.success) {
        setUsers(response.data.data || []);
      }
    } catch (err) {
      console.error('Error loading users:', err);
    }
  }, []);

  useEffect(() => {
    loadAttendances();
    loadStats();
  }, [loadAttendances, loadStats]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Reset page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, filterValues, dateRange]);

  // User options for filter
  const userOptions = users.map((u) => ({
    value: u.user_id?.toString(),
    label: u.full_name,
  }));

  // Columns for grouped attendance (by date with clock in/out)
  const columns = [
    {
      key: 'user',
      label: 'Karyawan',
      render: (_, row) => row.user ? (
        <div className="flex items-center gap-3">
          <AvatarWithFallback
            src={row.user.photo_1}
            alt={row.user.full_name}
            size={36}
          />
          <div>
            <p className="font-medium text-gray-800">{row.user.full_name}</p>
            <p className="text-xs text-gray-500">{row.user.position || '-'}</p>
          </div>
        </div>
      ) : <span className="text-gray-400">-</span>,
    },
    {
      key: 'date',
      label: 'Tanggal',
      width: '180px',
      render: (value) => {
        const date = new Date(value);
        return (
          <div className="flex items-center gap-2">
            <FiCalendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700">
              {date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        );
      },
    },
    {
      key: 'checkIn',
      label: 'Jam Masuk',
      width: '150px',
      render: (value) => value ? (
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            {new Date(value.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </span>
          {value.photo_1 && (
            <img src={value.photo_1} alt="Check-in" className="w-7 h-7 rounded-full object-cover border-2 border-green-200" />
          )}
        </div>
      ) : <span className="text-gray-400">-</span>,
    },
    {
      key: 'checkOut',
      label: 'Jam Keluar',
      width: '150px',
      render: (value) => value ? (
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            {new Date(value.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </span>
          {value.photo_1 && (
            <img src={value.photo_1} alt="Check-out" className="w-7 h-7 rounded-full object-cover border-2 border-red-200" />
          )}
        </div>
      ) : <span className="text-gray-400">-</span>,
    },
    {
      key: 'status',
      label: 'Status',
      width: '130px',
      render: (value, row) => {
        if (row.checkIn && row.checkOut) {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              <FiCheckCircle className="w-3 h-3" />
              Lengkap
            </span>
          );
        } else if (row.checkIn) {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
              <FiClock className="w-3 h-3" />
              Belum Pulang
            </span>
          );
        } else {
          return (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              Tidak Hadir
            </span>
          );
        }
      },
    },
  ];

  const filters = [
    {
      key: 'user_id',
      label: 'Karyawan',
      options: userOptions,
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  const clearDateRange = () => {
    setDateRange({ start: '', end: '' });
  };

  const setToday = () => {
    const today = new Date();
    const formatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    setDateRange({ start: formatted, end: formatted });
  };

  // Get today's date string for display
  const getTodayString = () => {
    return new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Check if viewing today
  const isViewingToday = () => {
    const today = new Date();
    const formatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return dateRange.start === formatted && dateRange.end === formatted;
  };

  return (
    <MainLayout>
      <PageHeader
        title="Absensi"
        subtitle={isViewingToday() ? `Data absensi hari ini - ${getTodayString()}` : 'Data kehadiran karyawan'}
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'User Management', path: null },
          { label: 'Absensi' },
        ]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {/* Total Employees */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2.5 rounded-lg">
              <FiUsers className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Karyawan</p>
              <p className="text-xl font-bold text-gray-800">
                {statsLoading ? '-' : stats?.today?.totalEmployees || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Present Count */}
        <div className="bg-green-50 rounded-xl p-4 shadow-sm border border-green-100">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 p-2.5 rounded-lg">
              <FiUserCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-green-600">Hadir</p>
              <p className="text-xl font-bold text-green-700">
                {statsLoading ? '-' : stats?.today?.presentCount || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Not Present */}
        <div className="bg-red-50 rounded-xl p-4 shadow-sm border border-red-100">
          <div className="flex items-center gap-3">
            <div className="bg-red-500 p-2.5 rounded-lg">
              <FiUserX className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-red-600">Belum Hadir</p>
              <p className="text-xl font-bold text-red-700">
                {statsLoading ? '-' : stats?.today?.notPresentCount || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Clock In Count */}
        <div className="bg-blue-50 rounded-xl p-4 shadow-sm border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2.5 rounded-lg">
              <FiLogIn className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-blue-600">Clock In</p>
              <p className="text-xl font-bold text-blue-700">
                {statsLoading ? '-' : stats?.period?.clockInCount || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Clock Out Count */}
        <div className="bg-orange-50 rounded-xl p-4 shadow-sm border border-orange-100">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2.5 rounded-lg">
              <FiLogOut className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-orange-600">Clock Out</p>
              <p className="text-xl font-bold text-orange-700">
                {statsLoading ? '-' : stats?.period?.clockOutCount || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Complete (Checked In & Out) */}
        <div className="bg-purple-50 rounded-xl p-4 shadow-sm border border-purple-100">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500 p-2.5 rounded-lg">
              <FiCheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-purple-600">Pulang</p>
              <p className="text-xl font-bold text-purple-700">
                {statsLoading ? '-' : stats?.today?.completeCount || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed (Today only) */}
      {isViewingToday() && stats?.recentAttendances?.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FiClock className="w-4 h-4" />
            Aktivitas Terbaru
          </h3>
          <div className="flex flex-wrap gap-3">
            {stats.recentAttendances.map((att) => (
              <div
                key={att.attendance_id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  att.type === 'IN' ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <AvatarWithFallback
                  src={att.user?.photo_1}
                  alt={att.user?.full_name}
                  size={28}
                />
                <div className="text-sm">
                  <span className="font-medium text-gray-800">{att.user?.full_name}</span>
                  <span className={`ml-2 text-xs ${att.type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                    {att.type === 'IN' ? 'masuk' : 'pulang'} {new Date(att.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Date Range Filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
            <input
              type="date"
              name="start"
              value={dateRange.start}
              onChange={handleDateRangeChange}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir</label>
            <input
              type="date"
              name="end"
              value={dateRange.end}
              onChange={handleDateRangeChange}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="flex gap-2">
            {!isViewingToday() && (
              <button
                onClick={setToday}
                className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
              >
                Hari Ini
              </button>
            )}
            {(dateRange.start || dateRange.end) && (
              <button
                onClick={clearDateRange}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari nama karyawan..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        showExport={false}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={attendances.data}
          onView={handleView}
          actionColumn={{ edit: false, delete: false, view: true }}
          currentPage={attendances.pagination.page}
          totalPages={attendances.pagination.totalPages}
          totalItems={attendances.pagination.total}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* View Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Detail Absensi"
        showFooter={false}
        size="md"
      >
        {selectedItem && (
          <div className="space-y-4">
            {/* Date */}
            <div className="flex items-center gap-2 text-gray-700 pb-3 border-b">
              <FiCalendar size={18} />
              <span className="font-medium">
                {new Date(selectedItem.date).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>

            {/* Clock In Section */}
            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-green-600 flex items-center gap-1">
                  <FiLogIn size={12} />
                  WAKTU MASUK
                </p>
                {selectedItem.checkIn?.user && (
                  <div className="flex items-center gap-2">
                    <AvatarWithFallback
                      src={selectedItem.checkIn.user.photo_1}
                      alt={selectedItem.checkIn.user.full_name}
                      size={24}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {selectedItem.checkIn.user.full_name}
                    </span>
                  </div>
                )}
              </div>
              {selectedItem.checkIn ? (
                <>
                  <p className="text-2xl font-bold text-green-700">
                    {new Date(selectedItem.checkIn.createdAt).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </p>
                  {selectedItem.checkIn.address && (
                    <div className="flex items-center gap-1 mt-2 text-green-600">
                      <FiMapPin size={14} />
                      <span className="text-sm">{selectedItem.checkIn.address}</span>
                    </div>
                  )}
                  {selectedItem.checkIn.photo_1 && (
                    <div className="mt-3">
                      <img
                        src={selectedItem.checkIn.photo_1}
                        alt="Check-in"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-400">Tidak ada data</p>
              )}
            </div>

            {/* Clock Out Section */}
            <div className="bg-red-50 rounded-xl p-4">
              <p className="text-xs font-medium text-red-600 mb-2 flex items-center gap-1">
                <FiLogOut size={12} />
                WAKTU PULANG
              </p>
              {selectedItem.checkOut ? (
                <>
                  <p className="text-2xl font-bold text-red-700">
                    {new Date(selectedItem.checkOut.createdAt).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </p>
                  {selectedItem.checkOut.address && (
                    <div className="flex items-center gap-1 mt-2 text-red-600">
                      <FiMapPin size={14} />
                      <span className="text-sm">{selectedItem.checkOut.address}</span>
                    </div>
                  )}
                  {selectedItem.checkOut.photo_1 && (
                    <div className="mt-3">
                      <img
                        src={selectedItem.checkOut.photo_1}
                        alt="Check-out"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-400">Belum pulang</p>
              )}
            </div>

            {/* Status */}
            <div className="flex justify-center pt-2">
              {selectedItem.checkIn && selectedItem.checkOut ? (
                <span className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700">
                  <FiCheckCircle className="w-4 h-4" />
                  Absensi Lengkap
                </span>
              ) : selectedItem.checkIn ? (
                <span className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
                  <FiClock className="w-4 h-4" />
                  Belum Pulang
                </span>
              ) : (
                <span className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                  Tidak Hadir
                </span>
              )}
            </div>
          </div>
        )}
      </Modal>
    </MainLayout>
  );
};

export default Attendance;

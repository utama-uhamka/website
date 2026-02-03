import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import {
  DataTable,
  Modal,
  SearchFilter,
  StatusBadge,
  PageHeader,
} from '../components/ui';
import { FiUser, FiCalendar, FiClock, FiMapPin, FiImage, FiLoader } from 'react-icons/fi';
import { fetchAttendances, clearDataError } from '../store/dataSlice';
import { fetchUsers } from '../store/usersSlice';

const Attendance = () => {
  const dispatch = useDispatch();
  const { attendances } = useSelector((state) => state.data);
  const { data: users } = useSelector((state) => state.users);

  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });

  const itemsPerPage = 10;

  const statuses = [
    { value: 'IN', label: 'Clock In' },
    { value: 'OUT', label: 'Clock Out' },
  ];

  // Load attendances
  const loadAttendances = useCallback(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchValue,
      ...filterValues,
    };
    if (dateRange.start) params.start_date = dateRange.start;
    if (dateRange.end) params.end_date = dateRange.end;
    dispatch(fetchAttendances(params));
  }, [dispatch, currentPage, itemsPerPage, searchValue, filterValues, dateRange]);

  useEffect(() => {
    loadAttendances();
  }, [loadAttendances]);

  // Load users for filter
  useEffect(() => {
    dispatch(fetchUsers({ limit: 100 }));
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (attendances.error) {
      toast.error(attendances.error);
      dispatch(clearDataError());
    }
  }, [attendances.error, dispatch]);

  // Reset page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, filterValues, dateRange]);

  // User options for filter
  const userOptions = users.map((u) => ({
    value: u.user_id?.toString(),
    label: u.full_name,
  }));

  const columns = [
    {
      key: 'user',
      label: 'Karyawan',
      render: (value, item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            {item.user?.photo ? (
              <img
                src={item.user.photo}
                alt={item.user?.full_name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <FiUser size={18} className="text-primary" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-800">{item.user?.full_name || '-'}</p>
            <p className="text-xs text-gray-500">{item.user?.shift?.shift_name || '-'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Tanggal',
      width: '120px',
      render: (value) => (
        <div className="flex items-center gap-1.5 text-gray-700">
          <FiCalendar size={14} />
          <span className="text-sm">
            {value
              ? new Date(value).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : '-'}
          </span>
        </div>
      ),
    },
    {
      key: 'time',
      label: 'Waktu',
      width: '100px',
      render: (value, item) => (
        <div className="flex items-center gap-1.5 text-gray-700">
          <FiClock size={14} />
          <span className="text-sm">
            {item.createdAt
              ? new Date(item.createdAt).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '-'}
          </span>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Tipe',
      width: '100px',
      render: (value) => (
        <span
          className={`px-2.5 py-1 text-xs font-medium rounded-full ${
            value === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {value === 'IN' ? 'Clock In' : 'Clock Out'}
        </span>
      ),
    },
    {
      key: 'location',
      label: 'Lokasi',
      width: '150px',
      render: (value, item) => (
        <div className="flex items-center gap-1.5 text-gray-600">
          <FiMapPin size={14} />
          <span className="text-sm truncate">{item.location || '-'}</span>
        </div>
      ),
    },
  ];

  const filters = [
    {
      key: 'user_id',
      label: 'Karyawan',
      options: userOptions,
    },
    {
      key: 'type',
      label: 'Tipe',
      options: statuses,
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

  // Calculate stats
  const clockInCount = attendances.data.filter((d) => d.type === 'IN').length;
  const clockOutCount = attendances.data.filter((d) => d.type === 'OUT').length;

  return (
    <MainLayout>
      <PageHeader
        title="Absensi"
        subtitle="Lihat data kehadiran karyawan dari aplikasi mobile"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'User Management', path: null },
          { label: 'Absensi' },
        ]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Data</p>
          <p className="text-2xl font-bold text-gray-800">{attendances.pagination.total || 0}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-green-600 mb-1">Clock In</p>
          <p className="text-2xl font-bold text-green-700">{clockInCount}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-red-600 mb-1">Clock Out</p>
          <p className="text-2xl font-bold text-red-700">{clockOutCount}</p>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
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

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari nama karyawan..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        showExport={true}
        onExport={() => console.log('Export attendance')}
      />

      {attendances.loading ? (
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
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                {selectedItem.user?.photo ? (
                  <img
                    src={selectedItem.user.photo}
                    alt={selectedItem.user?.full_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <FiUser size={24} className="text-primary" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {selectedItem.user?.full_name || '-'}
                </h3>
                <p className="text-sm text-gray-500">{selectedItem.user?.shift?.shift_name || '-'}</p>
              </div>
              <div className="ml-auto">
                <span
                  className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                    selectedItem.type === 'IN'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {selectedItem.type === 'IN' ? 'Clock In' : 'Clock Out'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <FiCalendar size={16} />
              <span>
                {selectedItem.createdAt
                  ? new Date(selectedItem.createdAt).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : '-'}
              </span>
            </div>

            <div
              className={`rounded-xl p-4 ${
                selectedItem.type === 'IN' ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <p
                className={`text-xs font-medium mb-2 ${
                  selectedItem.type === 'IN' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {selectedItem.type === 'IN' ? 'CLOCK IN' : 'CLOCK OUT'}
              </p>
              <p
                className={`text-xl font-bold ${
                  selectedItem.type === 'IN' ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {selectedItem.createdAt
                  ? new Date(selectedItem.createdAt).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })
                  : '-'}
              </p>
              {selectedItem.location && (
                <div
                  className={`flex items-center gap-1 mt-2 ${
                    selectedItem.type === 'IN' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  <FiMapPin size={14} />
                  <span className="text-sm">{selectedItem.location}</span>
                </div>
              )}
              {selectedItem.photo && (
                <div className="mt-3 w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={selectedItem.photo}
                    alt="Attendance"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {selectedItem.notes && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Catatan</p>
                <p className="text-sm text-gray-700">{selectedItem.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </MainLayout>
  );
};

export default Attendance;

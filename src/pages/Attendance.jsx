import { useState, useEffect, useMemo } from 'react';
import MainLayout from '../layouts/MainLayout';
import {
  DataTable,
  Modal,
  SearchFilter,
  StatusBadge,
  PageHeader,
} from '../components/ui';
import { FiUser, FiCalendar, FiClock, FiMapPin, FiImage } from 'react-icons/fi';

const Attendance = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });

  const itemsPerPage = 10;

  // Dummy data
  const users = [
    { value: '1', label: 'Ahmad Fauzi' },
    { value: '2', label: 'Budi Santoso' },
    { value: '3', label: 'Citra Dewi' },
    { value: '4', label: 'Dani Pratama' },
  ];

  const statuses = [
    { value: 'present', label: 'Hadir' },
    { value: 'late', label: 'Terlambat' },
    { value: 'absent', label: 'Tidak Hadir' },
    { value: 'leave', label: 'Cuti' },
  ];

  const allData = [
    { id: 1, user: 'Ahmad Fauzi', user_id: '1', date: '2024-12-27', shift: 'Shift Pagi', clock_in: '07:05:32', clock_out: '15:02:18', location_in: 'Gedung Rektorat', location_out: 'Gedung Rektorat', photo_in: '/photo1.jpg', photo_out: '/photo2.jpg', status: 'present' },
    { id: 2, user: 'Budi Santoso', user_id: '2', date: '2024-12-27', shift: 'Shift Pagi', clock_in: '07:45:12', clock_out: null, location_in: 'Gedung FKIP', location_out: null, photo_in: '/photo3.jpg', photo_out: null, status: 'late' },
    { id: 3, user: 'Citra Dewi', user_id: '3', date: '2024-12-27', shift: 'Shift Siang', clock_in: '14:02:45', clock_out: null, location_in: 'Gedung FEB', location_out: null, photo_in: '/photo4.jpg', photo_out: null, status: 'present' },
    { id: 4, user: 'Dani Pratama', user_id: '4', date: '2024-12-27', shift: 'Shift Pagi', clock_in: null, clock_out: null, location_in: null, location_out: null, photo_in: null, photo_out: null, status: 'absent' },
    { id: 5, user: 'Ahmad Fauzi', user_id: '1', date: '2024-12-26', shift: 'Shift Pagi', clock_in: '06:58:22', clock_out: '15:05:45', location_in: 'Gedung Rektorat', location_out: 'Gedung Rektorat', photo_in: '/photo5.jpg', photo_out: '/photo6.jpg', status: 'present' },
    { id: 6, user: 'Budi Santoso', user_id: '2', date: '2024-12-26', shift: 'Shift Pagi', clock_in: '07:02:18', clock_out: '15:08:32', location_in: 'Gedung FKIP', location_out: 'Gedung FKIP', photo_in: '/photo7.jpg', photo_out: '/photo8.jpg', status: 'present' },
    { id: 7, user: 'Citra Dewi', user_id: '3', date: '2024-12-26', shift: 'Shift Siang', clock_in: null, clock_out: null, location_in: null, location_out: null, photo_in: null, photo_out: null, status: 'leave' },
    { id: 8, user: 'Ahmad Fauzi', user_id: '1', date: '2024-12-25', shift: 'Shift Pagi', clock_in: '07:00:15', clock_out: '15:00:00', location_in: 'Gedung Rektorat', location_out: 'Gedung Rektorat', photo_in: '/photo9.jpg', photo_out: '/photo10.jpg', status: 'present' },
    { id: 9, user: 'Budi Santoso', user_id: '2', date: '2024-12-25', shift: 'Shift Pagi', clock_in: '07:30:00', clock_out: '15:00:00', location_in: 'Gedung FKIP', location_out: 'Gedung FKIP', photo_in: '/photo11.jpg', photo_out: '/photo12.jpg', status: 'late' },
    { id: 10, user: 'Dani Pratama', user_id: '4', date: '2024-12-25', shift: 'Shift Pagi', clock_in: '07:02:00', clock_out: '15:01:00', location_in: 'Gedung FT', location_out: 'Gedung FT', photo_in: '/photo13.jpg', photo_out: '/photo14.jpg', status: 'present' },
    { id: 11, user: 'Ahmad Fauzi', user_id: '1', date: '2024-12-24', shift: 'Shift Pagi', clock_in: '07:01:00', clock_out: '15:00:30', location_in: 'Gedung Rektorat', location_out: 'Gedung Rektorat', photo_in: '/photo15.jpg', photo_out: '/photo16.jpg', status: 'present' },
    { id: 12, user: 'Citra Dewi', user_id: '3', date: '2024-12-24', shift: 'Shift Siang', clock_in: '14:05:00', clock_out: '22:02:00', location_in: 'Gedung FEB', location_out: 'Gedung FEB', photo_in: '/photo17.jpg', photo_out: '/photo18.jpg', status: 'present' },
  ];

  const columns = [
    {
      key: 'user',
      label: 'Karyawan',
      render: (value, item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FiUser size={18} className="text-primary" />
          </div>
          <div>
            <p className="font-medium text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">{item.shift}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Tanggal',
      width: '120px',
      render: (value) => (
        <div className="flex items-center gap-1.5 text-gray-700">
          <FiCalendar size={14} />
          <span className="text-sm">{new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      ),
    },
    {
      key: 'clock_in',
      label: 'Clock In',
      width: '130px',
      render: (value, item) => value ? (
        <div>
          <div className="flex items-center gap-1.5 text-green-600">
            <FiClock size={14} />
            <span className="text-sm font-medium">{value}</span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{item.location_in}</p>
        </div>
      ) : (
        <span className="text-gray-400">-</span>
      ),
    },
    {
      key: 'clock_out',
      label: 'Clock Out',
      width: '130px',
      render: (value, item) => value ? (
        <div>
          <div className="flex items-center gap-1.5 text-red-600">
            <FiClock size={14} />
            <span className="text-sm font-medium">{value}</span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{item.location_out}</p>
        </div>
      ) : (
        <span className="text-gray-400">-</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '110px',
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  const filters = [
    {
      key: 'user_id',
      label: 'Karyawan',
      options: users,
    },
    {
      key: 'status',
      label: 'Status',
      options: statuses,
    },
  ];

  // Filter, sort, and paginate data
  const { paginatedData, totalItems, totalPages, presentCount, lateCount, absentCount } = useMemo(() => {
    let filtered = allData.filter((item) => {
      const matchSearch = item.user.toLowerCase().includes(searchValue.toLowerCase());
      const matchUser = !filterValues.user_id || item.user_id === filterValues.user_id;
      const matchStatus = !filterValues.status || item.status === filterValues.status;

      // Date range filter
      let matchDateRange = true;
      if (dateRange.start && dateRange.end) {
        const itemDate = new Date(item.date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        matchDateRange = itemDate >= startDate && itemDate <= endDate;
      } else if (dateRange.start) {
        const itemDate = new Date(item.date);
        const startDate = new Date(dateRange.start);
        matchDateRange = itemDate >= startDate;
      } else if (dateRange.end) {
        const itemDate = new Date(item.date);
        const endDate = new Date(dateRange.end);
        matchDateRange = itemDate <= endDate;
      }

      return matchSearch && matchUser && matchStatus && matchDateRange;
    });

    // Calculate stats before sorting/pagination
    const present = filtered.filter(d => d.status === 'present').length;
    const late = filtered.filter(d => d.status === 'late').length;
    const absent = filtered.filter(d => d.status === 'absent').length;

    filtered.sort((a, b) => {
      const aVal = a[sortColumn] || '';
      const bVal = b[sortColumn] || '';
      return sortDirection === 'asc'
        ? aVal.toString().localeCompare(bVal.toString())
        : bVal.toString().localeCompare(aVal.toString());
    });

    const total = filtered.length;
    const pages = Math.ceil(total / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(start, start + itemsPerPage);

    return {
      paginatedData: paginated,
      totalItems: total,
      totalPages: pages,
      presentCount: present,
      lateCount: late,
      absentCount: absent
    };
  }, [allData, searchValue, filterValues, dateRange, sortColumn, sortDirection, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, filterValues, dateRange]);

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSort = (column, direction) => {
    setSortColumn(column);
    setSortDirection(direction);
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Data</p>
          <p className="text-2xl font-bold text-gray-800">{totalItems}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-green-600 mb-1">Hadir Tepat Waktu</p>
          <p className="text-2xl font-bold text-green-700">{presentCount}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-yellow-600 mb-1">Terlambat</p>
          <p className="text-2xl font-bold text-yellow-700">{lateCount}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-red-600 mb-1">Tidak Hadir</p>
          <p className="text-2xl font-bold text-red-700">{absentCount}</p>
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

      <DataTable
        columns={columns}
        data={paginatedData}
        onView={handleView}
        actionColumn={{ edit: false, delete: false, view: true }}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onSort={handleSort}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
      />

      {/* View Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Detail Absensi"
        showFooter={false}
        size="lg"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FiUser size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{selectedItem.user}</h3>
                <p className="text-sm text-gray-500">{selectedItem.shift}</p>
              </div>
              <div className="ml-auto">
                <StatusBadge status={selectedItem.status} size="lg" />
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <FiCalendar size={16} />
              <span>{new Date(selectedItem.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Clock In */}
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-xs text-green-600 font-medium mb-2">CLOCK IN</p>
                {selectedItem.clock_in ? (
                  <>
                    <p className="text-xl font-bold text-green-700">{selectedItem.clock_in}</p>
                    <div className="flex items-center gap-1 mt-2 text-green-600">
                      <FiMapPin size={14} />
                      <span className="text-sm">{selectedItem.location_in}</span>
                    </div>
                    {selectedItem.photo_in && (
                      <div className="mt-3 w-full h-24 bg-green-100 rounded-lg flex items-center justify-center">
                        <FiImage size={24} className="text-green-400" />
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-400">Belum clock in</p>
                )}
              </div>

              {/* Clock Out */}
              <div className="bg-red-50 rounded-xl p-4">
                <p className="text-xs text-red-600 font-medium mb-2">CLOCK OUT</p>
                {selectedItem.clock_out ? (
                  <>
                    <p className="text-xl font-bold text-red-700">{selectedItem.clock_out}</p>
                    <div className="flex items-center gap-1 mt-2 text-red-600">
                      <FiMapPin size={14} />
                      <span className="text-sm">{selectedItem.location_out}</span>
                    </div>
                    {selectedItem.photo_out && (
                      <div className="mt-3 w-full h-24 bg-red-100 rounded-lg flex items-center justify-center">
                        <FiImage size={24} className="text-red-400" />
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-400">Belum clock out</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </MainLayout>
  );
};

export default Attendance;

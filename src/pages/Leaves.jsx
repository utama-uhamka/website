import { useState, useEffect, useMemo } from 'react';
import MainLayout from '../layouts/MainLayout';
import {
  DataTable,
  Modal,
  SearchFilter,
  StatusBadge,
  PageHeader,
} from '../components/ui';
import { FiUser, FiCalendar, FiCheck, FiX } from 'react-icons/fi';

const Leaves = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
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

  const leaveTypes = [
    { value: 'annual', label: 'Cuti Tahunan' },
    { value: 'sick', label: 'Cuti Sakit' },
    { value: 'personal', label: 'Cuti Pribadi' },
    { value: 'maternity', label: 'Cuti Melahirkan' },
    { value: 'other', label: 'Lainnya' },
  ];

  const statuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Disetujui' },
    { value: 'rejected', label: 'Ditolak' },
  ];

  const allData = [
    { id: 1, user: 'Ahmad Fauzi', user_id: '1', type: 'annual', type_label: 'Cuti Tahunan', start_date: '2025-01-02', end_date: '2025-01-05', days: 4, reason: 'Liburan keluarga ke Bali untuk merayakan tahun baru bersama keluarga besar.', status: 'approved', created_at: '2024-12-20' },
    { id: 2, user: 'Budi Santoso', user_id: '2', type: 'sick', type_label: 'Cuti Sakit', start_date: '2024-12-28', end_date: '2024-12-29', days: 2, reason: 'Demam dan flu, disarankan istirahat oleh dokter.', status: 'approved', created_at: '2024-12-27' },
    { id: 3, user: 'Citra Dewi', user_id: '3', type: 'personal', type_label: 'Cuti Pribadi', start_date: '2025-01-10', end_date: '2025-01-10', days: 1, reason: 'Urusan keluarga yang mendesak.', status: 'pending', created_at: '2024-12-27' },
    { id: 4, user: 'Dani Pratama', user_id: '4', type: 'annual', type_label: 'Cuti Tahunan', start_date: '2025-01-15', end_date: '2025-01-20', days: 6, reason: 'Menghadiri pernikahan adik di Surabaya.', status: 'pending', created_at: '2024-12-26' },
    { id: 5, user: 'Ahmad Fauzi', user_id: '1', type: 'sick', type_label: 'Cuti Sakit', start_date: '2024-12-20', end_date: '2024-12-21', days: 2, reason: 'Sakit perut akut, harus rawat jalan.', status: 'approved', created_at: '2024-12-19' },
    { id: 6, user: 'Budi Santoso', user_id: '2', type: 'personal', type_label: 'Cuti Pribadi', start_date: '2024-12-15', end_date: '2024-12-15', days: 1, reason: 'Acara keluarga mendadak.', status: 'rejected', created_at: '2024-12-14' },
    { id: 7, user: 'Citra Dewi', user_id: '3', type: 'annual', type_label: 'Cuti Tahunan', start_date: '2024-12-01', end_date: '2024-12-03', days: 3, reason: 'Liburan ke Yogyakarta.', status: 'approved', created_at: '2024-11-25' },
    { id: 8, user: 'Dani Pratama', user_id: '4', type: 'sick', type_label: 'Cuti Sakit', start_date: '2024-11-20', end_date: '2024-11-21', days: 2, reason: 'Rawat jalan karena demam tinggi.', status: 'approved', created_at: '2024-11-19' },
    { id: 9, user: 'Ahmad Fauzi', user_id: '1', type: 'personal', type_label: 'Cuti Pribadi', start_date: '2024-11-15', end_date: '2024-11-15', days: 1, reason: 'Mengurus dokumen penting.', status: 'approved', created_at: '2024-11-10' },
    { id: 10, user: 'Budi Santoso', user_id: '2', type: 'annual', type_label: 'Cuti Tahunan', start_date: '2025-02-01', end_date: '2025-02-05', days: 5, reason: 'Liburan keluarga.', status: 'pending', created_at: '2024-12-28' },
  ];

  const columns = [
    {
      key: 'user',
      label: 'Karyawan',
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FiUser size={14} className="text-primary" />
          </div>
          <span className="font-medium text-gray-800">{value}</span>
        </div>
      ),
    },
    {
      key: 'type_label',
      label: 'Tipe Cuti',
      width: '140px',
      render: (value, item) => {
        const typeColors = {
          annual: 'bg-blue-100 text-blue-700',
          sick: 'bg-red-100 text-red-700',
          personal: 'bg-purple-100 text-purple-700',
          maternity: 'bg-pink-100 text-pink-700',
          other: 'bg-gray-100 text-gray-700',
        };
        return (
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap ${typeColors[item.type]}`}>
            {value}
          </span>
        );
      },
    },
    {
      key: 'start_date',
      label: 'Tanggal',
      width: '180px',
      render: (value, item) => (
        <div className="flex items-center gap-1.5 text-gray-700">
          <FiCalendar size={14} />
          <span className="text-sm">
            {new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date(item.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
      ),
    },
    {
      key: 'days',
      label: 'Durasi',
      width: '80px',
      render: (value) => <span>{value} hari</span>,
    },
    {
      key: 'reason',
      label: 'Alasan',
      render: (value) => (
        <span className="text-sm text-gray-600">{value.length > 40 ? value.substring(0, 40) + '...' : value}</span>
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
      key: 'type',
      label: 'Tipe',
      options: leaveTypes,
    },
    {
      key: 'status',
      label: 'Status',
      options: statuses,
    },
  ];

  // Filter, sort, and paginate data
  const { paginatedData, totalItems, totalPages, pendingCount, approvedCount } = useMemo(() => {
    let filtered = allData.filter((item) => {
      const matchSearch = item.user.toLowerCase().includes(searchValue.toLowerCase());
      const matchUser = !filterValues.user_id || item.user_id === filterValues.user_id;
      const matchType = !filterValues.type || item.type === filterValues.type;
      const matchStatus = !filterValues.status || item.status === filterValues.status;

      // Date range filter
      let matchDateRange = true;
      if (dateRange.start && dateRange.end) {
        const itemDate = new Date(item.start_date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        matchDateRange = itemDate >= startDate && itemDate <= endDate;
      } else if (dateRange.start) {
        const itemDate = new Date(item.start_date);
        const startDate = new Date(dateRange.start);
        matchDateRange = itemDate >= startDate;
      } else if (dateRange.end) {
        const itemDate = new Date(item.start_date);
        const endDate = new Date(dateRange.end);
        matchDateRange = itemDate <= endDate;
      }

      return matchSearch && matchUser && matchType && matchStatus && matchDateRange;
    });

    // Calculate stats
    const pending = allData.filter(d => d.status === 'pending').length;
    const approved = allData.filter(d => d.status === 'approved').length;

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
      pendingCount: pending,
      approvedCount: approved
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

  const handleApprove = (item) => {
    setSelectedItem(item);
    setIsApproveOpen(true);
  };

  const handleReject = (item) => {
    setSelectedItem(item);
    setIsRejectOpen(true);
  };

  const handleConfirmApprove = () => {
    console.log('Approved:', selectedItem);
    setIsApproveOpen(false);
    setIsViewOpen(false);
  };

  const handleConfirmReject = () => {
    console.log('Rejected:', selectedItem);
    setIsRejectOpen(false);
    setIsViewOpen(false);
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  const clearDateRange = () => {
    setDateRange({ start: '', end: '' });
  };

  // Custom actions for pending items
  const customActions = (item) => {
    if (item.status === 'pending') {
      return (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleApprove(item)}
            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Setujui"
          >
            <FiCheck size={16} />
          </button>
          <button
            onClick={() => handleReject(item)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Tolak"
          >
            <FiX size={16} />
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <MainLayout>
      <PageHeader
        title="Pengajuan Cuti"
        subtitle="Kelola persetujuan pengajuan cuti karyawan"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'User Management', path: null },
          { label: 'Cuti' },
        ]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Pengajuan</p>
          <p className="text-2xl font-bold text-gray-800">{allData.length}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-yellow-600 mb-1">Menunggu Persetujuan</p>
          <p className="text-2xl font-bold text-yellow-700">{pendingCount}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-green-600 mb-1">Disetujui</p>
          <p className="text-2xl font-bold text-green-700">{approvedCount}</p>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai Cuti</label>
            <input
              type="date"
              name="start"
              value={dateRange.start}
              onChange={handleDateRangeChange}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir Cuti</label>
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
        onExport={() => console.log('Export leaves')}
      />

      <DataTable
        columns={columns}
        data={paginatedData}
        onView={handleView}
        actionColumn={{ edit: false, delete: false, view: true }}
        customActions={customActions}
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
        title="Detail Pengajuan Cuti"
        showFooter={false}
        size="md"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FiUser size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{selectedItem.user}</h3>
                <StatusBadge status={selectedItem.status} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Tipe Cuti</span>
                <span className="font-medium">{selectedItem.type_label}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Tanggal</span>
                <span className="font-medium">
                  {new Date(selectedItem.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} - {new Date(selectedItem.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Durasi</span>
                <span className="font-medium">{selectedItem.days} hari</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Tanggal Pengajuan</span>
                <span className="font-medium">{new Date(selectedItem.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Alasan</p>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700">{selectedItem.reason}</p>
              </div>
            </div>

            {selectedItem.status === 'pending' && (
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleApprove(selectedItem)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FiCheck size={18} />
                  Setujui
                </button>
                <button
                  onClick={() => handleReject(selectedItem)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  <FiX size={18} />
                  Tolak
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Approve Confirmation */}
      <Modal
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        title="Setujui Pengajuan Cuti"
        size="sm"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <FiCheck size={32} className="text-green-600" />
          </div>
          <p className="text-gray-600">
            Apakah Anda yakin ingin menyetujui pengajuan cuti dari <strong>{selectedItem?.user}</strong>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {selectedItem?.type_label} - {selectedItem?.days} hari
          </p>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setIsApproveOpen(false)}
            className="flex-1 px-4 py-2 text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleConfirmApprove}
            className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Ya, Setujui
          </button>
        </div>
      </Modal>

      {/* Reject Confirmation */}
      <Modal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        title="Tolak Pengajuan Cuti"
        size="sm"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <FiX size={32} className="text-red-600" />
          </div>
          <p className="text-gray-600">
            Apakah Anda yakin ingin menolak pengajuan cuti dari <strong>{selectedItem?.user}</strong>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {selectedItem?.type_label} - {selectedItem?.days} hari
          </p>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setIsRejectOpen(false)}
            className="flex-1 px-4 py-2 text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleConfirmReject}
            className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Ya, Tolak
          </button>
        </div>
      </Modal>
    </MainLayout>
  );
};

export default Leaves;

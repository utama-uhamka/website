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
import { FiUser, FiCalendar, FiCheck, FiX, FiLoader } from 'react-icons/fi';
import { fetchLeaves, approveLeave, rejectLeave, clearDataError, clearDataSuccess } from '../store/dataSlice';
import { fetchUsers } from '../store/usersSlice';

const Leaves = () => {
  const dispatch = useDispatch();
  const { leaves, loading, error, success } = useSelector((state) => state.data);
  const { data: users } = useSelector((state) => state.users);

  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });

  const itemsPerPage = 10;

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

  // Load leaves
  const loadLeaves = useCallback(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchValue,
      ...filterValues,
    };
    if (dateRange.start) params.start_date = dateRange.start;
    if (dateRange.end) params.end_date = dateRange.end;
    dispatch(fetchLeaves(params));
  }, [dispatch, currentPage, itemsPerPage, searchValue, filterValues, dateRange]);

  useEffect(() => {
    loadLeaves();
  }, [loadLeaves]);

  // Load users for filter
  useEffect(() => {
    dispatch(fetchUsers({ limit: 100 }));
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearDataError());
    }
  }, [error, dispatch]);

  // Handle success
  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearDataSuccess());
      loadLeaves();
    }
  }, [success, dispatch, loadLeaves]);

  // Reset page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, filterValues, dateRange]);

  // User options for filter
  const userOptions = users.map((u) => ({
    value: u.user_id?.toString(),
    label: u.full_name,
  }));

  const getTypeLabel = (type) => {
    const found = leaveTypes.find(t => t.value === type);
    return found ? found.label : type;
  };

  const columns = [
    {
      key: 'user',
      label: 'Karyawan',
      render: (value, item) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            {item.user?.photo ? (
              <img src={item.user.photo} alt={item.user?.full_name} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <FiUser size={14} className="text-primary" />
            )}
          </div>
          <span className="font-medium text-gray-800">{item.user?.full_name || '-'}</span>
        </div>
      ),
    },
    {
      key: 'leave_type',
      label: 'Tipe Cuti',
      width: '140px',
      render: (value) => {
        const typeColors = {
          annual: 'bg-blue-100 text-blue-700',
          sick: 'bg-red-100 text-red-700',
          personal: 'bg-purple-100 text-purple-700',
          maternity: 'bg-pink-100 text-pink-700',
          other: 'bg-gray-100 text-gray-700',
        };
        return (
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap ${typeColors[value] || 'bg-gray-100 text-gray-700'}`}>
            {getTypeLabel(value)}
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
            {value ? new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}
            {' - '}
            {item.end_date ? new Date(item.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
          </span>
        </div>
      ),
    },
    {
      key: 'total_days',
      label: 'Durasi',
      width: '80px',
      render: (value) => <span>{value || 1} hari</span>,
    },
    {
      key: 'reason',
      label: 'Alasan',
      render: (value) => (
        <span className="text-sm text-gray-600">{value ? (value.length > 40 ? value.substring(0, 40) + '...' : value) : '-'}</span>
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
      options: userOptions,
    },
    {
      key: 'leave_type',
      label: 'Tipe',
      options: leaveTypes,
    },
    {
      key: 'status',
      label: 'Status',
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

  const handleApprove = (item) => {
    setSelectedItem(item);
    setIsApproveOpen(true);
  };

  const handleReject = (item) => {
    setSelectedItem(item);
    setIsRejectOpen(true);
  };

  const handleConfirmApprove = async () => {
    setActionLoading(true);
    try {
      await dispatch(approveLeave(selectedItem.leave_id)).unwrap();
      setIsApproveOpen(false);
      setIsViewOpen(false);
    } catch (err) {
      // Error handled by slice
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmReject = async () => {
    setActionLoading(true);
    try {
      await dispatch(rejectLeave(selectedItem.leave_id)).unwrap();
      setIsRejectOpen(false);
      setIsViewOpen(false);
    } catch (err) {
      // Error handled by slice
    } finally {
      setActionLoading(false);
    }
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  const clearDateRange = () => {
    setDateRange({ start: '', end: '' });
  };

  // Calculate stats
  const pendingCount = leaves.data.filter(d => d.status === 'pending').length;
  const approvedCount = leaves.data.filter(d => d.status === 'approved').length;

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
          <p className="text-2xl font-bold text-gray-800">{leaves.pagination.total || 0}</p>
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

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={leaves.data}
          onView={handleView}
          actionColumn={{ edit: false, delete: false, view: true }}
          customActions={customActions}
          currentPage={leaves.pagination.page}
          totalPages={leaves.pagination.totalPages}
          totalItems={leaves.pagination.total}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

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
                {selectedItem.user?.photo ? (
                  <img src={selectedItem.user.photo} alt={selectedItem.user?.full_name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <FiUser size={24} className="text-primary" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{selectedItem.user?.full_name || '-'}</h3>
                <StatusBadge status={selectedItem.status} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Tipe Cuti</span>
                <span className="font-medium">{getTypeLabel(selectedItem.leave_type)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Tanggal</span>
                <span className="font-medium">
                  {selectedItem.start_date ? new Date(selectedItem.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                  {' - '}
                  {selectedItem.end_date ? new Date(selectedItem.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Durasi</span>
                <span className="font-medium">{selectedItem.total_days || 1} hari</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Tanggal Pengajuan</span>
                <span className="font-medium">
                  {selectedItem.createdAt
                    ? new Date(selectedItem.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                    : '-'}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Alasan</p>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700">{selectedItem.reason || '-'}</p>
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
        showFooter={false}
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <FiCheck size={32} className="text-green-600" />
          </div>
          <p className="text-gray-600">
            Apakah Anda yakin ingin menyetujui pengajuan cuti dari <strong>{selectedItem?.user?.full_name}</strong>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {getTypeLabel(selectedItem?.leave_type)} - {selectedItem?.total_days || 1} hari
          </p>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setIsApproveOpen(false)}
            disabled={actionLoading}
            className="flex-1 px-4 py-2 text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleConfirmApprove}
            disabled={actionLoading}
            className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {actionLoading && <FiLoader className="animate-spin" size={16} />}
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
        showFooter={false}
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <FiX size={32} className="text-red-600" />
          </div>
          <p className="text-gray-600">
            Apakah Anda yakin ingin menolak pengajuan cuti dari <strong>{selectedItem?.user?.full_name}</strong>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {getTypeLabel(selectedItem?.leave_type)} - {selectedItem?.total_days || 1} hari
          </p>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setIsRejectOpen(false)}
            disabled={actionLoading}
            className="flex-1 px-4 py-2 text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleConfirmReject}
            disabled={actionLoading}
            className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {actionLoading && <FiLoader className="animate-spin" size={16} />}
            Ya, Tolak
          </button>
        </div>
      </Modal>
    </MainLayout>
  );
};

export default Leaves;

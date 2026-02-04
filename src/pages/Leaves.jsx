import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import MainLayout from '../layouts/MainLayout';
import {
  DataTable,
  Modal,
  SearchFilter,
  StatusBadge,
  PageHeader,
  ConfirmDialog,
} from '../components/ui';
import { FiUser, FiCalendar, FiCheck, FiX, FiLoader } from 'react-icons/fi';
import { fetchLeaves, approveLeave, rejectLeave, clearDataError, clearDataSuccess } from '../store/dataSlice';
import { fetchUsers } from '../store/usersSlice';
import { leavesAPI } from '../services/api';

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
  const [exportLoading, setExportLoading] = useState(false);
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 7);

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return {
      start: formatDate(today),
      end: formatDate(endDate),
    };
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
    { value: 'Pending', label: 'Pending' },
    { value: 'Approved', label: 'Disetujui' },
    { value: 'Rejected', label: 'Ditolak' },
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
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 7);

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    setDateRange({
      start: formatDate(today),
      end: formatDate(endDate),
    });
  };

  // Export leaves data to Excel
  const handleExportLeaves = async () => {
    if (!dateRange.start || !dateRange.end) {
      toast.error('Pilih rentang tanggal terlebih dahulu');
      return;
    }

    setExportLoading(true);
    try {
      const params = {
        page: 1,
        limit: 10000,
        start_date: dateRange.start,
        end_date: dateRange.end,
        ...filterValues,
      };
      if (searchValue) params.search = searchValue;

      const response = await leavesAPI.getAll(params);
      const allLeaves = response.data?.data || [];

      if (allLeaves.length === 0) {
        toast.error('Tidak ada data cuti untuk periode ini');
        return;
      }

      // Create worksheet data
      const wsData = [
        ['DATA PENGAJUAN CUTI'],
        [''],
        ['Periode:', `${dateRange.start} s/d ${dateRange.end}`],
        ['Tanggal Export:', new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })],
        [''],
        ['No', 'Nama Karyawan', 'Tipe Cuti', 'Tanggal Mulai', 'Tanggal Selesai', 'Durasi', 'Alasan', 'Status', 'Tanggal Pengajuan'],
      ];

      allLeaves.forEach((leave, idx) => {
        let statusText = 'Menunggu';
        if (leave.status === 'Approved') statusText = 'Disetujui';
        else if (leave.status === 'Rejected') statusText = 'Ditolak';

        wsData.push([
          idx + 1,
          leave.user?.full_name || '-',
          getTypeLabel(leave.leave_type),
          leave.start_date ? new Date(leave.start_date).toLocaleDateString('id-ID') : '-',
          leave.end_date ? new Date(leave.end_date).toLocaleDateString('id-ID') : '-',
          `${leave.total_days || 1} hari`,
          leave.reason || '-',
          statusText,
          leave.createdAt ? new Date(leave.createdAt).toLocaleDateString('id-ID') : '-',
        ]);
      });

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(wsData);

      // Set column widths
      ws['!cols'] = [
        { wch: 5 },  // No
        { wch: 25 }, // Nama
        { wch: 15 }, // Tipe
        { wch: 15 }, // Tanggal Mulai
        { wch: 15 }, // Tanggal Selesai
        { wch: 10 }, // Durasi
        { wch: 40 }, // Alasan
        { wch: 12 }, // Status
        { wch: 15 }, // Tanggal Pengajuan
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'Data Cuti');

      // Download file
      const filename = `Data_Cuti_${dateRange.start}_${dateRange.end}.xlsx`;
      XLSX.writeFile(wb, filename);

      toast.success('Data cuti berhasil diexport');
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Gagal mengexport data cuti');
    } finally {
      setExportLoading(false);
    }
  };

  // Calculate stats (status uses capital case: Pending, Approved, Rejected)
  const pendingCount = leaves.data.filter(d => d.status === 'Pending').length;
  const approvedCount = leaves.data.filter(d => d.status === 'Approved').length;

  // Custom actions for pending items
  const customActions = (item) => {
    if (item.status === 'Pending') {
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
        onExport={handleExportLeaves}
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

            {selectedItem.status === 'Pending' && (
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
      <ConfirmDialog
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        onConfirm={handleConfirmApprove}
        title="Setujui Pengajuan Cuti"
        message={`Apakah Anda yakin ingin menyetujui pengajuan cuti dari ${selectedItem?.user?.full_name}? (${getTypeLabel(selectedItem?.leave_type)} - ${selectedItem?.total_days || 1} hari)`}
        confirmText="Ya, Setujui"
        cancelText="Batal"
        type="success"
        loading={actionLoading}
      />

      {/* Reject Confirmation */}
      <ConfirmDialog
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        onConfirm={handleConfirmReject}
        title="Tolak Pengajuan Cuti"
        message={`Apakah Anda yakin ingin menolak pengajuan cuti dari ${selectedItem?.user?.full_name}? (${getTypeLabel(selectedItem?.leave_type)} - ${selectedItem?.total_days || 1} hari)`}
        confirmText="Ya, Tolak"
        cancelText="Batal"
        type="danger"
        loading={actionLoading}
      />
    </MainLayout>
  );
};

export default Leaves;

import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import MainLayout from '../../layouts/MainLayout';
import {
  DataTable,
  Modal,
  SearchFilter,
  StatusBadge,
  PageHeader,
} from '../../components/ui';
import { FiUser, FiCalendar, FiClock, FiMapPin, FiImage, FiLoader, FiCheck, FiX } from 'react-icons/fi';
import { fetchActivities, updateActivity, clearDataError, clearDataSuccess } from '../../store/dataSlice';
import { fetchUsers } from '../../store/usersSlice';

const Activities = () => {
  const dispatch = useDispatch();
  const { activities, loading, error, success } = useSelector((state) => state.data);
  const { data: users } = useSelector((state) => state.users);

  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const itemsPerPage = 10;

  const statuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Disetujui' },
    { value: 'rejected', label: 'Ditolak' },
  ];

  // Load activities
  const loadActivities = useCallback(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchValue,
      ...filterValues,
    };
    if (dateRange.start) params.start_date = dateRange.start;
    if (dateRange.end) params.end_date = dateRange.end;
    dispatch(fetchActivities(params));
  }, [dispatch, currentPage, itemsPerPage, searchValue, filterValues, dateRange]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

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
      loadActivities();
    }
  }, [success, dispatch, loadActivities]);

  // Reset page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, filterValues, dateRange]);

  // User options
  const userOptions = users.map((u) => ({
    value: u.user_id?.toString(),
    label: u.full_name,
  }));

  const columns = [
    {
      key: 'activity_name',
      label: 'Kegiatan',
      render: (value, item) => (
        <div>
          <p className="font-medium text-gray-800">{value || item.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {item.description ? (item.description.length > 50 ? item.description.substring(0, 50) + '...' : item.description) : '-'}
          </p>
        </div>
      ),
    },
    {
      key: 'user',
      label: 'Petugas',
      width: '150px',
      render: (value, item) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            {item.user?.photo_1 ? (
              <img src={item.user.photo_1} alt={item.user?.full_name} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <FiUser size={14} className="text-primary" />
            )}
          </div>
          <span className="text-sm">{item.user?.full_name || '-'}</span>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Tanggal',
      width: '130px',
      render: (value, item) => (
        <div>
          <div className="flex items-center gap-1.5 text-gray-700">
            <FiCalendar size={14} />
            <span className="text-sm">
              {value ? new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 mt-0.5">
            <FiClock size={14} />
            <span className="text-xs">{item.start_time || '-'} - {item.end_time || '-'}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Lokasi',
      width: '180px',
      render: (value, item) => (
        <div className="flex items-center gap-1.5 text-gray-600">
          <FiMapPin size={14} />
          <span className="text-sm">{item.room?.room_name || value || '-'}</span>
        </div>
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
      label: 'Petugas',
      options: userOptions,
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

  const handleApprove = async (item) => {
    try {
      await dispatch(updateActivity({ id: item.activity_id, data: { status: 'approved' } })).unwrap();
    } catch (err) {
      // Error handled by slice
    }
  };

  const handleReject = async (item) => {
    try {
      await dispatch(updateActivity({ id: item.activity_id, data: { status: 'rejected' } })).unwrap();
    } catch (err) {
      // Error handled by slice
    }
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  const clearDateRange = () => {
    setDateRange({ start: '', end: '' });
  };

  // Stats
  const pendingCount = activities.data.filter(d => d.status === 'pending').length;
  const approvedCount = activities.data.filter(d => d.status === 'approved').length;

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
        title="Kegiatan"
        subtitle="Lihat laporan kegiatan harian dari aplikasi mobile"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Activity', path: null },
          { label: 'Kegiatan' },
        ]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Kegiatan</p>
          <p className="text-2xl font-bold text-gray-800">{activities.pagination.total || 0}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-yellow-600 mb-1">Menunggu Review</p>
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
        searchPlaceholder="Cari judul kegiatan..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        showExport={true}
        onExport={() => console.log('Export activities')}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={activities.data}
          onView={handleView}
          actionColumn={{ edit: false, delete: false, view: true }}
          customActions={customActions}
          currentPage={activities.pagination.page}
          totalPages={activities.pagination.totalPages}
          totalItems={activities.pagination.total}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* View Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Detail Kegiatan"
        showFooter={false}
        size="lg"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{selectedItem.activity_name || selectedItem.title}</h3>
              <StatusBadge status={selectedItem.status} />
            </div>

            {selectedItem.description && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">{selectedItem.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <FiUser className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Petugas</p>
                  <span className="text-sm font-medium">{selectedItem.user?.full_name || '-'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Tanggal</p>
                  <span className="text-sm font-medium">
                    {selectedItem.date
                      ? new Date(selectedItem.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                      : '-'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiClock className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Waktu</p>
                  <span className="text-sm font-medium">{selectedItem.start_time || '-'} - {selectedItem.end_time || '-'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiMapPin className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Lokasi</p>
                  <span className="text-sm font-medium">{selectedItem.room?.room_name || selectedItem.location || '-'}</span>
                </div>
              </div>
            </div>

            {selectedItem.photo_1 && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Foto Kegiatan</p>
                <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <img src={selectedItem.photo_1} alt="Kegiatan" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {selectedItem.status === 'pending' && (
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    handleApprove(selectedItem);
                    setIsViewOpen(false);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FiCheck size={18} />
                  Setujui
                </button>
                <button
                  onClick={() => {
                    handleReject(selectedItem);
                    setIsViewOpen(false);
                  }}
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
    </MainLayout>
  );
};

export default Activities;

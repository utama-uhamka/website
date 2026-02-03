import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import MainLayout from '../../layouts/MainLayout';
import {
  DataTable,
  SearchFilter,
  PageHeader,
} from '../../components/ui';
import { FiUser, FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiLoader, FiMapPin } from 'react-icons/fi';
import { fetchTaskLogs, clearDataError, clearDataSuccess } from '../../store/dataSlice';
import { fetchUsers } from '../../store/usersSlice';

const TaskLogs = () => {
  const dispatch = useDispatch();
  const { taskLogs, loading, error, success } = useSelector((state) => state.data);
  const { data: users } = useSelector((state) => state.users);

  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const itemsPerPage = 10;

  const logTypes = [
    { value: 'check_in', label: 'Check In' },
    { value: 'check_out', label: 'Check Out' },
    { value: 'checkpoint', label: 'Checkpoint' },
  ];

  // Load task logs
  const loadTaskLogs = useCallback(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchValue,
      ...filterValues,
    };
    if (dateRange.start) params.start_date = dateRange.start;
    if (dateRange.end) params.end_date = dateRange.end;
    dispatch(fetchTaskLogs(params));
  }, [dispatch, currentPage, itemsPerPage, searchValue, filterValues, dateRange]);

  useEffect(() => {
    loadTaskLogs();
  }, [loadTaskLogs]);

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
    }
  }, [success, dispatch]);

  // Reset page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, filterValues, dateRange]);

  // User options
  const userOptions = users.map((u) => ({
    value: u.user_id?.toString(),
    label: u.full_name,
  }));

  const typeConfig = {
    check_in: { icon: FiCheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Check In' },
    check_out: { icon: FiXCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Check Out' },
    checkpoint: { icon: FiCheckCircle, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Checkpoint' },
  };

  const columns = [
    {
      key: 'task_name',
      label: 'Task',
      render: (value, item) => (
        <div>
          <p className="font-medium text-gray-800">{value || item.activity?.activity_name || '-'}</p>
          <p className="text-xs text-gray-500 mt-0.5">{item.notes || '-'}</p>
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
            {item.user?.photo ? (
              <img src={item.user.photo} alt={item.user?.full_name} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <FiUser size={14} className="text-primary" />
            )}
          </div>
          <span className="text-sm">{item.user?.full_name || '-'}</span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Waktu',
      width: '150px',
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
            <span className="text-xs">
              {value ? new Date(value).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '-'}
            </span>
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
      key: 'log_type',
      label: 'Tipe',
      width: '120px',
      render: (value) => {
        const config = typeConfig[value] || typeConfig.checkpoint;
        const Icon = config.icon;
        return (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bg}`}>
            <Icon size={14} className={config.color} />
            <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
          </div>
        );
      },
    },
  ];

  const filters = [
    {
      key: 'user_id',
      label: 'Petugas',
      options: userOptions,
    },
    {
      key: 'log_type',
      label: 'Tipe',
      options: logTypes,
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  const clearDateRange = () => {
    setDateRange({ start: '', end: '' });
  };

  // Calculate stats
  const checkInCount = taskLogs.data.filter(d => d.log_type === 'check_in').length;
  const checkOutCount = taskLogs.data.filter(d => d.log_type === 'check_out').length;
  const checkpointCount = taskLogs.data.filter(d => d.log_type === 'checkpoint').length;

  return (
    <MainLayout>
      <PageHeader
        title="Task Logs"
        subtitle="Riwayat log tugas dan checkpoint"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Activity', path: null },
          { label: 'Task Logs' },
        ]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Log</p>
          <p className="text-2xl font-bold text-gray-800">{taskLogs.pagination.total || 0}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-green-600 mb-1">Check In</p>
          <p className="text-2xl font-bold text-green-700">{checkInCount}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-red-600 mb-1">Check Out</p>
          <p className="text-2xl font-bold text-red-700">{checkOutCount}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-blue-600 mb-1">Checkpoint</p>
          <p className="text-2xl font-bold text-blue-700">{checkpointCount}</p>
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
        searchPlaceholder="Cari task atau lokasi..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        showExport={true}
        onExport={() => console.log('Export task logs')}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={taskLogs.data}
          showActions={false}
          currentPage={taskLogs.pagination.page}
          totalPages={taskLogs.pagination.totalPages}
          totalItems={taskLogs.pagination.total}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </MainLayout>
  );
};

export default TaskLogs;

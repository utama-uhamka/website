import { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import {
  DataTable,
  SearchFilter,
  StatusBadge,
  PageHeader,
} from '../../components/ui';
import { FiUser, FiCalendar, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const TaskLogs = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  // Dummy data
  const users = [
    { value: '1', label: 'Ahmad Fauzi' },
    { value: '2', label: 'Budi Santoso' },
    { value: '3', label: 'Citra Dewi' },
    { value: '4', label: 'Dani Pratama' },
  ];

  const data = [
    { id: 1, task: 'Patrol Gedung A', user: 'Ahmad Fauzi', user_id: '1', date: '2024-12-27', time: '08:15:32', type: 'check_in', location: 'Gedung A - Lobby', notes: 'Mulai patrol pagi' },
    { id: 2, task: 'Patrol Gedung A', user: 'Ahmad Fauzi', user_id: '1', date: '2024-12-27', time: '08:45:18', type: 'checkpoint', location: 'Gedung A - Lt. 1', notes: 'Area aman' },
    { id: 3, task: 'Patrol Gedung A', user: 'Ahmad Fauzi', user_id: '1', date: '2024-12-27', time: '09:10:45', type: 'checkpoint', location: 'Gedung A - Lt. 2', notes: 'Lampu koridor mati, dilaporkan' },
    { id: 4, task: 'Patrol Gedung A', user: 'Ahmad Fauzi', user_id: '1', date: '2024-12-27', time: '09:30:22', type: 'check_out', location: 'Gedung A - Lobby', notes: 'Selesai patrol' },
    { id: 5, task: 'Pembersihan Lt. 1', user: 'Budi Santoso', user_id: '2', date: '2024-12-27', time: '07:00:05', type: 'check_in', location: 'Gedung FKIP', notes: 'Mulai pembersihan' },
    { id: 6, task: 'Pembersihan Lt. 1', user: 'Budi Santoso', user_id: '2', date: '2024-12-27', time: '09:00:12', type: 'check_out', location: 'Gedung FKIP', notes: 'Selesai' },
    { id: 7, task: 'Maintenance AC', user: 'Citra Dewi', user_id: '3', date: '2024-12-27', time: '13:05:00', type: 'check_in', location: 'Gedung FEB', notes: 'Mulai pengecekan' },
    { id: 8, task: 'Maintenance AC', user: 'Citra Dewi', user_id: '3', date: '2024-12-27', time: '13:30:45', type: 'checkpoint', location: 'Gedung FEB - R.101', notes: 'AC perlu ganti filter' },
  ];

  const columns = [
    {
      key: 'task',
      label: 'Task',
      render: (value, item) => (
        <div>
          <p className="font-medium text-gray-800">{value}</p>
          <p className="text-xs text-gray-500 mt-0.5">{item.notes}</p>
        </div>
      ),
    },
    {
      key: 'user',
      label: 'Petugas',
      width: '150px',
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <FiUser size={14} className="text-primary" />
          </div>
          <span className="text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Waktu',
      width: '150px',
      render: (value, item) => (
        <div>
          <div className="flex items-center gap-1.5 text-gray-700">
            <FiCalendar size={14} />
            <span className="text-sm">{new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 mt-0.5">
            <FiClock size={14} />
            <span className="text-xs">{item.time}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Lokasi',
      width: '180px',
    },
    {
      key: 'type',
      label: 'Tipe',
      width: '120px',
      render: (value) => {
        const typeConfig = {
          check_in: { icon: FiCheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Check In' },
          check_out: { icon: FiXCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Check Out' },
          checkpoint: { icon: FiCheckCircle, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Checkpoint' },
        };
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
      options: users,
    },
    {
      key: 'type',
      label: 'Tipe',
      options: [
        { value: 'check_in', label: 'Check In' },
        { value: 'check_out', label: 'Check Out' },
        { value: 'checkpoint', label: 'Checkpoint' },
      ],
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  // Filter data
  const filteredData = data.filter((item) => {
    const matchSearch = item.task.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.location.toLowerCase().includes(searchValue.toLowerCase());
    const matchUser = !filterValues.user_id || item.user_id === filterValues.user_id;
    const matchType = !filterValues.type || item.type === filterValues.type;
    return matchSearch && matchUser && matchType;
  });

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

      <DataTable
        columns={columns}
        data={filteredData}
        showActions={false}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredData.length / 10)}
        onPageChange={setCurrentPage}
      />
    </MainLayout>
  );
};

export default TaskLogs;

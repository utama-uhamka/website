import { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import {
  DataTable,
  Modal,
  SearchFilter,
  StatusBadge,
  PageHeader,
} from '../../components/ui';
import { FiUser, FiCalendar, FiClock, FiMapPin, FiImage } from 'react-icons/fi';

const Activities = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Dummy data
  const users = [
    { value: '1', label: 'Ahmad Fauzi' },
    { value: '2', label: 'Budi Santoso' },
    { value: '3', label: 'Citra Dewi' },
    { value: '4', label: 'Dani Pratama' },
  ];

  const statuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Disetujui' },
    { value: 'rejected', label: 'Ditolak' },
  ];

  const data = [
    { id: 1, title: 'Patrol Gedung Rektorat', description: 'Melakukan patrol keamanan di seluruh area gedung termasuk pengecekan pintu, jendela, dan area parkir.', location: 'Gedung Rektorat', date: '2024-12-27', start_time: '08:00', end_time: '10:00', user: 'Ahmad Fauzi', user_id: '1', image: '/patrol1.jpg', status: 'approved' },
    { id: 2, title: 'Pembersihan Lantai 2', description: 'Membersihkan seluruh area lantai 2 termasuk ruang kelas, koridor, dan toilet.', location: 'Gedung FKIP Lt. 2', date: '2024-12-27', start_time: '07:00', end_time: '09:00', user: 'Budi Santoso', user_id: '2', image: null, status: 'approved' },
    { id: 3, title: 'Pengecekan AC', description: 'Melakukan pengecekan dan maintenance AC di beberapa ruangan yang dilaporkan bermasalah.', location: 'Gedung FEB', date: '2024-12-27', start_time: '13:00', end_time: '15:00', user: 'Citra Dewi', user_id: '3', image: null, status: 'pending' },
    { id: 4, title: 'Perawatan Taman', description: 'Menyiram dan merawat tanaman di area taman, termasuk pemangkasan dan pembersihan.', location: 'Taman Kampus A', date: '2024-12-26', start_time: '06:00', end_time: '08:00', user: 'Dani Pratama', user_id: '4', image: '/taman1.jpg', status: 'approved' },
    { id: 5, title: 'Perbaikan Pintu', description: 'Memperbaiki engsel pintu yang rusak dan melumasi engsel yang sudah aus.', location: 'Ruang 101 - Ged. Rektorat', date: '2024-12-26', start_time: '10:00', end_time: '12:00', user: 'Budi Santoso', user_id: '2', image: null, status: 'approved' },
    { id: 6, title: 'Pengecekan Listrik', description: 'Cek instalasi listrik di gedung baru sebelum digunakan.', location: 'Gedung Baru', date: '2024-12-25', start_time: '09:00', end_time: '11:00', user: 'Citra Dewi', user_id: '3', image: null, status: 'rejected' },
  ];

  const columns = [
    {
      key: 'title',
      label: 'Kegiatan',
      render: (value, item) => (
        <div>
          <p className="font-medium text-gray-800">{value}</p>
          <p className="text-xs text-gray-500 mt-0.5">{item.description.substring(0, 50)}...</p>
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
      label: 'Tanggal',
      width: '130px',
      render: (value, item) => (
        <div>
          <div className="flex items-center gap-1.5 text-gray-700">
            <FiCalendar size={14} />
            <span className="text-sm">{new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 mt-0.5">
            <FiClock size={14} />
            <span className="text-xs">{item.start_time} - {item.end_time}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Lokasi',
      width: '180px',
      render: (value) => (
        <div className="flex items-center gap-1.5 text-gray-600">
          <FiMapPin size={14} />
          <span className="text-sm">{value}</span>
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
      options: users,
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

  // Filter data
  const filteredData = data.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(searchValue.toLowerCase());
    const matchUser = !filterValues.user_id || item.user_id === filterValues.user_id;
    const matchStatus = !filterValues.status || item.status === filterValues.status;
    return matchSearch && matchUser && matchStatus;
  });

  // Stats
  const pendingCount = data.filter(d => d.status === 'pending').length;
  const approvedCount = data.filter(d => d.status === 'approved').length;

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
          <p className="text-2xl font-bold text-gray-800">{data.length}</p>
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

      <DataTable
        columns={columns}
        data={filteredData}
        onView={handleView}
        actionColumn={{ edit: false, delete: false, view: true }}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredData.length / 10)}
        onPageChange={setCurrentPage}
      />

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
              <h3 className="text-lg font-semibold text-gray-800">{selectedItem.title}</h3>
              <StatusBadge status={selectedItem.status} />
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">{selectedItem.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <FiUser className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Petugas</p>
                  <span className="text-sm font-medium">{selectedItem.user}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Tanggal</p>
                  <span className="text-sm font-medium">{new Date(selectedItem.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiClock className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Waktu</p>
                  <span className="text-sm font-medium">{selectedItem.start_time} - {selectedItem.end_time}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiMapPin className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Lokasi</p>
                  <span className="text-sm font-medium">{selectedItem.location}</span>
                </div>
              </div>
            </div>
            {selectedItem.image && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Foto Kegiatan</p>
                <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FiImage size={32} className="text-gray-400" />
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </MainLayout>
  );
};

export default Activities;

import { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import {
  DataTable,
  Modal,
  SearchFilter,
  StatusBadge,
  PageHeader,
} from '../components/ui';
import { FiUser, FiImage, FiMapPin, FiCalendar } from 'react-icons/fi';

const Issue = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Dummy data
  const priorities = [
    { value: 'low', label: 'Rendah' },
    { value: 'medium', label: 'Sedang' },
    { value: 'high', label: 'Tinggi' },
    { value: 'critical', label: 'Kritis' },
  ];

  const statuses = [
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ];

  const data = [
    { id: 1, title: 'AC Ruang 101 tidak dingin', description: 'AC di ruang 101 sudah dinyalakan tapi tidak dingin. Sudah dicek filter dan remote, namun tetap tidak berfungsi dengan baik.', location: 'Ruang 101 - Gedung Rektorat', priority: 'high', reporter: 'Ahmad Fauzi', reporter_id: '1', assigned: 'Dani Pratama', assigned_id: '4', created_at: '2024-12-27', status: 'in_progress', image: '/issue1.jpg' },
    { id: 2, title: 'Lampu koridor mati', description: 'Beberapa lampu di koridor lantai 2 mati, membuat area menjadi gelap terutama di malam hari.', location: 'Koridor Lt.2 - Gedung FKIP', priority: 'medium', reporter: 'Budi Santoso', reporter_id: '2', assigned: 'Dani Pratama', assigned_id: '4', created_at: '2024-12-26', status: 'open', image: null },
    { id: 3, title: 'Kebocoran pipa kamar mandi', description: 'Pipa di kamar mandi lantai 1 bocor dan air menggenang di lantai. Perlu segera diperbaiki.', location: 'KM Lt.1 - Gedung FEB', priority: 'critical', reporter: 'Citra Dewi', reporter_id: '3', assigned: null, assigned_id: null, created_at: '2024-12-27', status: 'open', image: '/issue3.jpg' },
    { id: 4, title: 'Pintu kelas tidak bisa dikunci', description: 'Kunci pintu ruang 201 rusak sehingga tidak bisa dikunci dengan baik.', location: 'Ruang 201 - Gedung FKIP', priority: 'high', reporter: 'Ahmad Fauzi', reporter_id: '1', assigned: 'Budi Santoso', assigned_id: '2', created_at: '2024-12-25', status: 'resolved', image: null },
    { id: 5, title: 'Proyektor error', description: 'Proyektor di ruang rapat menampilkan warna aneh dan gambar tidak fokus.', location: 'Ruang Rapat A - Gedung Rektorat', priority: 'medium', reporter: 'Dani Pratama', reporter_id: '4', assigned: 'Ahmad Fauzi', assigned_id: '1', created_at: '2024-12-24', status: 'closed', image: null },
    { id: 6, title: 'Keran air macet', description: 'Keran air di pantry tidak bisa diputar, kemungkinan karat.', location: 'Pantry - Gedung Rektorat', priority: 'low', reporter: 'Budi Santoso', reporter_id: '2', assigned: null, assigned_id: null, created_at: '2024-12-27', status: 'open', image: null },
  ];

  const columns = [
    {
      key: 'title',
      label: 'Issue',
      render: (value, item) => (
        <div>
          <p className="font-medium text-gray-800">{value}</p>
          <p className="text-xs text-gray-500 mt-0.5">{item.location}</p>
        </div>
      ),
    },
    {
      key: 'priority',
      label: 'Prioritas',
      width: '100px',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'reporter',
      label: 'Pelapor',
      width: '130px',
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
            <FiUser size={14} className="text-gray-500" />
          </div>
          <span className="text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: 'assigned',
      label: 'Ditugaskan',
      width: '130px',
      render: (value) => value ? (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            <FiUser size={14} className="text-primary" />
          </div>
          <span className="text-sm">{value}</span>
        </div>
      ) : (
        <span className="text-gray-400 text-sm">Belum ditugaskan</span>
      ),
    },
    {
      key: 'created_at',
      label: 'Tanggal',
      width: '110px',
      render: (value) => {
        const date = new Date(value);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      },
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
      key: 'priority',
      label: 'Prioritas',
      options: priorities,
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
    const matchSearch =
      item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.location.toLowerCase().includes(searchValue.toLowerCase());
    const matchPriority = !filterValues.priority || item.priority === filterValues.priority;
    const matchStatus = !filterValues.status || item.status === filterValues.status;
    return matchSearch && matchPriority && matchStatus;
  });

  // Stats
  const openCount = data.filter(d => d.status === 'open').length;
  const inProgressCount = data.filter(d => d.status === 'in_progress').length;
  const resolvedCount = data.filter(d => d.status === 'resolved' || d.status === 'closed').length;

  return (
    <MainLayout>
      <PageHeader
        title="Issue Management"
        subtitle="Lihat laporan masalah dari aplikasi mobile"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Issue' },
        ]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Issue</p>
          <p className="text-2xl font-bold text-gray-800">{data.length}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-blue-600 mb-1">Open</p>
          <p className="text-2xl font-bold text-blue-700">{openCount}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-yellow-600 mb-1">In Progress</p>
          <p className="text-2xl font-bold text-yellow-700">{inProgressCount}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-green-600 mb-1">Resolved</p>
          <p className="text-2xl font-bold text-green-700">{resolvedCount}</p>
        </div>
      </div>

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari judul atau lokasi..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        showExport={true}
        onExport={() => console.log('Export issues')}
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
        title="Detail Issue"
        showFooter={false}
        size="lg"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{selectedItem.title}</h3>
              <div className="flex items-center gap-3 mt-2">
                <StatusBadge status={selectedItem.priority} />
                <StatusBadge status={selectedItem.status} />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">{selectedItem.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Lokasi</p>
                <div className="flex items-center gap-2">
                  <FiMapPin size={14} className="text-gray-400" />
                  <span className="text-sm font-medium">{selectedItem.location}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Tanggal Lapor</p>
                <div className="flex items-center gap-2">
                  <FiCalendar size={14} className="text-gray-400" />
                  <span className="text-sm font-medium">{new Date(selectedItem.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Pelapor</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <FiUser size={12} className="text-gray-500" />
                  </div>
                  <span className="text-sm font-medium">{selectedItem.reporter}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Ditugaskan ke</p>
                {selectedItem.assigned ? (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <FiUser size={12} className="text-primary" />
                    </div>
                    <span className="text-sm font-medium">{selectedItem.assigned}</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">Belum ditugaskan</span>
                )}
              </div>
            </div>

            {selectedItem.image && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Foto Lampiran</p>
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

export default Issue;

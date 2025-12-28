import { useState, useEffect, useMemo } from 'react';
import MainLayout from '../layouts/MainLayout';
import {
  DataTable,
  Modal,
  SearchFilter,
  PageHeader,
} from '../components/ui';
import { FiCalendar, FiClock, FiMapPin, FiAward, FiUsers } from 'react-icons/fi';

const Trainings = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const itemsPerPage = 10;

  // Dummy data
  const statuses = [
    { value: 'upcoming', label: 'Akan Datang' },
    { value: 'ongoing', label: 'Berlangsung' },
    { value: 'completed', label: 'Selesai' },
    { value: 'cancelled', label: 'Dibatalkan' },
  ];

  const allData = [
    { id: 1, title: 'Pelatihan K3 Dasar', description: 'Pelatihan keselamatan dan kesehatan kerja untuk semua karyawan. Materi meliputi penggunaan APD, prosedur evakuasi, dan penanganan darurat.', trainer: 'Ir. Budi Hartono', location: 'Aula Gedung Rektorat', date: '2025-01-15', start_time: '09:00', end_time: '16:00', participants: 50, participants_count: 45, status: 'upcoming' },
    { id: 2, title: 'Workshop Penggunaan Sistem', description: 'Pelatihan penggunaan sistem informasi manajemen fasilitas baru. Peserta akan belajar fitur-fitur dasar hingga advanced.', trainer: 'Tim IT Support', location: 'Lab Komputer', date: '2025-01-10', start_time: '13:00', end_time: '17:00', participants: 30, participants_count: 28, status: 'upcoming' },
    { id: 3, title: 'Training Leadership', description: 'Pelatihan kepemimpinan untuk supervisor dan koordinator. Materi meliputi komunikasi efektif, manajemen tim, dan pengambilan keputusan.', trainer: 'Dr. Maria Sari', location: 'Ruang Rapat A', date: '2024-12-20', start_time: '09:00', end_time: '12:00', participants: 15, participants_count: 15, status: 'completed' },
    { id: 4, title: 'Pelatihan Customer Service', description: 'Meningkatkan kualitas pelayanan kepada civitas akademika. Fokus pada handling complaint dan komunikasi yang efektif.', trainer: 'Dra. Ani Wijaya', location: 'Aula FKIP', date: '2024-12-15', start_time: '08:00', end_time: '15:00', participants: 25, participants_count: 22, status: 'completed' },
    { id: 5, title: 'Workshop Digital Marketing', description: 'Strategi pemasaran digital untuk promosi kampus dan unit bisnis. Meliputi social media management dan content creation.', trainer: 'Ahmad Fauzi, S.Kom', location: 'Lab Komputer', date: '2024-12-10', start_time: '09:00', end_time: '16:00', participants: 20, participants_count: 18, status: 'completed' },
    { id: 6, title: 'Pelatihan First Aid', description: 'Pelatihan pertolongan pertama pada kecelakaan untuk tim keamanan dan kebersihan.', trainer: 'Dr. Siti Rahayu', location: 'Klinik Kampus', date: '2025-02-01', start_time: '08:00', end_time: '12:00', participants: 40, participants_count: 35, status: 'upcoming' },
    { id: 7, title: 'Workshop Excel Advanced', description: 'Pelatihan penggunaan Microsoft Excel tingkat lanjut untuk administrasi dan keuangan.', trainer: 'Drs. Hendra Kusuma', location: 'Lab Komputer', date: '2024-11-25', start_time: '09:00', end_time: '15:00', participants: 25, participants_count: 25, status: 'completed' },
    { id: 8, title: 'Training Fire Safety', description: 'Pelatihan keselamatan kebakaran dan penggunaan APAR.', trainer: 'Damkar Jakarta Timur', location: 'Lapangan Utama', date: '2025-01-20', start_time: '08:00', end_time: '12:00', participants: 100, participants_count: 75, status: 'upcoming' },
    { id: 9, title: 'Workshop Public Speaking', description: 'Pelatihan berbicara di depan umum untuk dosen dan staf.', trainer: 'Prof. Dr. Ahmad Hidayat', location: 'Auditorium', date: '2024-12-05', start_time: '13:00', end_time: '17:00', participants: 30, participants_count: 28, status: 'completed' },
    { id: 10, title: 'Pelatihan Cyber Security', description: 'Pelatihan keamanan siber dasar untuk seluruh karyawan.', trainer: 'Tim IT Security', location: 'Lab Komputer', date: '2025-02-15', start_time: '09:00', end_time: '16:00', participants: 35, participants_count: 20, status: 'upcoming' },
    { id: 11, title: 'Workshop Time Management', description: 'Teknik manajemen waktu efektif untuk produktivitas kerja.', trainer: 'Dr. Rina Anggraini', location: 'Ruang Rapat B', date: '2024-11-20', start_time: '09:00', end_time: '12:00', participants: 20, participants_count: 18, status: 'completed' },
    { id: 12, title: 'Training Cleaning Standards', description: 'Standar kebersihan dan sanitasi untuk tim housekeeping.', trainer: 'Supervisor Cleaning', location: 'Aula Gedung B', date: '2024-12-01', start_time: '08:00', end_time: '11:00', participants: 45, participants_count: 42, status: 'completed' },
  ];

  const columns = [
    {
      key: 'title',
      label: 'Pelatihan',
      render: (value, item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FiAward size={18} className="text-primary" />
          </div>
          <div>
            <p className="font-medium text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">Trainer: {item.trainer}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Jadwal',
      width: '150px',
      render: (value, item) => (
        <div>
          <div className="flex items-center gap-1.5 text-gray-700">
            <FiCalendar size={14} />
            <span className="text-sm">{new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
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
          <FiMapPin size={14} className="flex-shrink-0" />
          <span className="text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: 'participants_count',
      label: 'Peserta',
      width: '100px',
      render: (value, item) => (
        <div className="flex items-center gap-1.5">
          <FiUsers size={14} className="text-gray-400" />
          <span className="text-sm">{value}/{item.participants}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '120px',
      render: (value) => {
        const statusColors = {
          upcoming: 'bg-blue-100 text-blue-700',
          ongoing: 'bg-green-100 text-green-700',
          completed: 'bg-gray-100 text-gray-700',
          cancelled: 'bg-red-100 text-red-700',
        };
        const statusLabels = {
          upcoming: 'Akan Datang',
          ongoing: 'Berlangsung',
          completed: 'Selesai',
          cancelled: 'Dibatalkan',
        };
        return (
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap ${statusColors[value]}`}>
            {statusLabels[value]}
          </span>
        );
      },
    },
  ];

  const filters = [
    {
      key: 'status',
      label: 'Status',
      options: statuses,
    },
  ];

  // Filter, sort, and paginate data
  const { paginatedData, totalItems, totalPages } = useMemo(() => {
    // Filter
    let filtered = allData.filter((item) => {
      const matchSearch = item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.trainer.toLowerCase().includes(searchValue.toLowerCase());
      const matchStatus = !filterValues.status || item.status === filterValues.status;
      return matchSearch && matchStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      const aVal = a[sortColumn] || '';
      const bVal = b[sortColumn] || '';
      if (sortDirection === 'asc') {
        return aVal.toString().localeCompare(bVal.toString());
      }
      return bVal.toString().localeCompare(aVal.toString());
    });

    const total = filtered.length;
    const pages = Math.ceil(total / itemsPerPage);

    // Paginate
    const start = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(start, start + itemsPerPage);

    return { paginatedData: paginated, totalItems: total, totalPages: pages };
  }, [allData, searchValue, filterValues, sortColumn, sortDirection, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, filterValues]);

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

  // Stats
  const upcomingCount = allData.filter(d => d.status === 'upcoming').length;
  const completedCount = allData.filter(d => d.status === 'completed').length;

  return (
    <MainLayout>
      <PageHeader
        title="Pelatihan"
        subtitle="Lihat jadwal dan informasi pelatihan"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'User Management', path: null },
          { label: 'Pelatihan' },
        ]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Pelatihan</p>
          <p className="text-2xl font-bold text-gray-800">{allData.length}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-blue-600 mb-1">Akan Datang</p>
          <p className="text-2xl font-bold text-blue-700">{upcomingCount}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-green-600 mb-1">Selesai</p>
          <p className="text-2xl font-bold text-green-700">{completedCount}</p>
        </div>
      </div>

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari judul atau trainer..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        showExport={true}
        onExport={() => console.log('Export trainings')}
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
        title="Detail Pelatihan"
        showFooter={false}
        size="lg"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FiAward size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{selectedItem.title}</h3>
                <p className="text-sm text-gray-500">Trainer: {selectedItem.trainer}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">{selectedItem.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Tanggal</p>
                <div className="flex items-center gap-2">
                  <FiCalendar size={14} className="text-gray-400" />
                  <span className="text-sm font-medium">{new Date(selectedItem.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Waktu</p>
                <div className="flex items-center gap-2">
                  <FiClock size={14} className="text-gray-400" />
                  <span className="text-sm font-medium">{selectedItem.start_time} - {selectedItem.end_time}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Lokasi</p>
                <div className="flex items-center gap-2">
                  <FiMapPin size={14} className="text-gray-400" />
                  <span className="text-sm font-medium">{selectedItem.location}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Peserta</p>
                <div className="flex items-center gap-2">
                  <FiUsers size={14} className="text-gray-400" />
                  <span className="text-sm font-medium">{selectedItem.participants_count} dari {selectedItem.participants} orang</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2">Status</p>
              {(() => {
                const statusColors = {
                  upcoming: 'bg-blue-100 text-blue-700',
                  ongoing: 'bg-green-100 text-green-700',
                  completed: 'bg-gray-100 text-gray-700',
                  cancelled: 'bg-red-100 text-red-700',
                };
                const statusLabels = {
                  upcoming: 'Akan Datang',
                  ongoing: 'Berlangsung',
                  completed: 'Selesai',
                  cancelled: 'Dibatalkan',
                };
                return (
                  <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${statusColors[selectedItem.status]}`}>
                    {statusLabels[selectedItem.status]}
                  </span>
                );
              })()}
            </div>

            {/* Progress bar for participants */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Kapasitas Terisi</span>
                <span className="font-medium">{Math.round((selectedItem.participants_count / selectedItem.participants) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2 transition-all"
                  style={{ width: `${(selectedItem.participants_count / selectedItem.participants) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </MainLayout>
  );
};

export default Trainings;

import { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import {
  DataTable,
  Modal,
  SearchFilter,
  FormInput,
  ConfirmDialog,
  PageHeader,
} from '../components/ui';
import { FiCalendar, FiClock, FiMapPin, FiImage, FiUsers } from 'react-icons/fi';

const Event = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    location: '',
    date: '',
    start_time: '',
    end_time: '',
    capacity: '',
    organizer: '',
    status: 'upcoming',
  });

  // Dummy data
  const categories = [
    { value: '1', label: 'Seminar' },
    { value: '2', label: 'Rapat' },
    { value: '3', label: 'Wisuda' },
    { value: '4', label: 'Pelatihan' },
    { value: '5', label: 'Lomba' },
    { value: '6', label: 'Kegiatan Mahasiswa' },
  ];

  const statuses = [
    { value: 'upcoming', label: 'Akan Datang' },
    { value: 'ongoing', label: 'Berlangsung' },
    { value: 'completed', label: 'Selesai' },
    { value: 'cancelled', label: 'Dibatalkan' },
  ];

  const data = [
    { id: 1, title: 'Seminar Nasional Teknologi', description: 'Seminar teknologi informasi terkini', category: 'Seminar', category_id: '1', color: '#4A22AD', location: 'Aula Gedung Rektorat', date: '2025-01-15', start_time: '08:00', end_time: '16:00', capacity: 500, attendees: 420, organizer: 'Fakultas Teknik', image: null, status: 'upcoming' },
    { id: 2, title: 'Rapat Koordinasi Bulanan', description: 'Rapat koordinasi seluruh pimpinan', category: 'Rapat', category_id: '2', color: '#2563EB', location: 'Ruang Rapat A', date: '2025-01-10', start_time: '09:00', end_time: '12:00', capacity: 30, attendees: 25, organizer: 'Rektorat', image: null, status: 'upcoming' },
    { id: 3, title: 'Wisuda Periode Januari', description: 'Wisuda mahasiswa periode Januari 2025', category: 'Wisuda', category_id: '3', color: '#059669', location: 'Gedung Convention Center', date: '2025-01-25', start_time: '08:00', end_time: '14:00', capacity: 2000, attendees: 1500, organizer: 'Rektorat', image: null, status: 'upcoming' },
    { id: 4, title: 'Pelatihan Penggunaan Sistem', description: 'Pelatihan untuk admin sistem baru', category: 'Pelatihan', category_id: '4', color: '#D97706', location: 'Lab Komputer', date: '2025-01-08', start_time: '13:00', end_time: '17:00', capacity: 40, attendees: 35, organizer: 'IT Support', image: null, status: 'upcoming' },
    { id: 5, title: 'Lomba Debat Bahasa Inggris', description: 'Kompetisi debat antar fakultas', category: 'Lomba', category_id: '5', color: '#7C3AED', location: 'Aula FKIP', date: '2024-12-20', start_time: '08:00', end_time: '17:00', capacity: 200, attendees: 180, organizer: 'HMJ Bahasa Inggris', image: null, status: 'completed' },
    { id: 6, title: 'Festival Seni Budaya', description: 'Festival tahunan seni dan budaya', category: 'Kegiatan Mahasiswa', category_id: '6', color: '#0891B2', location: 'Lapangan Kampus A', date: '2024-12-15', start_time: '07:00', end_time: '22:00', capacity: 1000, attendees: 850, organizer: 'BEM', image: null, status: 'completed' },
  ];

  const columns = [
    {
      key: 'title',
      label: 'Event',
      render: (value, item) => (
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-12 rounded-full"
            style={{ backgroundColor: item.color }}
          ></div>
          <div>
            <p className="font-medium text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">{item.category}</p>
          </div>
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
            <span className="text-sm">{new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 mt-1">
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
      key: 'attendees',
      label: 'Peserta',
      width: '100px',
      render: (value, item) => (
        <div className="flex items-center gap-1.5">
          <FiUsers size={14} className="text-gray-400" />
          <span className="text-sm">{value}/{item.capacity}</span>
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
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[value]}`}>
            {statusLabels[value]}
          </span>
        );
      },
    },
  ];

  const filters = [
    {
      key: 'category_id',
      label: 'Kategori',
      options: categories,
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

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({
      title: '',
      description: '',
      category_id: '',
      location: '',
      date: '',
      start_time: '',
      end_time: '',
      capacity: '',
      organizer: '',
      status: 'upcoming',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      category_id: item.category_id,
      location: item.location,
      date: item.date,
      start_time: item.start_time,
      end_time: item.end_time,
      capacity: item.capacity,
      organizer: item.organizer,
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    console.log('Deleted:', selectedItem);
    setIsDeleteOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Filter data
  const filteredData = data.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.location.toLowerCase().includes(searchValue.toLowerCase());
    const matchCategory = !filterValues.category_id || item.category_id === filterValues.category_id;
    const matchStatus = !filterValues.status || item.status === filterValues.status;
    return matchSearch && matchCategory && matchStatus;
  });

  // Stats
  const upcomingCount = data.filter(d => d.status === 'upcoming').length;
  const totalAttendees = data.reduce((sum, d) => sum + d.attendees, 0);

  return (
    <MainLayout>
      <PageHeader
        title="Event Management"
        subtitle="Kelola event dan kegiatan universitas"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Event' },
        ]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Event</p>
          <p className="text-2xl font-bold text-gray-800">{data.length}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-blue-600 mb-1">Event Akan Datang</p>
          <p className="text-2xl font-bold text-blue-700">{upcomingCount}</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-purple-600 mb-1">Total Peserta</p>
          <p className="text-2xl font-bold text-purple-700">{totalAttendees.toLocaleString('id-ID')}</p>
        </div>
      </div>

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari judul atau lokasi..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onAdd={handleAdd}
        addLabel="Tambah Event"
        showExport={true}
        onExport={() => console.log('Export events')}
      />

      <DataTable
        columns={columns}
        data={filteredData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        actionColumn={{ edit: true, delete: true, view: true }}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredData.length / 10)}
        onPageChange={setCurrentPage}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Event' : 'Tambah Event'}
        onSubmit={handleSubmit}
        size="lg"
      >
        <FormInput
          label="Judul Event"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Masukkan judul event"
          required
        />
        <FormInput
          label="Deskripsi"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Deskripsi event"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Kategori"
            name="category_id"
            type="select"
            value={formData.category_id}
            onChange={handleInputChange}
            options={categories}
            required
          />
          <FormInput
            label="Lokasi"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Contoh: Aula Gedung Rektorat"
            required
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormInput
            label="Tanggal"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
          <FormInput
            label="Jam Mulai"
            name="start_time"
            type="time"
            value={formData.start_time}
            onChange={handleInputChange}
            required
          />
          <FormInput
            label="Jam Selesai"
            name="end_time"
            type="time"
            value={formData.end_time}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Kapasitas"
            name="capacity"
            type="number"
            value={formData.capacity}
            onChange={handleInputChange}
            placeholder="Jumlah maksimal peserta"
          />
          <FormInput
            label="Penyelenggara"
            name="organizer"
            value={formData.organizer}
            onChange={handleInputChange}
            placeholder="Contoh: Fakultas Teknik"
          />
        </div>
        <FormInput
          label="Status"
          name="status"
          type="select"
          value={formData.status}
          onChange={handleInputChange}
          options={statuses}
        />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Banner Event
          </label>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <FiImage className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-sm text-gray-500">Klik untuk upload banner</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG (1200x630px recommended)</p>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Detail Event"
        showFooter={false}
        size="lg"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div
                className="w-3 h-3 rounded-full mt-1.5"
                style={{ backgroundColor: selectedItem.color }}
              ></div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{selectedItem.title}</h3>
                <p className="text-sm text-gray-500">{selectedItem.category}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">{selectedItem.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-gray-400" />
                <span className="text-sm">{new Date(selectedItem.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock className="text-gray-400" />
                <span className="text-sm">{selectedItem.start_time} - {selectedItem.end_time}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiMapPin className="text-gray-400" />
                <span className="text-sm">{selectedItem.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiUsers className="text-gray-400" />
                <span className="text-sm">{selectedItem.attendees}/{selectedItem.capacity} peserta</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Penyelenggara</p>
              <p className="text-sm font-medium">{selectedItem.organizer}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Event"
        message={`Apakah Anda yakin ingin menghapus event "${selectedItem?.title}"?`}
        confirmText="Ya, Hapus"
        type="danger"
      />
    </MainLayout>
  );
};

export default Event;

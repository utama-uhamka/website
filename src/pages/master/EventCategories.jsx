import { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import {
  DataTable,
  Modal,
  SearchFilter,
  FormInput,
  StatusBadge,
  ConfirmDialog,
  PageHeader,
} from '../../components/ui';

const EventCategories = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#4A22AD',
    description: '',
    status: 'active',
  });

  // Dummy data
  const data = [
    { id: 1, name: 'Seminar', color: '#4A22AD', description: 'Seminar dan workshop akademik', event_count: 15, status: 'active' },
    { id: 2, name: 'Rapat', color: '#2563EB', description: 'Rapat internal universitas', event_count: 45, status: 'active' },
    { id: 3, name: 'Wisuda', color: '#059669', description: 'Upacara wisuda dan kelulusan', event_count: 4, status: 'active' },
    { id: 4, name: 'Dies Natalis', color: '#DC2626', description: 'Perayaan ulang tahun universitas', event_count: 1, status: 'active' },
    { id: 5, name: 'Pelatihan', color: '#D97706', description: 'Pelatihan dan pengembangan SDM', event_count: 12, status: 'active' },
    { id: 6, name: 'Lomba', color: '#7C3AED', description: 'Kompetisi dan perlombaan', event_count: 8, status: 'active' },
    { id: 7, name: 'Kegiatan Mahasiswa', color: '#0891B2', description: 'Kegiatan UKM dan organisasi', event_count: 30, status: 'active' },
    { id: 8, name: 'Lainnya', color: '#6B7280', description: 'Kategori lainnya', event_count: 5, status: 'inactive' },
  ];

  const columns = [
    {
      key: 'color',
      label: 'Warna',
      width: '80px',
      render: (value) => (
        <div className="flex items-center justify-center">
          <div
            className="w-6 h-6 rounded-full border-2 border-white shadow"
            style={{ backgroundColor: value }}
          ></div>
        </div>
      ),
    },
    { key: 'name', label: 'Nama Kategori' },
    { key: 'description', label: 'Deskripsi' },
    { key: 'event_count', label: 'Jumlah Event', width: '120px' },
    {
      key: 'status',
      label: 'Status',
      width: '100px',
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  const filters = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'active', label: 'Aktif' },
        { value: 'inactive', label: 'Nonaktif' },
      ],
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({ name: '', color: '#4A22AD', description: '', status: 'active' });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      color: item.color,
      description: item.description,
      status: item.status,
    });
    setIsModalOpen(true);
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
    const matchSearch = item.name.toLowerCase().includes(searchValue.toLowerCase());
    const matchStatus = !filterValues.status || item.status === filterValues.status;
    return matchSearch && matchStatus;
  });

  // Predefined colors
  const colorOptions = [
    { value: '#4A22AD', label: 'Ungu' },
    { value: '#2563EB', label: 'Biru' },
    { value: '#059669', label: 'Hijau' },
    { value: '#DC2626', label: 'Merah' },
    { value: '#D97706', label: 'Orange' },
    { value: '#7C3AED', label: 'Violet' },
    { value: '#0891B2', label: 'Cyan' },
    { value: '#6B7280', label: 'Abu-abu' },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Kategori Event"
        subtitle="Kelola kategori untuk event dan kegiatan"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Master Data', path: null },
          { label: 'Kategori Event' },
        ]}
      />

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari nama kategori..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onAdd={handleAdd}
        addLabel="Tambah Kategori"
      />

      <DataTable
        columns={columns}
        data={filteredData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredData.length / 10)}
        onPageChange={setCurrentPage}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Kategori' : 'Tambah Kategori'}
        onSubmit={handleSubmit}
      >
        <FormInput
          label="Nama Kategori"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Contoh: Seminar"
          required
        />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Warna <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg border-2 border-gray-200"
              style={{ backgroundColor: formData.color }}
            ></div>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, color: color.value }))}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${
                    formData.color === color.value
                      ? 'border-gray-800 scale-110'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                ></button>
              ))}
            </div>
          </div>
        </div>
        <FormInput
          label="Deskripsi"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Deskripsi kategori event"
        />
        <FormInput
          label="Status"
          name="status"
          type="select"
          value={formData.status}
          onChange={handleInputChange}
          options={[
            { value: 'active', label: 'Aktif' },
            { value: 'inactive', label: 'Nonaktif' },
          ]}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Kategori"
        message={`Apakah Anda yakin ingin menghapus "${selectedItem?.name}"? Event dengan kategori ini akan perlu dipindahkan.`}
        confirmText="Ya, Hapus"
        type="danger"
      />
    </MainLayout>
  );
};

export default EventCategories;

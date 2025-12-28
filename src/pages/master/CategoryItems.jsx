import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const CategoryItems = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    status: 'active',
  });

  // Dummy data
  const data = [
    { id: 1, name: 'Elektronik', code: 'ELK', description: 'Peralatan elektronik seperti komputer, printer, dll', item_count: 45, status: 'active' },
    { id: 2, name: 'Furniture', code: 'FRN', description: 'Meja, kursi, lemari, dan perabotan lainnya', item_count: 120, status: 'active' },
    { id: 3, name: 'Alat Tulis Kantor', code: 'ATK', description: 'Perlengkapan kantor seperti kertas, pulpen, dll', item_count: 80, status: 'active' },
    { id: 4, name: 'Peralatan Lab', code: 'LAB', description: 'Peralatan laboratorium', item_count: 35, status: 'active' },
    { id: 5, name: 'Kendaraan', code: 'KDR', description: 'Mobil, motor, dan kendaraan operasional', item_count: 12, status: 'active' },
    { id: 6, name: 'Peralatan Kebersihan', code: 'KBS', description: 'Sapu, pel, dan alat kebersihan', item_count: 25, status: 'active' },
    { id: 7, name: 'Peralatan Dapur', code: 'DPR', description: 'Peralatan untuk dapur dan pantry', item_count: 18, status: 'inactive' },
  ];

  const columns = [
    { key: 'code', label: 'Kode', width: '80px' },
    { key: 'name', label: 'Nama Kategori' },
    { key: 'description', label: 'Deskripsi' },
    { key: 'item_count', label: 'Jumlah Item', width: '120px' },
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
    setFormData({ name: '', code: '', description: '', status: 'active' });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      code: item.code,
      description: item.description,
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleView = (item) => {
    navigate(`/master/category-items/${item.id}`);
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
      item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.code.toLowerCase().includes(searchValue.toLowerCase());
    const matchStatus = !filterValues.status || item.status === filterValues.status;
    return matchSearch && matchStatus;
  });

  return (
    <MainLayout>
      <PageHeader
        title="Kategori Item"
        subtitle="Kelola kategori untuk inventaris"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Master Data', path: null },
          { label: 'Kategori Item' },
        ]}
      />

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari nama atau kode kategori..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onAdd={handleAdd}
        addLabel="Tambah Kategori"
      />

      <DataTable
        columns={columns}
        data={filteredData}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredData.length / 10)}
        onPageChange={setCurrentPage}
        showActions={true}
        actionColumn={{ view: true, edit: true, delete: true }}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Kategori' : 'Tambah Kategori'}
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Kode Kategori"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            placeholder="Contoh: ELK"
            required
          />
          <FormInput
            label="Nama Kategori"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Contoh: Elektronik"
            required
          />
        </div>
        <FormInput
          label="Deskripsi"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Deskripsi kategori item"
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
        message={`Apakah Anda yakin ingin menghapus "${selectedItem?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        type="danger"
      />
    </MainLayout>
  );
};

export default CategoryItems;

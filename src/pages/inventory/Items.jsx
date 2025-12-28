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
import { FiPackage, FiImage } from 'react-icons/fi';

const Items = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category_id: '',
    room_id: '',
    quantity: '',
    condition: '',
    purchase_date: '',
    purchase_price: '',
    description: '',
    status: 'active',
  });

  // Dummy data
  const categories = [
    { value: '1', label: 'Elektronik' },
    { value: '2', label: 'Furniture' },
    { value: '3', label: 'Alat Tulis Kantor' },
    { value: '4', label: 'Peralatan Lab' },
  ];

  const rooms = [
    { value: '1', label: 'Ruang 101 - Ged. Rektorat' },
    { value: '2', label: 'Lab Komputer - Ged. Rektorat' },
    { value: '3', label: 'Ruang Rapat A - Ged. Rektorat' },
    { value: '4', label: 'Kantor Dosen - Ged. FKIP' },
  ];

  const conditions = [
    { value: 'good', label: 'Baik' },
    { value: 'fair', label: 'Cukup' },
    { value: 'poor', label: 'Kurang' },
    { value: 'broken', label: 'Rusak' },
  ];

  const data = [
    { id: 1, name: 'Komputer Desktop Dell', code: 'ELK-001', category: 'Elektronik', category_id: '1', room: 'Lab Komputer', room_id: '2', quantity: 25, condition: 'good', condition_label: 'Baik', purchase_date: '2023-01-15', purchase_price: 12000000, image: null, status: 'active' },
    { id: 2, name: 'Meja Kerja', code: 'FRN-001', category: 'Furniture', category_id: '2', room: 'Ruang 101', room_id: '1', quantity: 40, condition: 'good', condition_label: 'Baik', purchase_date: '2022-06-20', purchase_price: 1500000, image: null, status: 'active' },
    { id: 3, name: 'Kursi Kantor', code: 'FRN-002', category: 'Furniture', category_id: '2', room: 'Ruang 101', room_id: '1', quantity: 45, condition: 'fair', condition_label: 'Cukup', purchase_date: '2022-06-20', purchase_price: 800000, image: null, status: 'active' },
    { id: 4, name: 'Proyektor Epson', code: 'ELK-002', category: 'Elektronik', category_id: '1', room: 'Ruang Rapat A', room_id: '3', quantity: 5, condition: 'good', condition_label: 'Baik', purchase_date: '2023-03-10', purchase_price: 8500000, image: null, status: 'active' },
    { id: 5, name: 'Printer HP LaserJet', code: 'ELK-003', category: 'Elektronik', category_id: '1', room: 'Kantor Dosen', room_id: '4', quantity: 3, condition: 'fair', condition_label: 'Cukup', purchase_date: '2021-11-05', purchase_price: 3500000, image: null, status: 'active' },
    { id: 6, name: 'AC Daikin 2PK', code: 'ELK-004', category: 'Elektronik', category_id: '1', room: 'Lab Komputer', room_id: '2', quantity: 4, condition: 'good', condition_label: 'Baik', purchase_date: '2022-12-01', purchase_price: 7000000, image: null, status: 'active' },
    { id: 7, name: 'Whiteboard Magnetic', code: 'ATK-001', category: 'Alat Tulis Kantor', category_id: '3', room: 'Ruang 101', room_id: '1', quantity: 10, condition: 'poor', condition_label: 'Kurang', purchase_date: '2020-01-15', purchase_price: 500000, image: null, status: 'inactive' },
  ];

  const columns = [
    {
      key: 'name',
      label: 'Item',
      render: (value, item) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
            {item.image ? (
              <img src={item.image} alt={value} className="w-12 h-12 rounded-lg object-cover" />
            ) : (
              <FiPackage className="text-gray-400" size={20} />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">{item.code}</p>
          </div>
        </div>
      ),
    },
    { key: 'category', label: 'Kategori', width: '120px' },
    { key: 'room', label: 'Lokasi', width: '150px' },
    { key: 'quantity', label: 'Qty', width: '60px' },
    {
      key: 'condition_label',
      label: 'Kondisi',
      width: '100px',
      render: (value, item) => {
        const conditionColors = {
          good: 'bg-green-100 text-green-700',
          fair: 'bg-yellow-100 text-yellow-700',
          poor: 'bg-orange-100 text-orange-700',
          broken: 'bg-red-100 text-red-700',
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${conditionColors[item.condition] || 'bg-gray-100 text-gray-700'}`}>
            {value}
          </span>
        );
      },
    },
    {
      key: 'purchase_price',
      label: 'Harga',
      width: '120px',
      render: (value) => `Rp ${value.toLocaleString('id-ID')}`,
    },
    {
      key: 'status',
      label: 'Status',
      width: '100px',
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  const filters = [
    {
      key: 'category_id',
      label: 'Kategori',
      options: categories,
    },
    {
      key: 'condition',
      label: 'Kondisi',
      options: conditions,
    },
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
    setFormData({
      name: '',
      code: '',
      category_id: '',
      room_id: '',
      quantity: '',
      condition: '',
      purchase_date: '',
      purchase_price: '',
      description: '',
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      code: item.code,
      category_id: item.category_id,
      room_id: item.room_id,
      quantity: item.quantity,
      condition: item.condition,
      purchase_date: item.purchase_date,
      purchase_price: item.purchase_price,
      description: item.description || '',
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
    const matchSearch =
      item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.code.toLowerCase().includes(searchValue.toLowerCase());
    const matchCategory = !filterValues.category_id || item.category_id === filterValues.category_id;
    const matchCondition = !filterValues.condition || item.condition === filterValues.condition;
    const matchStatus = !filterValues.status || item.status === filterValues.status;
    return matchSearch && matchCategory && matchCondition && matchStatus;
  });

  return (
    <MainLayout>
      <PageHeader
        title="Inventaris Item"
        subtitle="Kelola data barang inventaris"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Inventaris', path: null },
          { label: 'Items' },
        ]}
      />

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari nama atau kode item..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onAdd={handleAdd}
        addLabel="Tambah Item"
        showExport={true}
        onExport={() => console.log('Export items')}
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
        title={selectedItem ? 'Edit Item' : 'Tambah Item'}
        onSubmit={handleSubmit}
        size="lg"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Kode Item"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            placeholder="Contoh: ELK-001"
            required
          />
          <FormInput
            label="Nama Item"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Masukkan nama item"
            required
          />
        </div>
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
            name="room_id"
            type="select"
            value={formData.room_id}
            onChange={handleInputChange}
            options={rooms}
            required
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormInput
            label="Jumlah"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleInputChange}
            placeholder="0"
            required
          />
          <FormInput
            label="Kondisi"
            name="condition"
            type="select"
            value={formData.condition}
            onChange={handleInputChange}
            options={conditions}
            required
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
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Tanggal Pembelian"
            name="purchase_date"
            type="date"
            value={formData.purchase_date}
            onChange={handleInputChange}
          />
          <FormInput
            label="Harga Pembelian"
            name="purchase_price"
            type="number"
            value={formData.purchase_price}
            onChange={handleInputChange}
            placeholder="0"
          />
        </div>
        <FormInput
          label="Deskripsi"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Deskripsi item"
        />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Foto Item
          </label>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <FiImage className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-sm text-gray-500">Klik untuk upload foto</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Item"
        message={`Apakah Anda yakin ingin menghapus "${selectedItem?.name}"?`}
        confirmText="Ya, Hapus"
        type="danger"
      />
    </MainLayout>
  );
};

export default Items;

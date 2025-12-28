import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import {
  DataTable,
  Modal,
  FormInput,
  StatusBadge,
  PageHeader,
  ConfirmDialog,
} from '../../components/ui';
import {
  FiArrowLeft,
  FiBox,
  FiTag,
  FiPlus,
  FiPackage,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';

const CategoryItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy category data
  const categoryData = {
    id: parseInt(id),
    name: 'Elektronik',
    code: 'ELK',
    description: 'Peralatan elektronik seperti komputer, printer, AC, dan peralatan listrik lainnya',
    item_count: 45,
    status: 'active',
  };

  // Items CRUD states
  const [itemsData, setItemsData] = useState([
    { id: 1, name: 'Komputer Desktop', code: 'ELK-001', quantity: 25, unit: 'Unit', condition: 'Baik', location: 'Gedung Rektorat', status: 'active' },
    { id: 2, name: 'Laptop ASUS', code: 'ELK-002', quantity: 15, unit: 'Unit', condition: 'Baik', location: 'Gedung FKIP', status: 'active' },
    { id: 3, name: 'Printer Canon', code: 'ELK-003', quantity: 10, unit: 'Unit', condition: 'Cukup', location: 'Gedung Rektorat', status: 'active' },
    { id: 4, name: 'AC Split 2PK', code: 'ELK-004', quantity: 30, unit: 'Unit', condition: 'Baik', location: 'Semua Gedung', status: 'active' },
    { id: 5, name: 'Proyektor Epson', code: 'ELK-005', quantity: 12, unit: 'Unit', condition: 'Baik', location: 'Ruang Kelas', status: 'active' },
    { id: 6, name: 'Scanner HP', code: 'ELK-006', quantity: 5, unit: 'Unit', condition: 'Rusak', location: 'Gedung Rektorat', status: 'inactive' },
    { id: 7, name: 'UPS APC', code: 'ELK-007', quantity: 20, unit: 'Unit', condition: 'Baik', location: 'Ruang Server', status: 'active' },
    { id: 8, name: 'TV LED 55"', code: 'ELK-008', quantity: 8, unit: 'Unit', condition: 'Baik', location: 'Lobby', status: 'active' },
  ]);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isItemDeleteOpen, setIsItemDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemForm, setItemForm] = useState({
    name: '',
    code: '',
    quantity: '',
    unit: 'Unit',
    condition: 'Baik',
    location: '',
    status: 'active',
  });

  const conditions = [
    { value: 'Baik', label: 'Baik' },
    { value: 'Cukup', label: 'Cukup' },
    { value: 'Rusak', label: 'Rusak' },
  ];

  const units = [
    { value: 'Unit', label: 'Unit' },
    { value: 'Buah', label: 'Buah' },
    { value: 'Set', label: 'Set' },
    { value: 'Pak', label: 'Pak' },
    { value: 'Box', label: 'Box' },
  ];

  // Column definitions
  const itemColumns = [
    { key: 'code', label: 'Kode', width: '100px' },
    { key: 'name', label: 'Nama Item' },
    { key: 'quantity', label: 'Jumlah', width: '80px', render: (v, row) => `${v} ${row.unit}` },
    {
      key: 'condition',
      label: 'Kondisi',
      width: '100px',
      render: (v) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          v === 'Baik' ? 'bg-green-100 text-green-700' :
          v === 'Cukup' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {v}
        </span>
      )
    },
    { key: 'location', label: 'Lokasi' },
    { key: 'status', label: 'Status', width: '100px', render: (v) => <StatusBadge status={v} /> },
  ];

  // Item handlers
  const handleAddItem = () => {
    setSelectedItem(null);
    setItemForm({
      name: '',
      code: '',
      quantity: '',
      unit: 'Unit',
      condition: 'Baik',
      location: '',
      status: 'active',
    });
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setItemForm({
      name: item.name,
      code: item.code,
      quantity: item.quantity,
      unit: item.unit,
      condition: item.condition,
      location: item.location,
      status: item.status,
    });
    setIsItemModalOpen(true);
  };

  const handleDeleteItem = (item) => {
    setSelectedItem(item);
    setIsItemDeleteOpen(true);
  };

  const handleItemSubmit = () => {
    if (selectedItem) {
      setItemsData((prev) =>
        prev.map((item) => (item.id === selectedItem.id ? { ...item, ...itemForm } : item))
      );
    } else {
      setItemsData((prev) => [...prev, { id: Date.now(), ...itemForm }]);
    }
    setIsItemModalOpen(false);
  };

  const handleConfirmDeleteItem = () => {
    setItemsData((prev) => prev.filter((item) => item.id !== selectedItem.id));
    setIsItemDeleteOpen(false);
  };

  // Calculate stats
  const totalItems = itemsData.reduce((sum, item) => sum + item.quantity, 0);
  const goodCondition = itemsData.filter(item => item.condition === 'Baik').length;
  const needAttention = itemsData.filter(item => item.condition !== 'Baik').length;

  return (
    <MainLayout>
      <PageHeader
        title={categoryData.name}
        subtitle="Detail kategori item"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Kategori Item', path: '/master/category-items' },
          { label: categoryData.name },
        ]}
        actions={
          <button
            onClick={() => navigate('/master/category-items')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FiArrowLeft className="w-4 h-4" />
            Kembali
          </button>
        }
      />

      {/* Category Info Card - Enhanced Design */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50 rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Category Icon */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
              <FiTag className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Category Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-800">{categoryData.name}</h2>
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">{categoryData.code}</span>
                </div>
                <p className="text-gray-500 mt-1 max-w-2xl">{categoryData.description}</p>
              </div>
              <StatusBadge status={categoryData.status} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-3 rounded-xl shadow">
              <FiPackage className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{itemsData.length}</p>
              <p className="text-sm text-gray-500">Jenis Item</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500 p-3 rounded-xl shadow">
              <FiBox className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{totalItems}</p>
              <p className="text-sm text-gray-500">Total Unit</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="bg-green-500 p-3 rounded-xl shadow">
              <FiCheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{goodCondition}</p>
              <p className="text-sm text-gray-500">Kondisi Baik</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="bg-orange-500 p-3 rounded-xl shadow">
              <FiAlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{needAttention}</p>
              <p className="text-sm text-gray-500">Perlu Perhatian</p>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Daftar Item</h3>
          <button
            onClick={handleAddItem}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            <FiPlus className="w-4 h-4" />
            Tambah Item
          </button>
        </div>
        <DataTable
          columns={itemColumns}
          data={itemsData}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
          showActions={true}
          actionColumn={{ view: false, edit: true, delete: true }}
        />
      </div>

      {/* Item Modal */}
      <Modal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        title={selectedItem ? 'Edit Item' : 'Tambah Item'}
        onSubmit={handleItemSubmit}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Kode Item"
            name="code"
            value={itemForm.code}
            onChange={(e) => setItemForm({ ...itemForm, code: e.target.value })}
            placeholder="Contoh: ELK-001"
            required
          />
          <FormInput
            label="Nama Item"
            name="name"
            value={itemForm.name}
            onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
            placeholder="Contoh: Komputer Desktop"
            required
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormInput
            label="Jumlah"
            name="quantity"
            type="number"
            value={itemForm.quantity}
            onChange={(e) => setItemForm({ ...itemForm, quantity: e.target.value })}
            placeholder="0"
            required
          />
          <FormInput
            label="Satuan"
            name="unit"
            type="select"
            value={itemForm.unit}
            onChange={(e) => setItemForm({ ...itemForm, unit: e.target.value })}
            options={units}
          />
          <FormInput
            label="Kondisi"
            name="condition"
            type="select"
            value={itemForm.condition}
            onChange={(e) => setItemForm({ ...itemForm, condition: e.target.value })}
            options={conditions}
          />
        </div>
        <FormInput
          label="Lokasi"
          name="location"
          value={itemForm.location}
          onChange={(e) => setItemForm({ ...itemForm, location: e.target.value })}
          placeholder="Contoh: Gedung Rektorat"
          required
        />
        <FormInput
          label="Status"
          name="status"
          type="select"
          value={itemForm.status}
          onChange={(e) => setItemForm({ ...itemForm, status: e.target.value })}
          options={[
            { value: 'active', label: 'Aktif' },
            { value: 'inactive', label: 'Nonaktif' },
          ]}
        />
      </Modal>

      {/* Item Delete Confirmation */}
      <ConfirmDialog
        isOpen={isItemDeleteOpen}
        onClose={() => setIsItemDeleteOpen(false)}
        onConfirm={handleConfirmDeleteItem}
        title="Hapus Item"
        message={`Apakah Anda yakin ingin menghapus "${selectedItem?.name}"?`}
        confirmText="Ya, Hapus"
        type="danger"
      />
    </MainLayout>
  );
};

export default CategoryItemDetail;

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
  FiMapPin,
  FiLayers,
  FiGrid,
  FiUsers,
  FiMaximize,
  FiPlus,
  FiBox,
  FiCheckCircle,
  FiAlertCircle,
  FiHome,
} from 'react-icons/fi';

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy room data
  const roomData = {
    id: parseInt(id),
    name: 'Lobby Utama',
    code: 'R101',
    type: 'Lobby',
    floor: 'Lantai 1',
    floor_id: 1,
    building: 'Gedung Rektorat',
    building_id: 1,
    unit: 'Unit A - Limau',
    unit_id: 1,
    capacity: 50,
    area: '200 m²',
    description: 'Lobby utama gedung rektorat untuk penerimaan tamu',
    status: 'active',
  };

  // Item CRUD states
  const [itemsData, setItemsData] = useState([
    { id: 1, name: 'Sofa Tunggu 3-Seater', code: 'SF-001', category: 'Furniture', quantity: 4, condition: 'Baik', last_check: '2025-01-10' },
    { id: 2, name: 'Meja Kopi', code: 'MK-001', category: 'Furniture', quantity: 2, condition: 'Baik', last_check: '2025-01-10' },
    { id: 3, name: 'AC Standing 2PK', code: 'AC-003', category: 'Elektronik', quantity: 2, condition: 'Baik', last_check: '2025-01-08' },
    { id: 4, name: 'Tanaman Hias Besar', code: 'TH-001', category: 'Dekorasi', quantity: 6, condition: 'Baik', last_check: '2025-01-15' },
    { id: 5, name: 'Lampu Gantung', code: 'LG-001', category: 'Elektronik', quantity: 3, condition: 'Baik', last_check: '2025-01-05' },
    { id: 6, name: 'Karpet Lantai', code: 'KP-001', category: 'Dekorasi', quantity: 2, condition: 'Cukup', last_check: '2025-01-12' },
    { id: 7, name: 'TV LED 65"', code: 'TV-002', category: 'Elektronik', quantity: 1, condition: 'Baik', last_check: '2025-01-10' },
    { id: 8, name: 'Dispenser Air', code: 'DP-002', category: 'Elektronik', quantity: 1, condition: 'Baik', last_check: '2025-01-08' },
  ]);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isItemDeleteOpen, setIsItemDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemForm, setItemForm] = useState({ name: '', code: '', category: '', quantity: '', condition: 'Baik', last_check: '' });

  const categories = [
    { value: 'Elektronik', label: 'Elektronik' },
    { value: 'Furniture', label: 'Furniture' },
    { value: 'Dekorasi', label: 'Dekorasi' },
    { value: 'Alat Tulis', label: 'Alat Tulis' },
    { value: 'Lainnya', label: 'Lainnya' },
  ];

  const conditions = [
    { value: 'Baik', label: 'Baik' },
    { value: 'Cukup', label: 'Cukup' },
    { value: 'Rusak', label: 'Rusak' },
  ];

  // Column definitions
  const itemColumns = [
    { key: 'code', label: 'Kode', width: '100px' },
    { key: 'name', label: 'Nama Item' },
    { key: 'category', label: 'Kategori', width: '120px' },
    { key: 'quantity', label: 'Jumlah', width: '80px' },
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
    { key: 'last_check', label: 'Cek Terakhir', width: '120px' },
  ];

  // Item handlers
  const handleAddItem = () => {
    setSelectedItem(null);
    setItemForm({ name: '', code: '', category: '', quantity: '', condition: 'Baik', last_check: '' });
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setItemForm({
      name: item.name,
      code: item.code,
      category: item.category,
      quantity: item.quantity,
      condition: item.condition,
      last_check: item.last_check,
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

  return (
    <MainLayout>
      <PageHeader
        title={roomData.name}
        subtitle="Detail informasi ruangan"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Unit', path: '/master/units' },
          { label: roomData.unit, path: `/master/units/${roomData.unit_id}` },
          { label: roomData.building, path: `/master/buildings/${roomData.building_id}` },
          { label: roomData.floor, path: `/master/floors/${roomData.floor_id}` },
          { label: roomData.name },
        ]}
        actions={
          <button
            onClick={() => navigate(`/master/floors/${roomData.floor_id}`)}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FiArrowLeft className="w-4 h-4" />
            Kembali
          </button>
        }
      />

      {/* Room Info Card - Enhanced Design */}
      <div className="bg-gradient-to-r from-green-50 via-white to-green-50 rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Room Icon */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <FiGrid className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Room Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-800">{roomData.name}</h2>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">{roomData.code}</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">{roomData.type}</span>
                </div>
                <p className="text-gray-500 mt-1">{roomData.description}</p>
              </div>
              <StatusBadge status={roomData.status} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FiMapPin className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-gray-500">Unit</span>
                  <p className="font-medium text-sm truncate">{roomData.unit}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FiHome className="w-4 h-4 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-gray-500">Gedung</span>
                  <p className="font-medium text-sm truncate">{roomData.building}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiLayers className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-gray-500">Lantai</span>
                  <p className="font-medium text-sm">{roomData.floor}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <FiUsers className="w-4 h-4 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-gray-500">Kapasitas</span>
                  <p className="font-medium text-sm">{roomData.capacity} orang</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500 p-3 rounded-xl shadow">
              <FiMaximize className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{roomData.area}</p>
              <p className="text-sm text-gray-500">Luas Ruangan</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="bg-green-500 p-3 rounded-xl shadow">
              <FiBox className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{itemsData.length}</p>
              <p className="text-sm text-gray-500">Total Item</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-3 rounded-xl shadow">
              <FiCheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{itemsData.filter(i => i.condition === 'Baik').length}</p>
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
              <p className="text-2xl font-bold text-gray-800">{itemsData.filter(i => i.condition !== 'Baik').length}</p>
              <p className="text-sm text-gray-500">Perlu Perhatian</p>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Daftar Item di Ruangan Ini</h3>
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
            placeholder="Contoh: SF-001"
            required
          />
          <FormInput
            label="Nama Item"
            name="name"
            value={itemForm.name}
            onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
            placeholder="Contoh: Sofa Tunggu"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Kategori"
            name="category"
            type="select"
            value={itemForm.category}
            onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
            options={categories}
            required
          />
          <FormInput
            label="Jumlah"
            name="quantity"
            type="number"
            value={itemForm.quantity}
            onChange={(e) => setItemForm({ ...itemForm, quantity: e.target.value })}
            placeholder="Contoh: 4"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Kondisi"
            name="condition"
            type="select"
            value={itemForm.condition}
            onChange={(e) => setItemForm({ ...itemForm, condition: e.target.value })}
            options={conditions}
          />
          <FormInput
            label="Tanggal Cek Terakhir"
            name="last_check"
            type="date"
            value={itemForm.last_check}
            onChange={(e) => setItemForm({ ...itemForm, last_check: e.target.value })}
          />
        </div>
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

export default RoomDetail;

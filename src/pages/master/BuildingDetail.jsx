import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import {
  DataTable,
  Modal,
  FormInput,
  StatusBadge,
  PageHeader,
  Tabs,
  ConfirmDialog,
} from '../../components/ui';
import {
  FiArrowLeft,
  FiLayers,
  FiBox,
  FiMapPin,
  FiPlus,
  FiGrid,
  FiHome,
  FiCheckCircle,
  FiXCircle,
} from 'react-icons/fi';

const BuildingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('lantai');

  // Dummy building data
  const buildingData = {
    id: parseInt(id),
    name: 'Gedung Rektorat',
    unit: 'Unit A - Limau',
    unit_id: 1,
    floors_count: 5,
    description: 'Gedung pusat administrasi universitas',
    status: 'active',
  };

  // Floor CRUD states
  const [floorsData, setFloorsData] = useState([
    { id: 1, name: 'Lantai 1', code: 'L1', rooms_count: 10, description: 'Lobby dan ruang tamu', status: 'active' },
    { id: 2, name: 'Lantai 2', code: 'L2', rooms_count: 8, description: 'Ruang administrasi', status: 'active' },
    { id: 3, name: 'Lantai 3', code: 'L3', rooms_count: 8, description: 'Ruang dekanat', status: 'active' },
    { id: 4, name: 'Lantai 4', code: 'L4', rooms_count: 6, description: 'Ruang rapat', status: 'active' },
    { id: 5, name: 'Lantai 5', code: 'L5', rooms_count: 4, description: 'Ruang pimpinan', status: 'active' },
  ]);
  const [isFloorModalOpen, setIsFloorModalOpen] = useState(false);
  const [isFloorDeleteOpen, setIsFloorDeleteOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [floorForm, setFloorForm] = useState({ name: '', code: '', description: '', status: 'active' });

  // Item CRUD states
  const [itemsData, setItemsData] = useState([
    { id: 1, name: 'AC Split 2PK', code: 'AC-001', category: 'Elektronik', quantity: 25, condition: 'Baik', location: 'Lantai 1-5' },
    { id: 2, name: 'Meja Kerja', code: 'MJ-001', category: 'Furniture', quantity: 50, condition: 'Baik', location: 'Lantai 1-5' },
    { id: 3, name: 'Kursi Kantor', code: 'KR-001', category: 'Furniture', quantity: 60, condition: 'Baik', location: 'Lantai 1-5' },
    { id: 4, name: 'Proyektor', code: 'PR-001', category: 'Elektronik', quantity: 5, condition: 'Baik', location: 'Lantai 4' },
    { id: 5, name: 'Printer', code: 'PT-001', category: 'Elektronik', quantity: 10, condition: 'Cukup', location: 'Lantai 1-3' },
    { id: 6, name: 'Lemari Arsip', code: 'LA-001', category: 'Furniture', quantity: 20, condition: 'Baik', location: 'Lantai 2' },
  ]);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isItemDeleteOpen, setIsItemDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemForm, setItemForm] = useState({ name: '', code: '', category: '', quantity: '', condition: 'Baik', location: '' });

  const categories = [
    { value: 'Elektronik', label: 'Elektronik' },
    { value: 'Furniture', label: 'Furniture' },
    { value: 'Alat Tulis', label: 'Alat Tulis' },
    { value: 'Lainnya', label: 'Lainnya' },
  ];

  const conditions = [
    { value: 'Baik', label: 'Baik' },
    { value: 'Cukup', label: 'Cukup' },
    { value: 'Rusak', label: 'Rusak' },
  ];

  // Column definitions
  const floorColumns = [
    { key: 'code', label: 'Kode', width: '80px' },
    { key: 'name', label: 'Nama Lantai' },
    { key: 'rooms_count', label: 'Jumlah Ruangan', width: '140px' },
    { key: 'description', label: 'Deskripsi' },
    { key: 'status', label: 'Status', width: '100px', render: (v) => <StatusBadge status={v} /> },
  ];

  const itemColumns = [
    { key: 'code', label: 'Kode', width: '100px' },
    { key: 'name', label: 'Nama Item' },
    { key: 'category', label: 'Kategori', width: '120px' },
    { key: 'quantity', label: 'Jumlah', width: '80px' },
    { key: 'condition', label: 'Kondisi', width: '100px' },
    { key: 'location', label: 'Lokasi', width: '120px' },
  ];

  // Floor handlers
  const handleAddFloor = () => {
    setSelectedFloor(null);
    setFloorForm({ name: '', code: '', description: '', status: 'active' });
    setIsFloorModalOpen(true);
  };

  const handleEditFloor = (item) => {
    setSelectedFloor(item);
    setFloorForm({
      name: item.name,
      code: item.code,
      description: item.description,
      status: item.status,
    });
    setIsFloorModalOpen(true);
  };

  const handleDeleteFloor = (item) => {
    setSelectedFloor(item);
    setIsFloorDeleteOpen(true);
  };

  const handleFloorSubmit = () => {
    if (selectedFloor) {
      setFloorsData((prev) =>
        prev.map((item) => (item.id === selectedFloor.id ? { ...item, ...floorForm, rooms_count: item.rooms_count } : item))
      );
    } else {
      setFloorsData((prev) => [...prev, { id: Date.now(), ...floorForm, rooms_count: 0 }]);
    }
    setIsFloorModalOpen(false);
  };

  const handleConfirmDeleteFloor = () => {
    setFloorsData((prev) => prev.filter((item) => item.id !== selectedFloor.id));
    setIsFloorDeleteOpen(false);
  };

  // Item handlers
  const handleAddItem = () => {
    setSelectedItem(null);
    setItemForm({ name: '', code: '', category: '', quantity: '', condition: 'Baik', location: '' });
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
      location: item.location,
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
        title={buildingData.name}
        subtitle="Detail informasi gedung"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Unit', path: '/master/units' },
          { label: buildingData.unit, path: `/master/units/${buildingData.unit_id}` },
          { label: buildingData.name },
        ]}
        actions={
          <button
            onClick={() => navigate(`/master/units/${buildingData.unit_id}`)}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FiArrowLeft className="w-4 h-4" />
            Kembali
          </button>
        }
      />

      {/* Building Info Card - Enhanced Design */}
      <div className="bg-gradient-to-r from-primary/5 via-white to-primary/5 rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Building Icon */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
              <FiHome className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Building Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{buildingData.name}</h2>
                <p className="text-gray-500">{buildingData.description}</p>
              </div>
              <StatusBadge status={buildingData.status} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FiMapPin className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-gray-500">Unit</span>
                  <p className="font-medium text-sm truncate">{buildingData.unit}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiLayers className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-gray-500">Jumlah Lantai</span>
                  <p className="font-semibold text-lg">{floorsData.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiGrid className="w-4 h-4 text-green-600" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-gray-500">Total Ruangan</span>
                  <p className="font-semibold text-lg">{floorsData.reduce((acc, f) => acc + (f.rooms_count || 0), 0)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FiBox className="w-4 h-4 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-gray-500">Total Item</span>
                  <p className="font-semibold text-lg">{itemsData.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-3 rounded-xl shadow">
              <FiLayers className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{floorsData.length}</p>
              <p className="text-sm text-gray-500">Lantai Aktif</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="bg-green-500 p-3 rounded-xl shadow">
              <FiCheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{itemsData.filter(i => i.condition === 'Baik').length}</p>
              <p className="text-sm text-gray-500">Item Kondisi Baik</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="bg-orange-500 p-3 rounded-xl shadow">
              <FiXCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{itemsData.filter(i => i.condition !== 'Baik').length}</p>
              <p className="text-sm text-gray-500">Item Perlu Perhatian</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <Tabs activeTab={activeTab} onTabChange={setActiveTab}>
          <Tabs.Tab id="lantai" label="Lantai" icon={FiLayers}>
            <div className="mb-4 flex justify-end">
              <button
                onClick={handleAddFloor}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                <FiPlus className="w-4 h-4" />
                Tambah Lantai
              </button>
            </div>
            <DataTable
              columns={floorColumns}
              data={floorsData}
              onView={(item) => navigate(`/master/floors/${item.id}`)}
              onEdit={handleEditFloor}
              onDelete={handleDeleteFloor}
              showActions={true}
              actionColumn={{ view: true, edit: true, delete: true }}
            />
          </Tabs.Tab>

          <Tabs.Tab id="items" label="Items" icon={FiBox}>
            <div className="mb-4 flex justify-end">
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
          </Tabs.Tab>
        </Tabs>
      </div>

      {/* Floor Modal */}
      <Modal
        isOpen={isFloorModalOpen}
        onClose={() => setIsFloorModalOpen(false)}
        title={selectedFloor ? 'Edit Lantai' : 'Tambah Lantai'}
        onSubmit={handleFloorSubmit}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Kode Lantai"
            name="code"
            value={floorForm.code}
            onChange={(e) => setFloorForm({ ...floorForm, code: e.target.value })}
            placeholder="Contoh: L1"
            required
          />
          <FormInput
            label="Nama Lantai"
            name="name"
            value={floorForm.name}
            onChange={(e) => setFloorForm({ ...floorForm, name: e.target.value })}
            placeholder="Contoh: Lantai 1"
            required
          />
        </div>
        <FormInput
          label="Deskripsi"
          name="description"
          type="textarea"
          value={floorForm.description}
          onChange={(e) => setFloorForm({ ...floorForm, description: e.target.value })}
          placeholder="Deskripsi lantai"
        />
        <FormInput
          label="Status"
          name="status"
          type="select"
          value={floorForm.status}
          onChange={(e) => setFloorForm({ ...floorForm, status: e.target.value })}
          options={[
            { value: 'active', label: 'Aktif' },
            { value: 'inactive', label: 'Nonaktif' },
          ]}
        />
      </Modal>

      {/* Floor Delete Confirmation */}
      <ConfirmDialog
        isOpen={isFloorDeleteOpen}
        onClose={() => setIsFloorDeleteOpen(false)}
        onConfirm={handleConfirmDeleteFloor}
        title="Hapus Lantai"
        message={`Apakah Anda yakin ingin menghapus "${selectedFloor?.name}"?`}
        confirmText="Ya, Hapus"
        type="danger"
      />

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
            placeholder="Contoh: AC-001"
            required
          />
          <FormInput
            label="Nama Item"
            name="name"
            value={itemForm.name}
            onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
            placeholder="Contoh: AC Split 2PK"
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
            placeholder="Contoh: 10"
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
            label="Lokasi"
            name="location"
            value={itemForm.location}
            onChange={(e) => setItemForm({ ...itemForm, location: e.target.value })}
            placeholder="Contoh: Lantai 1-5"
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

export default BuildingDetail;

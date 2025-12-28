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
  FiGrid,
  FiBox,
  FiMapPin,
  FiLayers,
  FiPlus,
  FiHome,
  FiCheckCircle,
  FiUsers,
} from 'react-icons/fi';

const FloorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ruangan');

  // Dummy floor data
  const floorData = {
    id: parseInt(id),
    name: 'Lantai 1',
    code: 'L1',
    building: 'Gedung Rektorat',
    building_id: 1,
    unit: 'Unit A - Limau',
    unit_id: 1,
    rooms_count: 10,
    description: 'Lobby dan ruang tamu',
    status: 'active',
  };

  // Room CRUD states
  const [roomsData, setRoomsData] = useState([
    { id: 1, name: 'Lobby Utama', code: 'R101', type: 'Lobby', capacity: 50, area: '200 m²', status: 'active' },
    { id: 2, name: 'Ruang Tamu', code: 'R102', type: 'Meeting', capacity: 10, area: '30 m²', status: 'active' },
    { id: 3, name: 'Resepsionis', code: 'R103', type: 'Office', capacity: 5, area: '25 m²', status: 'active' },
    { id: 4, name: 'Ruang Tunggu', code: 'R104', type: 'Waiting', capacity: 20, area: '40 m²', status: 'active' },
    { id: 5, name: 'Toilet Pria', code: 'R105', type: 'Toilet', capacity: 0, area: '15 m²', status: 'active' },
    { id: 6, name: 'Toilet Wanita', code: 'R106', type: 'Toilet', capacity: 0, area: '15 m²', status: 'active' },
    { id: 7, name: 'Musholla', code: 'R107', type: 'Ibadah', capacity: 30, area: '35 m²', status: 'active' },
    { id: 8, name: 'Ruang Security', code: 'R108', type: 'Office', capacity: 4, area: '20 m²', status: 'active' },
    { id: 9, name: 'Gudang', code: 'R109', type: 'Storage', capacity: 0, area: '25 m²', status: 'active' },
    { id: 10, name: 'Pantry', code: 'R110', type: 'Pantry', capacity: 0, area: '15 m²', status: 'inactive' },
  ]);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isRoomDeleteOpen, setIsRoomDeleteOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomForm, setRoomForm] = useState({ name: '', code: '', type: '', capacity: '', area: '', status: 'active' });

  // Item CRUD states
  const [itemsData, setItemsData] = useState([
    { id: 1, name: 'Sofa Tunggu', code: 'SF-001', category: 'Furniture', quantity: 5, condition: 'Baik', room: 'Ruang Tunggu' },
    { id: 2, name: 'Meja Resepsionis', code: 'MR-001', category: 'Furniture', quantity: 1, condition: 'Baik', room: 'Resepsionis' },
    { id: 3, name: 'Kursi Lipat', code: 'KL-001', category: 'Furniture', quantity: 30, condition: 'Baik', room: 'Musholla' },
    { id: 4, name: 'AC Standing', code: 'AC-002', category: 'Elektronik', quantity: 2, condition: 'Baik', room: 'Lobby Utama' },
    { id: 5, name: 'TV LED 55"', code: 'TV-001', category: 'Elektronik', quantity: 1, condition: 'Baik', room: 'Ruang Tunggu' },
    { id: 6, name: 'Dispenser', code: 'DP-001', category: 'Elektronik', quantity: 2, condition: 'Cukup', room: 'Pantry' },
  ]);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isItemDeleteOpen, setIsItemDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemForm, setItemForm] = useState({ name: '', code: '', category: '', quantity: '', condition: 'Baik', room: '' });

  const roomTypes = [
    { value: 'Lobby', label: 'Lobby' },
    { value: 'Meeting', label: 'Ruang Meeting' },
    { value: 'Office', label: 'Kantor' },
    { value: 'Waiting', label: 'Ruang Tunggu' },
    { value: 'Toilet', label: 'Toilet' },
    { value: 'Ibadah', label: 'Ruang Ibadah' },
    { value: 'Storage', label: 'Gudang' },
    { value: 'Pantry', label: 'Pantry' },
    { value: 'Classroom', label: 'Ruang Kelas' },
    { value: 'Lab', label: 'Laboratorium' },
    { value: 'Other', label: 'Lainnya' },
  ];

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

  const roomOptions = roomsData.map((r) => ({ value: r.name, label: r.name }));

  // Column definitions
  const roomColumns = [
    { key: 'code', label: 'Kode', width: '80px' },
    { key: 'name', label: 'Nama Ruangan' },
    { key: 'type', label: 'Tipe', width: '100px' },
    { key: 'capacity', label: 'Kapasitas', width: '100px', render: (v) => v > 0 ? `${v} orang` : '-' },
    { key: 'area', label: 'Luas', width: '100px' },
    { key: 'status', label: 'Status', width: '100px', render: (v) => <StatusBadge status={v} /> },
  ];

  const itemColumns = [
    { key: 'code', label: 'Kode', width: '100px' },
    { key: 'name', label: 'Nama Item' },
    { key: 'category', label: 'Kategori', width: '120px' },
    { key: 'quantity', label: 'Jumlah', width: '80px' },
    { key: 'condition', label: 'Kondisi', width: '100px' },
    { key: 'room', label: 'Ruangan', width: '140px' },
  ];

  // Room handlers
  const handleAddRoom = () => {
    setSelectedRoom(null);
    setRoomForm({ name: '', code: '', type: '', capacity: '', area: '', status: 'active' });
    setIsRoomModalOpen(true);
  };

  const handleEditRoom = (item) => {
    setSelectedRoom(item);
    setRoomForm({
      name: item.name,
      code: item.code,
      type: item.type,
      capacity: item.capacity,
      area: item.area,
      status: item.status,
    });
    setIsRoomModalOpen(true);
  };

  const handleDeleteRoom = (item) => {
    setSelectedRoom(item);
    setIsRoomDeleteOpen(true);
  };

  const handleRoomSubmit = () => {
    if (selectedRoom) {
      setRoomsData((prev) =>
        prev.map((item) => (item.id === selectedRoom.id ? { ...item, ...roomForm } : item))
      );
    } else {
      setRoomsData((prev) => [...prev, { id: Date.now(), ...roomForm }]);
    }
    setIsRoomModalOpen(false);
  };

  const handleConfirmDeleteRoom = () => {
    setRoomsData((prev) => prev.filter((item) => item.id !== selectedRoom.id));
    setIsRoomDeleteOpen(false);
  };

  // Item handlers
  const handleAddItem = () => {
    setSelectedItem(null);
    setItemForm({ name: '', code: '', category: '', quantity: '', condition: 'Baik', room: '' });
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
      room: item.room,
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
        title={floorData.name}
        subtitle="Detail informasi lantai"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Unit', path: '/master/units' },
          { label: floorData.unit, path: `/master/units/${floorData.unit_id}` },
          { label: floorData.building, path: `/master/buildings/${floorData.building_id}` },
          { label: floorData.name },
        ]}
        actions={
          <button
            onClick={() => navigate(`/master/buildings/${floorData.building_id}`)}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FiArrowLeft className="w-4 h-4" />
            Kembali
          </button>
        }
      />

      {/* Floor Info Card - Enhanced Design */}
      <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Floor Icon */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <FiLayers className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Floor Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-800">{floorData.name}</h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">{floorData.code}</span>
                </div>
                <p className="text-gray-500 mt-1">{floorData.description}</p>
              </div>
              <StatusBadge status={floorData.status} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FiMapPin className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-gray-500">Unit</span>
                  <p className="font-medium text-sm truncate">{floorData.unit}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FiHome className="w-4 h-4 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-gray-500">Gedung</span>
                  <p className="font-medium text-sm truncate">{floorData.building}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiGrid className="w-4 h-4 text-green-600" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-gray-500">Jumlah Ruangan</span>
                  <p className="font-semibold text-lg">{roomsData.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <FiBox className="w-4 h-4 text-amber-600" />
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500 p-3 rounded-xl shadow">
              <FiGrid className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{roomsData.filter(r => r.status === 'active').length}</p>
              <p className="text-sm text-gray-500">Ruangan Aktif</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="bg-green-500 p-3 rounded-xl shadow">
              <FiUsers className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{roomsData.reduce((acc, r) => acc + (r.capacity || 0), 0)}</p>
              <p className="text-sm text-gray-500">Total Kapasitas</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="bg-purple-500 p-3 rounded-xl shadow">
              <FiBox className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{itemsData.reduce((acc, i) => acc + parseInt(i.quantity || 0), 0)}</p>
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
              <p className="text-sm text-gray-500">Item Kondisi Baik</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <Tabs activeTab={activeTab} onTabChange={setActiveTab}>
          <Tabs.Tab id="ruangan" label="Ruangan" icon={FiGrid}>
            <div className="mb-4 flex justify-end">
              <button
                onClick={handleAddRoom}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                <FiPlus className="w-4 h-4" />
                Tambah Ruangan
              </button>
            </div>
            <DataTable
              columns={roomColumns}
              data={roomsData}
              onView={(item) => navigate(`/master/rooms/${item.id}`)}
              onEdit={handleEditRoom}
              onDelete={handleDeleteRoom}
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

      {/* Room Modal */}
      <Modal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        title={selectedRoom ? 'Edit Ruangan' : 'Tambah Ruangan'}
        onSubmit={handleRoomSubmit}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Kode Ruangan"
            name="code"
            value={roomForm.code}
            onChange={(e) => setRoomForm({ ...roomForm, code: e.target.value })}
            placeholder="Contoh: R101"
            required
          />
          <FormInput
            label="Nama Ruangan"
            name="name"
            value={roomForm.name}
            onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
            placeholder="Contoh: Lobby Utama"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Tipe Ruangan"
            name="type"
            type="select"
            value={roomForm.type}
            onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
            options={roomTypes}
            required
          />
          <FormInput
            label="Kapasitas"
            name="capacity"
            type="number"
            value={roomForm.capacity}
            onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
            placeholder="Contoh: 50"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Luas"
            name="area"
            value={roomForm.area}
            onChange={(e) => setRoomForm({ ...roomForm, area: e.target.value })}
            placeholder="Contoh: 200 m²"
          />
          <FormInput
            label="Status"
            name="status"
            type="select"
            value={roomForm.status}
            onChange={(e) => setRoomForm({ ...roomForm, status: e.target.value })}
            options={[
              { value: 'active', label: 'Aktif' },
              { value: 'inactive', label: 'Nonaktif' },
            ]}
          />
        </div>
      </Modal>

      {/* Room Delete Confirmation */}
      <ConfirmDialog
        isOpen={isRoomDeleteOpen}
        onClose={() => setIsRoomDeleteOpen(false)}
        onConfirm={handleConfirmDeleteRoom}
        title="Hapus Ruangan"
        message={`Apakah Anda yakin ingin menghapus "${selectedRoom?.name}"?`}
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
            label="Ruangan"
            name="room"
            type="select"
            value={itemForm.room}
            onChange={(e) => setItemForm({ ...itemForm, room: e.target.value })}
            options={roomOptions}
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

export default FloorDetail;

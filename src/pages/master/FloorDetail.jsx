import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import MainLayout from '../../layouts/MainLayout';
import {
  DataTable,
  Modal,
  FormInput,
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
  FiLoader,
} from 'react-icons/fi';
import {
  fetchFloorById,
  fetchRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  fetchCategoryItems,
  clearMasterError,
  clearMasterSuccess,
} from '../../store/masterSlice';
import {
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
  clearDataError,
  clearDataSuccess,
} from '../../store/dataSlice';

const FloorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('ruangan');

  // Redux state
  const { rooms, categoryItems, loading: masterLoading, error: masterError, success: masterSuccess } = useSelector((state) => state.master);
  const { items, loading: dataLoading, error: dataError, success: dataSuccess } = useSelector((state) => state.data);

  // Local state for floor detail
  const [floorData, setFloorData] = useState(null);
  const [floorLoading, setFloorLoading] = useState(true);

  // Pagination states
  const [roomPage, setRoomPage] = useState(1);
  const [itemPage, setItemPage] = useState(1);
  const itemsPerPage = 10;

  // Room CRUD states
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isRoomDeleteOpen, setIsRoomDeleteOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomForm, setRoomForm] = useState({ room_name: '' });
  const [roomFormLoading, setRoomFormLoading] = useState(false);

  // Item CRUD states
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isItemDeleteOpen, setIsItemDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemForm, setItemForm] = useState({
    item_name: '',
    item_code: '',
    item_description: '',
    category_item_id: '',
    item_condition: 'Baik',
    total: '',
    brand: '',
    room_id: '',
  });
  const [itemFormLoading, setItemFormLoading] = useState(false);

  const conditions = [
    { value: 'Baik', label: 'Baik' },
    { value: 'Menunggu Diperbaiki', label: 'Menunggu Diperbaiki' },
    { value: 'Diperbaiki', label: 'Diperbaiki' },
    { value: 'Rusak', label: 'Rusak' },
  ];

  // Load floor detail
  const loadFloorDetail = useCallback(async () => {
    setFloorLoading(true);
    try {
      const result = await dispatch(fetchFloorById(id)).unwrap();
      setFloorData(result.data);
    } catch (err) {
      toast.error(err || 'Gagal memuat detail lantai');
      navigate(-1);
    } finally {
      setFloorLoading(false);
    }
  }, [dispatch, id, navigate]);

  // Load rooms for this floor
  const loadRooms = useCallback((page = roomPage) => {
    dispatch(fetchRooms({ floor_id: id, page, limit: itemsPerPage }));
  }, [dispatch, id, roomPage, itemsPerPage]);

  // Load items for this floor
  const loadItems = useCallback((page = itemPage) => {
    if (floorData) {
      dispatch(fetchItems({
        campus_id: floorData.campus_id,
        building_id: floorData.building_id,
        floor_id: id,
        page,
        limit: itemsPerPage
      }));
    }
  }, [dispatch, id, floorData, itemPage, itemsPerPage]);

  // Load category items for dropdown
  const loadCategoryItems = useCallback(() => {
    dispatch(fetchCategoryItems({ limit: 100 }));
  }, [dispatch]);

  // Initial load
  useEffect(() => {
    loadFloorDetail();
    loadRooms();
    loadCategoryItems();
  }, [loadFloorDetail, loadRooms, loadCategoryItems]);

  // Load items after floorData is available
  useEffect(() => {
    if (floorData) {
      loadItems();
    }
  }, [floorData, loadItems]);

  // Handle master errors and success
  useEffect(() => {
    if (masterError) {
      toast.error(masterError);
      dispatch(clearMasterError());
    }
    if (masterSuccess) {
      toast.success(masterSuccess);
      dispatch(clearMasterSuccess());
    }
  }, [masterError, masterSuccess, dispatch]);

  // Handle data errors and success
  useEffect(() => {
    if (dataError) {
      toast.error(dataError);
      dispatch(clearDataError());
    }
    if (dataSuccess) {
      toast.success(dataSuccess);
      dispatch(clearDataSuccess());
    }
  }, [dataError, dataSuccess, dispatch]);

  // Data arrays and pagination
  const roomsData = rooms.data || [];
  const roomsPagination = rooms.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 };
  const itemsData = items.data || [];
  const itemsPagination = items.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 };

  // Handle page changes
  const handleRoomPageChange = (newPage) => {
    setRoomPage(newPage);
    loadRooms(newPage);
  };

  const handleItemPageChange = (newPage) => {
    setItemPage(newPage);
    loadItems(newPage);
  };

  // Room options for dropdown
  const roomOptions = roomsData.map((r) => ({ value: r.room_id, label: r.room_name }));

  // Category options for dropdown
  const categoryOptions = (categoryItems.data || []).map(c => ({
    value: c.category_item_id,
    label: c.category_item_name
  }));

  // Column definitions
  const roomColumns = [
    { key: 'room_id', label: 'ID', width: '100px' },
    { key: 'room_name', label: 'Nama Ruangan' },
  ];

  const itemColumns = [
    { key: 'item_code', label: 'Kode', width: '120px' },
    { key: 'item_name', label: 'Nama Item' },
    {
      key: 'category_item',
      label: 'Kategori',
      width: '120px',
      render: (v, row) => row.category_item?.category_item_name || '-',
    },
    { key: 'total', label: 'Jumlah', width: '80px' },
    {
      key: 'item_condition',
      label: 'Kondisi',
      width: '100px',
      render: (v) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          v === 'Baik' ? 'bg-green-100 text-green-700' :
          v === 'Diperbaiki' ? 'bg-blue-100 text-blue-700' :
          v === 'Menunggu Diperbaiki' ? 'bg-yellow-100 text-yellow-700' :
          v === 'Rusak' ? 'bg-red-100 text-red-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {v || '-'}
        </span>
      ),
    },
    { key: 'brand', label: 'Merk', width: '100px', render: (v) => v || '-' },
    { key: 'room', label: 'Ruangan', width: '140px', render: (v, row) => row.room?.room_name || '-' },
  ];

  // Room handlers
  const handleAddRoom = () => {
    setSelectedRoom(null);
    setRoomForm({ room_name: '' });
    setIsRoomModalOpen(true);
  };

  const handleEditRoom = (item) => {
    setSelectedRoom(item);
    setRoomForm({
      room_name: item.room_name || '',
    });
    setIsRoomModalOpen(true);
  };

  const handleDeleteRoom = (item) => {
    setSelectedRoom(item);
    setIsRoomDeleteOpen(true);
  };

  const handleRoomSubmit = async () => {
    setRoomFormLoading(true);
    try {
      const submitData = {
        room_name: roomForm.room_name,
        floor_id: parseInt(id),
      };
      if (selectedRoom) {
        await dispatch(updateRoom({ id: selectedRoom.room_id, data: submitData })).unwrap();
      } else {
        await dispatch(createRoom(submitData)).unwrap();
      }
      setIsRoomModalOpen(false);
      loadRooms();
    } catch (err) {
      // Error handled by effect
    } finally {
      setRoomFormLoading(false);
    }
  };

  const handleConfirmDeleteRoom = async () => {
    try {
      await dispatch(deleteRoom(selectedRoom.room_id)).unwrap();
      setIsRoomDeleteOpen(false);
      loadRooms();
    } catch (err) {
      // Error handled by effect
    }
  };

  // Item handlers
  const handleAddItem = () => {
    setSelectedItem(null);
    setItemForm({
      item_name: '',
      item_code: '',
      item_description: '',
      category_item_id: '',
      item_condition: 'Baik',
      total: '',
      brand: '',
      room_id: '',
    });
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setItemForm({
      item_name: item.item_name || '',
      item_code: item.item_code || '',
      item_description: item.item_description || '',
      category_item_id: item.category_item_id?.toString() || '',
      item_condition: item.item_condition || 'Baik',
      total: item.total?.toString() || '',
      brand: item.brand || '',
      room_id: item.room_id?.toString() || '',
    });
    setIsItemModalOpen(true);
  };

  const handleDeleteItem = (item) => {
    setSelectedItem(item);
    setIsItemDeleteOpen(true);
  };

  const handleItemSubmit = async () => {
    setItemFormLoading(true);
    try {
      const itemData = {
        ...itemForm,
        campus_id: floorData?.campus_id ? parseInt(floorData.campus_id) : null,
        building_id: floorData?.building_id ? parseInt(floorData.building_id) : null,
        floor_id: parseInt(id),
        total: itemForm.total ? parseInt(itemForm.total) : null,
        category_item_id: itemForm.category_item_id ? parseInt(itemForm.category_item_id) : null,
        room_id: itemForm.room_id ? parseInt(itemForm.room_id) : null,
      };
      if (selectedItem) {
        await dispatch(updateItem({ id: selectedItem.item_id, data: itemData })).unwrap();
      } else {
        await dispatch(createItem(itemData)).unwrap();
      }
      setIsItemModalOpen(false);
      loadItems();
    } catch (err) {
      // Error handled by effect
    } finally {
      setItemFormLoading(false);
    }
  };

  const handleConfirmDeleteItem = async () => {
    try {
      await dispatch(deleteItem(selectedItem.item_id)).unwrap();
      setIsItemDeleteOpen(false);
      loadItems();
    } catch (err) {
      // Error handled by effect
    }
  };

  // Calculate stats
  const totalItemQty = itemsData.reduce((acc, i) => acc + parseInt(i.total || 0), 0);
  const goodConditionItems = itemsData.filter(i => i.item_condition === 'Baik').length;

  if (floorLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <FiLoader className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!floorData) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <p className="text-gray-500">Lantai tidak ditemukan</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title={floorData.floor_name}
        subtitle="Detail informasi lantai"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Unit', path: '/master/units' },
          { label: floorData.campus_name || 'Unit', path: `/master/units/${floorData.campus_id}` },
          { label: floorData.building_name || 'Gedung', path: `/master/buildings/${floorData.building_id}` },
          { label: floorData.floor_name },
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
                <h2 className="text-2xl font-bold text-gray-800">{floorData.floor_name}</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FiMapPin className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-gray-500">Unit</span>
                  <p className="font-medium text-sm truncate">{floorData.campus_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FiHome className="w-4 h-4 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-gray-500">Gedung</span>
                  <p className="font-medium text-sm truncate">{floorData.building_name}</p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500 p-3 rounded-xl shadow">
              <FiGrid className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{roomsData.length}</p>
              <p className="text-sm text-gray-500">Total Ruangan</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="bg-purple-500 p-3 rounded-xl shadow">
              <FiBox className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{totalItemQty}</p>
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
              <p className="text-2xl font-bold text-gray-800">{goodConditionItems}</p>
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
              loading={masterLoading}
              onView={(item) => navigate(`/master/rooms/${item.room_id}`)}
              onEdit={handleEditRoom}
              onDelete={handleDeleteRoom}
              showActions={true}
              actionColumn={{ view: true, edit: true, delete: true }}
              currentPage={roomsPagination.page}
              totalPages={roomsPagination.totalPages}
              totalItems={roomsPagination.total}
              itemsPerPage={itemsPerPage}
              onPageChange={handleRoomPageChange}
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
              loading={dataLoading}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              showActions={true}
              actionColumn={{ view: false, edit: true, delete: true }}
              currentPage={itemsPagination.page}
              totalPages={itemsPagination.totalPages}
              totalItems={itemsPagination.total}
              itemsPerPage={itemsPerPage}
              onPageChange={handleItemPageChange}
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
        loading={roomFormLoading}
      >
        <FormInput
          label="Nama Ruangan"
          name="room_name"
          value={roomForm.room_name}
          onChange={(e) => setRoomForm({ ...roomForm, room_name: e.target.value })}
          placeholder="Contoh: Ruang 101"
          required
        />
      </Modal>

      {/* Room Delete Confirmation */}
      <ConfirmDialog
        isOpen={isRoomDeleteOpen}
        onClose={() => setIsRoomDeleteOpen(false)}
        onConfirm={handleConfirmDeleteRoom}
        title="Hapus Ruangan"
        message={`Apakah Anda yakin ingin menghapus "${selectedRoom?.room_name}"?`}
        confirmText="Ya, Hapus"
        type="danger"
      />

      {/* Item Modal */}
      <Modal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        title={selectedItem ? 'Edit Item' : 'Tambah Item'}
        onSubmit={handleItemSubmit}
        loading={itemFormLoading}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Kode Item"
            name="item_code"
            value={itemForm.item_code}
            onChange={(e) => setItemForm({ ...itemForm, item_code: e.target.value })}
            placeholder="Contoh: ITM-001"
            required
          />
          <FormInput
            label="Nama Item"
            name="item_name"
            value={itemForm.item_name}
            onChange={(e) => setItemForm({ ...itemForm, item_name: e.target.value })}
            placeholder="Contoh: AC Split 2PK"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Kategori"
            name="category_item_id"
            type="select"
            value={itemForm.category_item_id}
            onChange={(e) => setItemForm({ ...itemForm, category_item_id: e.target.value })}
            options={[{ value: '', label: 'Pilih Kategori' }, ...categoryOptions]}
          />
          <FormInput
            label="Jumlah"
            name="total"
            type="number"
            value={itemForm.total}
            onChange={(e) => setItemForm({ ...itemForm, total: e.target.value })}
            placeholder="Contoh: 10"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Kondisi"
            name="item_condition"
            type="select"
            value={itemForm.item_condition}
            onChange={(e) => setItemForm({ ...itemForm, item_condition: e.target.value })}
            options={conditions}
          />
          <FormInput
            label="Merk"
            name="brand"
            value={itemForm.brand}
            onChange={(e) => setItemForm({ ...itemForm, brand: e.target.value })}
            placeholder="Contoh: Samsung"
          />
        </div>
        <FormInput
          label="Ruangan"
          name="room_id"
          type="select"
          value={itemForm.room_id}
          onChange={(e) => setItemForm({ ...itemForm, room_id: e.target.value })}
          options={[{ value: '', label: 'Pilih Ruangan' }, ...roomOptions]}
        />
      </Modal>

      {/* Item Delete Confirmation */}
      <ConfirmDialog
        isOpen={isItemDeleteOpen}
        onClose={() => setIsItemDeleteOpen(false)}
        onConfirm={handleConfirmDeleteItem}
        title="Hapus Item"
        message={`Apakah Anda yakin ingin menghapus "${selectedItem?.item_name}"?`}
        confirmText="Ya, Hapus"
        type="danger"
      />
    </MainLayout>
  );
};

export default FloorDetail;

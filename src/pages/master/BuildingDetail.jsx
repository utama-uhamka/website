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
  FiLayers,
  FiBox,
  FiMapPin,
  FiPlus,
  FiGrid,
  FiHome,
  FiCheckCircle,
  FiXCircle,
  FiLoader,
} from 'react-icons/fi';
import {
  fetchBuildingById,
  fetchFloors,
  createFloor,
  updateFloor,
  deleteFloor,
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
import { fetchCategoryItems } from '../../store/masterSlice';

const BuildingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('lantai');

  // Redux state
  const { floors, categoryItems, loading: masterLoading, error: masterError, success: masterSuccess } = useSelector((state) => state.master);
  const { items, loading: dataLoading, error: dataError, success: dataSuccess } = useSelector((state) => state.data);

  // Local state for building detail
  const [buildingData, setBuildingData] = useState(null);
  const [buildingLoading, setBuildingLoading] = useState(true);

  // Pagination states
  const [floorPage, setFloorPage] = useState(1);
  const [itemPage, setItemPage] = useState(1);
  const itemsPerPage = 10;

  // Floor CRUD states
  const [isFloorModalOpen, setIsFloorModalOpen] = useState(false);
  const [isFloorDeleteOpen, setIsFloorDeleteOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [floorForm, setFloorForm] = useState({ floor_name: '' });
  const [floorFormLoading, setFloorFormLoading] = useState(false);

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
  });
  const [itemFormLoading, setItemFormLoading] = useState(false);

  const conditions = [
    { value: 'Baik', label: 'Baik' },
    { value: 'Menunggu Diperbaiki', label: 'Menunggu Diperbaiki' },
    { value: 'Diperbaiki', label: 'Diperbaiki' },
    { value: 'Rusak', label: 'Rusak' },
  ];

  // Load building detail
  const loadBuildingDetail = useCallback(async () => {
    setBuildingLoading(true);
    try {
      const result = await dispatch(fetchBuildingById(id)).unwrap();
      setBuildingData(result.data);
    } catch (err) {
      toast.error(err || 'Gagal memuat detail gedung');
      navigate('/master/units');
    } finally {
      setBuildingLoading(false);
    }
  }, [dispatch, id, navigate]);

  // Load floors for this building
  const loadFloors = useCallback((page = floorPage) => {
    dispatch(fetchFloors({ building_id: id, page, limit: itemsPerPage }));
  }, [dispatch, id, floorPage, itemsPerPage]);

  // Load items for this building (filtered by building_id only)
  const loadItems = useCallback((page = itemPage) => {
    if (buildingData) {
      dispatch(fetchItems({
        campus_id: buildingData.campus_id,
        building_id: id,
        page,
        limit: itemsPerPage
      }));
    }
  }, [dispatch, id, buildingData, itemPage, itemsPerPage]);

  // Load category items for dropdown
  const loadCategoryItems = useCallback(() => {
    dispatch(fetchCategoryItems({ limit: 100 }));
  }, [dispatch]);

  // Initial load
  useEffect(() => {
    loadBuildingDetail();
    loadFloors();
    loadCategoryItems();
  }, [loadBuildingDetail, loadFloors, loadCategoryItems]);

  // Load items after building data is loaded
  useEffect(() => {
    if (buildingData) {
      loadItems();
    }
  }, [buildingData, loadItems]);

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

  // Column definitions
  const floorColumns = [
    { key: 'floor_id', label: 'ID', width: '100px' },
    { key: 'floor_name', label: 'Nama Lantai' },
    { key: 'rooms_count', label: 'Jumlah Ruangan', width: '140px', render: (v) => v || 0 },
  ];

  const itemColumns = [
    { key: 'item_code', label: 'Kode', width: '120px' },
    { key: 'item_name', label: 'Nama Item' },
    { key: 'category_item', label: 'Kategori', width: '120px', render: (v, row) => row.category_item?.category_item_name || '-' },
    { key: 'total', label: 'Jumlah', width: '80px' },
    { key: 'item_condition', label: 'Kondisi', width: '120px', render: (v) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        v === 'Baik' ? 'bg-green-100 text-green-700' :
        v === 'Diperbaiki' ? 'bg-blue-100 text-blue-700' :
        v === 'Menunggu Diperbaiki' ? 'bg-yellow-100 text-yellow-700' :
        v === 'Rusak' ? 'bg-red-100 text-red-700' :
        'bg-gray-100 text-gray-700'
      }`}>
        {v || '-'}
      </span>
    )},
    { key: 'brand', label: 'Merk', width: '100px', render: (v) => v || '-' },
  ];

  // Floor handlers
  const handleAddFloor = () => {
    setSelectedFloor(null);
    setFloorForm({ floor_name: '' });
    setIsFloorModalOpen(true);
  };

  const handleEditFloor = (item) => {
    setSelectedFloor(item);
    setFloorForm({
      floor_name: item.floor_name || '',
    });
    setIsFloorModalOpen(true);
  };

  const handleDeleteFloor = (item) => {
    setSelectedFloor(item);
    setIsFloorDeleteOpen(true);
  };

  const handleFloorSubmit = async () => {
    setFloorFormLoading(true);
    try {
      const submitData = {
        floor_name: floorForm.floor_name,
        building_id: id,
      };
      if (selectedFloor) {
        await dispatch(updateFloor({ id: selectedFloor.floor_id, data: submitData })).unwrap();
      } else {
        await dispatch(createFloor(submitData)).unwrap();
      }
      setIsFloorModalOpen(false);
      loadFloors();
    } catch (err) {
      // Error handled by effect
    } finally {
      setFloorFormLoading(false);
    }
  };

  const handleConfirmDeleteFloor = async () => {
    try {
      await dispatch(deleteFloor(selectedFloor.floor_id)).unwrap();
      setIsFloorDeleteOpen(false);
      loadFloors();
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
    });
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setItemForm({
      item_name: item.item_name || '',
      item_code: item.item_code || '',
      item_description: item.item_description || '',
      category_item_id: item.category_item_id || '',
      item_condition: item.item_condition || 'Baik',
      total: item.total || '',
      brand: item.brand || '',
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
        item_name: itemForm.item_name,
        item_code: itemForm.item_code,
        item_description: itemForm.item_description,
        category_item_id: itemForm.category_item_id || null,
        item_condition: itemForm.item_condition,
        total: itemForm.total ? parseInt(itemForm.total) : null,
        brand: itemForm.brand,
        campus_id: buildingData.campus_id,
        building_id: id,
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

  // Calculate stats and pagination
  const floorsData = floors.data || [];
  const floorsPagination = floors.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 };
  const itemsData = items.data || [];
  const itemsPagination = items.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 };
  const totalRooms = floorsData.reduce((acc, f) => acc + (f.rooms_count || 0), 0);
  const goodConditionItems = itemsData.filter(i => i.item_condition === 'Baik').length;
  const needAttentionItems = itemsData.filter(i => i.item_condition && i.item_condition !== 'Baik').length;

  // Handle page changes
  const handleFloorPageChange = (newPage) => {
    setFloorPage(newPage);
    loadFloors(newPage);
  };

  const handleItemPageChange = (newPage) => {
    setItemPage(newPage);
    loadItems(newPage);
  };

  // Category options for dropdown
  const categoryOptions = (categoryItems.data || []).map(c => ({
    value: c.category_item_id,
    label: c.category_item_name
  }));

  if (buildingLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <FiLoader className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!buildingData) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <p className="text-gray-500">Gedung tidak ditemukan</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title={buildingData.building_name}
        subtitle="Detail informasi gedung"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Unit', path: '/master/units' },
          { label: buildingData.campus_name || 'Unit', path: `/master/units/${buildingData.campus_id}` },
          { label: buildingData.building_name },
        ]}
        actions={
          <button
            onClick={() => navigate(`/master/units/${buildingData.campus_id}`)}
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
                <h2 className="text-2xl font-bold text-gray-800">{buildingData.building_name}</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FiMapPin className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-gray-500">Unit</span>
                  <p className="font-medium text-sm truncate">{buildingData.campus_name}</p>
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
                  <p className="font-semibold text-lg">{totalRooms}</p>
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
              <p className="text-sm text-gray-500">Total Lantai</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="bg-green-500 p-3 rounded-xl shadow">
              <FiCheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{goodConditionItems}</p>
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
              <p className="text-2xl font-bold text-gray-800">{needAttentionItems}</p>
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
              loading={masterLoading}
              onView={(item) => navigate(`/master/floors/${item.floor_id}`)}
              onEdit={handleEditFloor}
              onDelete={handleDeleteFloor}
              showActions={true}
              actionColumn={{ view: true, edit: true, delete: true }}
              currentPage={floorsPagination.page}
              totalPages={floorsPagination.totalPages}
              totalItems={floorsPagination.total}
              itemsPerPage={itemsPerPage}
              onPageChange={handleFloorPageChange}
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

      {/* Floor Modal */}
      <Modal
        isOpen={isFloorModalOpen}
        onClose={() => setIsFloorModalOpen(false)}
        title={selectedFloor ? 'Edit Lantai' : 'Tambah Lantai'}
        onSubmit={handleFloorSubmit}
        loading={floorFormLoading}
      >
        <FormInput
          label="Nama Lantai"
          name="floor_name"
          value={floorForm.floor_name}
          onChange={(e) => setFloorForm({ ...floorForm, floor_name: e.target.value })}
          placeholder="Contoh: Lantai 1"
          required
        />
      </Modal>

      {/* Floor Delete Confirmation */}
      <ConfirmDialog
        isOpen={isFloorDeleteOpen}
        onClose={() => setIsFloorDeleteOpen(false)}
        onConfirm={handleConfirmDeleteFloor}
        title="Hapus Lantai"
        message={`Apakah Anda yakin ingin menghapus "${selectedFloor?.floor_name}"?`}
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
            placeholder="Contoh: AC-001"
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
        <FormInput
          label="Deskripsi"
          name="item_description"
          type="textarea"
          value={itemForm.item_description}
          onChange={(e) => setItemForm({ ...itemForm, item_description: e.target.value })}
          placeholder="Deskripsi item..."
        />
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
            placeholder="Contoh: Daikin"
          />
        </div>
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

export default BuildingDetail;

import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import {
  DataTable,
  Modal,
  FormInput,
  StatusBadge,
  PageHeader,
  ConfirmDialog,
} from '../components/ui';
import {
  FiBox,
  FiPlus,
  FiPackage,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
  FiFilter,
  FiSearch,
} from 'react-icons/fi';
import {
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
  clearDataError,
  clearDataSuccess,
} from '../store/dataSlice';
import {
  fetchCategoryItems,
  fetchCampuses,
  fetchBuildings,
  fetchFloors,
  fetchRooms,
  clearMasterError,
  clearMasterSuccess,
} from '../store/masterSlice';

const Inventory = () => {
  const dispatch = useDispatch();
  const { items, loading: dataLoading, error: dataError, success: dataSuccess } = useSelector((state) => state.data);
  const { categoryItems, campuses, buildings, floors, rooms, error: masterError, success: masterSuccess } = useSelector((state) => state.master);

  // Pagination and filter state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    category_id: '',
    campus_id: '',
    building_id: '',
    floor_id: '',
    room_id: '',
    condition: '',
    status: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // CRUD state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category_id: '',
    quantity: '',
    unit: 'Unit',
    condition: 'Baik',
    campus_id: '',
    building_id: '',
    floor_id: '',
    room_id: '',
    location: '',
    description: '',
    status: 'active',
  });

  const conditions = [
    { value: 'Rusak', label: 'Rusak' },
    { value: 'Menunggu Diperbaiki', label: 'Menunggu Diperbaiki' },
    { value: 'Diperbaiki', label: 'Diperbaiki' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Baik', label: 'Baik' },
  ];

  const units = [
    { value: 'Unit', label: 'Unit' },
    { value: 'Buah', label: 'Buah' },
    { value: 'Set', label: 'Set' },
    { value: 'Pak', label: 'Pak' },
    { value: 'Box', label: 'Box' },
  ];

  // Load items
  const loadItems = useCallback(() => {
    const params = {
      page,
      limit,
      search: search || undefined,
      category_id: filters.category_id || undefined,
      campus_id: filters.campus_id || undefined,
      building_id: filters.building_id || undefined,
      floor_id: filters.floor_id || undefined,
      room_id: filters.room_id || undefined,
      condition: filters.condition || undefined,
      status: filters.status || undefined,
    };
    dispatch(fetchItems(params));
  }, [dispatch, page, limit, search, filters]);

  // Load master data for dropdowns
  const loadMasterData = useCallback(() => {
    dispatch(fetchCategoryItems({ limit: 100 }));
    dispatch(fetchCampuses({ limit: 100 }));
    dispatch(fetchBuildings({ limit: 100 }));
    dispatch(fetchFloors({ limit: 100 }));
    dispatch(fetchRooms({ limit: 100 }));
  }, [dispatch]);

  // Initial load
  useEffect(() => {
    loadItems();
    loadMasterData();
  }, [loadItems, loadMasterData]);

  // Handle errors and success
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

  // Data arrays
  const itemsData = items.data || [];
  const categoryOptions = (categoryItems.data || []).map(c => ({ value: c.category_item_id, label: c.category_item_name }));
  const campusOptions = (campuses.data || []).map(c => ({ value: c.campus_id, label: c.campus_name }));
  const buildingOptions = (buildings.data || []).map(b => ({ value: b.building_id, label: b.building_name }));
  const floorOptions = (floors.data || []).map(f => ({ value: f.floor_id, label: f.floor_name }));
  const roomOptions = (rooms.data || []).map(r => ({ value: r.room_id, label: r.room_name }));

  // Column definitions
  const columns = [
    { key: 'code', label: 'Kode', width: '100px' },
    { key: 'name', label: 'Nama Item' },
    { key: 'category_name', label: 'Kategori', width: '120px' },
    { key: 'quantity', label: 'Jumlah', width: '80px', render: (v, row) => `${v} ${row.unit || ''}` },
    {
      key: 'condition',
      label: 'Kondisi',
      width: '100px',
      render: (v) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          v === 'Rusak' ? 'bg-red-100 text-red-700' :
          v === 'Menunggu Diperbaiki' ? 'bg-yellow-100 text-yellow-700' :
          v === 'Diperbaiki' ? 'bg-green-100 text-green-700' :
          v === 'Maintenance' ? 'bg-blue-100 text-blue-700' :
          v === 'Baik' ? 'bg-emerald-100 text-emerald-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {v}
        </span>
      )
    },
    { key: 'location', label: 'Lokasi' },
    { key: 'status', label: 'Status', width: '100px', render: (v) => <StatusBadge status={v} /> },
  ];

  // Handlers
  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({
      name: '',
      code: '',
      category_id: '',
      quantity: '',
      unit: 'Unit',
      condition: 'Baik',
      campus_id: '',
      building_id: '',
      floor_id: '',
      room_id: '',
      location: '',
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
      category_id: item.category_item_id || '',
      quantity: item.quantity,
      unit: item.unit || 'Unit',
      condition: item.condition,
      campus_id: item.campus_id || '',
      building_id: item.building_id || '',
      floor_id: item.floor_id || '',
      room_id: item.room_id || '',
      location: item.location || '',
      description: item.description || '',
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async () => {
    setFormLoading(true);
    try {
      const data = {
        ...formData,
        quantity: parseInt(formData.quantity),
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        campus_id: formData.campus_id ? parseInt(formData.campus_id) : null,
        building_id: formData.building_id ? parseInt(formData.building_id) : null,
        floor_id: formData.floor_id ? parseInt(formData.floor_id) : null,
        room_id: formData.room_id ? parseInt(formData.room_id) : null,
      };
      if (selectedItem) {
        await dispatch(updateItem({ id: selectedItem.item_id, data })).unwrap();
      } else {
        await dispatch(createItem(data)).unwrap();
      }
      setIsModalOpen(false);
      loadItems();
    } catch (err) {
      // Error handled by effect
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteItem(selectedItem.item_id)).unwrap();
      setIsDeleteOpen(false);
      loadItems();
    } catch (err) {
      // Error handled by effect
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadItems();
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      category_id: '',
      campus_id: '',
      building_id: '',
      floor_id: '',
      room_id: '',
      condition: '',
      status: '',
    });
    setSearch('');
    setPage(1);
  };

  // Calculate stats
  const totalItems = itemsData.length;
  const goodCondition = itemsData.filter(i => i.condition === 'Baik').length;
  const needAttention = itemsData.filter(i => i.condition === 'Menunggu Diperbaiki').length;
  const damaged = itemsData.filter(i => i.condition === 'Rusak').length;

  return (
    <MainLayout>
      <PageHeader
        title="Inventaris"
        subtitle="Kelola semua item inventaris"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Inventaris' },
        ]}
        actions={
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            <FiPlus className="w-4 h-4" />
            Tambah Item
          </button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-3 rounded-xl shadow">
              <FiPackage className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{items.pagination?.total || 0}</p>
              <p className="text-sm text-gray-500">Total Item</p>
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
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-500 p-3 rounded-xl shadow">
              <FiAlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{needAttention}</p>
              <p className="text-sm text-gray-500">Perlu Perhatian</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="bg-red-500 p-3 rounded-xl shadow">
              <FiXCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{damaged}</p>
              <p className="text-sm text-gray-500">Rusak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari item..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Cari
            </button>
          </form>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <FiFilter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
            <FormInput
              label="Kategori"
              type="select"
              value={filters.category_id}
              onChange={(e) => handleFilterChange('category_id', e.target.value)}
              options={[{ value: '', label: 'Semua Kategori' }, ...categoryOptions]}
            />
            <FormInput
              label="Unit/Kampus"
              type="select"
              value={filters.campus_id}
              onChange={(e) => handleFilterChange('campus_id', e.target.value)}
              options={[{ value: '', label: 'Semua Unit' }, ...campusOptions]}
            />
            <FormInput
              label="Kondisi"
              type="select"
              value={filters.condition}
              onChange={(e) => handleFilterChange('condition', e.target.value)}
              options={[{ value: '', label: 'Semua Kondisi' }, ...conditions]}
            />
            <FormInput
              label="Status"
              type="select"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              options={[
                { value: '', label: 'Semua Status' },
                { value: 'active', label: 'Aktif' },
                { value: 'inactive', label: 'Nonaktif' },
              ]}
            />
            <div className="col-span-2 md:col-span-4 flex justify-end">
              <button
                onClick={handleClearFilters}
                className="text-sm text-primary hover:underline"
              >
                Reset Filter
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FiBox className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Daftar Item</h3>
        </div>
        <DataTable
          columns={columns}
          data={itemsData}
          loading={dataLoading}
          pagination={items.pagination}
          onPageChange={setPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showActions={true}
          actionColumn={{ view: false, edit: true, delete: true }}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Item' : 'Tambah Item'}
        onSubmit={handleSubmit}
        loading={formLoading}
        size="lg"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Kode Item"
            name="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="Contoh: INV-001"
            required
          />
          <FormInput
            label="Nama Item"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Contoh: Komputer Desktop"
            required
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormInput
            label="Kategori"
            name="category_id"
            type="select"
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            options={[{ value: '', label: 'Pilih Kategori' }, ...categoryOptions]}
          />
          <FormInput
            label="Jumlah"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            placeholder="0"
            required
          />
          <FormInput
            label="Satuan"
            name="unit"
            type="select"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            options={units}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Kondisi"
            name="condition"
            type="select"
            value={formData.condition}
            onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
            options={conditions}
          />
          <FormInput
            label="Status"
            name="status"
            type="select"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'active', label: 'Aktif' },
              { value: 'inactive', label: 'Nonaktif' },
            ]}
          />
        </div>

        <div className="border-t border-gray-100 pt-4 mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Lokasi Item</h4>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Unit/Kampus"
              name="campus_id"
              type="select"
              value={formData.campus_id}
              onChange={(e) => setFormData({ ...formData, campus_id: e.target.value })}
              options={[{ value: '', label: 'Pilih Unit' }, ...campusOptions]}
            />
            <FormInput
              label="Gedung"
              name="building_id"
              type="select"
              value={formData.building_id}
              onChange={(e) => setFormData({ ...formData, building_id: e.target.value })}
              options={[{ value: '', label: 'Pilih Gedung' }, ...buildingOptions]}
            />
            <FormInput
              label="Lantai"
              name="floor_id"
              type="select"
              value={formData.floor_id}
              onChange={(e) => setFormData({ ...formData, floor_id: e.target.value })}
              options={[{ value: '', label: 'Pilih Lantai' }, ...floorOptions]}
            />
            <FormInput
              label="Ruangan"
              name="room_id"
              type="select"
              value={formData.room_id}
              onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
              options={[{ value: '', label: 'Pilih Ruangan' }, ...roomOptions]}
            />
          </div>
          <FormInput
            label="Lokasi Manual"
            name="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Deskripsi lokasi (jika tidak ada di pilihan)"
          />
        </div>

        <FormInput
          label="Deskripsi"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Deskripsi item (opsional)"
        />
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

export default Inventory;

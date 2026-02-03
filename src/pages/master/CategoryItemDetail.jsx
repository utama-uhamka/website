import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
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
  FiLoader,
} from 'react-icons/fi';
import {
  fetchCategoryItemById,
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

const CategoryItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const { loading: masterLoading, error: masterError, success: masterSuccess } = useSelector((state) => state.master);
  const { items, loading: dataLoading, error: dataError, success: dataSuccess } = useSelector((state) => state.data);

  // Local state for category detail
  const [categoryData, setCategoryData] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(true);

  // Items CRUD states
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
  const [itemFormLoading, setItemFormLoading] = useState(false);

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

  // Load category detail
  const loadCategoryDetail = useCallback(async () => {
    setCategoryLoading(true);
    try {
      const result = await dispatch(fetchCategoryItemById(id)).unwrap();
      setCategoryData(result.data);
    } catch (err) {
      toast.error(err || 'Gagal memuat detail kategori');
      navigate('/master/category-items');
    } finally {
      setCategoryLoading(false);
    }
  }, [dispatch, id, navigate]);

  // Load items for this category
  const loadItems = useCallback(() => {
    dispatch(fetchItems({ category_id: id, limit: 100 }));
  }, [dispatch, id]);

  // Initial load
  useEffect(() => {
    loadCategoryDetail();
    loadItems();
  }, [loadCategoryDetail, loadItems]);

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

  // Data arrays
  const itemsData = items.data || [];

  // Column definitions
  const itemColumns = [
    { key: 'code', label: 'Kode', width: '100px' },
    { key: 'name', label: 'Nama Item' },
    { key: 'quantity', label: 'Jumlah', width: '80px', render: (v, row) => `${v} ${row.unit || ''}` },
    {
      key: 'item_condition',
      label: 'Kondisi',
      width: '120px',
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
      unit: item.unit || 'Unit',
      condition: item.condition,
      location: item.location || '',
      status: item.status,
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
        category_id: parseInt(id),
        quantity: parseInt(itemForm.quantity),
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
  const totalItems = itemsData.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const goodCondition = itemsData.filter(item => item.condition === 'Baik').length;
  const needAttention = itemsData.filter(item => item.condition !== 'Baik').length;

  if (categoryLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <FiLoader className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!categoryData) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <p className="text-gray-500">Kategori tidak ditemukan</p>
        </div>
      </MainLayout>
    );
  }

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
          loading={dataLoading}
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
        loading={itemFormLoading}
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

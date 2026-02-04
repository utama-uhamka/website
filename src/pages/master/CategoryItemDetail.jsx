import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import MainLayout from '../../layouts/MainLayout';
import {
  DataTable,
  Modal,
  FormInput,
  ConfirmDialog,
  PageHeader,
} from '../../components/ui';
import {
  FiArrowLeft,
  FiBox,
  FiTag,
  FiPackage,
  FiCheckCircle,
  FiAlertCircle,
  FiTool,
  FiLoader,
  FiImage,
  FiFileText,
  FiClock,
  FiUser,
  FiX,
  FiUpload,
} from 'react-icons/fi';
import {
  fetchCategoryItemById,
  fetchRooms,
  fetchBuildings,
  fetchFloors,
  clearMasterError,
} from '../../store/masterSlice';
import {
  fetchItems,
  updateItem,
  deleteItem,
  fetchIssues,
  clearDataError,
  clearDataSuccess,
} from '../../store/dataSlice';
import { convertToWebP, validateImageFile } from '../../utils/imageUtils';
import logoFallback from '/logo.png';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper function to get image URL
const getImageUrl = (photo, folder) => {
  if (!photo) return logoFallback;
  if (photo.startsWith('http://') || photo.startsWith('https://')) return photo;
  return `${API_BASE_URL.replace('/api/dashboard', '')}/uploads/${folder}/${photo}`;
};

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get status label
const getStatusLabel = (status) => {
  const statusNum = parseInt(status);
  if (isNaN(statusNum) || status === null || status === undefined) {
    return { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' };
  }
  switch (statusNum) {
    case 0: return { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' };
    case 1: return { label: 'Diproses', color: 'bg-blue-100 text-blue-700' };
    case 2: return { label: 'Selesai', color: 'bg-green-100 text-green-700' };
    case 3: return { label: 'Ditolak', color: 'bg-red-100 text-red-700' };
    case 4: return { label: 'Selesai', color: 'bg-green-100 text-green-700' };
    default: return { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' };
  }
};

const CategoryItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const { error: masterError, rooms, buildings, floors } = useSelector((state) => state.master);
  const { items, issues, loading: dataLoading, error: dataError, success: dataSuccess } = useSelector((state) => state.data);

  // Local state for category detail
  const [categoryData, setCategoryData] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Item CRUD states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    item_name: '',
    item_code: '',
    item_description: '',
    total: '',
    brand: '',
    item_condition: 'Baik',
    building_id: '',
    floor_id: '',
    room_id: '',
    maintenance: '',
    pembelian: '',
  });

  // Image upload states
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const photoInputRef = useRef(null);

  // Issue modal states
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [issueItem, setIssueItem] = useState(null);
  const [issueLoading, setIssueLoading] = useState(false);
  const [itemIssues, setItemIssues] = useState([]);

  // Dropdown options
  const conditions = [
    { value: 'Baik', label: 'Baik' },
    { value: 'Menunggu Diperbaiki', label: 'Menunggu Diperbaiki' },
    { value: 'Diperbaiki', label: 'Diperbaiki' },
    { value: 'Rusak', label: 'Rusak' },
  ];

  const maintenanceOptions = [
    { value: '', label: 'Tidak Ada' },
    { value: '1 Minggu', label: '1 Minggu' },
    { value: '2 Minggu', label: '2 Minggu' },
    { value: '1 Bulan', label: '1 Bulan' },
    { value: '3 Bulan', label: '3 Bulan' },
    { value: '6 Bulan', label: '6 Bulan' },
    { value: '1 Tahun', label: '1 Tahun' },
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
    dispatch(fetchItems({
      category_item_id: id,
      page: currentPage,
      limit: itemsPerPage
    }));
  }, [dispatch, id, currentPage, itemsPerPage]);

  // Initial load
  useEffect(() => {
    loadCategoryDetail();
    dispatch(fetchBuildings({ limit: 100 }));
    dispatch(fetchFloors({ limit: 100 }));
    dispatch(fetchRooms({ limit: 100 }));
  }, [loadCategoryDetail, dispatch]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Handle errors
  useEffect(() => {
    if (masterError) {
      toast.error(masterError);
      dispatch(clearMasterError());
    }
  }, [masterError, dispatch]);

  useEffect(() => {
    if (dataError) {
      toast.error(dataError);
      dispatch(clearDataError());
    }
  }, [dataError, dispatch]);

  // Handle success
  useEffect(() => {
    if (dataSuccess) {
      toast.success(dataSuccess);
      dispatch(clearDataSuccess());
      loadItems();
      loadCategoryDetail();
    }
  }, [dataSuccess, dispatch, loadItems, loadCategoryDetail]);

  // Data arrays
  const itemsData = items.data || [];
  const allCategoryItems = categoryData?.items || [];

  // Dropdown options
  const buildingOptions = (buildings.data || []).map((b) => ({
    value: b.building_id,
    label: b.building_name,
  }));

  const floorOptions = (floors.data || [])
    .filter((f) => !formData.building_id || f.building_id === formData.building_id)
    .map((f) => ({
      value: f.floor_id,
      label: f.floor_name,
    }));

  const roomOptions = (rooms.data || [])
    .filter((r) => !formData.floor_id || r.floor_id === formData.floor_id)
    .map((r) => ({
      value: r.room_id,
      label: r.room_name,
    }));

  // Column definitions for items
  const itemColumns = [
    {
      key: 'photo_1',
      label: 'Foto',
      width: '70px',
      render: (value) => (
        <img
          src={getImageUrl(value, 'items')}
          alt="Item"
          className="w-10 h-10 object-cover rounded-lg border border-gray-200"
          onError={(e) => { e.target.src = logoFallback; }}
        />
      ),
    },
    {
      key: 'item_code',
      label: 'Kode',
      width: '120px',
      render: (value) => <span className="font-mono text-xs">{value}</span>,
    },
    { key: 'item_name', label: 'Nama Item' },
    { key: 'brand', label: 'Merek', width: '100px' },
    {
      key: 'total',
      label: 'Jumlah',
      width: '80px',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          {value || 0}
        </span>
      ),
    },
    {
      key: 'item_condition',
      label: 'Kondisi',
      width: '140px',
      render: (value) => (
        <span className={`inline-flex items-center whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-medium ${
          value === 'Baik' ? 'bg-green-100 text-green-700' :
          value === 'Diperbaiki' ? 'bg-blue-100 text-blue-700' :
          value === 'Menunggu Diperbaiki' ? 'bg-yellow-100 text-yellow-700' :
          value === 'Rusak' ? 'bg-red-100 text-red-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {value || '-'}
        </span>
      ),
    },
    {
      key: 'issues',
      label: 'Issue',
      width: '80px',
      render: (value, row) => {
        const issueCount = row.issues?.length || 0;
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewIssues(row);
            }}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              issueCount > 0
                ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <FiFileText className="w-3 h-3" />
            {issueCount}
          </button>
        );
      },
    },
  ];

  // Calculate stats
  const totalItems = allCategoryItems.length;
  const totalUnits = allCategoryItems.reduce((sum, item) => sum + (item.total || 0), 0);
  const goodCondition = allCategoryItems.filter(item => item.item_condition === 'Baik').length;
  const needRepair = allCategoryItems.filter(item =>
    item.item_condition === 'Menunggu Diperbaiki' || item.item_condition === 'Diperbaiki'
  ).length;
  const damaged = allCategoryItems.filter(item => item.item_condition === 'Rusak').length;

  // Handlers
  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      item_name: item.item_name || '',
      item_code: item.item_code || '',
      item_description: item.item_description || '',
      total: item.total?.toString() || '',
      brand: item.brand || '',
      item_condition: item.item_condition || 'Baik',
      building_id: item.building_id || '',
      floor_id: item.floor_id || '',
      room_id: item.room_id || '',
      maintenance: item.maintenance || '',
      pembelian: item.pembelian ? item.pembelian.split('T')[0] : '',
    });
    setPhotoPreview(item.photo_1 ? getImageUrl(item.photo_1, 'items') : '');
    setPhotoFile(null);
    setIsEditModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleViewIssues = async (item) => {
    setIssueItem(item);
    setIssueLoading(true);
    setIsIssueModalOpen(true);

    try {
      const result = await dispatch(fetchIssues({ item_id: item.item_id, limit: 50 })).unwrap();
      setItemIssues(result.data || []);
    } catch (err) {
      toast.error('Gagal memuat riwayat issue');
      setItemIssues([]);
    } finally {
      setIssueLoading(false);
    }
  };

  // File upload handler
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file, 5);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setImageLoading(true);
    try {
      const webpBlob = await convertToWebP(file, 0.8);
      const webpFile = new File([webpBlob], `photo_${Date.now()}.webp`, { type: 'image/webp' });
      const previewUrl = URL.createObjectURL(webpBlob);

      setPhotoFile(webpFile);
      setPhotoPreview(previewUrl);
    } catch (err) {
      toast.error(err.message || 'Gagal memproses gambar');
    } finally {
      setImageLoading(false);
    }
  };

  const removeImage = () => {
    setPhotoFile(null);
    setPhotoPreview('');
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!formData.item_name.trim()) {
      toast.error('Nama item wajib diisi');
      return;
    }

    setFormLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('item_name', formData.item_name);
      submitData.append('item_code', formData.item_code);
      submitData.append('item_description', formData.item_description);
      submitData.append('total', formData.total || '0');
      submitData.append('brand', formData.brand);
      submitData.append('item_condition', formData.item_condition);
      submitData.append('category_item_id', id);
      if (formData.building_id) submitData.append('building_id', formData.building_id);
      if (formData.floor_id) submitData.append('floor_id', formData.floor_id);
      if (formData.room_id) submitData.append('room_id', formData.room_id);
      if (formData.maintenance) submitData.append('maintenance', formData.maintenance);
      if (formData.pembelian) submitData.append('pembelian', formData.pembelian);
      if (photoFile) submitData.append('photo_1', photoFile);

      await dispatch(updateItem({ id: selectedItem.item_id, data: submitData })).unwrap();
      setIsEditModalOpen(false);
    } catch (err) {
      // Error handled by slice
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteItem(selectedItem.item_id)).unwrap();
      setIsDeleteOpen(false);
    } catch (err) {
      // Error handled by slice
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      // Reset dependent dropdowns
      if (name === 'building_id') {
        newData.floor_id = '';
        newData.room_id = '';
      }
      if (name === 'floor_id') {
        newData.room_id = '';
      }
      return newData;
    });
  };

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
        title={categoryData.category_item_name}
        subtitle="Detail kategori item"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Kategori Item', path: '/master/category-items' },
          { label: categoryData.category_item_name },
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

      {/* Category Info Card */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50 rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            {categoryData.photo_1 ? (
              <img
                src={getImageUrl(categoryData.photo_1, 'category_items')}
                alt={categoryData.category_item_name}
                className="w-24 h-24 rounded-2xl object-cover shadow-lg border-2 border-white"
                onError={(e) => { e.target.src = logoFallback; }}
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                <FiTag className="w-12 h-12 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl font-bold text-gray-800">{categoryData.category_item_name}</h2>
                  <span className={`inline-flex items-center whitespace-nowrap px-3 py-1 rounded-full text-sm font-medium ${
                    categoryData.type === 'Item' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {categoryData.type || 'Item'}
                  </span>
                </div>
                <p className="text-gray-500 mt-1 font-mono text-sm">ID: {categoryData.category_item_id}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 text-gray-600">
                <FiPackage className="w-4 h-4" />
                <span className="text-sm">{totalItems} Jenis Item</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FiBox className="w-4 h-4" />
                <span className="text-sm">{totalUnits} Total Unit</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2.5 rounded-xl shadow">
              <FiPackage className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{totalItems}</p>
              <p className="text-xs text-gray-500">Jenis Item</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2.5 rounded-xl shadow">
              <FiBox className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{totalUnits}</p>
              <p className="text-xs text-gray-500">Total Unit</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 p-2.5 rounded-xl shadow">
              <FiCheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{goodCondition}</p>
              <p className="text-xs text-gray-500">Kondisi Baik</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500 p-2.5 rounded-xl shadow">
              <FiTool className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{needRepair}</p>
              <p className="text-xs text-gray-500">Diperbaiki</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-500 p-2.5 rounded-xl shadow">
              <FiAlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{damaged}</p>
              <p className="text-xs text-gray-500">Rusak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Daftar Item</h3>
        </div>

        {dataLoading ? (
          <div className="flex items-center justify-center py-12">
            <FiLoader className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : allCategoryItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <FiImage className="w-16 h-16 mb-4" />
            <p className="text-lg font-medium">Belum ada item</p>
            <p className="text-sm">Item dalam kategori ini akan ditampilkan di sini</p>
          </div>
        ) : (
          <DataTable
            columns={itemColumns}
            data={itemsData}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentPage={items.pagination?.page || 1}
            totalPages={items.pagination?.totalPages || 1}
            totalItems={items.pagination?.total || 0}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            showActions={true}
            actionColumn={{ view: false, edit: true, delete: true }}
          />
        )}
      </div>

      {/* Edit Item Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Item"
        onSubmit={handleSubmit}
        size="lg"
        loading={formLoading}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Kode Item"
            name="item_code"
            value={formData.item_code}
            onChange={handleInputChange}
            placeholder="Kode item"
          />
          <FormInput
            label="Nama Item"
            name="item_name"
            value={formData.item_name}
            onChange={handleInputChange}
            placeholder="Nama item"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Merek"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            placeholder="Merek item"
          />
          <FormInput
            label="Jumlah"
            name="total"
            type="number"
            value={formData.total}
            onChange={handleInputChange}
            placeholder="0"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Kondisi"
            name="item_condition"
            type="select"
            value={formData.item_condition}
            onChange={handleInputChange}
            options={conditions}
          />
          <FormInput
            label="Jadwal Maintenance"
            name="maintenance"
            type="select"
            value={formData.maintenance}
            onChange={handleInputChange}
            options={maintenanceOptions}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormInput
            label="Gedung"
            name="building_id"
            type="select"
            value={formData.building_id}
            onChange={handleInputChange}
            options={buildingOptions}
          />
          <FormInput
            label="Lantai"
            name="floor_id"
            type="select"
            value={formData.floor_id}
            onChange={handleInputChange}
            options={floorOptions}
          />
          <FormInput
            label="Ruangan"
            name="room_id"
            type="select"
            value={formData.room_id}
            onChange={handleInputChange}
            options={roomOptions}
          />
        </div>
        <FormInput
          label="Tanggal Pembelian"
          name="pembelian"
          type="date"
          value={formData.pembelian}
          onChange={handleInputChange}
        />
        <FormInput
          label="Deskripsi"
          name="item_description"
          type="textarea"
          value={formData.item_description}
          onChange={handleInputChange}
          placeholder="Deskripsi item"
        />

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Foto Item</label>
          <div className="relative">
            {photoPreview ? (
              <div className="relative group">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg border border-gray-200"
                  onError={(e) => { e.target.src = logoFallback; }}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                  >
                    <FiUpload size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => photoInputRef.current?.click()}
                className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
              >
                {imageLoading ? (
                  <FiLoader className="w-8 h-8 animate-spin text-primary" />
                ) : (
                  <>
                    <FiImage className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Klik untuk upload</p>
                  </>
                )}
              </div>
            )}
            <input
              ref={photoInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Item"
        message={`Apakah Anda yakin ingin menghapus "${selectedItem?.item_name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        type="danger"
        loading={dataLoading}
      />

      {/* Issue Timeline Modal */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        title={`Riwayat Issue - ${issueItem?.item_name || ''}`}
        size="lg"
        showFooter={false}
      >
        {issueLoading ? (
          <div className="flex items-center justify-center py-12">
            <FiLoader className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : itemIssues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <FiFileText className="w-16 h-16 mb-4" />
            <p className="text-lg font-medium">Tidak ada riwayat issue</p>
            <p className="text-sm">Item ini belum memiliki laporan issue</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

            {/* Timeline items */}
            <div className="space-y-6">
              {itemIssues.map((issue, index) => {
                const statusInfo = getStatusLabel(issue.status);
                return (
                  <div key={issue.issue_history_id} className="relative pl-14">
                    {/* Timeline dot */}
                    <div className={`absolute left-4 w-5 h-5 rounded-full border-2 border-white shadow ${
                      parseInt(issue.status) === 2 || parseInt(issue.status) === 4 ? 'bg-green-500' :
                      parseInt(issue.status) === 1 ? 'bg-blue-500' :
                      parseInt(issue.status) === 3 ? 'bg-red-500' :
                      'bg-yellow-500'
                    }`} />

                    {/* Issue Card */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">{issue.issue_title}</h4>
                        <span className={`inline-flex items-center whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{issue.issue_description}</p>

                      {/* Issue Photos */}
                      {(issue.photo_1 || issue.photo_2) && (
                        <div className="flex gap-2 mb-3">
                          {issue.photo_1 && (
                            <img
                              src={getImageUrl(issue.photo_1, 'issues')}
                              alt="Issue"
                              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                              onError={(e) => { e.target.src = logoFallback; }}
                            />
                          )}
                          {issue.photo_2 && (
                            <img
                              src={getImageUrl(issue.photo_2, 'issues')}
                              alt="Issue"
                              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                              onError={(e) => { e.target.src = logoFallback; }}
                            />
                          )}
                        </div>
                      )}

                      {/* Issue Meta */}
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <FiUser className="w-3 h-3" />
                          <span>{issue.user?.full_name || issue.oleh || '-'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiClock className="w-3 h-3" />
                          <span>{formatDate(issue.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className={`inline-flex items-center whitespace-nowrap px-2 py-0.5 rounded text-xs font-medium ${
                            issue.item_condition === 'Baik' ? 'bg-green-100 text-green-700' :
                            issue.item_condition === 'Diperbaiki' ? 'bg-blue-100 text-blue-700' :
                            issue.item_condition === 'Menunggu Diperbaiki' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {issue.item_condition}
                          </span>
                        </div>
                      </div>

                      {/* Technician info if available */}
                      {issue.teknisi_lainnya && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">Teknisi:</span> {issue.teknisi_lainnya}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Modal>
    </MainLayout>
  );
};

export default CategoryItemDetail;

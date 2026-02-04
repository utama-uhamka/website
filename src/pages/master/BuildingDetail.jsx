import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  FiCheckCircle,
  FiXCircle,
  FiLoader,
  FiExternalLink,
  FiUpload,
  FiX,
  FiImage,
} from 'react-icons/fi';
import { convertToWebP, validateImageFile } from '../../utils/imageUtils';
import {
  fetchBuildingById,
  fetchFloors,
  createFloor,
  updateFloor,
  deleteFloor,
  clearMasterError,
  clearMasterSuccess,
  fetchCategoryItems,
} from '../../store/masterSlice';
import {
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
  clearDataError,
  clearDataSuccess,
} from '../../store/dataSlice';
import logoFallback from '/logo.png';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper function to get building image URL
const getBuildingImageUrl = (photo) => {
  if (!photo) return logoFallback;
  if (photo.startsWith('http://') || photo.startsWith('https://')) return photo;
  return `${API_BASE_URL.replace('/api/dashboard', '')}/uploads/buildings/${photo}`;
};

// Helper function to get item image URL
const getItemImageUrl = (photo) => {
  if (!photo) return null;
  if (photo.startsWith('http://') || photo.startsWith('https://')) return photo;
  return `${API_BASE_URL.replace('/api/dashboard', '')}/uploads/items/${photo}`;
};

// Helper function to get floor image URL
const getFloorImageUrl = (photo) => {
  if (!photo) return null;
  if (photo.startsWith('http://') || photo.startsWith('https://')) return photo;
  return `${API_BASE_URL.replace('/api/dashboard', '')}/uploads/floors/${photo}`;
};

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
  const [floorPhotoFile, setFloorPhotoFile] = useState(null);
  const [floorPhotoPreview, setFloorPhotoPreview] = useState('');

  // Item CRUD states
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isItemDeleteOpen, setIsItemDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemForm, setItemForm] = useState({
    item_name: '',
    item_description: '',
    category_item_id: '',
    item_condition: 'Baik',
    total: '',
    brand: '',
    maintenance: '',
    maintenance_date: '',
    pembelian: '',
  });
  const [itemFormLoading, setItemFormLoading] = useState(false);

  // Item photo states
  const [itemPhoto1File, setItemPhoto1File] = useState(null);
  const [itemPhoto1Preview, setItemPhoto1Preview] = useState('');
  const [itemPhoto2File, setItemPhoto2File] = useState(null);
  const [itemPhoto2Preview, setItemPhoto2Preview] = useState('');
  const [itemImageLoading, setItemImageLoading] = useState(false);
  const itemPhoto1InputRef = useRef(null);
  const itemPhoto2InputRef = useRef(null);

  const itemConditions = [
    { value: 'Baik', label: 'Baik' },
    { value: 'Menunggu Diperbaiki', label: 'Menunggu Diperbaiki' },
    { value: 'Diperbaiki', label: 'Diperbaiki' },
    { value: 'Rusak', label: 'Rusak' },
  ];

  const maintenanceOptions = [
    { value: '', label: 'Tidak ada' },
    { value: '1 Minggu', label: '1 Minggu' },
    { value: '2 Minggu', label: '2 Minggu' },
    { value: '1 Bulan', label: '1 Bulan' },
    { value: '3 Bulan', label: '3 Bulan' },
    { value: '6 Bulan', label: '6 Bulan' },
    { value: '1 Tahun', label: '1 Tahun' },
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
    {
      key: 'photo_1',
      label: 'Foto',
      width: '80px',
      render: (value) => (
        <img
          src={getFloorImageUrl(value) || logoFallback}
          alt="Floor"
          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
          onError={(e) => { e.target.src = logoFallback; }}
        />
      ),
    },
    { key: 'floor_id', label: 'ID', width: '100px' },
    { key: 'floor_name', label: 'Nama Lantai' },
    { key: 'roomCount', label: 'Jumlah Ruangan', width: '140px', render: (v) => v || 0 },
  ];

  const itemColumns = [
    {
      key: 'photo_1',
      label: 'Foto',
      width: '80px',
      render: (value) => (
        <img
          src={getItemImageUrl(value) || logoFallback}
          alt="Item"
          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
          onError={(e) => { e.target.src = logoFallback; }}
        />
      ),
    },
    { key: 'item_code', label: 'Kode', width: '120px' },
    { key: 'item_name', label: 'Nama Item' },
    {
      key: 'category_item',
      label: 'Kategori',
      width: '140px',
      render: (_, row) => (
        <span className="inline-flex items-center whitespace-nowrap px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700">
          {row.category_item?.category_item_name || '-'}
        </span>
      ),
    },
    { key: 'total', label: 'Jumlah', width: '80px' },
    {
      key: 'item_condition',
      label: 'Kondisi',
      width: '140px',
      render: (v) => (
        <span className={`inline-flex items-center whitespace-nowrap px-2 py-1 rounded-full text-xs font-medium ${
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
  ];

  // Floor photo handler
  const handleFloorPhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    try {
      const webpFile = await convertToWebP(file);
      setFloorPhotoFile(webpFile);
      setFloorPhotoPreview(URL.createObjectURL(webpFile));
    } catch (error) {
      toast.error('Gagal memproses gambar');
    }
  };

  const removeFloorPhoto = () => {
    setFloorPhotoFile(null);
    setFloorPhotoPreview('');
  };

  // Floor handlers
  const handleAddFloor = () => {
    setSelectedFloor(null);
    setFloorForm({ floor_name: '' });
    setFloorPhotoFile(null);
    setFloorPhotoPreview('');
    setIsFloorModalOpen(true);
  };

  const handleEditFloor = (item) => {
    setSelectedFloor(item);
    setFloorForm({
      floor_name: item.floor_name || '',
    });
    setFloorPhotoFile(null);
    setFloorPhotoPreview(item.photo_1 ? getFloorImageUrl(item.photo_1) : '');
    setIsFloorModalOpen(true);
  };

  const handleDeleteFloor = (item) => {
    setSelectedFloor(item);
    setIsFloorDeleteOpen(true);
  };

  const handleFloorSubmit = async () => {
    setFloorFormLoading(true);
    try {
      let submitData;

      if (floorPhotoFile) {
        // Use FormData when there's a photo
        submitData = new FormData();
        submitData.append('floor_name', floorForm.floor_name);
        submitData.append('building_id', id);
        submitData.append('photo_1', floorPhotoFile);
      } else {
        submitData = {
          floor_name: floorForm.floor_name,
          building_id: id,
        };
      }

      if (selectedFloor) {
        await dispatch(updateFloor({ id: selectedFloor.floor_id, data: submitData })).unwrap();
      } else {
        await dispatch(createFloor(submitData)).unwrap();
      }
      setIsFloorModalOpen(false);
      setFloorPhotoFile(null);
      setFloorPhotoPreview('');
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

  // Item photo handlers
  const resetItemPhotoStates = () => {
    setItemPhoto1File(null);
    setItemPhoto1Preview('');
    setItemPhoto2File(null);
    setItemPhoto2Preview('');
  };

  const handleItemPhotoChange = async (e, photoNum) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file, 5);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setItemImageLoading(true);
    try {
      const webpBlob = await convertToWebP(file, 0.8);
      const webpFile = new File([webpBlob], `photo_${Date.now()}.webp`, { type: 'image/webp' });
      const previewUrl = URL.createObjectURL(webpBlob);

      if (photoNum === 1) {
        setItemPhoto1File(webpFile);
        setItemPhoto1Preview(previewUrl);
      } else {
        setItemPhoto2File(webpFile);
        setItemPhoto2Preview(previewUrl);
      }
      toast.success('Gambar berhasil dikonversi ke WebP');
    } catch (err) {
      toast.error(err.message || 'Gagal memproses gambar');
    } finally {
      setItemImageLoading(false);
    }
  };

  const removeItemPhoto = (photoNum) => {
    if (photoNum === 1) {
      setItemPhoto1File(null);
      setItemPhoto1Preview('');
      if (itemPhoto1InputRef.current) itemPhoto1InputRef.current.value = '';
    } else {
      setItemPhoto2File(null);
      setItemPhoto2Preview('');
      if (itemPhoto2InputRef.current) itemPhoto2InputRef.current.value = '';
    }
  };

  // Item handlers
  const handleAddItem = () => {
    setSelectedItem(null);
    setItemForm({
      item_name: '',
      item_description: '',
      category_item_id: '',
      item_condition: 'Baik',
      total: '',
      brand: '',
      maintenance: '',
      maintenance_date: '',
      pembelian: '',
    });
    resetItemPhotoStates();
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setItemForm({
      item_name: item.item_name || '',
      item_description: item.item_description || '',
      category_item_id: item.category_item_id?.toString() || '',
      item_condition: item.item_condition || 'Baik',
      total: item.total?.toString() || '',
      brand: item.brand || '',
      maintenance: item.maintenance || '',
      maintenance_date: item.maintenance_date ? item.maintenance_date.split('T')[0] : '',
      pembelian: item.pembelian || '',
    });
    setItemPhoto1Preview(item.photo_1 ? getItemImageUrl(item.photo_1) : '');
    setItemPhoto2Preview(item.photo_2 ? getItemImageUrl(item.photo_2) : '');
    setItemPhoto1File(null);
    setItemPhoto2File(null);
    setIsItemModalOpen(true);
  };

  const handleDeleteItem = (item) => {
    setSelectedItem(item);
    setIsItemDeleteOpen(true);
  };

  const handleItemSubmit = async () => {
    if (!itemForm.item_name || !itemForm.category_item_id || !itemForm.total) {
      toast.error('Nama, Kategori, dan Jumlah wajib diisi');
      return;
    }

    setItemFormLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('item_name', itemForm.item_name);
      // item_code auto-generated by API for new items, keep existing for edit
      if (selectedItem && selectedItem.item_code) {
        submitData.append('item_code', selectedItem.item_code);
      }
      submitData.append('item_description', itemForm.item_description || itemForm.item_name);
      submitData.append('category_item_id', itemForm.category_item_id);
      submitData.append('campus_id', buildingData.campus_id);
      submitData.append('building_id', id);
      submitData.append('item_condition', itemForm.item_condition);
      submitData.append('total', parseInt(itemForm.total));
      submitData.append('category_pln_pdam', 0); // Regular items are not PLN/PDAM
      if (itemForm.brand) submitData.append('brand', itemForm.brand);
      if (itemForm.maintenance) submitData.append('maintenance', itemForm.maintenance);
      if (itemForm.maintenance_date) submitData.append('maintenance_date', itemForm.maintenance_date);
      if (itemForm.pembelian) submitData.append('pembelian', itemForm.pembelian);

      if (itemPhoto1File) {
        submitData.append('photo_1', itemPhoto1File);
      }
      if (itemPhoto2File) {
        submitData.append('photo_2', itemPhoto2File);
      }

      if (selectedItem) {
        await dispatch(updateItem({ id: selectedItem.item_id, data: submitData })).unwrap();
      } else {
        await dispatch(createItem(submitData)).unwrap();
      }
      setIsItemModalOpen(false);
      resetItemPhotoStates();
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
  const totalFloors = floorsPagination.total || floorsData.length;
  const totalItems = itemsPagination.total || itemsData.length;
  const totalRooms = floorsData.reduce((acc, f) => acc + (f.roomCount || 0), 0);
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
          { label: buildingData.campus?.campus_name || 'Unit', path: `/master/units/${buildingData.campus_id}` },
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
          {/* Building Image */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
              <img
                src={getBuildingImageUrl(buildingData.photo_1)}
                alt={buildingData.building_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = logoFallback;
                }}
              />
            </div>
          </div>

          {/* Building Info */}
          <div className="flex-1">

            <div className="grid grid-cols-2 md:grid-cols-2 gap-1">
              <Link
                to={`/master/units/${buildingData.campus_id}`}
                className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-sm transition-all"
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FiMapPin className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-gray-500">Nama Unit</span>
                  <p className="font-medium text-sm truncate">{buildingData.campus?.campus_name || '-'}</p>
                </div>
              </Link>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiLayers className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-gray-500">Jumlah Lantai</span>
                  <p className="font-semibold text-lg">{totalFloors}</p>
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
                  <p className="font-semibold text-lg">{totalItems}</p>
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
              <p className="text-2xl font-bold text-gray-800">{totalFloors}</p>
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

        {/* Floor Photo Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Foto Lantai
          </label>
          {floorPhotoPreview ? (
            <div className="relative inline-block">
              <img
                src={floorPhotoPreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={removeFloorPhoto}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Klik untuk upload foto</p>
                <p className="text-xs text-gray-400">PNG, JPG, WebP (Maks. 5MB)</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFloorPhotoChange}
              />
            </label>
          )}
        </div>
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
        size="lg"
      >
        <FormInput
          label="Nama Item"
          name="item_name"
          value={itemForm.item_name}
          onChange={(e) => setItemForm({ ...itemForm, item_name: e.target.value })}
          placeholder="Contoh: Meja Kerja"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Kategori"
            name="category_item_id"
            type="select"
            value={itemForm.category_item_id}
            onChange={(e) => setItemForm({ ...itemForm, category_item_id: e.target.value })}
            options={[{ value: '', label: 'Pilih Kategori' }, ...categoryOptions]}
            required
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
            options={itemConditions}
            noDefaultOption
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
          label="Deskripsi"
          name="item_description"
          type="textarea"
          value={itemForm.item_description}
          onChange={(e) => setItemForm({ ...itemForm, item_description: e.target.value })}
          placeholder="Deskripsi item"
        />

        {/* Photo Upload Section */}
        <div className="border-t pt-4 mt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Foto Item (Opsional)</h4>
          <div className="grid grid-cols-2 gap-4">
            {/* Photo 1 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Foto 1</label>
              <div className="relative">
                {itemPhoto1Preview ? (
                  <div className="relative group">
                    <img
                      src={itemPhoto1Preview}
                      alt="Preview 1"
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => itemPhoto1InputRef.current?.click()}
                        className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                      >
                        <FiUpload size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItemPhoto(1)}
                        className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => itemPhoto1InputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    {itemImageLoading ? (
                      <FiLoader className="w-6 h-6 animate-spin text-primary" />
                    ) : (
                      <>
                        <FiImage className="w-6 h-6 text-gray-400 mb-1" />
                        <p className="text-xs text-gray-500">Upload Foto</p>
                      </>
                    )}
                  </div>
                )}
                <input
                  ref={itemPhoto1InputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={(e) => handleItemPhotoChange(e, 1)}
                  className="hidden"
                />
              </div>
            </div>

            {/* Photo 2 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Foto 2</label>
              <div className="relative">
                {itemPhoto2Preview ? (
                  <div className="relative group">
                    <img
                      src={itemPhoto2Preview}
                      alt="Preview 2"
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => itemPhoto2InputRef.current?.click()}
                        className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                      >
                        <FiUpload size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItemPhoto(2)}
                        className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => itemPhoto2InputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    {itemImageLoading ? (
                      <FiLoader className="w-6 h-6 animate-spin text-primary" />
                    ) : (
                      <>
                        <FiImage className="w-6 h-6 text-gray-400 mb-1" />
                        <p className="text-xs text-gray-500">Upload Foto</p>
                      </>
                    )}
                  </div>
                )}
                <input
                  ref={itemPhoto2InputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={(e) => handleItemPhotoChange(e, 2)}
                  className="hidden"
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Gambar akan otomatis dikonversi ke format WebP</p>
        </div>

        {/* Maintenance Section */}
        <div className="border-t pt-4 mt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Maintenance (Opsional)</h4>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Jadwal Maintenance"
              name="maintenance"
              type="select"
              value={itemForm.maintenance}
              onChange={(e) => setItemForm({ ...itemForm, maintenance: e.target.value })}
              options={maintenanceOptions}
            />
            <FormInput
              label="Tanggal Maintenance"
              name="maintenance_date"
              type="date"
              value={itemForm.maintenance_date}
              onChange={(e) => setItemForm({ ...itemForm, maintenance_date: e.target.value })}
            />
          </div>
          <FormInput
            label="Tanggal Pembelian"
            name="pembelian"
            type="date"
            value={itemForm.pembelian}
            onChange={(e) => setItemForm({ ...itemForm, pembelian: e.target.value })}
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

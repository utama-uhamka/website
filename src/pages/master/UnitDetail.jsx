import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  Tabs,
  ConfirmDialog,
} from '../../components/ui';
import {
  FiArrowLeft,
  FiGrid,
  FiFileText,
  FiUsers,
  FiActivity,
  FiCalendar,
  FiDownload,
  FiMapPin,
  FiPlus,
  FiZap,
  FiDroplet,
  FiTrendingUp,
  FiFilter,
  FiLoader,
  FiUpload,
  FiX,
  FiImage,
  FiBox,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';
import { convertToWebP, validateImageFile } from '../../utils/imageUtils';
import { fetchCampusById } from '../../store/campusesSlice';
import {
  fetchBuildings,
  createBuilding,
  updateBuilding,
  deleteBuilding,
  fetchCategoryItems,
  clearMasterError,
  clearMasterSuccess,
} from '../../store/masterSlice';
import { fetchUsers } from '../../store/usersSlice';
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  fetchActivities,
  fetchBillings,
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
  clearDataError,
  clearDataSuccess,
} from '../../store/dataSlice';

const UnitDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedCampus, loading: campusLoading } = useSelector((state) => state.campuses);
  const { buildings, categoryItems, loading: masterLoading, error: masterError, success: masterSuccess } = useSelector(
    (state) => state.master
  );
  const { data: users } = useSelector((state) => state.users);
  const { events, activities, billings, items, loading: dataLoading, error: dataError, success: dataSuccess } = useSelector(
    (state) => state.data
  );

  const [activeTab, setActiveTab] = useState('gedung');

  // Export modal
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportData, setExportData] = useState({ start_date: '', end_date: '' });

  // Activity date filter - default to current month
  const getDefaultDateFilter = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const formatDate = (date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    return {
      start_date: formatDate(firstDay),
      end_date: formatDate(lastDay),
    };
  };

  const [activityDateFilter, setActivityDateFilter] = useState(getDefaultDateFilter);

  // Pagination states
  const [buildingPage, setBuildingPage] = useState(1);
  const [eventPage, setEventPage] = useState(1);
  const [itemPage, setItemPage] = useState(1);
  const itemsPerPage = 10;

  // Building CRUD states
  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);
  const [isBuildingDeleteOpen, setIsBuildingDeleteOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [buildingForm, setBuildingForm] = useState({
    building_name: '',
    latitude: '',
    longitude: '',
    radius: '',
  });
  const [buildingFormLoading, setBuildingFormLoading] = useState(false);

  // Building image states
  const [buildingPhotoFile, setBuildingPhotoFile] = useState(null);
  const [buildingPhotoPreview, setBuildingPhotoPreview] = useState('');
  const [buildingImageLoading, setBuildingImageLoading] = useState(false);
  const buildingPhotoInputRef = useRef(null);

  // Event CRUD states
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isEventDeleteOpen, setIsEventDeleteOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    event_name: '',
    event_category_id: '',
    event_date: '',
    location: '',
    status: 'upcoming',
  });
  const [eventFormLoading, setEventFormLoading] = useState(false);

  // Billing states
  const [activeBillingType, setActiveBillingType] = useState('pln');
  const [isBillingDetailOpen, setIsBillingDetailOpen] = useState(false);
  const [selectedBillingType, setSelectedBillingType] = useState(null);

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

  const itemConditions = [
    { value: 'Baik', label: 'Baik' },
    { value: 'Menunggu Diperbaiki', label: 'Menunggu Diperbaiki' },
    { value: 'Diperbaiki', label: 'Diperbaiki' },
    { value: 'Rusak', label: 'Rusak' },
  ];

  // Load campus detail
  useEffect(() => {
    if (id) {
      dispatch(fetchCampusById(id));
    }
  }, [dispatch, id]);

  // Load buildings for this campus
  const loadBuildings = useCallback((page = buildingPage) => {
    dispatch(fetchBuildings({ campus_id: id, page, limit: itemsPerPage }));
  }, [dispatch, id, buildingPage, itemsPerPage]);

  useEffect(() => {
    loadBuildings();
  }, [loadBuildings]);

  // Load items for this campus
  const loadItems = useCallback((page = itemPage) => {
    dispatch(fetchItems({ campus_id: id, page, limit: itemsPerPage }));
  }, [dispatch, id, itemPage, itemsPerPage]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Load category items for dropdown
  const loadCategoryItems = useCallback(() => {
    dispatch(fetchCategoryItems({ limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    loadCategoryItems();
  }, [loadCategoryItems]);

  // Load users for this campus
  useEffect(() => {
    dispatch(fetchUsers({ campus_id: id, limit: 100 }));
  }, [dispatch, id]);

  // Load events for this campus
  const loadEvents = useCallback((page = eventPage) => {
    dispatch(fetchEvents({ campus_id: id, page, limit: itemsPerPage }));
  }, [dispatch, id, eventPage, itemsPerPage]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Load activities for this campus
  const loadActivities = useCallback(() => {
    const params = { campus_id: id, limit: 100 };
    if (activityDateFilter.start_date) params.start_date = activityDateFilter.start_date;
    if (activityDateFilter.end_date) params.end_date = activityDateFilter.end_date;
    dispatch(fetchActivities(params));
  }, [dispatch, id, activityDateFilter]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  // Load billings for this campus
  useEffect(() => {
    dispatch(fetchBillings({ campus_id: id, limit: 100 }));
  }, [dispatch, id]);

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

  // Handle data success
  useEffect(() => {
    if (dataSuccess) {
      toast.success(dataSuccess);
      dispatch(clearDataSuccess());
      loadItems();
    }
  }, [dataSuccess, dispatch, loadItems]);

  // Handle success
  useEffect(() => {
    if (masterSuccess) {
      toast.success(masterSuccess);
      dispatch(clearMasterSuccess());
      loadBuildings();
    }
  }, [masterSuccess, dispatch, loadBuildings]);

  // Billing data by type (PLN & PDAM only)
  const billingTypes = [
    { id: 'pln', name: 'PLN', icon: FiZap, color: 'bg-amber-500', total: '0 kWh', trend: '0%' },
    { id: 'pdam', name: 'PDAM', icon: FiDroplet, color: 'bg-blue-500', total: '0 m³', trend: '0%' },
  ];

  // Filter billings by type
  const filteredBillings = useMemo(() => {
    if (!billings?.data) return [];
    return billings.data.filter((b) => b.billing_type === activeBillingType);
  }, [billings, activeBillingType]);

  // Items data
  const itemsData = items?.data || [];

  // Category options for dropdown
  const categoryOptions = (categoryItems?.data || []).map(c => ({
    value: c.category_item_id,
    label: c.category_item_name
  }));

  // Item stats
  const goodConditionItems = itemsData.filter(i => i.item_condition === 'Baik').length;
  const needAttentionItems = itemsData.filter(i => i.item_condition !== 'Baik').length;

  // Column definitions
  const buildingColumns = [
    { key: 'building_id', label: 'ID', width: '80px' },
    { key: 'building_name', label: 'Nama Gedung' },
    {
      key: 'floor_count',
      label: 'Lantai',
      width: '80px',
      render: (value) => value || 0,
    },
  ];

  const accountColumns = [
    {
      key: 'full_name',
      label: 'Nama',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            {row.photo ? (
              <img src={row.photo} alt={value} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <span className="text-primary font-semibold text-sm">{value?.charAt(0) || '?'}</span>
            )}
          </div>
          <span>{value || '-'}</span>
        </div>
      ),
    },
    { key: 'email', label: 'Email', render: (value) => value || '-' },
    {
      key: 'role',
      label: 'Role',
      width: '100px',
      render: (value, row) => row.role?.role_name || '-',
    },
    {
      key: 'shift',
      label: 'Shift',
      width: '80px',
      render: (value, row) => row.shift?.shift_name || '-',
    },
    {
      key: 'is_active',
      label: 'Status',
      width: '100px',
      render: (v) => <StatusBadge status={v === 1 ? 'active' : 'inactive'} />,
    },
  ];

  const activityColumns = [
    {
      key: 'user',
      label: 'User',
      render: (value, row) => row.user?.full_name || '-',
    },
    { key: 'activity_name', label: 'Aktivitas', render: (value) => value || '-' },
    {
      key: 'room',
      label: 'Lokasi',
      render: (value, row) => row.room?.room_name || '-',
    },
    {
      key: 'start_time',
      label: 'Waktu',
      width: '80px',
      render: (value) => value || '-',
    },
    {
      key: 'date',
      label: 'Tanggal',
      width: '120px',
      render: (value) =>
        value ? new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-',
    },
  ];

  const eventColumns = [
    { key: 'event_name', label: 'Nama Event' },
    {
      key: 'event_category',
      label: 'Kategori',
      width: '120px',
      render: (value, row) => row.event_category?.category_name || '-',
    },
    {
      key: 'event_date',
      label: 'Tanggal',
      width: '120px',
      render: (value) =>
        value ? new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-',
    },
    { key: 'location', label: 'Lokasi', render: (value) => value || '-' },
    {
      key: 'status',
      label: 'Status',
      width: '120px',
      render: (v) => <StatusBadge status={v} />,
    },
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
  ];

  // Export handlers
  const handleExportSubmit = () => {
    console.log('Export with date range:', exportData);
    setIsExportOpen(false);
    setExportData({ start_date: '', end_date: '' });
    toast.success('Export berhasil diunduh');
  };

  // Building handlers
  const resetBuildingForm = () => {
    setBuildingForm({
      building_name: '',
      latitude: '',
      longitude: '',
      radius: '',
    });
    setBuildingPhotoFile(null);
    setBuildingPhotoPreview('');
  };

  const handleAddBuilding = () => {
    setSelectedBuilding(null);
    resetBuildingForm();
    setIsBuildingModalOpen(true);
  };

  const handleEditBuilding = (item) => {
    setSelectedBuilding(item);
    setBuildingForm({
      building_name: item.building_name || '',
      latitude: item.latitude || '',
      longitude: item.longitude || '',
      radius: item.radius || '',
    });
    setBuildingPhotoPreview(item.photo_1 || '');
    setBuildingPhotoFile(null);
    setIsBuildingModalOpen(true);
  };

  const handleDeleteBuilding = (item) => {
    setSelectedBuilding(item);
    setIsBuildingDeleteOpen(true);
  };

  // Handle building file selection and convert to WebP
  const handleBuildingFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file, 5);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setBuildingImageLoading(true);
    try {
      const webpBlob = await convertToWebP(file, 0.8);
      const webpFile = new File([webpBlob], `photo_${Date.now()}.webp`, { type: 'image/webp' });
      const previewUrl = URL.createObjectURL(webpBlob);

      setBuildingPhotoFile(webpFile);
      setBuildingPhotoPreview(previewUrl);
      toast.success('Gambar berhasil dikonversi ke WebP');
    } catch (err) {
      toast.error(err.message || 'Gagal memproses gambar');
    } finally {
      setBuildingImageLoading(false);
    }
  };

  const removeBuildingImage = () => {
    setBuildingPhotoFile(null);
    setBuildingPhotoPreview('');
    if (buildingPhotoInputRef.current) buildingPhotoInputRef.current.value = '';
  };

  const validateBuildingForm = () => {
    if (!buildingForm.building_name.trim()) {
      toast.error('Nama gedung wajib diisi');
      return false;
    }
    if (!selectedBuilding && !buildingPhotoFile) {
      toast.error('Foto gedung wajib diupload');
      return false;
    }
    if (selectedBuilding && !buildingPhotoFile && !buildingPhotoPreview) {
      toast.error('Foto gedung wajib diupload');
      return false;
    }
    return true;
  };

  const handleBuildingSubmit = async () => {
    if (!validateBuildingForm()) return;

    setBuildingFormLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('building_name', buildingForm.building_name);
      submitData.append('campus_id', id);

      if (buildingForm.latitude) submitData.append('latitude', buildingForm.latitude);
      if (buildingForm.longitude) submitData.append('longitude', buildingForm.longitude);
      if (buildingForm.radius) submitData.append('radius', buildingForm.radius);

      if (buildingPhotoFile) {
        submitData.append('photo_1', buildingPhotoFile);
      }

      if (selectedBuilding) {
        await dispatch(updateBuilding({ id: selectedBuilding.building_id, data: submitData })).unwrap();
      } else {
        await dispatch(createBuilding(submitData)).unwrap();
      }
      setIsBuildingModalOpen(false);
      resetBuildingForm();
    } catch (err) {
      // Error handled by slice
    } finally {
      setBuildingFormLoading(false);
    }
  };

  const handleConfirmDeleteBuilding = async () => {
    try {
      await dispatch(deleteBuilding(selectedBuilding.building_id)).unwrap();
      setIsBuildingDeleteOpen(false);
    } catch (err) {
      // Error handled by slice
    }
  };

  // Event handlers
  const handleAddEvent = () => {
    setSelectedEvent(null);
    setEventForm({ event_name: '', event_category_id: '', event_date: '', location: '', status: 'upcoming' });
    setIsEventModalOpen(true);
  };

  const handleEditEvent = (item) => {
    setSelectedEvent(item);
    setEventForm({
      event_name: item.event_name || '',
      event_category_id: item.event_category_id?.toString() || '',
      event_date: item.event_date ? item.event_date.split('T')[0] : '',
      location: item.location || '',
      status: item.status || 'upcoming',
    });
    setIsEventModalOpen(true);
  };

  const handleDeleteEvent = (item) => {
    setSelectedEvent(item);
    setIsEventDeleteOpen(true);
  };

  const handleEventSubmit = async () => {
    setEventFormLoading(true);
    try {
      const submitData = {
        ...eventForm,
        campus_id: parseInt(id),
        event_category_id: parseInt(eventForm.event_category_id),
      };

      if (selectedEvent) {
        await dispatch(updateEvent({ id: selectedEvent.event_id, data: submitData })).unwrap();
      } else {
        await dispatch(createEvent(submitData)).unwrap();
      }
      setIsEventModalOpen(false);
      dispatch(fetchEvents({ campus_id: id, limit: 100 }));
    } catch (err) {
      // Error handled by slice
    } finally {
      setEventFormLoading(false);
    }
  };

  const handleConfirmDeleteEvent = async () => {
    try {
      await dispatch(deleteEvent(selectedEvent.event_id)).unwrap();
      setIsEventDeleteOpen(false);
      dispatch(fetchEvents({ campus_id: id, limit: 100 }));
    } catch (err) {
      // Error handled by slice
    }
  };

  // Billing detail handler
  const handleViewBillingDetail = (type) => {
    setSelectedBillingType(type);
    setActiveBillingType(type.id);
    setIsBillingDetailOpen(true);
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
      category_item_id: item.category_item_id?.toString() || '',
      item_condition: item.item_condition || 'Baik',
      total: item.total?.toString() || '',
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
        ...itemForm,
        campus_id: parseInt(id),
        total: itemForm.total ? parseInt(itemForm.total) : null,
        category_item_id: itemForm.category_item_id ? parseInt(itemForm.category_item_id) : null,
      };
      if (selectedItem) {
        await dispatch(updateItem({ id: selectedItem.item_id, data: itemData })).unwrap();
      } else {
        await dispatch(createItem(itemData)).unwrap();
      }
      setIsItemModalOpen(false);
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
    } catch (err) {
      // Error handled by effect
    }
  };

  if (campusLoading && !selectedCampus) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <FiLoader className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  const unitData = selectedCampus || {
    campus_name: 'Loading...',
    campus_id: '-',
    alamat: '-',
    photo_1: '',
    cover: '',
    kata_pengantar: '',
    is_active: 1,
  };

  return (
    <MainLayout>
      <PageHeader
        title={unitData.campus_name}
        subtitle="Detail informasi unit"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Unit', path: '/master/units' },
          { label: unitData.campus_name },
        ]}
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/master/units')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FiArrowLeft className="w-4 h-4" />
              Kembali
            </button>
            <button
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary/90"
            >
              <FiDownload className="w-4 h-4" />
              Export Laporan
            </button>
          </div>
        }
      />

      {/* Unit Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        {/* Images Section */}
        {(unitData.photo_1 || unitData.cover) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {unitData.cover && (
              <div>
                <span className="text-sm text-gray-500 mb-2 block">Cover Unit</span>
                <img
                  src={unitData.cover}
                  alt="Cover Unit"
                  className="w-full h-48 object-cover rounded-xl border border-gray-100"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
            {unitData.photo_1 && (
              <div>
                <span className="text-sm text-gray-500 mb-2 block">Foto Unit</span>
                <img
                  src={unitData.photo_1}
                  alt="Foto Unit"
                  className="w-full h-48 object-cover rounded-xl border border-gray-100"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-sm text-gray-500">ID Unit</span>
            <p className="font-semibold text-lg font-mono">{unitData.campus_id || '-'}</p>
          </div>
          <div>
            {/* <span className="text-sm text-gray-500">Status</span>
            <div className="mt-1">
              <StatusBadge status={unitData.is_active === 1 ? 'active' : 'inactive'} />
            </div> */}
          </div>
          <div className="flex items-start gap-2">
            <FiMapPin className="w-4 h-4 text-gray-400 mt-1" />
            <div>
              <span className="text-sm text-gray-500">Alamat</span>
              <p className="font-medium">{unitData.alamat || '-'}</p>
            </div>
          </div>
        </div>

        {/* Kata Pengantar */}
        {unitData.kata_pengantar && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500 mb-2 block">Kata Pengantar</span>
            <p className="text-gray-700 whitespace-pre-line">{unitData.kata_pengantar}</p>
          </div>
        )}
      </div>

      {/* Tabs Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <Tabs activeTab={activeTab} onTabChange={setActiveTab}>
          <Tabs.Tab id="gedung" label="Gedung" icon={FiGrid}>
            <div className="mb-4 flex justify-end">
              <button
                onClick={handleAddBuilding}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                <FiPlus className="w-4 h-4" />
                Tambah Gedung
              </button>
            </div>
            {masterLoading ? (
              <div className="flex items-center justify-center py-10">
                <FiLoader className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <DataTable
                columns={buildingColumns}
                data={buildings.data}
                onView={(item) => navigate(`/master/buildings/${item.building_id}`)}
                onEdit={handleEditBuilding}
                onDelete={handleDeleteBuilding}
                showActions={true}
                actionColumn={{ view: true, edit: true, delete: true }}
                currentPage={buildings.pagination?.page || 1}
                totalPages={buildings.pagination?.totalPages || 1}
                totalItems={buildings.pagination?.total || 0}
                itemsPerPage={itemsPerPage}
                onPageChange={(newPage) => { setBuildingPage(newPage); loadBuildings(newPage); }}
              />
            )}
          </Tabs.Tab>

          <Tabs.Tab id="billing" label="Billing" icon={FiFileText}>
            {/* Billing Type Cards - PLN & PDAM only */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {billingTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.id}
                    onClick={() => handleViewBillingDetail(type)}
                    className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-5 cursor-pointer hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`${type.color} p-3 rounded-xl`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <FiTrendingUp className="w-4 h-4" />
                        {type.trend}
                      </div>
                    </div>
                    <h3 className="text-gray-500 text-sm mb-1">{type.name}</h3>
                    <p className="text-2xl font-bold text-gray-800">{type.total}</p>
                    <p className="text-xs text-primary mt-2 group-hover:underline">Lihat Detail →</p>
                  </div>
                );
              })}
            </div>

            {/* Recent Billing History */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Riwayat Billing Terbaru</h4>
              {dataLoading ? (
                <div className="flex items-center justify-center py-10">
                  <FiLoader className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-3">
                  {billings?.data?.slice(0, 4).map((item) => (
                    <div key={item.billing_id} className="flex items-center justify-between bg-white rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`${
                            item.billing_type === 'pln'
                              ? 'bg-amber-500'
                              : 'bg-blue-500'
                          } p-2 rounded-lg`}
                        >
                          {item.billing_type === 'pln' && <FiZap className="w-4 h-4 text-white" />}
                          {item.billing_type === 'pdam' && <FiDroplet className="w-4 h-4 text-white" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{item.account?.account_name || '-'}</p>
                          <p className="text-xs text-gray-500">
                            {item.billing_date
                              ? new Date(item.billing_date).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : '-'}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-800">
                        Rp {Number(item.amount || 0).toLocaleString('id-ID')}
                      </p>
                    </div>
                  ))}
                  {(!billings?.data || billings.data.length === 0) && (
                    <p className="text-center text-gray-500 py-4">Belum ada data billing</p>
                  )}
                </div>
              )}
            </div>
          </Tabs.Tab>

          <Tabs.Tab id="account" label="Account" icon={FiUsers}>
            <DataTable
              columns={accountColumns}
              data={users}
              onView={(item) => navigate(`/employee/${item.user_id}`)}
              showActions={true}
              actionColumn={{ view: true, edit: false, delete: false }}
            />
          </Tabs.Tab>

          <Tabs.Tab id="activity" label="Activity" icon={FiActivity}>
            {/* Date Filter */}
            <div className="mb-4 flex flex-wrap items-end gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 text-gray-600">
                <FiFilter className="w-4 h-4" />
                <span className="text-sm font-medium">Filter Tanggal:</span>
              </div>
              <div className="flex gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Dari</label>
                  <input
                    type="date"
                    value={activityDateFilter.start_date}
                    onChange={(e) => setActivityDateFilter({ ...activityDateFilter, start_date: e.target.value })}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Sampai</label>
                  <input
                    type="date"
                    value={activityDateFilter.end_date}
                    onChange={(e) => setActivityDateFilter({ ...activityDateFilter, end_date: e.target.value })}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                {(activityDateFilter.start_date || activityDateFilter.end_date) && (
                  <button
                    onClick={() => setActivityDateFilter({ start_date: '', end_date: '' })}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 self-end"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
            {dataLoading ? (
              <div className="flex items-center justify-center py-10">
                <FiLoader className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <DataTable columns={activityColumns} data={activities?.data || []} showActions={false} />
            )}
          </Tabs.Tab>

          <Tabs.Tab id="event" label="Event" icon={FiCalendar}>
            <div className="mb-4 flex justify-end">
              <button
                onClick={handleAddEvent}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                <FiPlus className="w-4 h-4" />
                Tambah Event
              </button>
            </div>
            {dataLoading ? (
              <div className="flex items-center justify-center py-10">
                <FiLoader className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <DataTable
                columns={eventColumns}
                data={events?.data || []}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
                showActions={true}
                actionColumn={{ view: false, edit: true, delete: true }}
                currentPage={events.pagination?.page || 1}
                totalPages={events.pagination?.totalPages || 1}
                totalItems={events.pagination?.total || 0}
                itemsPerPage={itemsPerPage}
                onPageChange={(newPage) => { setEventPage(newPage); loadEvents(newPage); }}
              />
            )}
          </Tabs.Tab>

          <Tabs.Tab id="item" label="Item" icon={FiBox}>
            {/* Item Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                    <p className="text-2xl font-bold text-gray-800">{goodConditionItems}</p>
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
                    <p className="text-2xl font-bold text-gray-800">{needAttentionItems}</p>
                    <p className="text-sm text-gray-500">Perlu Perhatian</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4 flex justify-end">
              <button
                onClick={handleAddItem}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                <FiPlus className="w-4 h-4" />
                Tambah Item
              </button>
            </div>
            {dataLoading ? (
              <div className="flex items-center justify-center py-10">
                <FiLoader className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <DataTable
                columns={itemColumns}
                data={itemsData}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                showActions={true}
                actionColumn={{ view: false, edit: true, delete: true }}
                currentPage={items.pagination?.page || 1}
                totalPages={items.pagination?.totalPages || 1}
                totalItems={items.pagination?.total || 0}
                itemsPerPage={itemsPerPage}
                onPageChange={(newPage) => { setItemPage(newPage); loadItems(newPage); }}
              />
            )}
          </Tabs.Tab>
        </Tabs>
      </div>

      {/* Export Modal */}
      <Modal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title="Export Laporan"
        onSubmit={handleExportSubmit}
        submitText="Export"
        size="sm"
      >
        <p className="text-sm text-gray-500 mb-4">
          Pilih rentang tanggal untuk export laporan unit {unitData.campus_name}
        </p>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Tanggal Mulai"
            name="start_date"
            type="date"
            value={exportData.start_date}
            onChange={(e) => setExportData({ ...exportData, start_date: e.target.value })}
            required
          />
          <FormInput
            label="Tanggal Selesai"
            name="end_date"
            type="date"
            value={exportData.end_date}
            onChange={(e) => setExportData({ ...exportData, end_date: e.target.value })}
            required
          />
        </div>
      </Modal>

      {/* Billing Detail Modal */}
      <Modal
        isOpen={isBillingDetailOpen}
        onClose={() => setIsBillingDetailOpen(false)}
        title={`Detail ${selectedBillingType?.name || ''} Billing`}
        size="lg"
      >
        {selectedBillingType && (
          <div className="space-y-4">
            {/* Header Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className={`${selectedBillingType.color} p-4 rounded-xl`}>
                <selectedBillingType.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{selectedBillingType.total}</h3>
                <p className="text-gray-500">Total penggunaan bulan ini</p>
              </div>
            </div>

            {/* History List */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Riwayat Penggunaan</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredBillings.map((item) => (
                  <div
                    key={item.billing_id}
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{item.account?.account_name || '-'}</p>
                      <p className="text-sm text-gray-500">
                        {item.billing_date
                          ? new Date(item.billing_date).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '-'}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-800">
                      Rp {Number(item.amount || 0).toLocaleString('id-ID')}
                    </p>
                  </div>
                ))}
                {filteredBillings.length === 0 && (
                  <p className="text-center text-gray-500 py-4">Belum ada data billing</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Building Modal */}
      <Modal
        isOpen={isBuildingModalOpen}
        onClose={() => setIsBuildingModalOpen(false)}
        title={selectedBuilding ? 'Edit Gedung' : 'Tambah Gedung'}
        onSubmit={handleBuildingSubmit}
        loading={buildingFormLoading}
      >
        <FormInput
          label="Nama Gedung"
          name="building_name"
          value={buildingForm.building_name}
          onChange={(e) => setBuildingForm({ ...buildingForm, building_name: e.target.value })}
          placeholder="Contoh: Gedung Rektorat"
          required
        />

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Foto Gedung <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            {buildingPhotoPreview ? (
              <div className="relative group">
                <img
                  src={buildingPhotoPreview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg border border-gray-200"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => buildingPhotoInputRef.current?.click()}
                    className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                  >
                    <FiUpload size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={removeBuildingImage}
                    className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => buildingPhotoInputRef.current?.click()}
                className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
              >
                {buildingImageLoading ? (
                  <FiLoader className="w-8 h-8 animate-spin text-primary" />
                ) : (
                  <>
                    <FiImage className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Klik untuk upload</p>
                    <p className="text-xs text-gray-400">JPG, PNG, GIF (max 5MB)</p>
                  </>
                )}
              </div>
            )}
            <input
              ref={buildingPhotoInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleBuildingFileChange}
              className="hidden"
            />
          </div>
          <p className="text-xs text-gray-500">Gambar akan otomatis dikonversi ke format WebP</p>
        </div>

        {/* Location Fields */}
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Latitude"
            name="latitude"
            type="number"
            step="any"
            value={buildingForm.latitude}
            onChange={(e) => setBuildingForm({ ...buildingForm, latitude: e.target.value })}
            placeholder="Contoh: -6.2088"
          />
          <FormInput
            label="Longitude"
            name="longitude"
            type="number"
            step="any"
            value={buildingForm.longitude}
            onChange={(e) => setBuildingForm({ ...buildingForm, longitude: e.target.value })}
            placeholder="Contoh: 106.8456"
          />
        </div>
        <FormInput
          label="Radius (meter)"
          name="radius"
          type="number"
          value={buildingForm.radius}
          onChange={(e) => setBuildingForm({ ...buildingForm, radius: e.target.value })}
          placeholder="Contoh: 100"
        />
      </Modal>

      {/* Building Delete Confirmation */}
      <ConfirmDialog
        isOpen={isBuildingDeleteOpen}
        onClose={() => setIsBuildingDeleteOpen(false)}
        onConfirm={handleConfirmDeleteBuilding}
        title="Hapus Gedung"
        message={`Apakah Anda yakin ingin menghapus "${selectedBuilding?.building_name}"?`}
        confirmText="Ya, Hapus"
        type="danger"
        loading={masterLoading}
      />

      {/* Event Modal */}
      <Modal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        title={selectedEvent ? 'Edit Event' : 'Tambah Event'}
        onSubmit={handleEventSubmit}
        loading={eventFormLoading}
      >
        <FormInput
          label="Nama Event"
          name="event_name"
          value={eventForm.event_name}
          onChange={(e) => setEventForm({ ...eventForm, event_name: e.target.value })}
          placeholder="Contoh: Seminar Nasional"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Tanggal"
            name="event_date"
            type="date"
            value={eventForm.event_date}
            onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
            required
          />
          <FormInput
            label="Status"
            name="status"
            type="select"
            value={eventForm.status}
            onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })}
            options={[
              { value: 'upcoming', label: 'Akan Datang' },
              { value: 'ongoing', label: 'Berlangsung' },
              { value: 'completed', label: 'Selesai' },
              { value: 'cancelled', label: 'Dibatalkan' },
            ]}
          />
        </div>
        <FormInput
          label="Lokasi"
          name="location"
          value={eventForm.location}
          onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
          placeholder="Contoh: Aula Utama"
          required
        />
      </Modal>

      {/* Event Delete Confirmation */}
      <ConfirmDialog
        isOpen={isEventDeleteOpen}
        onClose={() => setIsEventDeleteOpen(false)}
        onConfirm={handleConfirmDeleteEvent}
        title="Hapus Event"
        message={`Apakah Anda yakin ingin menghapus "${selectedEvent?.event_name}"?`}
        confirmText="Ya, Hapus"
        type="danger"
        loading={dataLoading}
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
            placeholder="Contoh: Meja Kerja"
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
            options={itemConditions}
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
          value={itemForm.item_description}
          onChange={(e) => setItemForm({ ...itemForm, item_description: e.target.value })}
          placeholder="Deskripsi item (opsional)"
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
        loading={dataLoading}
      />
    </MainLayout>
  );
};

export default UnitDetail;

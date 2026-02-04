import { useState, useEffect, useCallback, useRef } from 'react';
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
import logoFallback from '../../../logo.png';
import { fetchCampusById } from '../../store/campusesSlice';
import {
  fetchBuildings,
  createBuilding,
  updateBuilding,
  deleteBuilding,
  fetchCategoryItems,
  fetchEventCategories,
  clearMasterError,
  clearMasterSuccess,
} from '../../store/masterSlice';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  clearUsersError,
  clearUsersSuccess,
} from '../../store/usersSlice';
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  fetchActivities,
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
  clearDataError,
  clearDataSuccess,
} from '../../store/dataSlice';
import { reportsAPI } from '../../services/api';

const UnitDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedCampus, loading: campusLoading } = useSelector((state) => state.campuses);
  const { buildings, categoryItems, eventCategories, loading: masterLoading, error: masterError, success: masterSuccess } = useSelector(
    (state) => state.master
  );
  const { data: users, pagination: usersPagination, loading: usersLoading, error: usersError, success: usersSuccess } = useSelector((state) => state.users);
  const { events, activities, items, loading: dataLoading, error: dataError, success: dataSuccess } = useSelector(
    (state) => state.data
  );

  const [activeTab, setActiveTab] = useState('gedung');

  // Export modal - menggunakan format bulan (month1, year1, month2, year2)
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [photosLoading, setPhotosLoading] = useState(false);
  const getDefaultExportPeriod = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    return {
      month1: String(month).padStart(2, '0'),
      year1: String(year),
      month2: String(month).padStart(2, '0'),
      year2: String(year),
    };
  };
  const [exportData, setExportData] = useState(getDefaultExportPeriod);

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
  const [userPage, setUserPage] = useState(1);
  const [activityPage, setActivityPage] = useState(1);
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
    event_title: '',
    event_description: '',
    date: '',
    time_1: '',
    time_2: '',
    tempat: '',
    event_kategori: '',
    petugas: '',
  });
  const [eventFormLoading, setEventFormLoading] = useState(false);

  // Event photo states
  const [eventPhotoFile, setEventPhotoFile] = useState(null);
  const [eventPhotoPreview, setEventPhotoPreview] = useState('');
  const [eventImageLoading, setEventImageLoading] = useState(false);
  const eventPhotoInputRef = useRef(null);

  // PLN/PDAM Item CRUD states (for billing items)
  const [isPlnPdamModalOpen, setIsPlnPdamModalOpen] = useState(false);
  const [isPlnPdamDeleteOpen, setIsPlnPdamDeleteOpen] = useState(false);
  const [selectedPlnPdam, setSelectedPlnPdam] = useState(null);
  const [plnPdamForm, setPlnPdamForm] = useState({
    item_name: '',
    item_code: '',
    item_description: 'Item PLN/PDAM',
    type: 'PLN', // PLN or PDAM
    no_subcription: '',
    total: 1,
  });
  const [plnPdamFormLoading, setPlnPdamFormLoading] = useState(false);

  // User CRUD states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isUserDeleteOpen, setIsUserDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userForm, setUserForm] = useState({
    full_name: '',
    email: '',
    password: '',
    phone_number: '',
    role_id: 2,
    position: '',
    is_active: 1,
  });
  const [userFormLoading, setUserFormLoading] = useState(false);

  // Role options for user form
  const roleOptions = [
    { value: 1, label: 'Super Admin' },
    { value: 2, label: 'Admin' },
    { value: 3, label: 'Petugas' },
    { value: 4, label: 'User' },
  ];

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

  // Load event categories for dropdown
  useEffect(() => {
    dispatch(fetchEventCategories({ limit: 100 }));
  }, [dispatch]);

  // Load events for this campus
  const loadEvents = useCallback((page = eventPage) => {
    dispatch(fetchEvents({ campus_id: id, page, limit: itemsPerPage }));
  }, [dispatch, id, eventPage, itemsPerPage]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Load activities for this campus (server-side pagination)
  const loadActivities = useCallback((page = activityPage) => {
    const params = { campus_id: id, page, limit: itemsPerPage };
    if (activityDateFilter.start_date) params.start_date = activityDateFilter.start_date;
    if (activityDateFilter.end_date) params.end_date = activityDateFilter.end_date;
    dispatch(fetchActivities(params));
  }, [dispatch, id, activityPage, itemsPerPage, activityDateFilter]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  // Load users for this campus (server-side pagination)
  const loadUsers = useCallback((page = userPage) => {
    dispatch(fetchUsers({ campus_id: id, page, limit: itemsPerPage }));
  }, [dispatch, id, userPage, itemsPerPage]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

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

  useEffect(() => {
    if (usersError) {
      toast.error(usersError);
      dispatch(clearUsersError());
    }
  }, [usersError, dispatch]);

  // Handle users success
  useEffect(() => {
    if (usersSuccess) {
      toast.success(usersSuccess);
      dispatch(clearUsersSuccess());
      loadUsers();
    }
  }, [usersSuccess, dispatch, loadUsers]);

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


  // Category options for dropdown
  const categoryOptions = (categoryItems?.data || []).map(c => ({
    value: c.category_item_id,
    label: c.category_item_name
  }));

  // Event category options for dropdown
  const eventCategoryOptions = (eventCategories?.data || []).map(c => ({
    value: c.event_category_id,
    label: c.category_name
  }));

  // PLN/PDAM type options (static)
  const plnPdamTypeOptions = [
    { value: 'PLN', label: 'PLN (Listrik)' },
    { value: 'PDAM', label: 'PDAM (Air)' },
  ];

  // Get PLN/PDAM items for this campus
  // Get PLN/PDAM items for billing tab
  const plnPdamItems = (items?.data || []).filter(item => parseInt(item.category_pln_pdam) === 1);

  // Regular items (excluding PLN/PDAM items) for Item tab
  const regularItems = (items?.data || []).filter(item => parseInt(item.category_pln_pdam) !== 1);

  // Item stats (excluding PLN/PDAM items)
  const goodConditionItems = regularItems.filter(i => i.item_condition === 'Baik').length;
  const needAttentionItems = regularItems.filter(i => i.item_condition !== 'Baik').length;

  // Column definitions
  const buildingColumns = [
    {
      key: 'photo_1',
      label: 'Foto',
      width: '80px',
      render: (value) => (
        <img
          src={value || logoFallback}
          alt="Gedung"
          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
          onError={(e) => { e.target.src = logoFallback; }}
        />
      ),
    },
    { key: 'building_id', label: 'ID', width: '80px' },
    { key: 'building_name', label: 'Nama Gedung' },
    {
      key: 'floorCount',
      label: 'Lantai',
      width: '80px',
      render: (value) => value || 0,
    },
  ];

  const userColumns = [
    {
      key: 'photo_1',
      label: 'Foto',
      width: '60px',
      render: (value) => (
        <img
          src={value || logoFallback}
          alt="User"
          className="w-10 h-10 object-cover rounded-full border border-gray-200"
          onError={(e) => { e.target.src = logoFallback; }}
        />
      ),
    },
    { key: 'full_name', label: 'Nama Lengkap' },
    { key: 'email', label: 'Email' },
    { key: 'phone_number', label: 'No. Telepon', render: (v) => v || '-' },
    {
      key: 'role',
      label: 'Role',
      width: '120px',
      render: (v, row) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
          {row.role?.role_name || '-'}
        </span>
      ),
    },
    { key: 'position', label: 'Jabatan', render: (v) => v || '-' },
    {
      key: 'is_active',
      label: 'Status',
      width: '100px',
      render: (v) => <StatusBadge status={v === 1 ? 'active' : 'inactive'} />,
    },
  ];

  // PLN/PDAM items columns
  const plnPdamColumns = [
    { key: 'item_code', label: 'Kode', width: '120px' },
    { key: 'item_name', label: 'Nama Item' },
    { key: 'no_subcription', label: 'No. Langganan', render: (v) => v || '-' },
    {
      key: 'category_item',
      label: 'Tipe',
      width: '100px',
      render: (v, row) => {
        const categoryName = row.category_item?.category_item_name || '';
        const type = categoryName.toUpperCase().includes('PDAM') ? 'PDAM' : 'PLN';
        return (
          <span className={`inline-flex items-center whitespace-nowrap px-2 py-1 rounded-full text-xs font-medium ${
            type === 'PLN' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {type}
          </span>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Ditambahkan',
      width: '120px',
      render: (value) =>
        value ? new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-',
    },
  ];

  const activityColumns = [
    {
      key: 'user',
      label: 'User',
      render: (value, row) => row.user?.full_name || '-',
    },
    { key: 'title', label: 'Aktivitas' },
    { key: 'location', label: 'Lokasi', render: (value) => value || '-' },
    {
      key: 'time',
      label: 'Waktu',
      width: '120px',
      render: (v, row) => `${row.time_start || ''} - ${row.time_end || ''}`,
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
    {
      key: 'photo_1',
      label: 'Foto',
      width: '80px',
      render: (value) => (
        <img
          src={value || logoFallback}
          alt="Event"
          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
          onError={(e) => { e.target.src = logoFallback; }}
        />
      ),
    },
    { key: 'event_title', label: 'Judul Event' },
    {
      key: 'category',
      label: 'Kategori',
      width: '120px',
      render: (value, row) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
          {row.category?.category_name || '-'}
        </span>
      ),
    },
    {
      key: 'date',
      label: 'Tanggal',
      width: '120px',
      render: (value) =>
        value ? new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-',
    },
    {
      key: 'time',
      label: 'Waktu',
      width: '120px',
      render: (v, row) => `${row.time_1 || ''} - ${row.time_2 || ''}`,
    },
    { key: 'tempat', label: 'Tempat', render: (value) => value || '-' },
    { key: 'petugas', label: 'Petugas', width: '120px', render: (value) => value || '-' },
  ];

  const itemColumns = [
    {
      key: 'photo_1',
      label: 'Foto',
      width: '80px',
      render: (value) => (
        <img
          src={value || logoFallback}
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
      render: (v, row) => (
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

  // Export handlers - Download both PDF and ZIP
  const handleExportSubmit = async () => {
    // Validasi input
    if (!exportData.month1 || !exportData.year1 || !exportData.month2 || !exportData.year2) {
      toast.error('Periode awal dan akhir harus diisi');
      return;
    }

    setExportLoading(true);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const campusName = (unitData.campus_name || 'Unit').replace(/\s+/g, '_');
    const params = {
      month1: exportData.month1,
      year1: exportData.year1,
      month2: exportData.month2,
      year2: exportData.year2,
    };

    try {
      // Download PDF first
      const pdfResponse = await reportsAPI.downloadCampusPdf(id, params);
      const pdfBlob = new Blob([pdfResponse.data], { type: 'application/pdf' });
      const pdfUrl = window.URL.createObjectURL(pdfBlob);
      const pdfLink = document.createElement('a');
      pdfLink.href = pdfUrl;
      const pdfFilename = `Laporan_${campusName}_${monthNames[parseInt(exportData.month1) - 1]}${exportData.year1}-${monthNames[parseInt(exportData.month2) - 1]}${exportData.year2}.pdf`;
      pdfLink.setAttribute('download', pdfFilename);
      document.body.appendChild(pdfLink);
      pdfLink.click();
      document.body.removeChild(pdfLink);
      window.URL.revokeObjectURL(pdfUrl);

      // Then download ZIP (photos)
      try {
        const zipResponse = await reportsAPI.downloadCampusPhotos(id, params);
        const zipBlob = new Blob([zipResponse.data], { type: 'application/zip' });
        const zipUrl = window.URL.createObjectURL(zipBlob);
        const zipLink = document.createElement('a');
        zipLink.href = zipUrl;
        const zipFilename = `Foto_${campusName}_${monthNames[parseInt(exportData.month1) - 1]}${exportData.year1}-${monthNames[parseInt(exportData.month2) - 1]}${exportData.year2}.zip`;
        zipLink.setAttribute('download', zipFilename);
        document.body.appendChild(zipLink);
        zipLink.click();
        document.body.removeChild(zipLink);
        window.URL.revokeObjectURL(zipUrl);

        toast.success('Laporan PDF dan Foto berhasil diunduh');
      } catch (zipError) {
        // ZIP might fail if no photos, but PDF was successful
        console.log('No photos available or ZIP error:', zipError);
        // Parse error message from blob response
        let errorMsg = 'tidak ada foto untuk periode ini';
        if (zipError.response?.data instanceof Blob) {
          try {
            const text = await zipError.response.data.text();
            const json = JSON.parse(text);
            errorMsg = json.message || errorMsg;
          } catch {
            // ignore parse error
          }
        }
        toast.success(`Laporan PDF berhasil diunduh (${errorMsg})`);
      }

      setIsExportOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error(error.response?.data?.message || 'Gagal mengunduh laporan');
    } finally {
      setExportLoading(false);
    }
  };

  // Export photos only as ZIP
  const handleExportPhotos = async () => {
    if (!exportData.month1 || !exportData.year1 || !exportData.month2 || !exportData.year2) {
      toast.error('Periode awal dan akhir harus diisi');
      return;
    }

    setPhotosLoading(true);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const campusName = (unitData.campus_name || 'Unit').replace(/\s+/g, '_');

    try {
      const response = await reportsAPI.downloadCampusPhotos(id, {
        month1: exportData.month1,
        year1: exportData.year1,
        month2: exportData.month2,
        year2: exportData.year2,
      });

      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const filename = `Foto_${campusName}_${monthNames[parseInt(exportData.month1) - 1]}${exportData.year1}-${monthNames[parseInt(exportData.month2) - 1]}${exportData.year2}.zip`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Foto berhasil diunduh');
    } catch (error) {
      console.error('Export photos error:', error);
      // Handle blob response error - parse JSON from blob
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const json = JSON.parse(text);
          toast.error(json.message || 'Gagal mengunduh foto');
        } catch {
          toast.error('Gagal mengunduh foto');
        }
      } else {
        toast.error(error.response?.data?.message || 'Gagal mengunduh foto');
      }
    } finally {
      setPhotosLoading(false);
    }
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
  const resetEventPhotoStates = () => {
    setEventPhotoFile(null);
    setEventPhotoPreview('');
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setEventForm({
      event_title: '',
      event_description: '',
      date: '',
      time_1: '',
      time_2: '',
      tempat: '',
      event_kategori: '',
      petugas: '',
    });
    resetEventPhotoStates();
    setIsEventModalOpen(true);
  };

  const handleEditEvent = (item) => {
    setSelectedEvent(item);
    setEventForm({
      event_title: item.event_title || '',
      event_description: item.event_description || '',
      date: item.date ? item.date.split('T')[0] : '',
      time_1: item.time_1 || '',
      time_2: item.time_2 || '',
      tempat: item.tempat || '',
      event_kategori: item.event_kategori?.toString() || '',
      petugas: item.petugas || '',
    });
    setEventPhotoPreview(item.photo_1 || '');
    setEventPhotoFile(null);
    setIsEventModalOpen(true);
  };

  const handleDeleteEvent = (item) => {
    setSelectedEvent(item);
    setIsEventDeleteOpen(true);
  };

  // Handle event file selection and convert to WebP
  const handleEventFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file, 5);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setEventImageLoading(true);
    try {
      const webpBlob = await convertToWebP(file, 0.8);
      const webpFile = new File([webpBlob], `photo_${Date.now()}.webp`, { type: 'image/webp' });
      const previewUrl = URL.createObjectURL(webpBlob);

      setEventPhotoFile(webpFile);
      setEventPhotoPreview(previewUrl);
      toast.success('Gambar berhasil dikonversi ke WebP');
    } catch (err) {
      toast.error(err.message || 'Gagal memproses gambar');
    } finally {
      setEventImageLoading(false);
    }
  };

  const removeEventImage = () => {
    setEventPhotoFile(null);
    setEventPhotoPreview('');
    if (eventPhotoInputRef.current) eventPhotoInputRef.current.value = '';
  };

  const handleEventSubmit = async () => {
    if (!eventForm.event_title || !eventForm.event_description || !eventForm.date || !eventForm.time_1 || !eventForm.time_2 || !eventForm.event_kategori) {
      toast.error('Judul, Deskripsi, Tanggal, Waktu, dan Kategori wajib diisi');
      return;
    }

    setEventFormLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('event_title', eventForm.event_title);
      submitData.append('event_description', eventForm.event_description);
      submitData.append('date', eventForm.date);
      submitData.append('time_1', eventForm.time_1);
      submitData.append('time_2', eventForm.time_2);
      submitData.append('campus_id', id);
      submitData.append('event_kategori', parseInt(eventForm.event_kategori));
      if (eventForm.tempat) submitData.append('tempat', eventForm.tempat);
      if (eventForm.petugas) submitData.append('petugas', eventForm.petugas);

      if (eventPhotoFile) {
        submitData.append('photo_1', eventPhotoFile);
      }

      if (selectedEvent) {
        await dispatch(updateEvent({ id: selectedEvent.event_id, data: submitData })).unwrap();
      } else {
        await dispatch(createEvent(submitData)).unwrap();
      }
      setIsEventModalOpen(false);
      resetEventPhotoStates();
      loadEvents();
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
      loadEvents();
    } catch (err) {
      // Error handled by slice
    }
  };

  // Item handlers
  const resetItemPhotoStates = () => {
    setItemPhoto1File(null);
    setItemPhoto1Preview('');
    setItemPhoto2File(null);
    setItemPhoto2Preview('');
  };

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
      item_code: item.item_code || '',
      item_description: item.item_description || '',
      category_item_id: item.category_item_id?.toString() || '',
      item_condition: item.item_condition || 'Baik',
      total: item.total?.toString() || '',
      brand: item.brand || '',
      maintenance: item.maintenance || '',
      maintenance_date: item.maintenance_date ? item.maintenance_date.split('T')[0] : '',
      pembelian: item.pembelian || '',
    });
    setItemPhoto1Preview(item.photo_1 || '');
    setItemPhoto2Preview(item.photo_2 || '');
    setItemPhoto1File(null);
    setItemPhoto2File(null);
    setIsItemModalOpen(true);
  };

  const handleDeleteItem = (item) => {
    setSelectedItem(item);
    setIsItemDeleteOpen(true);
  };

  // Handle item photo upload
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
      if (selectedItem && itemForm.item_code) {
        submitData.append('item_code', itemForm.item_code);
      }
      submitData.append('item_description', itemForm.item_description || itemForm.item_name);
      submitData.append('category_item_id', itemForm.category_item_id);
      submitData.append('campus_id', id);
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

  // PLN/PDAM Item handlers
  const handleAddPlnPdam = () => {
    setSelectedPlnPdam(null);
    setPlnPdamForm({
      item_name: '',
      item_code: '',
      item_description: 'Item PLN/PDAM',
      type: 'PLN',
      no_subcription: '',
      total: 1,
    });
    setIsPlnPdamModalOpen(true);
  };

  const handleEditPlnPdam = (item) => {
    setSelectedPlnPdam(item);
    // Determine type from category_item.category_item_name
    const categoryName = item.category_item?.category_item_name || '';
    const itemType = categoryName.toUpperCase().includes('PDAM') ? 'PDAM' : 'PLN';
    setPlnPdamForm({
      item_name: item.item_name || '',
      item_code: item.item_code || '',
      item_description: item.item_description || '',
      type: itemType,
      no_subcription: item.no_subcription || '',
      total: item.total || 1,
    });
    setIsPlnPdamModalOpen(true);
  };

  const handleDeletePlnPdam = (item) => {
    setSelectedPlnPdam(item);
    setIsPlnPdamDeleteOpen(true);
  };

  const handlePlnPdamSubmit = async () => {
    if (!plnPdamForm.item_name || !plnPdamForm.type || !plnPdamForm.no_subcription) {
      toast.error('Nama, Tipe, dan No. Langganan wajib diisi');
      return;
    }

    // Find category based on selected type (PLN or PDAM)
    // Look for category with category_item_name containing the type
    const selectedCategory = (categoryItems?.data || []).find(c =>
      c.category_item_name?.toUpperCase().includes(plnPdamForm.type)
    );
    if (!selectedCategory) {
      toast.error(`Kategori ${plnPdamForm.type} tidak ditemukan. Silakan tambahkan kategori "${plnPdamForm.type}" terlebih dahulu.`);
      return;
    }

    setPlnPdamFormLoading(true);
    try {
      // Auto-generate item_code based on type and timestamp
      const generatedCode = selectedPlnPdam?.item_code || `${plnPdamForm.type}-${Date.now()}`;

      const itemData = {
        item_name: plnPdamForm.item_name,
        item_code: generatedCode,
        item_description: plnPdamForm.item_name, // Same as item_name
        campus_id: id,
        category_item_id: selectedCategory.category_item_id, // Use PLN or PDAM category
        no_subcription: plnPdamForm.no_subcription,
        total: parseInt(plnPdamForm.total) || 1,
        category_pln_pdam: 1, // Mark as PLN/PDAM item
        item_condition: 'Baik',
      };

      if (selectedPlnPdam) {
        await dispatch(updateItem({ id: selectedPlnPdam.item_id, data: itemData })).unwrap();
      } else {
        await dispatch(createItem(itemData)).unwrap();
      }
      setIsPlnPdamModalOpen(false);
      loadItems(); // Refresh items list
    } catch (err) {
      // Error handled by effect
    } finally {
      setPlnPdamFormLoading(false);
    }
  };

  const handleConfirmDeletePlnPdam = async () => {
    try {
      await dispatch(deleteItem(selectedPlnPdam.item_id)).unwrap();
      setIsPlnPdamDeleteOpen(false);
      loadItems(); // Refresh items list
    } catch (err) {
      // Error handled by effect
    }
  };

  // User handlers
  const handleAddUser = () => {
    setSelectedUser(null);
    setUserForm({
      full_name: '',
      email: '',
      password: '',
      phone_number: '',
      role_id: 2,
      position: '',
      is_active: 1,
    });
    setIsUserModalOpen(true);
  };

  const handleEditUser = (item) => {
    setSelectedUser(item);
    setUserForm({
      full_name: item.full_name || '',
      email: item.email || '',
      password: '', // Don't show existing password
      phone_number: item.phone_number || '',
      role_id: item.role_id || 2,
      position: item.position || '',
      is_active: item.is_active ?? 1,
    });
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = (item) => {
    setSelectedUser(item);
    setIsUserDeleteOpen(true);
  };

  const handleUserSubmit = async () => {
    if (!userForm.full_name || !userForm.email || !userForm.phone_number) {
      toast.error('Nama Lengkap, Email, dan No. Telepon wajib diisi');
      return;
    }

    // Password required for new user
    if (!selectedUser && !userForm.password) {
      toast.error('Password wajib diisi untuk user baru');
      return;
    }

    setUserFormLoading(true);
    try {
      const userData = {
        full_name: userForm.full_name,
        email: userForm.email,
        phone_number: userForm.phone_number,
        role_id: parseInt(userForm.role_id),
        position: userForm.position,
        is_active: parseInt(userForm.is_active),
        campus_id: id,
      };

      // Only include password if provided
      if (userForm.password) {
        userData.password = userForm.password;
      }

      if (selectedUser) {
        await dispatch(updateUser({ id: selectedUser.user_id, data: userData })).unwrap();
      } else {
        await dispatch(createUser(userData)).unwrap();
      }
      setIsUserModalOpen(false);
    } catch (err) {
      // Error handled by effect
    } finally {
      setUserFormLoading(false);
    }
  };

  const handleConfirmDeleteUser = async () => {
    try {
      await dispatch(deleteUser(selectedUser.user_id)).unwrap();
      setIsUserDeleteOpen(false);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <span className="text-sm text-gray-500 mb-2 block">Cover Unit</span>
            <img
              src={unitData.cover || logoFallback}
              alt="Cover Unit"
              className="w-full h-48 object-cover rounded-xl border border-gray-100"
              onError={(e) => { e.target.src = logoFallback; }}
            />
          </div>
          <div>
            <span className="text-sm text-gray-500 mb-2 block">Foto Unit</span>
            <img
              src={unitData.photo_1 || logoFallback}
              alt="Foto Unit"
              className="w-full h-48 object-cover rounded-xl border border-gray-100"
              onError={(e) => { e.target.src = logoFallback; }}
            />
          </div>
        </div>

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

          <Tabs.Tab id="billing" label="PLN/PDAM" icon={FiZap}>
            {/* PLN/PDAM Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {billingTypes.map((type) => {
                const Icon = type.icon;
                // Count based on category_item.category_item_name (same logic as table)
                const typeCount = plnPdamItems.filter(item => {
                  const categoryName = item.category_item?.category_item_name?.toUpperCase() || '';
                  if (type.id === 'pdam') {
                    return categoryName.includes('PDAM');
                  } else {
                    // PLN: category contains PLN but NOT PDAM
                    return categoryName.includes('PLN') && !categoryName.includes('PDAM');
                  }
                }).length;
                return (
                  <div
                    key={type.id}
                    className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-5"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`${type.color} p-3 rounded-xl`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-gray-500 text-sm mb-1">Item {type.name}</h3>
                    <p className="text-2xl font-bold text-gray-800">
                      {typeCount} Item
                    </p>
                  </div>
                );
              })}
            </div>

            {/* PLN/PDAM Items Table with CRUD */}
            <div className="mb-4 flex justify-end">
              <button
                onClick={handleAddPlnPdam}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                <FiPlus className="w-4 h-4" />
                Tambah Item PLN/PDAM
              </button>
            </div>
            {dataLoading ? (
              <div className="flex items-center justify-center py-10">
                <FiLoader className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <DataTable
                columns={plnPdamColumns}
                data={plnPdamItems}
                onEdit={handleEditPlnPdam}
                onDelete={handleDeletePlnPdam}
                showActions={true}
                actionColumn={{ view: false, edit: true, delete: true }}
              />
            )}
          </Tabs.Tab>

          <Tabs.Tab id="user" label="User" icon={FiUsers}>
            <div className="mb-4 flex justify-end">
              <button
                onClick={handleAddUser}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                <FiPlus className="w-4 h-4" />
                Tambah User
              </button>
            </div>
            {usersLoading ? (
              <div className="flex items-center justify-center py-10">
                <FiLoader className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <DataTable
                columns={userColumns}
                data={users || []}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                showActions={true}
                actionColumn={{ view: false, edit: true, delete: true }}
                currentPage={usersPagination?.page || 1}
                totalPages={usersPagination?.totalPages || 1}
                totalItems={usersPagination?.total || 0}
                itemsPerPage={itemsPerPage}
                onPageChange={(newPage) => { setUserPage(newPage); loadUsers(newPage); }}
              />
            )}
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
                    onChange={(e) => { setActivityPage(1); setActivityDateFilter({ ...activityDateFilter, start_date: e.target.value }); }}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Sampai</label>
                  <input
                    type="date"
                    value={activityDateFilter.end_date}
                    onChange={(e) => { setActivityPage(1); setActivityDateFilter({ ...activityDateFilter, end_date: e.target.value }); }}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                {(activityDateFilter.start_date || activityDateFilter.end_date) && (
                  <button
                    onClick={() => { setActivityPage(1); setActivityDateFilter({ start_date: '', end_date: '' }); }}
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
              <DataTable
                columns={activityColumns}
                data={activities?.data || []}
                showActions={false}
                currentPage={activities?.pagination?.page || 1}
                totalPages={activities?.pagination?.totalPages || 1}
                totalItems={activities?.pagination?.total || 0}
                itemsPerPage={itemsPerPage}
                onPageChange={(newPage) => { setActivityPage(newPage); loadActivities(newPage); }}
              />
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
                    <p className="text-2xl font-bold text-gray-800">{regularItems.length}</p>
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
                data={regularItems}
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
        showFooter={false}
        size="md"
      >
        <p className="text-sm text-gray-500 mb-4">
          Pilih periode untuk export laporan unit <strong>{unitData.campus_name}</strong>
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Periode Awal</label>
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Bulan"
                name="month1"
                type="select"
                value={exportData.month1}
                onChange={(e) => setExportData({ ...exportData, month1: e.target.value })}
                options={[
                  { value: '01', label: 'Januari' },
                  { value: '02', label: 'Februari' },
                  { value: '03', label: 'Maret' },
                  { value: '04', label: 'April' },
                  { value: '05', label: 'Mei' },
                  { value: '06', label: 'Juni' },
                  { value: '07', label: 'Juli' },
                  { value: '08', label: 'Agustus' },
                  { value: '09', label: 'September' },
                  { value: '10', label: 'Oktober' },
                  { value: '11', label: 'November' },
                  { value: '12', label: 'Desember' },
                ]}
                noDefaultOption
                required
              />
              <FormInput
                label="Tahun"
                name="year1"
                type="number"
                value={exportData.year1}
                onChange={(e) => setExportData({ ...exportData, year1: e.target.value })}
                placeholder="2024"
                min="2020"
                max="2099"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Periode Akhir</label>
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Bulan"
                name="month2"
                type="select"
                value={exportData.month2}
                onChange={(e) => setExportData({ ...exportData, month2: e.target.value })}
                options={[
                  { value: '01', label: 'Januari' },
                  { value: '02', label: 'Februari' },
                  { value: '03', label: 'Maret' },
                  { value: '04', label: 'April' },
                  { value: '05', label: 'Mei' },
                  { value: '06', label: 'Juni' },
                  { value: '07', label: 'Juli' },
                  { value: '08', label: 'Agustus' },
                  { value: '09', label: 'September' },
                  { value: '10', label: 'Oktober' },
                  { value: '11', label: 'November' },
                  { value: '12', label: 'Desember' },
                ]}
                noDefaultOption
                required
              />
              <FormInput
                label="Tahun"
                name="year2"
                type="number"
                value={exportData.year2}
                onChange={(e) => setExportData({ ...exportData, year2: e.target.value })}
                placeholder="2024"
                min="2020"
                max="2099"
                required
              />
            </div>
          </div>
        </div>

        {/* Info box */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700 font-medium mb-2">
            File yang akan diunduh:
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-blue-600 font-medium">📄 Laporan PDF</p>
              <ul className="text-xs text-blue-500 mt-1 list-disc list-inside">
                <li>Ringkasan Kegiatan</li>
                <li>Laporan Harian Teknisi</li>
                <li>Daftar Event</li>
                <li>Laporan PLN & PDAM</li>
              </ul>
            </div>
            <div>
              <p className="text-xs text-green-600 font-medium">📦 Foto ZIP</p>
              <ul className="text-xs text-green-500 mt-1 list-disc list-inside">
                <li>Foto Kegiatan Teknisi</li>
                <li>Foto Event/Acara</li>
                <li>Terorganisir per folder</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Custom footer with download buttons */}
        <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => setIsExportOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleExportPhotos}
            disabled={photosLoading || exportLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {photosLoading ? (
              <>
                <span className="animate-spin">⏳</span>
                Mengunduh...
              </>
            ) : (
              <>
                📦 Download Foto
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleExportSubmit}
            disabled={exportLoading || photosLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {exportLoading ? (
              <>
                <span className="animate-spin">⏳</span>
                Mengunduh...
              </>
            ) : (
              <>
                📥 Download Laporan
              </>
            )}
          </button>
        </div>
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
        size="lg"
      >
        <FormInput
          label="Judul Event"
          name="event_title"
          value={eventForm.event_title}
          onChange={(e) => setEventForm({ ...eventForm, event_title: e.target.value })}
          placeholder="Contoh: Seminar Nasional"
          required
        />
        <FormInput
          label="Deskripsi"
          name="event_description"
          type="textarea"
          value={eventForm.event_description}
          onChange={(e) => setEventForm({ ...eventForm, event_description: e.target.value })}
          placeholder="Deskripsi event"
          required
        />
        <div className="grid grid-cols-3 gap-4">
          <FormInput
            label="Tanggal"
            name="date"
            type="date"
            value={eventForm.date}
            onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
            required
          />
          <FormInput
            label="Waktu Mulai"
            name="time_1"
            type="time"
            value={eventForm.time_1}
            onChange={(e) => setEventForm({ ...eventForm, time_1: e.target.value })}
            required
          />
          <FormInput
            label="Waktu Selesai"
            name="time_2"
            type="time"
            value={eventForm.time_2}
            onChange={(e) => setEventForm({ ...eventForm, time_2: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Kategori Event"
            name="event_kategori"
            type="select"
            value={eventForm.event_kategori}
            onChange={(e) => setEventForm({ ...eventForm, event_kategori: e.target.value })}
            options={[{ value: '', label: 'Pilih Kategori' }, ...eventCategoryOptions]}
            required
          />
          <FormInput
            label="Tempat"
            name="tempat"
            value={eventForm.tempat}
            onChange={(e) => setEventForm({ ...eventForm, tempat: e.target.value })}
            placeholder="Contoh: Aula Utama"
          />
        </div>
        <FormInput
          label="Petugas"
          name="petugas"
          value={eventForm.petugas}
          onChange={(e) => setEventForm({ ...eventForm, petugas: e.target.value })}
          placeholder="Nama petugas (opsional)"
        />

        {/* Event Photo Upload */}
        <div className="space-y-2 mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Foto Event (Opsional)
          </label>
          <div className="relative">
            {eventPhotoPreview ? (
              <div className="relative group">
                <img
                  src={eventPhotoPreview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg border border-gray-200"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => eventPhotoInputRef.current?.click()}
                    className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                  >
                    <FiUpload size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={removeEventImage}
                    className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => eventPhotoInputRef.current?.click()}
                className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
              >
                {eventImageLoading ? (
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
              ref={eventPhotoInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleEventFileChange}
              className="hidden"
            />
          </div>
          <p className="text-xs text-gray-500">Gambar akan otomatis dikonversi ke format WebP</p>
        </div>
      </Modal>

      {/* Event Delete Confirmation */}
      <ConfirmDialog
        isOpen={isEventDeleteOpen}
        onClose={() => setIsEventDeleteOpen(false)}
        onConfirm={handleConfirmDeleteEvent}
        title="Hapus Event"
        message={`Apakah Anda yakin ingin menghapus "${selectedEvent?.event_title}"?`}
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
        loading={dataLoading}
      />

      {/* PLN/PDAM Item Modal */}
      <Modal
        isOpen={isPlnPdamModalOpen}
        onClose={() => setIsPlnPdamModalOpen(false)}
        title={selectedPlnPdam ? 'Edit Item PLN/PDAM' : 'Tambah Item PLN/PDAM'}
        onSubmit={handlePlnPdamSubmit}
        loading={plnPdamFormLoading}
      >
        <FormInput
          label="Nama Item"
          name="item_name"
          value={plnPdamForm.item_name}
          onChange={(e) => setPlnPdamForm({ ...plnPdamForm, item_name: e.target.value })}
          placeholder="Contoh: Meteran PLN Gedung A"
          required
        />
        <FormInput
          label="Tipe"
          name="type"
          type="select"
          value={plnPdamForm.type}
          onChange={(e) => setPlnPdamForm({ ...plnPdamForm, type: e.target.value })}
          options={plnPdamTypeOptions}
          noDefaultOption
          required
        />
        <FormInput
          label="No. Langganan"
          name="no_subcription"
          value={plnPdamForm.no_subcription}
          onChange={(e) => setPlnPdamForm({ ...plnPdamForm, no_subcription: e.target.value })}
          placeholder="No. Pelanggan PLN/PDAM"
          required
        />
      </Modal>

      {/* PLN/PDAM Item Delete Confirmation */}
      <ConfirmDialog
        isOpen={isPlnPdamDeleteOpen}
        onClose={() => setIsPlnPdamDeleteOpen(false)}
        onConfirm={handleConfirmDeletePlnPdam}
        title="Hapus Item PLN/PDAM"
        message={`Apakah Anda yakin ingin menghapus "${selectedPlnPdam?.item_name}"?`}
        confirmText="Ya, Hapus"
        type="danger"
        loading={dataLoading}
      />

      {/* User Modal */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title={selectedUser ? 'Edit User' : 'Tambah User'}
        onSubmit={handleUserSubmit}
        loading={userFormLoading}
        size="lg"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Nama Lengkap"
            name="full_name"
            value={userForm.full_name}
            onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })}
            placeholder="Contoh: John Doe"
            required
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={userForm.email}
            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
            placeholder="Contoh: john@example.com"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label={selectedUser ? 'Password (kosongkan jika tidak diubah)' : 'Password'}
            name="password"
            type="password"
            value={userForm.password}
            onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
            placeholder="Masukkan password"
            required={!selectedUser}
          />
          <FormInput
            label="No. Telepon"
            name="phone_number"
            value={userForm.phone_number}
            onChange={(e) => setUserForm({ ...userForm, phone_number: e.target.value })}
            placeholder="Contoh: 08123456789"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Role"
            name="role_id"
            type="select"
            value={userForm.role_id}
            onChange={(e) => setUserForm({ ...userForm, role_id: e.target.value })}
            options={roleOptions}
            noDefaultOption
            required
          />
          <FormInput
            label="Jabatan"
            name="position"
            value={userForm.position}
            onChange={(e) => setUserForm({ ...userForm, position: e.target.value })}
            placeholder="Contoh: Staff IT"
          />
        </div>
        <FormInput
          label="Status"
          name="is_active"
          type="select"
          value={userForm.is_active}
          onChange={(e) => setUserForm({ ...userForm, is_active: parseInt(e.target.value) })}
          options={[
            { value: 1, label: 'Aktif' },
            { value: 0, label: 'Tidak Aktif' },
          ]}
          noDefaultOption
        />
      </Modal>

      {/* User Delete Confirmation */}
      <ConfirmDialog
        isOpen={isUserDeleteOpen}
        onClose={() => setIsUserDeleteOpen(false)}
        onConfirm={handleConfirmDeleteUser}
        title="Hapus User"
        message={`Apakah Anda yakin ingin menghapus user "${selectedUser?.full_name}"?`}
        confirmText="Ya, Hapus"
        type="danger"
        loading={usersLoading}
      />
    </MainLayout>
  );
};

export default UnitDetail;

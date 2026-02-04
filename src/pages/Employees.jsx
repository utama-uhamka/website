import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import MainLayout from '../layouts/MainLayout';
import {
  DataTable,
  Modal,
  SearchFilter,
  FormInput,
  StatusBadge,
  ConfirmDialog,
  PageHeader,
  AvatarWithFallback,
} from '../components/ui';
import { FiUsers, FiMapPin, FiLoader, FiUserCheck, FiDownload, FiUpload, FiFileText } from 'react-icons/fi';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  fetchUserStats,
  clearUsersError,
  clearUsersSuccess,
} from '../store/usersSlice';
import { fetchCampuses } from '../store/campusesSlice';
import { fetchRoles } from '../store/masterSlice';
import { evaluationsAPI, usersAPI, activitiesAPI, attendancesAPI, leavesAPI, shiftsAPI } from '../services/api';

const Employees = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: users, pagination, loading, error, success, stats } = useSelector((state) => state.users);
  const { data: campuses } = useSelector((state) => state.campuses);
  const { roles } = useSelector((state) => state.master);
  const fileInputRef = useRef(null);

  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    position: '',
    role_id: '',
    campus_id: '',
    password: '',
    is_active: 1,
  });

  // Import modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importMonth, setImportMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [importData, setImportData] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [employeeExportLoading, setEmployeeExportLoading] = useState(false);

  // Individual employee export modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedEmployeeForExport, setSelectedEmployeeForExport] = useState(null);
  const [individualExportLoading, setIndividualExportLoading] = useState(false);
  const [exportDateRange, setExportDateRange] = useState(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const formatDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return { start_date: formatDate(firstDay), end_date: formatDate(lastDay) };
  });

  const itemsPerPage = 10;

  // Load users
  const loadUsers = useCallback(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchValue,
      ...filterValues,
    };
    dispatch(fetchUsers(params));
  }, [dispatch, currentPage, itemsPerPage, searchValue, filterValues]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Load campuses and roles for filters
  useEffect(() => {
    dispatch(fetchCampuses({ limit: 100 }));
    dispatch(fetchRoles({ limit: 100 }));
    dispatch(fetchUserStats());
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearUsersError());
    }
  }, [error, dispatch]);

  // Handle success
  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearUsersSuccess());
      loadUsers();
      dispatch(fetchUserStats());
    }
  }, [success, dispatch, loadUsers]);

  // Reset page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, filterValues]);

  // Campus options for filter
  const campusOptions = campuses.map((c) => ({
    value: c.campus_id?.toString(),
    label: c.campus_name,
  }));

  // Role options for filter
  const roleOptions = roles.data.map((r) => ({
    value: r.role_id?.toString(),
    label: r.role_name,
  }));

  const columns = [
    {
      key: 'full_name',
      label: 'Nama Karyawan',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <AvatarWithFallback src={row.photo_1} alt={value} size={40} />
          <div>
            <p className="font-medium text-gray-800">{value || '-'}</p>
            <p className="text-xs text-gray-500">{row.position || row.email || '-'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'phone_number',
      label: 'Telepon',
      width: '140px',
      render: (value) => value || '-',
    },
    {
      key: 'role',
      label: 'Role',
      width: '120px',
      render: (value, row) => row.role?.role_name || '-',
    },
    {
      key: 'campus',
      label: 'Unit',
      render: (value, row) => row.campus?.campus_name || '-',
    },
    {
      key: 'is_active',
      label: 'Status',
      width: '100px',
      render: (value) => <StatusBadge status={value === 1 ? 'active' : 'inactive'} />,
    },
  ];

  const filters = [
    {
      key: 'campus_id',
      label: 'Unit',
      options: campusOptions,
    },
    {
      key: 'role_id',
      label: 'Role',
      options: roleOptions,
    },
    {
      key: 'is_active',
      label: 'Status',
      options: [
        { value: '1', label: 'Aktif' },
        { value: '0', label: 'Nonaktif' },
      ],
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({
      full_name: '',
      email: '',
      phone_number: '',
      position: '',
      role_id: '',
      campus_id: '',
      password: '',
      is_active: 1,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      full_name: item.full_name || '',
      email: item.email || '',
      phone_number: item.phone_number || '',
      position: item.position || '',
      role_id: item.role_id?.toString() || '',
      campus_id: item.campus_id?.toString() || '',
      password: '',
      is_active: item.is_active,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleView = (item) => {
    navigate(`/employee/${item.user_id}`);
  };

  const handleSubmit = async () => {
    setFormLoading(true);
    try {
      const submitData = {
        full_name: formData.full_name,
        email: formData.email,
        phone_number: formData.phone_number,
        position: formData.position,
        role_id: parseInt(formData.role_id),
        campus_id: parseInt(formData.campus_id),
        is_active: parseInt(formData.is_active),
      };

      // Only include password if provided (for new user or password change)
      if (formData.password) {
        submitData.password = formData.password;
      }

      if (selectedItem) {
        await dispatch(updateUser({ id: selectedItem.user_id, data: submitData })).unwrap();
      } else {
        // Password is required for new user
        if (!formData.password) {
          toast.error('Password wajib diisi untuk karyawan baru');
          setFormLoading(false);
          return;
        }
        await dispatch(createUser(submitData)).unwrap();
      }
      setIsModalOpen(false);
    } catch (err) {
      // Error handled by slice
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteUser(selectedItem.user_id)).unwrap();
      setIsDeleteOpen(false);
    } catch (err) {
      // Error handled by slice
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Export evaluation template
  const handleExportTemplate = async () => {
    setExportLoading(true);
    try {
      const response = await evaluationsAPI.exportTemplate();
      if (response.data?.success) {
        const { employees, categories } = response.data.data;

        // Create worksheet data
        const wsData = [
          ['Template Penilaian Karyawan'],
          [''],
          ['Petunjuk: Isi nilai 1-100 pada kolom kategori penilaian'],
          [''],
          ['user_id', 'Nama Karyawan', 'Jabatan', 'Email', ...categories],
        ];

        employees.forEach((emp) => {
          wsData.push([
            emp.user_id,
            emp.full_name,
            emp.position,
            emp.email,
            emp.Kinerja || '',
            emp.Kedisiplinan || '',
            emp.Kerjasama || '',
            emp.Inisiatif || '',
            emp['Tanggung Jawab'] || '',
          ]);
        });

        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Set column widths
        ws['!cols'] = [
          { wch: 20 }, // user_id
          { wch: 30 }, // Nama
          { wch: 20 }, // Jabatan
          { wch: 30 }, // Email
          { wch: 12 }, // Kinerja
          { wch: 14 }, // Kedisiplinan
          { wch: 12 }, // Kerjasama
          { wch: 12 }, // Inisiatif
          { wch: 16 }, // Tanggung Jawab
        ];

        XLSX.utils.book_append_sheet(wb, ws, 'Template Penilaian');

        // Download file
        const now = new Date();
        const filename = `Template_Penilaian_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}.xlsx`;
        XLSX.writeFile(wb, filename);

        toast.success('Template berhasil didownload');
      }
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Gagal mengexport template');
    } finally {
      setExportLoading(false);
    }
  };

  // Handle file selection for import
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });

        // Find header row (contains 'user_id')
        let headerRowIndex = -1;
        for (let i = 0; i < jsonData.length; i++) {
          if (jsonData[i] && jsonData[i].includes('user_id')) {
            headerRowIndex = i;
            break;
          }
        }

        if (headerRowIndex === -1) {
          toast.error('Format file tidak valid. Kolom user_id tidak ditemukan.');
          return;
        }

        const headers = jsonData[headerRowIndex];
        const dataRows = jsonData.slice(headerRowIndex + 1);

        // Parse data
        const parsedData = dataRows
          .filter((row) => row && row[0]) // Filter empty rows
          .map((row) => {
            const obj = {};
            headers.forEach((header, idx) => {
              obj[header] = row[idx] || '';
            });
            return obj;
          });

        setImportData(parsedData);
        toast.success(`${parsedData.length} data karyawan berhasil dibaca`);
      } catch (err) {
        console.error('Parse error:', err);
        toast.error('Gagal membaca file. Pastikan format file benar.');
      }
    };
    reader.readAsBinaryString(file);
  };

  // Handle import submit
  const handleImportSubmit = async () => {
    if (!importMonth) {
      toast.error('Pilih bulan penilaian terlebih dahulu');
      return;
    }
    if (!importData || importData.length === 0) {
      toast.error('Upload file template yang sudah diisi');
      return;
    }

    setImportLoading(true);
    try {
      const response = await evaluationsAPI.importEvaluations({
        period: importMonth,
        data: importData,
      });

      if (response.data?.success) {
        toast.success(response.data.message);
        setIsImportModalOpen(false);
        setImportData(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        toast.error(response.data?.message || 'Gagal import data');
      }
    } catch (err) {
      console.error('Import error:', err);
      toast.error(err.response?.data?.message || 'Gagal import data penilaian');
    } finally {
      setImportLoading(false);
    }
  };

  // Open import modal
  const handleOpenImportModal = () => {
    setImportData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsImportModalOpen(true);
  };

  // Export employees to Excel
  const handleExportEmployees = async () => {
    setEmployeeExportLoading(true);
    try {
      // Fetch all employees (use high limit to get all)
      const params = {
        page: 1,
        limit: 10000,
      };
      const result = await dispatch(fetchUsers(params)).unwrap();
      const allEmployees = result.data || [];

      if (allEmployees.length === 0) {
        toast.error('Tidak ada data karyawan untuk diexport');
        return;
      }

      // Create worksheet data
      const wsData = [
        ['Data Karyawan'],
        [''],
        ['Tanggal Export:', new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })],
        [''],
        ['No', 'Nama Lengkap', 'Email', 'Telepon', 'Jabatan', 'Role', 'Unit', 'Status'],
      ];

      allEmployees.forEach((emp, index) => {
        wsData.push([
          index + 1,
          emp.full_name || '-',
          emp.email || '-',
          emp.phone_number || '-',
          emp.position || '-',
          emp.role?.role_name || '-',
          emp.campus?.campus_name || '-',
          emp.is_active === 1 ? 'Aktif' : 'Nonaktif',
        ]);
      });

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(wsData);

      // Set column widths
      ws['!cols'] = [
        { wch: 5 },  // No
        { wch: 30 }, // Nama Lengkap
        { wch: 30 }, // Email
        { wch: 15 }, // Telepon
        { wch: 20 }, // Jabatan
        { wch: 15 }, // Role
        { wch: 25 }, // Unit
        { wch: 10 }, // Status
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'Data Karyawan');

      // Download file
      const now = new Date();
      const filename = `Data_Karyawan_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}.xlsx`;
      XLSX.writeFile(wb, filename);

      toast.success('Data karyawan berhasil diexport');

      // Reload current page data
      loadUsers();
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Gagal mengexport data karyawan');
    } finally {
      setEmployeeExportLoading(false);
    }
  };

  // Open export modal for individual employee
  const handleOpenExportModal = (employee) => {
    setSelectedEmployeeForExport(employee);
    // Reset date range to current month
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const formatDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    setExportDateRange({ start_date: formatDate(firstDay), end_date: formatDate(lastDay) });
    setIsExportModalOpen(true);
  };

  // Export individual employee data to Excel
  const handleExportIndividualEmployee = async () => {
    if (!selectedEmployeeForExport) return;
    if (!exportDateRange.start_date || !exportDateRange.end_date) {
      toast.error('Pilih rentang tanggal terlebih dahulu');
      return;
    }

    setIndividualExportLoading(true);
    try {
      const userId = selectedEmployeeForExport.user_id;
      const { start_date, end_date } = exportDateRange;

      // Fetch all data in parallel
      const [activitiesRes, attendancesRes, leavesRes, shiftsRes] = await Promise.all([
        activitiesAPI.getAll({ user_id: userId, start_date, end_date, limit: 10000 }),
        attendancesAPI.getGrouped({ user_id: userId, start_date, end_date, limit: 10000 }),
        leavesAPI.getAll({ user_id: userId, limit: 10000 }),
        usersAPI.getShifts(userId),
      ]);

      const activities = activitiesRes.data?.data || [];
      const attendances = attendancesRes.data?.data || [];
      const leaves = leavesRes.data?.data || [];
      const shifts = shiftsRes.data?.data || [];

      // Create workbook
      const wb = XLSX.utils.book_new();

      // Sheet 1: Info Karyawan
      const infoData = [
        ['DATA KARYAWAN'],
        [''],
        ['Nama Lengkap', selectedEmployeeForExport.full_name || '-'],
        ['Email', selectedEmployeeForExport.email || '-'],
        ['Telepon', selectedEmployeeForExport.phone_number || '-'],
        ['Jabatan', selectedEmployeeForExport.position || '-'],
        ['Role', selectedEmployeeForExport.role?.role_name || '-'],
        ['Unit', selectedEmployeeForExport.campus?.campus_name || '-'],
        ['Status', selectedEmployeeForExport.is_active === 1 ? 'Aktif' : 'Nonaktif'],
        [''],
        ['Periode Export', `${start_date} s/d ${end_date}`],
        ['Tanggal Export', new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })],
      ];
      const wsInfo = XLSX.utils.aoa_to_sheet(infoData);
      wsInfo['!cols'] = [{ wch: 20 }, { wch: 40 }];
      XLSX.utils.book_append_sheet(wb, wsInfo, 'Info Karyawan');

      // Sheet 2: Aktivitas
      const activityData = [
        ['AKTIVITAS'],
        [''],
        ['No', 'Tanggal', 'Judul', 'Lokasi', 'Jam Mulai', 'Jam Selesai', 'Deskripsi'],
      ];
      activities.forEach((act, idx) => {
        activityData.push([
          idx + 1,
          act.date ? new Date(act.date).toLocaleDateString('id-ID') : '-',
          act.title || '-',
          act.location || '-',
          act.time_start || '-',
          act.time_end || '-',
          act.description || '-',
        ]);
      });
      if (activities.length === 0) {
        activityData.push(['', 'Tidak ada data aktivitas untuk periode ini']);
      }
      const wsActivity = XLSX.utils.aoa_to_sheet(activityData);
      wsActivity['!cols'] = [{ wch: 5 }, { wch: 15 }, { wch: 30 }, { wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 40 }];
      XLSX.utils.book_append_sheet(wb, wsActivity, 'Aktivitas');

      // Sheet 3: Absensi
      const attendanceData = [
        ['ABSENSI'],
        [''],
        ['No', 'Tanggal', 'Jam Masuk', 'Jam Keluar', 'Status'],
      ];
      attendances.forEach((att, idx) => {
        const checkInTime = att.checkIn ? new Date(att.checkIn.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-';
        const checkOutTime = att.checkOut ? new Date(att.checkOut.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-';
        let status = 'Tidak Hadir';
        if (att.checkIn && att.checkOut) status = 'Lengkap';
        else if (att.checkIn) status = 'Belum Checkout';

        attendanceData.push([
          idx + 1,
          att.date ? new Date(att.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-',
          checkInTime,
          checkOutTime,
          status,
        ]);
      });
      if (attendances.length === 0) {
        attendanceData.push(['', 'Tidak ada data absensi untuk periode ini']);
      }
      const wsAttendance = XLSX.utils.aoa_to_sheet(attendanceData);
      wsAttendance['!cols'] = [{ wch: 5 }, { wch: 40 }, { wch: 12 }, { wch: 12 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, wsAttendance, 'Absensi');

      // Sheet 4: Cuti
      const leaveData = [
        ['CUTI'],
        [''],
        ['No', 'Jenis Cuti', 'Tanggal Mulai', 'Tanggal Selesai', 'Alasan', 'Status'],
      ];
      leaves.forEach((leave, idx) => {
        let statusText = 'Menunggu';
        if (leave.status === 'Approved') statusText = 'Disetujui';
        else if (leave.status === 'Rejected') statusText = 'Ditolak';

        leaveData.push([
          idx + 1,
          leave.leave_type || '-',
          leave.start_date ? new Date(leave.start_date).toLocaleDateString('id-ID') : '-',
          leave.end_date ? new Date(leave.end_date).toLocaleDateString('id-ID') : '-',
          leave.reason || '-',
          statusText,
        ]);
      });
      if (leaves.length === 0) {
        leaveData.push(['', 'Tidak ada data cuti']);
      }
      const wsLeave = XLSX.utils.aoa_to_sheet(leaveData);
      wsLeave['!cols'] = [{ wch: 5 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 40 }, { wch: 12 }];
      XLSX.utils.book_append_sheet(wb, wsLeave, 'Cuti');

      // Sheet 5: Jadwal Shift
      const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const shiftData = [
        ['JADWAL SHIFT'],
        [''],
        ['Hari', 'Nama Shift', 'Jam Kerja'],
      ];
      shifts.forEach((schedule) => {
        shiftData.push([
          dayNames[schedule.day_of_week] || '-',
          schedule.shift?.name || 'Libur',
          schedule.shift ? `${schedule.shift.timeStart} - ${schedule.shift.timeEnd}` : '-',
        ]);
      });
      if (shifts.length === 0) {
        shiftData.push(['', 'Tidak ada jadwal shift']);
      }
      const wsShift = XLSX.utils.aoa_to_sheet(shiftData);
      wsShift['!cols'] = [{ wch: 12 }, { wch: 25 }, { wch: 20 }];
      XLSX.utils.book_append_sheet(wb, wsShift, 'Jadwal Shift');

      // Download file
      const filename = `Data_${selectedEmployeeForExport.full_name?.replace(/\s+/g, '_') || 'Karyawan'}_${start_date}_${end_date}.xlsx`;
      XLSX.writeFile(wb, filename);

      toast.success('Data karyawan berhasil diexport');
      setIsExportModalOpen(false);
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Gagal mengexport data karyawan');
    } finally {
      setIndividualExportLoading(false);
    }
  };

  // Stats from API
  const totalEmployees = stats?.totalUsers || pagination.total || 0;
  const activeEmployees = stats?.activeUsers || users.filter((e) => e.is_active === 1).length;
  const unitCount = stats?.usersByCampus?.length || [...new Set(users.map((e) => e.campus_id).filter(Boolean))].length;

  return (
    <MainLayout>
      <PageHeader
        title="Karyawan"
        subtitle="Kelola data karyawan"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Kepegawaian', path: null },
          { label: 'Karyawan' },
        ]}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-xl">
              <FiUsers className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{totalEmployees}</p>
              <p className="text-sm text-gray-500">Total Karyawan</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <FiUserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{activeEmployees}</p>
              <p className="text-sm text-gray-500">Karyawan Aktif</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <FiMapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{unitCount}</p>
              <p className="text-sm text-gray-500">Unit Penempatan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Import/Export Penilaian */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiFileText className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Template Penilaian Karyawan</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportTemplate}
              disabled={exportLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
            >
              {exportLoading ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiDownload className="w-4 h-4" />}
              Export Template
            </button>
            <button
              onClick={handleOpenImportModal}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <FiUpload className="w-4 h-4" />
              Import Penilaian
            </button>
          </div>
        </div>
      </div>

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari nama, email, atau telepon..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onAdd={handleAdd}
        addLabel="Tambah Karyawan"
        showExport={true}
        onExport={handleExportEmployees}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={users}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          showActions={true}
          actionColumn={{ view: true, edit: true, delete: true }}
          customActions={(item) => (
            <button
              onClick={() => handleOpenExportModal(item)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Export Data"
            >
              <FiDownload size={16} />
            </button>
          )}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Karyawan' : 'Tambah Karyawan'}
        onSubmit={handleSubmit}
        loading={formLoading}
        size="lg"
      >
        <FormInput
          label="Nama Lengkap"
          name="full_name"
          value={formData.full_name}
          onChange={handleInputChange}
          placeholder="Contoh: Ahmad Fauzi"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="email@domain.com"
            required
          />
          <FormInput
            label="No. Telepon"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            placeholder="08xxxxxxxxxx"
            required
          />
        </div>
        <FormInput
          label="Jabatan/Posisi"
          name="position"
          value={formData.position}
          onChange={handleInputChange}
          placeholder="Contoh: Staff IT, Teknisi, dll"
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Role"
            name="role_id"
            type="select"
            value={formData.role_id}
            onChange={handleInputChange}
            options={roleOptions}
            placeholder="Pilih Role"
            required
          />
          <FormInput
            label="Unit Penempatan"
            name="campus_id"
            type="select"
            value={formData.campus_id}
            onChange={handleInputChange}
            options={campusOptions}
            placeholder="Pilih Unit"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label={selectedItem ? 'Password (kosongkan jika tidak diubah)' : 'Password'}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Minimal 6 karakter"
            required={!selectedItem}
          />
          <FormInput
            label="Status"
            name="is_active"
            type="select"
            value={formData.is_active?.toString()}
            onChange={(e) => setFormData((prev) => ({ ...prev, is_active: parseInt(e.target.value) }))}
            options={[
              { value: '1', label: 'Aktif' },
              { value: '0', label: 'Nonaktif' },
            ]}
          />
        </div>
      </Modal>

      {/* Import Evaluation Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Penilaian Karyawan"
        onSubmit={handleImportSubmit}
        loading={importLoading}
        submitText="Import Data"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Periode Penilaian <span className="text-red-500">*</span>
            </label>
            <input
              type="month"
              value={importMonth}
              onChange={(e) => setImportMonth(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <p className="text-xs text-gray-500 mt-1">Pilih bulan dan tahun periode penilaian</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File Template <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                id="import-file"
              />
              <label htmlFor="import-file" className="cursor-pointer">
                <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Klik untuk upload atau drag & drop
                </p>
                <p className="text-xs text-gray-400 mt-1">Format: .xlsx, .xls</p>
              </label>
            </div>
            {importData && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  {importData.length} data karyawan siap diimport
                </p>
              </div>
            )}
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Petunjuk:</h4>
            <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
              <li>Download template terlebih dahulu dengan klik &quot;Export Template&quot;</li>
              <li>Isi nilai penilaian (1-100) pada kolom kategori</li>
              <li>Pilih periode penilaian (bulan/tahun)</li>
              <li>Upload file template yang sudah diisi</li>
              <li>Klik &quot;Import Data&quot; untuk menyimpan</li>
            </ol>
          </div>
        </div>
      </Modal>

      {/* Export Individual Employee Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title={`Export Data - ${selectedEmployeeForExport?.full_name || 'Karyawan'}`}
        onSubmit={handleExportIndividualEmployee}
        loading={individualExportLoading}
        submitText="Export Excel"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              Export data karyawan <strong>{selectedEmployeeForExport?.full_name}</strong> ke file Excel.
              Data yang akan diexport meliputi: Aktivitas, Absensi, Cuti, dan Jadwal Shift.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rentang Tanggal <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Dari Tanggal</label>
                <input
                  type="date"
                  value={exportDateRange.start_date}
                  onChange={(e) => setExportDateRange({ ...exportDateRange, start_date: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Sampai Tanggal</label>
                <input
                  type="date"
                  value={exportDateRange.end_date}
                  onChange={(e) => setExportDateRange({ ...exportDateRange, end_date: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Rentang tanggal berlaku untuk data Aktivitas dan Absensi
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Data yang akan diexport:</h4>
            <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
              <li>Info Karyawan (profil)</li>
              <li>Aktivitas (dalam rentang tanggal)</li>
              <li>Absensi (dalam rentang tanggal)</li>
              <li>Riwayat Cuti (semua data)</li>
              <li>Jadwal Shift Mingguan</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Karyawan"
        message={`Apakah Anda yakin ingin menghapus "${selectedItem?.full_name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        type="danger"
        loading={loading}
      />
    </MainLayout>
  );
};

export default Employees;

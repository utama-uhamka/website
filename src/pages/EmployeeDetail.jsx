import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import {
  DataTable,
  Modal,
  FormInput,
  StatusBadge,
  PageHeader,
  Tabs,
  ConfirmDialog,
  AvatarWithFallback,
} from '../components/ui';
import {
  FiArrowLeft,
  FiUser,
  FiActivity,
  FiClock,
  FiCalendar,
  FiAward,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiLoader,
  FiPlus,
  FiCheck,
  FiX,
  FiFilter,
  FiStar,
  FiTrendingUp,
  FiSave,
  FiEdit2,
} from 'react-icons/fi';
import {
  usersAPI,
  attendancesAPI,
  leavesAPI,
  shiftsAPI,
  activitiesAPI,
  evaluationsAPI,
} from '../services/api';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);

  // User data
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  // Tab states
  const [activeTab, setActiveTab] = useState('activity');

  // Activity data
  const [activities, setActivities] = useState({ data: [], pagination: {} });
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activityPage, setActivityPage] = useState(1);
  const [activityDateFilter, setActivityDateFilter] = useState(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const formatDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return { start_date: formatDate(firstDay), end_date: formatDate(lastDay) };
  });

  // Attendance data
  const [attendances, setAttendances] = useState({ data: [], pagination: {} });
  const [attendancesLoading, setAttendancesLoading] = useState(false);
  const [attendancePage, setAttendancePage] = useState(1);
  const [attendanceDateFilter, setAttendanceDateFilter] = useState(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const formatDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return { start_date: formatDate(firstDay), end_date: formatDate(lastDay) };
  });

  // Leave data
  const [leaves, setLeaves] = useState({ data: [], pagination: {} });
  const [leavesLoading, setLeavesLoading] = useState(false);
  const [leavePage, setLeavePage] = useState(1);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  // Shift data
  const [shifts, setShifts] = useState({ data: [] });
  const [shiftsLoading, setShiftsLoading] = useState(false);
  const [userShifts, setUserShifts] = useState([]);
  const [userShiftsLoading, setUserShiftsLoading] = useState(false);
  const [editingShifts, setEditingShifts] = useState(false);
  const [tempUserShifts, setTempUserShifts] = useState([]);
  const [savingShifts, setSavingShifts] = useState(false);

  // Evaluation data
  const [evaluations, setEvaluations] = useState({ data: [], pagination: {} });
  const [evaluationsLoading, setEvaluationsLoading] = useState(false);
  const [evaluationPage, setEvaluationPage] = useState(1);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [isEvaluationDeleteOpen, setIsEvaluationDeleteOpen] = useState(false);
  const [evaluationFormLoading, setEvaluationFormLoading] = useState(false);
  const [evaluationMonthFilter, setEvaluationMonthFilter] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [evaluationForm, setEvaluationForm] = useState({
    period: '',
    category: 'Kinerja',
    score: '',
    notes: '',
  });

  const itemsPerPage = 10;

  // Day names
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  // Evaluation category options
  const evaluationCategoryOptions = [
    { value: 'Kinerja', label: 'Kinerja' },
    { value: 'Kedisiplinan', label: 'Kedisiplinan' },
    { value: 'Kerjasama', label: 'Kerjasama' },
    { value: 'Inisiatif', label: 'Inisiatif' },
    { value: 'Tanggung Jawab', label: 'Tanggung Jawab' },
  ];

  // Generate month options for evaluation
  const generateMonthOptions = () => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
      options.push({ value, label });
    }
    return options;
  };

  const monthOptions = generateMonthOptions();

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      setUserLoading(true);
      try {
        const response = await usersAPI.getById(id);
        if (response.data?.success) {
          setUser(response.data.data);
        } else {
          toast.error('Gagal memuat data karyawan');
          navigate('/employees');
        }
      } catch (err) {
        console.error('Error loading user:', err);
        toast.error('Gagal memuat data karyawan');
        navigate('/employees');
      } finally {
        setUserLoading(false);
      }
    };
    if (id) loadUser();
  }, [id, navigate]);

  // Load activities
  const loadActivities = useCallback(async (page = activityPage) => {
    setActivitiesLoading(true);
    try {
      const params = { user_id: id, page, limit: itemsPerPage };
      if (activityDateFilter.start_date) params.start_date = activityDateFilter.start_date;
      if (activityDateFilter.end_date) params.end_date = activityDateFilter.end_date;
      const response = await activitiesAPI.getAll(params);
      if (response.data?.success) {
        setActivities({
          data: response.data.data || [],
          pagination: response.data.pagination || {},
        });
      }
    } catch (err) {
      console.error('Error loading activities:', err);
    } finally {
      setActivitiesLoading(false);
    }
  }, [id, activityPage, activityDateFilter]);

  useEffect(() => {
    if (activeTab === 'activity' && id) loadActivities();
  }, [activeTab, id, loadActivities]);

  // Load attendances (grouped by date - server-side)
  const loadAttendances = useCallback(async (page = attendancePage) => {
    setAttendancesLoading(true);
    try {
      const params = { user_id: id, page, limit: itemsPerPage };
      if (attendanceDateFilter.start_date) params.start_date = attendanceDateFilter.start_date;
      if (attendanceDateFilter.end_date) params.end_date = attendanceDateFilter.end_date;
      const response = await attendancesAPI.getGrouped(params);
      if (response.data?.success) {
        setAttendances({
          data: response.data.data || [],
          pagination: response.data.pagination || {},
        });
      }
    } catch (err) {
      console.error('Error loading attendances:', err);
    } finally {
      setAttendancesLoading(false);
    }
  }, [id, attendancePage, attendanceDateFilter]);

  useEffect(() => {
    if (activeTab === 'attendance' && id) loadAttendances();
  }, [activeTab, id, loadAttendances]);

  // Load leaves
  const loadLeaves = useCallback(async (page = leavePage) => {
    setLeavesLoading(true);
    try {
      const params = { user_id: id, page, limit: itemsPerPage };
      const response = await leavesAPI.getAll(params);
      if (response.data?.success) {
        setLeaves({
          data: response.data.data || [],
          pagination: response.data.pagination || {},
        });
      }
    } catch (err) {
      console.error('Error loading leaves:', err);
    } finally {
      setLeavesLoading(false);
    }
  }, [id, leavePage]);

  useEffect(() => {
    if (activeTab === 'leave' && id) loadLeaves();
  }, [activeTab, id, loadLeaves]);

  // Load shifts and user shifts
  const loadShifts = useCallback(async () => {
    setShiftsLoading(true);
    try {
      const response = await shiftsAPI.getAll({ limit: 100 });
      if (response.data?.success) {
        setShifts({ data: response.data.data || [] });
      }
    } catch (err) {
      console.error('Error loading shifts:', err);
    } finally {
      setShiftsLoading(false);
    }
  }, []);

  const loadUserShifts = useCallback(async () => {
    setUserShiftsLoading(true);
    try {
      const response = await usersAPI.getShifts(id);
      if (response.data?.success) {
        setUserShifts(response.data.data || []);
        setTempUserShifts(response.data.data || []);
      }
    } catch (err) {
      console.error('Error loading user shifts:', err);
      // Initialize with empty schedule
      const emptySchedule = dayNames.map((_, i) => ({
        day_of_week: i,
        shift_id: null,
        shift: null,
      }));
      setUserShifts(emptySchedule);
      setTempUserShifts(emptySchedule);
    } finally {
      setUserShiftsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (activeTab === 'shift' && id) {
      loadShifts();
      loadUserShifts();
    }
  }, [activeTab, id, loadShifts, loadUserShifts]);

  // Load evaluations
  const loadEvaluations = useCallback(async (page = evaluationPage) => {
    setEvaluationsLoading(true);
    try {
      const params = { user_id: id, page, limit: itemsPerPage };
      // Add period filter if set
      if (evaluationMonthFilter) {
        const [year, month] = evaluationMonthFilter.split('-');
        const monthName = new Date(year, parseInt(month) - 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
        params.period = monthName;
      }
      const response = await evaluationsAPI.getAll(params);
      if (response.data?.success) {
        setEvaluations({
          data: response.data.data || [],
          pagination: response.data.pagination || {},
        });
      }
    } catch (err) {
      console.error('Error loading evaluations:', err);
    } finally {
      setEvaluationsLoading(false);
    }
  }, [id, evaluationPage, evaluationMonthFilter]);

  useEffect(() => {
    if (activeTab === 'evaluation' && id) loadEvaluations();
  }, [activeTab, id, loadEvaluations]);

  // Leave handlers
  const handleOpenApproveDialog = (leave) => {
    setSelectedLeave(leave);
    setIsApproveDialogOpen(true);
  };

  const handleOpenRejectDialog = (leave) => {
    setSelectedLeave(leave);
    setIsRejectDialogOpen(true);
  };

  const handleConfirmApproveLeave = async () => {
    if (!selectedLeave) return;
    try {
      await leavesAPI.approve(selectedLeave.leave_id);
      toast.success('Cuti berhasil disetujui');
      setIsApproveDialogOpen(false);
      setSelectedLeave(null);
      loadLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyetujui cuti');
    }
  };

  const handleConfirmRejectLeave = async () => {
    if (!selectedLeave) return;
    try {
      await leavesAPI.reject(selectedLeave.leave_id);
      toast.success('Cuti berhasil ditolak');
      setIsRejectDialogOpen(false);
      setSelectedLeave(null);
      loadLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menolak cuti');
    }
  };

  // Shift handlers
  const handleEditShifts = () => {
    setTempUserShifts([...userShifts]);
    setEditingShifts(true);
  };

  const handleCancelEditShifts = () => {
    setTempUserShifts([...userShifts]);
    setEditingShifts(false);
  };

  const handleShiftChange = (dayOfWeek, shiftId) => {
    setTempUserShifts(prev =>
      prev.map(item =>
        item.day_of_week === dayOfWeek
          ? { ...item, shift_id: shiftId || null, shift: shifts.data.find(s => s.shift_id === shiftId) || null }
          : item
      )
    );
  };

  const handleSaveShifts = async () => {
    setSavingShifts(true);
    try {
      const schedules = tempUserShifts.map(item => ({
        day_of_week: item.day_of_week,
        shift_id: item.shift_id,
      }));
      await usersAPI.bulkUpdateShifts(id, schedules);
      toast.success('Jadwal shift berhasil disimpan');
      setUserShifts([...tempUserShifts]);
      setEditingShifts(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan jadwal shift');
    } finally {
      setSavingShifts(false);
    }
  };

  // Evaluation handlers
  const handleAddEvaluation = () => {
    setSelectedEvaluation(null);
    // Set default period to current month
    const now = new Date();
    const periodLabel = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    setEvaluationForm({
      period: periodLabel,
      category: 'Kinerja',
      score: '',
      notes: '',
    });
    setIsEvaluationModalOpen(true);
  };

  const handleEditEvaluation = (item) => {
    setSelectedEvaluation(item);
    setEvaluationForm({
      period: item.period || '',
      category: item.category || 'Kinerja',
      score: item.score?.toString() || '',
      notes: item.notes || '',
    });
    setIsEvaluationModalOpen(true);
  };

  const handleDeleteEvaluation = (item) => {
    setSelectedEvaluation(item);
    setIsEvaluationDeleteOpen(true);
  };

  const handleEvaluationSubmit = async () => {
    if (!evaluationForm.period || !evaluationForm.score) {
      toast.error('Periode dan Skor wajib diisi');
      return;
    }

    const score = parseFloat(evaluationForm.score);
    if (isNaN(score) || score < 0 || score > 100) {
      toast.error('Skor harus berupa angka antara 0-100');
      return;
    }

    setEvaluationFormLoading(true);
    try {
      const data = {
        user_id: id,
        evaluator_id: currentUser?.user_id,
        period: evaluationForm.period,
        category: evaluationForm.category,
        score: score,
        notes: evaluationForm.notes,
      };

      if (selectedEvaluation) {
        await evaluationsAPI.update(selectedEvaluation.evaluation_id, data);
        toast.success('Evaluasi berhasil diupdate');
      } else {
        await evaluationsAPI.create(data);
        toast.success('Evaluasi berhasil ditambahkan');
      }
      setIsEvaluationModalOpen(false);
      loadEvaluations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan evaluasi');
    } finally {
      setEvaluationFormLoading(false);
    }
  };

  const handleConfirmDeleteEvaluation = async () => {
    try {
      await evaluationsAPI.delete(selectedEvaluation.evaluation_id);
      toast.success('Evaluasi berhasil dihapus');
      setIsEvaluationDeleteOpen(false);
      loadEvaluations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus evaluasi');
    }
  };

  // Column definitions
  const activityColumns = [
    { key: 'title', label: 'Aktivitas' },
    { key: 'location', label: 'Lokasi', render: (v) => v || '-' },
    {
      key: 'time',
      label: 'Waktu',
      width: '140px',
      render: (v, row) => `${row.time_start || ''} - ${row.time_end || ''}`,
    },
    {
      key: 'date',
      label: 'Tanggal',
      width: '120px',
      render: (v) => v ? new Date(v).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-',
    },
    {
      key: 'photo_1',
      label: 'Foto',
      width: '80px',
      render: (v) => v ? (
        <img src={v} alt="Activity" className="w-10 h-10 object-cover rounded-lg" />
      ) : '-',
    },
  ];

  // Attendance columns for DataTable
  const attendanceColumns = [
    {
      key: 'date',
      label: 'Tanggal',
      render: (v) => {
        const date = new Date(v);
        return (
          <span className="font-medium text-gray-800">
            {date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        );
      },
    },
    {
      key: 'checkIn',
      label: 'Jam Masuk',
      render: (v) => v ? (
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            {new Date(v.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </span>
          {v.photo_1 && (
            <img src={v.photo_1} alt="Check-in" className="w-8 h-8 rounded-full object-cover" />
          )}
        </div>
      ) : <span className="text-gray-400">-</span>,
    },
    {
      key: 'checkOut',
      label: 'Jam Keluar',
      render: (v) => v ? (
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            {new Date(v.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </span>
          {v.photo_1 && (
            <img src={v.photo_1} alt="Check-out" className="w-8 h-8 rounded-full object-cover" />
          )}
        </div>
      ) : <span className="text-gray-400">-</span>,
    },
    {
      key: 'status',
      label: 'Status',
      width: '140px',
      render: (v, row) => {
        if (row.checkIn && row.checkOut) {
          return <span className="px-2 py-1 flex text-center justify-center rounded-full text-xs font-medium bg-green-100 text-green-700">Lengkap</span>;
        } else if (row.checkIn) {
          return <span className="px-2 py-1 flex text-center justify-center rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Belum Checkout</span>;
        } else {
          return <span className="px-2 py-1 flex text-center justify-center rounded-full text-xs font-medium bg-gray-100 text-gray-700">Tidak Hadir</span>;
        }
      },
    },
  ];

  const leaveColumns = [
    {
      key: 'leave_type',
      label: 'Jenis Cuti',
      render: (v) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          {v}
        </span>
      ),
    },
    {
      key: 'start_date',
      label: 'Mulai',
      width: '120px',
      render: (v) => v ? new Date(v).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-',
    },
    {
      key: 'end_date',
      label: 'Selesai',
      width: '120px',
      render: (v) => v ? new Date(v).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-',
    },
    { key: 'reason', label: 'Alasan', render: (v) => v || '-' },
    {
      key: 'status',
      label: 'Status',
      width: '120px',
      render: (v) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          v === 'Approved' ? 'bg-green-100 text-green-700' :
          v === 'Rejected' ? 'bg-red-100 text-red-700' :
          'bg-yellow-100 text-yellow-700'
        }`}>
          {v === 'Approved' ? 'Disetujui' : v === 'Rejected' ? 'Ditolak' : 'Menunggu'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Aksi',
      width: '120px',
      render: (v, row) => row.status === 'Pending' ? (
        <div className="flex gap-1">
          <button
            onClick={() => handleOpenApproveDialog(row)}
            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
            title="Setujui"
          >
            <FiCheck className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenRejectDialog(row)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
            title="Tolak"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      ) : '-',
    },
  ];

  const evaluationColumns = [
    { key: 'period', label: 'Periode' },
    {
      key: 'category',
      label: 'Kategori',
      render: (v) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
          {v}
        </span>
      ),
    },
    {
      key: 'score',
      label: 'Skor',
      width: '100px',
      render: (v) => {
        const score = parseFloat(v);
        const colorClass = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600';
        return <span className={`font-bold ${colorClass}`}>{v}</span>;
      },
    },
    { key: 'notes', label: 'Catatan', render: (v) => v || '-' },
    {
      key: 'evaluator',
      label: 'Penilai',
      render: (v, row) => row.evaluator?.full_name || '-',
    },
    {
      key: 'createdAt',
      label: 'Tanggal',
      width: '120px',
      render: (v) => v ? new Date(v).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-',
    },
  ];

  // Calculate evaluation stats
  const evaluationStats = {
    total: evaluations.pagination?.total || evaluations.data.length,
    avgScore: evaluations.data.length > 0
      ? (evaluations.data.reduce((sum, e) => sum + parseFloat(e.score || 0), 0) / evaluations.data.length).toFixed(1)
      : 0,
    latestScore: evaluations.data.length > 0 ? evaluations.data[0]?.score : '-',
  };

  // Calculate attendance stats (from server-side data)
  const attendanceStats = {
    totalDays: attendances.pagination?.total || attendances.data.length,
    completeDays: attendances.data.filter(d => d.checkIn && d.checkOut).length,
  };

  // Calculate leave stats
  const leaveStats = {
    total: leaves.pagination?.total || leaves.data.length,
    pending: leaves.data.filter(l => l.status === 'Pending').length,
    approved: leaves.data.filter(l => l.status === 'Approved').length,
    rejected: leaves.data.filter(l => l.status === 'Rejected').length,
  };

  if (userLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <FiLoader className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <p className="text-gray-500">Karyawan tidak ditemukan</p>
          <button
            onClick={() => navigate('/employees')}
            className="mt-4 px-4 py-2 text-primary hover:underline"
          >
            Kembali ke Daftar Karyawan
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Detail Karyawan"
        subtitle={user.full_name}
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Karyawan', path: '/employees' },
          { label: user.full_name },
        ]}
        actions={
          <button
            onClick={() => navigate('/employees')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FiArrowLeft className="w-4 h-4" />
            Kembali
          </button>
        }
      />

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <AvatarWithFallback
              src={user.photo_1}
              alt={user.full_name}
              size={120}
              className="rounded-xl"
            />
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <FiUser className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Nama Lengkap</p>
                <p className="font-semibold text-gray-800">{user.full_name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FiMail className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-gray-800">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FiPhone className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">No. Telepon</p>
                <p className="font-semibold text-gray-800">{user.phone_number || '-'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FiBriefcase className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Jabatan</p>
                <p className="font-semibold text-gray-800">{user.position || '-'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FiAward className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {user.role?.role_name || '-'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FiMapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Unit Penempatan</p>
                <p className="font-semibold text-gray-800">{user.campus?.campus_name || '-'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FiClock className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <StatusBadge status={user.is_active === 1 ? 'active' : 'inactive'} />
              </div>
            </div>

            {user.address && (
              <div className="flex items-start gap-3 col-span-2">
                <FiMapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Alamat</p>
                  <p className="font-semibold text-gray-800">{user.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <Tabs activeTab={activeTab} onTabChange={setActiveTab}>
          {/* Activity Tab */}
          <Tabs.Tab id="activity" label="Aktivitas" icon={FiActivity}>
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

            {activitiesLoading ? (
              <div className="flex items-center justify-center py-10">
                <FiLoader className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <DataTable
                columns={activityColumns}
                data={activities.data}
                showActions={false}
                currentPage={activities.pagination?.page || 1}
                totalPages={activities.pagination?.totalPages || 1}
                totalItems={activities.pagination?.total || 0}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => { setActivityPage(page); loadActivities(page); }}
              />
            )}
          </Tabs.Tab>

          {/* Shift Tab */}
          <Tabs.Tab id="shift" label="Shift" icon={FiClock}>
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-600">Jadwal Shift Mingguan</h3>
              {!editingShifts ? (
                <button
                  onClick={handleEditShifts}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  <FiEdit2 className="w-4 h-4" />
                  Edit Jadwal
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelEditShifts}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <FiX className="w-4 h-4" />
                    Batal
                  </button>
                  <button
                    onClick={handleSaveShifts}
                    disabled={savingShifts}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {savingShifts ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
                    Simpan
                  </button>
                </div>
              )}
            </div>

            {(shiftsLoading || userShiftsLoading) ? (
              <div className="flex items-center justify-center py-10">
                <FiLoader className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Hari</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Shift</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Jam Kerja</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(editingShifts ? tempUserShifts : userShifts).map((schedule, idx) => (
                      <tr key={schedule.day_of_week} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                        <td className="px-4 py-3">
                          <span className="font-medium text-gray-800">{dayNames[schedule.day_of_week]}</span>
                        </td>
                        <td className="px-4 py-3">
                          {editingShifts ? (
                            <select
                              value={schedule.shift_id || ''}
                              onChange={(e) => handleShiftChange(schedule.day_of_week, e.target.value)}
                              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary min-w-[200px]"
                            >
                              <option value="">Libur / Tidak Ada Shift</option>
                              {shifts.data.map(shift => (
                                <option key={shift.shift_id} value={shift.shift_id}>
                                  {shift.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              schedule.shift ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {schedule.shift?.name || 'Libur'}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {schedule.shift ? (
                            <span className="flex items-center gap-1">
                              <FiClock className="w-4 h-4" />
                              {schedule.shift.timeStart} - {schedule.shift.timeEnd}
                            </span>
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Tabs.Tab>

          {/* Leave Tab */}
          <Tabs.Tab id="leave" label="Cuti" icon={FiCalendar}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-gray-800">{leaveStats.total}</p>
                <p className="text-sm text-gray-500">Total Pengajuan</p>
              </div>
              <div className="bg-yellow-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-yellow-600">{leaveStats.pending}</p>
                <p className="text-sm text-gray-500">Menunggu</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{leaveStats.approved}</p>
                <p className="text-sm text-gray-500">Disetujui</p>
              </div>
              <div className="bg-red-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-red-600">{leaveStats.rejected}</p>
                <p className="text-sm text-gray-500">Ditolak</p>
              </div>
            </div>

            {leavesLoading ? (
              <div className="flex items-center justify-center py-10">
                <FiLoader className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <DataTable
                columns={leaveColumns}
                data={leaves.data}
                showActions={false}
                currentPage={leaves.pagination?.page || 1}
                totalPages={leaves.pagination?.totalPages || 1}
                totalItems={leaves.pagination?.total || 0}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => { setLeavePage(page); loadLeaves(page); }}
              />
            )}
          </Tabs.Tab>

          {/* Attendance Tab */}
          <Tabs.Tab id="attendance" label="Absensi" icon={FiClock}>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-green-500 p-3 rounded-xl">
                    <FiCalendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{attendanceStats.totalDays}</p>
                    <p className="text-sm text-gray-500">Total Hari Absen</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500 p-3 rounded-xl">
                    <FiCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{attendanceStats.completeDays}</p>
                    <p className="text-sm text-gray-500">Absen Lengkap</p>
                  </div>
                </div>
              </div>
            </div>

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
                    value={attendanceDateFilter.start_date}
                    onChange={(e) => { setAttendancePage(1); setAttendanceDateFilter({ ...attendanceDateFilter, start_date: e.target.value }); }}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Sampai</label>
                  <input
                    type="date"
                    value={attendanceDateFilter.end_date}
                    onChange={(e) => { setAttendancePage(1); setAttendanceDateFilter({ ...attendanceDateFilter, end_date: e.target.value }); }}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                {(attendanceDateFilter.start_date || attendanceDateFilter.end_date) && (
                  <button
                    onClick={() => { setAttendancePage(1); setAttendanceDateFilter({ start_date: '', end_date: '' }); }}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 self-end"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {attendancesLoading ? (
              <div className="flex items-center justify-center py-10">
                <FiLoader className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <DataTable
                columns={attendanceColumns}
                data={attendances.data}
                showActions={false}
                currentPage={attendances.pagination?.page || 1}
                totalPages={attendances.pagination?.totalPages || 1}
                totalItems={attendances.pagination?.total || 0}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => { setAttendancePage(page); loadAttendances(page); }}
              />
            )}
          </Tabs.Tab>

          {/* Evaluation Tab */}
          <Tabs.Tab id="evaluation" label="Penilaian" icon={FiStar}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-5">
                <div className="flex items-center gap-4">
                  <div className="bg-primary p-3 rounded-xl shadow">
                    <FiStar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{evaluationStats.total}</p>
                    <p className="text-sm text-gray-500">Total Penilaian</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5">
                <div className="flex items-center gap-4">
                  <div className="bg-green-500 p-3 rounded-xl shadow">
                    <FiTrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{evaluationStats.avgScore}</p>
                    <p className="text-sm text-gray-500">Rata-rata Skor</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-500 p-3 rounded-xl shadow">
                    <FiAward className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{evaluationStats.latestScore}</p>
                    <p className="text-sm text-gray-500">Skor Terakhir</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-600">
                  <FiFilter className="w-4 h-4" />
                  <span className="text-sm font-medium">Periode Penilaian:</span>
                </div>
                <input
                  type="month"
                  value={evaluationMonthFilter}
                  onChange={(e) => { setEvaluationPage(1); setEvaluationMonthFilter(e.target.value); }}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                {evaluationMonthFilter && (
                  <button
                    onClick={() => { setEvaluationPage(1); setEvaluationMonthFilter(''); }}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
              <button
                onClick={handleAddEvaluation}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                <FiPlus className="w-4 h-4" />
                Tambah Penilaian
              </button>
            </div>

            {evaluationsLoading ? (
              <div className="flex items-center justify-center py-10">
                <FiLoader className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <DataTable
                columns={evaluationColumns}
                data={evaluations.data}
                onEdit={handleEditEvaluation}
                onDelete={handleDeleteEvaluation}
                showActions={true}
                actionColumn={{ view: false, edit: true, delete: true }}
                currentPage={evaluations.pagination?.page || 1}
                totalPages={evaluations.pagination?.totalPages || 1}
                totalItems={evaluations.pagination?.total || 0}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => { setEvaluationPage(page); loadEvaluations(page); }}
              />
            )}
          </Tabs.Tab>
        </Tabs>
      </div>

      {/* Evaluation Modal */}
      <Modal
        isOpen={isEvaluationModalOpen}
        onClose={() => setIsEvaluationModalOpen(false)}
        title={selectedEvaluation ? 'Edit Penilaian' : 'Tambah Penilaian'}
        onSubmit={handleEvaluationSubmit}
        loading={evaluationFormLoading}
      >
        <FormInput
          label="Periode (Bulan)"
          name="period"
          type="select"
          value={evaluationForm.period}
          onChange={(e) => setEvaluationForm({ ...evaluationForm, period: e.target.value })}
          options={monthOptions.map(opt => ({ value: opt.label, label: opt.label }))}
          placeholder="Pilih Bulan"
          required
        />
        <FormInput
          label="Kategori"
          name="category"
          type="select"
          value={evaluationForm.category}
          onChange={(e) => setEvaluationForm({ ...evaluationForm, category: e.target.value })}
          options={evaluationCategoryOptions}
          noDefaultOption
          required
        />
        <FormInput
          label="Skor (0-100)"
          name="score"
          type="number"
          min="0"
          max="100"
          value={evaluationForm.score}
          onChange={(e) => setEvaluationForm({ ...evaluationForm, score: e.target.value })}
          placeholder="Masukkan skor 0-100"
          required
        />
        <FormInput
          label="Catatan"
          name="notes"
          type="textarea"
          value={evaluationForm.notes}
          onChange={(e) => setEvaluationForm({ ...evaluationForm, notes: e.target.value })}
          placeholder="Catatan tambahan (opsional)"
        />
      </Modal>

      {/* Evaluation Delete Confirmation */}
      <ConfirmDialog
        isOpen={isEvaluationDeleteOpen}
        onClose={() => setIsEvaluationDeleteOpen(false)}
        onConfirm={handleConfirmDeleteEvaluation}
        title="Hapus Penilaian"
        message={`Apakah Anda yakin ingin menghapus penilaian periode "${selectedEvaluation?.period}"?`}
        confirmText="Ya, Hapus"
        type="danger"
      />

      {/* Leave Approve Confirmation */}
      <ConfirmDialog
        isOpen={isApproveDialogOpen}
        onClose={() => { setIsApproveDialogOpen(false); setSelectedLeave(null); }}
        onConfirm={handleConfirmApproveLeave}
        title="Setujui Cuti"
        message={`Apakah Anda yakin ingin menyetujui pengajuan cuti "${selectedLeave?.leave_type}" dari tanggal ${selectedLeave?.start_date ? new Date(selectedLeave.start_date).toLocaleDateString('id-ID') : ''} sampai ${selectedLeave?.end_date ? new Date(selectedLeave.end_date).toLocaleDateString('id-ID') : ''}?`}
        confirmText="Ya, Setujui"
        type="success"
      />

      {/* Leave Reject Confirmation */}
      <ConfirmDialog
        isOpen={isRejectDialogOpen}
        onClose={() => { setIsRejectDialogOpen(false); setSelectedLeave(null); }}
        onConfirm={handleConfirmRejectLeave}
        title="Tolak Cuti"
        message={`Apakah Anda yakin ingin menolak pengajuan cuti "${selectedLeave?.leave_type}" dari tanggal ${selectedLeave?.start_date ? new Date(selectedLeave.start_date).toLocaleDateString('id-ID') : ''} sampai ${selectedLeave?.end_date ? new Date(selectedLeave.end_date).toLocaleDateString('id-ID') : ''}?`}
        confirmText="Ya, Tolak"
        type="danger"
      />
    </MainLayout>
  );
};

export default EmployeeDetail;

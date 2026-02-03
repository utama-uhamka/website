import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
} from '../components/ui';
import {
  FiArrowLeft,
  FiUser,
  FiLock,
  FiClock,
  FiActivity,
  FiCalendar,
  FiStar,
  FiSun,
  FiMail,
  FiPhone,
  FiMapPin,
  FiPlus,
  FiEdit2,
  FiBook,
  FiAward,
  FiCheck,
  FiLoader,
} from 'react-icons/fi';
import { fetchUserById, updateUser, clearUsersError, clearUsersSuccess } from '../store/usersSlice';
import {
  fetchAttendances,
  fetchActivities,
  fetchLeaves,
  fetchEvaluations,
  createEvaluation,
  updateEvaluation,
  deleteEvaluation,
  fetchTrainings,
  clearDataError,
  clearDataSuccess,
} from '../store/dataSlice';
import { fetchShifts, clearMasterError, clearMasterSuccess } from '../store/masterSlice';

const AccountDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('informasi');

  // Redux state
  const { selectedUser, loading: usersLoading, error: usersError, success: usersSuccess } = useSelector((state) => state.users);
  const { attendances, activities, leaves, evaluations, trainings, loading: dataLoading, error: dataError, success: dataSuccess } = useSelector((state) => state.data);
  const { shifts, error: masterError, success: masterSuccess } = useSelector((state) => state.master);

  // Local loading state
  const [pageLoading, setPageLoading] = useState(true);

  // Password form
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Shift management
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [shiftForm, setShiftForm] = useState({ shift_id: '' });
  const [shiftLoading, setShiftLoading] = useState(false);

  // Evaluation modal
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
  const [isEvalDeleteOpen, setIsEvalDeleteOpen] = useState(false);
  const [selectedEval, setSelectedEval] = useState(null);
  const [evalFormData, setEvalFormData] = useState({
    month: '',
    year: '',
    attendance_score: '',
    performance_score: '',
    attitude_score: '',
    skill_score: '',
    notes: '',
  });
  const [evalLoading, setEvalLoading] = useState(false);

  const months = [
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
  ];

  const years = [
    { value: '2025', label: '2025' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
  ];

  // Load user data
  const loadUser = useCallback(async () => {
    setPageLoading(true);
    try {
      await dispatch(fetchUserById(id)).unwrap();
    } catch (err) {
      toast.error(err || 'Gagal memuat data user');
      navigate('/employees');
    } finally {
      setPageLoading(false);
    }
  }, [dispatch, id, navigate]);

  // Load related data
  const loadAttendances = useCallback(() => {
    dispatch(fetchAttendances({ user_id: id, limit: 30 }));
  }, [dispatch, id]);

  const loadActivities = useCallback(() => {
    dispatch(fetchActivities({ user_id: id, limit: 30 }));
  }, [dispatch, id]);

  const loadLeaves = useCallback(() => {
    dispatch(fetchLeaves({ user_id: id, limit: 30 }));
  }, [dispatch, id]);

  const loadEvaluations = useCallback(() => {
    dispatch(fetchEvaluations({ user_id: id, limit: 30 }));
  }, [dispatch, id]);

  const loadTrainings = useCallback(() => {
    dispatch(fetchTrainings({ user_id: id, limit: 30 }));
  }, [dispatch, id]);

  const loadShifts = useCallback(() => {
    dispatch(fetchShifts({ limit: 100 }));
  }, [dispatch]);

  // Initial load
  useEffect(() => {
    loadUser();
    loadAttendances();
    loadActivities();
    loadLeaves();
    loadEvaluations();
    loadTrainings();
    loadShifts();
  }, [loadUser, loadAttendances, loadActivities, loadLeaves, loadEvaluations, loadTrainings, loadShifts]);

  // Handle errors and success
  useEffect(() => {
    if (usersError) {
      toast.error(usersError);
      dispatch(clearUsersError());
    }
    if (usersSuccess) {
      toast.success(usersSuccess);
      dispatch(clearUsersSuccess());
    }
  }, [usersError, usersSuccess, dispatch]);

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
  const attendanceData = attendances.data || [];
  const activityData = activities.data || [];
  const leaveData = leaves.data || [];
  const evaluationData = evaluations.data || [];
  const trainingData = trainings.data || [];
  const shiftsData = shifts.data || [];

  // Shift options for dropdown
  const shiftOptions = shiftsData.map(s => ({
    value: s.shift_id,
    label: `${s.name} (${s.start_time} - ${s.end_time})`
  }));

  // Column definitions
  const attendanceColumns = [
    { key: 'date', label: 'Tanggal', width: '120px', render: (v) => v ? new Date(v).toLocaleDateString('id-ID') : '-' },
    { key: 'clock_in', label: 'Masuk', width: '80px', render: (v) => v || '-' },
    { key: 'clock_out', label: 'Keluar', width: '80px', render: (v) => v || '-' },
    { key: 'location', label: 'Lokasi' },
    { key: 'status', label: 'Status', width: '100px', render: (v) => <StatusBadge status={v} /> },
  ];

  const activityColumns = [
    { key: 'date', label: 'Tanggal', width: '120px', render: (v) => v ? new Date(v).toLocaleDateString('id-ID') : '-' },
    { key: 'time', label: 'Waktu', width: '80px' },
    { key: 'action', label: 'Aktivitas' },
    { key: 'location', label: 'Lokasi' },
    { key: 'notes', label: 'Catatan' },
  ];

  const leaveColumns = [
    { key: 'type', label: 'Tipe Cuti' },
    { key: 'start_date', label: 'Mulai', width: '120px', render: (v) => v ? new Date(v).toLocaleDateString('id-ID') : '-' },
    { key: 'end_date', label: 'Selesai', width: '120px', render: (v) => v ? new Date(v).toLocaleDateString('id-ID') : '-' },
    { key: 'days', label: 'Hari', width: '60px' },
    { key: 'reason', label: 'Alasan' },
    { key: 'status', label: 'Status', width: '100px', render: (v) => <StatusBadge status={v} /> },
  ];

  const evaluationColumns = [
    { key: 'period', label: 'Periode' },
    { key: 'attendance_score', label: 'Kehadiran', width: '100px' },
    { key: 'performance_score', label: 'Kinerja', width: '100px' },
    { key: 'attitude_score', label: 'Sikap', width: '100px' },
    { key: 'skill_score', label: 'Skill', width: '100px' },
    { key: 'total', label: 'Total', width: '80px', render: (v) => <span className="font-bold text-primary">{v}</span> },
    { key: 'created_at', label: 'Tanggal', width: '120px', render: (v) => v ? new Date(v).toLocaleDateString('id-ID') : '-' },
  ];

  const trainingColumns = [
    { key: 'name', label: 'Nama Training' },
    { key: 'date', label: 'Tanggal', width: '120px', render: (v) => v ? new Date(v).toLocaleDateString('id-ID') : '-' },
    { key: 'duration', label: 'Durasi', width: '100px' },
    { key: 'status', label: 'Status', width: '120px', render: (v) => <StatusBadge status={v} /> },
    {
      key: 'certificate',
      label: 'Sertifikat',
      width: '100px',
      render: (v) => v ? (
        <span className="flex items-center gap-1 text-green-600">
          <FiCheck className="w-4 h-4" /> Ada
        </span>
      ) : (
        <span className="text-gray-400">-</span>
      )
    },
  ];

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('Password baru tidak cocok');
      return;
    }
    setPasswordLoading(true);
    try {
      await dispatch(updateUser({
        id,
        data: { password: passwordData.new_password }
      })).unwrap();
      toast.success('Password berhasil diubah');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      // Error handled by effect
    } finally {
      setPasswordLoading(false);
    }
  };

  // Shift handlers
  const handleOpenShiftModal = () => {
    setShiftForm({ shift_id: selectedUser?.shift_id || '' });
    setIsShiftModalOpen(true);
  };

  const handleShiftSubmit = async () => {
    setShiftLoading(true);
    try {
      await dispatch(updateUser({
        id,
        data: { shift_id: parseInt(shiftForm.shift_id) }
      })).unwrap();
      setIsShiftModalOpen(false);
      loadUser();
    } catch (err) {
      // Error handled by effect
    } finally {
      setShiftLoading(false);
    }
  };

  // Evaluation handlers
  const handleAddEval = () => {
    setSelectedEval(null);
    setEvalFormData({
      month: '',
      year: '2025',
      attendance_score: '',
      performance_score: '',
      attitude_score: '',
      skill_score: '',
      notes: '',
    });
    setIsEvalModalOpen(true);
  };

  const handleEditEval = (item) => {
    setSelectedEval(item);
    setEvalFormData({
      month: item.month || '',
      year: item.year || '',
      attendance_score: item.attendance_score,
      performance_score: item.performance_score,
      attitude_score: item.attitude_score,
      skill_score: item.skill_score,
      notes: item.notes || '',
    });
    setIsEvalModalOpen(true);
  };

  const handleDeleteEval = (item) => {
    setSelectedEval(item);
    setIsEvalDeleteOpen(true);
  };

  const handleEvalSubmit = async () => {
    setEvalLoading(true);
    try {
      const total = (
        (parseFloat(evalFormData.attendance_score) +
          parseFloat(evalFormData.performance_score) +
          parseFloat(evalFormData.attitude_score) +
          parseFloat(evalFormData.skill_score)) / 4
      ).toFixed(2);

      const monthName = months.find(m => m.value === evalFormData.month)?.label || '';
      const period = `${monthName} ${evalFormData.year}`;

      const evalData = {
        user_id: parseInt(id),
        month: evalFormData.month,
        year: evalFormData.year,
        period,
        attendance_score: parseFloat(evalFormData.attendance_score),
        performance_score: parseFloat(evalFormData.performance_score),
        attitude_score: parseFloat(evalFormData.attitude_score),
        skill_score: parseFloat(evalFormData.skill_score),
        total: parseFloat(total),
        notes: evalFormData.notes,
      };

      if (selectedEval) {
        await dispatch(updateEvaluation({ id: selectedEval.evaluation_id, data: evalData })).unwrap();
      } else {
        await dispatch(createEvaluation(evalData)).unwrap();
      }
      setIsEvalModalOpen(false);
      loadEvaluations();
    } catch (err) {
      // Error handled by effect
    } finally {
      setEvalLoading(false);
    }
  };

  const handleConfirmDeleteEval = async () => {
    try {
      await dispatch(deleteEvaluation(selectedEval.evaluation_id)).unwrap();
      setIsEvalDeleteOpen(false);
      loadEvaluations();
    } catch (err) {
      // Error handled by effect
    }
  };

  const handleEvalInputChange = (e) => {
    const { name, value } = e.target;
    setEvalFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Find current shift details
  const currentShift = shiftsData.find(s => s.shift_id === selectedUser?.shift_id);

  // Calculate leave stats
  const approvedLeaves = leaveData.filter(l => l.status === 'approved');
  const usedLeaveDays = approvedLeaves.reduce((acc, l) => acc + (l.days || 0), 0);
  const totalLeaveAllowed = 12; // Default annual leave
  const remainingLeave = totalLeaveAllowed - usedLeaveDays;

  if (pageLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <FiLoader className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!selectedUser) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <p className="text-gray-500">User tidak ditemukan</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title={selectedUser.name}
        subtitle="Detail informasi karyawan"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Karyawan', path: '/employees' },
          { label: selectedUser.name },
        ]}
        actions={
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FiArrowLeft className="w-4 h-4" />
            Kembali
          </button>
        }
      />

      {/* User Info Card - Enhanced Design */}
      <div className="bg-gradient-to-r from-primary/5 via-white to-primary/5 rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
              {selectedUser.avatar ? (
                <img src={selectedUser.avatar} alt={selectedUser.name} className="w-full h-full rounded-2xl object-cover" />
              ) : (
                <span className="text-4xl font-bold text-white">
                  {selectedUser.name?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedUser.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">{selectedUser.role_name || selectedUser.role}</span>
                  <StatusBadge status={selectedUser.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiMail className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-gray-500">Email</span>
                  <p className="font-medium text-sm truncate">{selectedUser.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiPhone className="w-4 h-4 text-green-600" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-gray-500">Telepon</span>
                  <p className="font-medium text-sm">{selectedUser.phone || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FiMapPin className="w-4 h-4 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-gray-500">Unit</span>
                  <p className="font-medium text-sm">{selectedUser.campus_name || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <FiCalendar className="w-4 h-4 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-gray-500">Bergabung</span>
                  <p className="font-medium text-sm">{selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString('id-ID') : '-'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <Tabs activeTab={activeTab} onTabChange={setActiveTab}>
          <Tabs.Tab id="informasi" label="Informasi" icon={FiUser}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FiUser className="w-4 h-4 text-primary" />
                  Data Pribadi
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-500">Nama Lengkap</span>
                    <span className="font-medium text-gray-800">{selectedUser.name}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-500">Email</span>
                    <span className="font-medium text-gray-800">{selectedUser.email}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-500">No. Telepon</span>
                    <span className="font-medium text-gray-800">{selectedUser.phone || '-'}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-gray-500">Tanggal Bergabung</span>
                    <span className="font-medium text-gray-800">{selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString('id-ID') : '-'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FiMapPin className="w-4 h-4 text-primary" />
                  Data Pekerjaan
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-500">Role</span>
                    <span className="font-medium text-gray-800">{selectedUser.role_name || selectedUser.role}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-500">Shift</span>
                    <span className="font-medium text-gray-800">{currentShift?.name || '-'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-500">Unit</span>
                    <span className="font-medium text-gray-800">{selectedUser.campus_name || '-'}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-gray-500">Gedung</span>
                    <span className="font-medium text-gray-800">{selectedUser.building_name || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          </Tabs.Tab>

          <Tabs.Tab id="password" label="Ubah Password" icon={FiLock}>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <FiLock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Ubah Password</h4>
                  <p className="text-sm text-gray-500">Pastikan password baru minimal 8 karakter</p>
                </div>
              </div>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <FormInput
                  label="Password Saat Ini"
                  name="current_password"
                  type="password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  placeholder="Masukkan password saat ini"
                  required
                />
                <FormInput
                  label="Password Baru"
                  name="new_password"
                  type="password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  placeholder="Masukkan password baru"
                  required
                />
                <FormInput
                  label="Konfirmasi Password Baru"
                  name="confirm_password"
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  placeholder="Ulangi password baru"
                  required
                />
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="w-full md:w-auto px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {passwordLoading && <FiLoader className="w-4 h-4 animate-spin" />}
                    Simpan Password Baru
                  </button>
                </div>
              </form>
            </div>
          </Tabs.Tab>

          <Tabs.Tab id="absensi" label="Absensi" icon={FiClock}>
            <DataTable
              columns={attendanceColumns}
              data={attendanceData}
              loading={dataLoading}
              showActions={false}
            />
          </Tabs.Tab>

          <Tabs.Tab id="activity" label="Activity" icon={FiActivity}>
            <DataTable
              columns={activityColumns}
              data={activityData}
              loading={dataLoading}
              showActions={false}
            />
          </Tabs.Tab>

          <Tabs.Tab id="shift" label="Shift" icon={FiSun}>
            <div className="max-w-2xl">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-primary rounded-xl shadow-lg">
                      <FiSun className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-gray-800">{currentShift?.name || 'Belum ada shift'}</h4>
                      <p className="text-gray-500">Shift saat ini</p>
                    </div>
                  </div>
                  <button
                    onClick={handleOpenShiftModal}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Ubah Shift
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                    <span className="text-sm text-gray-500 block mb-1">Jam Masuk</span>
                    <p className="font-bold text-2xl text-primary">{currentShift?.start_time || '-'}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                    <span className="text-sm text-gray-500 block mb-1">Jam Keluar</span>
                    <p className="font-bold text-2xl text-primary">{currentShift?.end_time || '-'}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                    <span className="text-sm text-gray-500 block mb-1">Durasi</span>
                    <p className="font-bold text-2xl text-primary">8 Jam</p>
                  </div>
                </div>

                {currentShift?.break_start && (
                  <div className="mt-4 pt-4 border-t border-primary/20">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiClock className="w-4 h-4" />
                      <span className="text-sm">Waktu Istirahat: <strong>{currentShift.break_start} - {currentShift.break_end}</strong></span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Tabs.Tab>

          <Tabs.Tab id="cuti" label="Cuti" icon={FiCalendar}>
            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-5 text-center">
                <span className="text-sm text-gray-500">Sisa Cuti</span>
                <p className="font-bold text-3xl text-primary mt-1">{Math.max(0, remainingLeave)}</p>
                <span className="text-xs text-gray-400">hari</span>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 text-center">
                <span className="text-sm text-gray-500">Terpakai</span>
                <p className="font-bold text-3xl text-orange-500 mt-1">{usedLeaveDays}</p>
                <span className="text-xs text-gray-400">hari</span>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 text-center">
                <span className="text-sm text-gray-500">Total Tahun Ini</span>
                <p className="font-bold text-3xl text-gray-700 mt-1">{totalLeaveAllowed}</p>
                <span className="text-xs text-gray-400">hari</span>
              </div>
            </div>
            <DataTable
              columns={leaveColumns}
              data={leaveData}
              loading={dataLoading}
              showActions={false}
            />
          </Tabs.Tab>

          <Tabs.Tab id="training" label="Training" icon={FiBook}>
            <div className="mb-4 flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                <FiAward className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">{trainingData.filter(t => t.certificate).length} Sertifikat</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                <FiBook className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">{trainingData.length} Training</span>
              </div>
            </div>
            <DataTable
              columns={trainingColumns}
              data={trainingData}
              loading={dataLoading}
              showActions={false}
            />
          </Tabs.Tab>

          <Tabs.Tab id="penilaian" label="Penilaian" icon={FiStar}>
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-500">Penilaian karyawan dilakukan setiap bulan</p>
              <button
                onClick={handleAddEval}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                <FiPlus className="w-4 h-4" />
                Tambah Penilaian
              </button>
            </div>
            <DataTable
              columns={evaluationColumns}
              data={evaluationData}
              loading={dataLoading}
              onEdit={handleEditEval}
              onDelete={handleDeleteEval}
              showActions={true}
              actionColumn={{ view: false, edit: true, delete: true }}
            />
          </Tabs.Tab>
        </Tabs>
      </div>

      {/* Shift Modal */}
      <Modal
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
        title="Ubah Shift Karyawan"
        onSubmit={handleShiftSubmit}
        loading={shiftLoading}
      >
        <p className="text-sm text-gray-500 mb-4">
          Pilih shift baru untuk {selectedUser.name}
        </p>
        <FormInput
          label="Shift"
          name="shift_id"
          type="select"
          value={shiftForm.shift_id}
          onChange={(e) => setShiftForm({ shift_id: e.target.value })}
          options={[{ value: '', label: 'Pilih Shift' }, ...shiftOptions]}
          required
        />
      </Modal>

      {/* Evaluation Modal - Monthly */}
      <Modal
        isOpen={isEvalModalOpen}
        onClose={() => setIsEvalModalOpen(false)}
        title={selectedEval ? 'Edit Penilaian' : 'Tambah Penilaian'}
        onSubmit={handleEvalSubmit}
        loading={evalLoading}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Bulan"
            name="month"
            type="select"
            value={evalFormData.month}
            onChange={handleEvalInputChange}
            options={[{ value: '', label: 'Pilih Bulan' }, ...months]}
            required
          />
          <FormInput
            label="Tahun"
            name="year"
            type="select"
            value={evalFormData.year}
            onChange={handleEvalInputChange}
            options={years}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Skor Kehadiran (0-100)"
            name="attendance_score"
            type="number"
            value={evalFormData.attendance_score}
            onChange={handleEvalInputChange}
            placeholder="0-100"
            required
          />
          <FormInput
            label="Skor Kinerja (0-100)"
            name="performance_score"
            type="number"
            value={evalFormData.performance_score}
            onChange={handleEvalInputChange}
            placeholder="0-100"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Skor Sikap (0-100)"
            name="attitude_score"
            type="number"
            value={evalFormData.attitude_score}
            onChange={handleEvalInputChange}
            placeholder="0-100"
            required
          />
          <FormInput
            label="Skor Skill (0-100)"
            name="skill_score"
            type="number"
            value={evalFormData.skill_score}
            onChange={handleEvalInputChange}
            placeholder="0-100"
            required
          />
        </div>
        <FormInput
          label="Catatan"
          name="notes"
          type="textarea"
          value={evalFormData.notes}
          onChange={handleEvalInputChange}
          placeholder="Catatan tambahan (opsional)"
        />
      </Modal>

      {/* Delete Evaluation Confirmation */}
      <ConfirmDialog
        isOpen={isEvalDeleteOpen}
        onClose={() => setIsEvalDeleteOpen(false)}
        onConfirm={handleConfirmDeleteEval}
        title="Hapus Penilaian"
        message={`Apakah Anda yakin ingin menghapus penilaian periode "${selectedEval?.period}"?`}
        confirmText="Ya, Hapus"
        type="danger"
      />
    </MainLayout>
  );
};

export default AccountDetail;

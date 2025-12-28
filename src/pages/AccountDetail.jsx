import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from 'react-icons/fi';

const AccountDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('informasi');

  // Password form
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  // Shift management
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [shiftForm, setShiftForm] = useState({ shift_id: '' });

  // Training data
  const trainingData = [
    { id: 1, name: 'Training Keamanan Gedung', date: '2024-11-15', duration: '2 hari', status: 'completed', certificate: true },
    { id: 2, name: 'Workshop Customer Service', date: '2024-09-20', duration: '1 hari', status: 'completed', certificate: true },
    { id: 3, name: 'Training First Aid', date: '2025-02-10', duration: '1 hari', status: 'upcoming', certificate: false },
  ];

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

  // Dummy user data
  const [userData, setUserData] = useState({
    id: parseInt(id),
    name: 'Ahmad Fauzi',
    email: 'ahmad.fauzi@uhamka.ac.id',
    phone: '08123456789',
    role: 'Admin',
    shift_id: '1',
    shift: 'Shift Pagi',
    shift_time: '07:00 - 15:00',
    unit: 'Unit A - Limau',
    unit_id: 1,
    building: 'Gedung Rektorat',
    join_date: '2023-01-15',
    status: 'active',
    avatar: null,
  });

  const shifts = [
    { value: '1', label: 'Shift Pagi (07:00 - 15:00)' },
    { value: '2', label: 'Shift Siang (14:00 - 22:00)' },
    { value: '3', label: 'Shift Malam (22:00 - 07:00)' },
  ];

  const shiftDetails = {
    '1': { name: 'Shift Pagi', start: '07:00', end: '15:00', break: '12:00 - 13:00' },
    '2': { name: 'Shift Siang', start: '14:00', end: '22:00', break: '18:00 - 19:00' },
    '3': { name: 'Shift Malam', start: '22:00', end: '07:00', break: '02:00 - 03:00' },
  };

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

  // Dummy attendance data
  const attendanceData = [
    { id: 1, date: '2025-01-15', clock_in: '07:05', clock_out: '15:10', status: 'present', location: 'Gedung Rektorat' },
    { id: 2, date: '2025-01-14', clock_in: '07:00', clock_out: '15:05', status: 'present', location: 'Gedung Rektorat' },
    { id: 3, date: '2025-01-13', clock_in: '07:15', clock_out: '15:00', status: 'late', location: 'Gedung Rektorat' },
    { id: 4, date: '2025-01-12', clock_in: null, clock_out: null, status: 'leave', location: '-' },
    { id: 5, date: '2025-01-11', clock_in: '07:02', clock_out: '15:08', status: 'present', location: 'Gedung Rektorat' },
  ];

  // Dummy activity data
  const activityData = [
    { id: 1, action: 'Check-in', location: 'Gedung Rektorat Lt.1', time: '07:05', date: '2025-01-15', notes: 'On time' },
    { id: 2, action: 'Meeting', location: 'Ruang Rapat', time: '09:00', date: '2025-01-15', notes: 'Weekly meeting' },
    { id: 3, action: 'Task Complete', location: 'Gedung Rektorat', time: '11:30', date: '2025-01-15', notes: 'Report submission' },
    { id: 4, action: 'Check-out', location: 'Gedung Rektorat Lt.1', time: '15:10', date: '2025-01-15', notes: '' },
    { id: 5, action: 'Check-in', location: 'Gedung Rektorat Lt.1', time: '07:00', date: '2025-01-14', notes: 'On time' },
  ];

  // Dummy leave data
  const leaveData = [
    { id: 1, type: 'Cuti Tahunan', start_date: '2025-01-12', end_date: '2025-01-12', days: 1, reason: 'Keperluan keluarga', status: 'approved' },
    { id: 2, type: 'Izin Sakit', start_date: '2024-12-20', end_date: '2024-12-21', days: 2, reason: 'Demam', status: 'approved' },
    { id: 3, type: 'Cuti Tahunan', start_date: '2024-11-25', end_date: '2024-11-27', days: 3, reason: 'Liburan', status: 'approved' },
  ];

  // Dummy evaluation data - monthly instead of quarterly
  const [evaluationData, setEvaluationData] = useState([
    { id: 1, period: 'Desember 2024', month: '12', year: '2024', attendance_score: 90, performance_score: 85, attitude_score: 88, skill_score: 82, total: 86.25, date: '2024-12-30' },
    { id: 2, period: 'November 2024', month: '11', year: '2024', attendance_score: 85, performance_score: 80, attitude_score: 85, skill_score: 80, total: 82.5, date: '2024-11-30' },
    { id: 3, period: 'Oktober 2024', month: '10', year: '2024', attendance_score: 88, performance_score: 82, attitude_score: 86, skill_score: 78, total: 83.5, date: '2024-10-30' },
  ]);

  // Column definitions
  const attendanceColumns = [
    { key: 'date', label: 'Tanggal', width: '120px' },
    { key: 'clock_in', label: 'Masuk', width: '80px', render: (v) => v || '-' },
    { key: 'clock_out', label: 'Keluar', width: '80px', render: (v) => v || '-' },
    { key: 'location', label: 'Lokasi' },
    { key: 'status', label: 'Status', width: '100px', render: (v) => <StatusBadge status={v} /> },
  ];

  const activityColumns = [
    { key: 'date', label: 'Tanggal', width: '120px' },
    { key: 'time', label: 'Waktu', width: '80px' },
    { key: 'action', label: 'Aktivitas' },
    { key: 'location', label: 'Lokasi' },
    { key: 'notes', label: 'Catatan' },
  ];

  const leaveColumns = [
    { key: 'type', label: 'Tipe Cuti' },
    { key: 'start_date', label: 'Mulai', width: '120px' },
    { key: 'end_date', label: 'Selesai', width: '120px' },
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
    { key: 'date', label: 'Tanggal', width: '120px' },
  ];

  const trainingColumns = [
    { key: 'name', label: 'Nama Training' },
    { key: 'date', label: 'Tanggal', width: '120px' },
    { key: 'duration', label: 'Durasi', width: '100px' },
    {
      key: 'status',
      label: 'Status',
      width: '120px',
      render: (v) => <StatusBadge status={v} />
    },
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

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    console.log('Password change:', passwordData);
    setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
  };

  // Shift handlers
  const handleOpenShiftModal = () => {
    setShiftForm({ shift_id: userData.shift_id });
    setIsShiftModalOpen(true);
  };

  const handleShiftSubmit = () => {
    const selectedShift = shiftDetails[shiftForm.shift_id];
    setUserData((prev) => ({
      ...prev,
      shift_id: shiftForm.shift_id,
      shift: selectedShift.name,
      shift_time: `${selectedShift.start} - ${selectedShift.end}`,
    }));
    setIsShiftModalOpen(false);
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
      month: item.month,
      year: item.year,
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

  const handleEvalSubmit = () => {
    const total = (
      (parseFloat(evalFormData.attendance_score) +
        parseFloat(evalFormData.performance_score) +
        parseFloat(evalFormData.attitude_score) +
        parseFloat(evalFormData.skill_score)) / 4
    ).toFixed(2);

    const monthName = months.find(m => m.value === evalFormData.month)?.label || '';
    const period = `${monthName} ${evalFormData.year}`;

    if (selectedEval) {
      setEvaluationData((prev) =>
        prev.map((item) =>
          item.id === selectedEval.id
            ? { ...item, ...evalFormData, period, total: parseFloat(total) }
            : item
        )
      );
    } else {
      const newEval = {
        id: Date.now(),
        ...evalFormData,
        period,
        total: parseFloat(total),
        date: new Date().toISOString().split('T')[0],
      };
      setEvaluationData((prev) => [newEval, ...prev]);
    }
    setIsEvalModalOpen(false);
  };

  const handleConfirmDeleteEval = () => {
    setEvaluationData((prev) => prev.filter((item) => item.id !== selectedEval.id));
    setIsEvalDeleteOpen(false);
  };

  const handleEvalInputChange = (e) => {
    const { name, value } = e.target;
    setEvalFormData((prev) => ({ ...prev, [name]: value }));
  };

  const currentShift = shiftDetails[userData.shift_id];

  return (
    <MainLayout>
      <PageHeader
        title={userData.name}
        subtitle="Detail informasi karyawan"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Karyawan', path: '/employees' },
          { label: userData.name },
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
              {userData.avatar ? (
                <img src={userData.avatar} alt={userData.name} className="w-full h-full rounded-2xl object-cover" />
              ) : (
                <span className="text-4xl font-bold text-white">
                  {userData.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{userData.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">{userData.role}</span>
                  <StatusBadge status={userData.status} />
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
                  <p className="font-medium text-sm truncate">{userData.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiPhone className="w-4 h-4 text-green-600" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-gray-500">Telepon</span>
                  <p className="font-medium text-sm">{userData.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FiMapPin className="w-4 h-4 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-gray-500">Unit</span>
                  <p className="font-medium text-sm">{userData.unit}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <FiCalendar className="w-4 h-4 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-gray-500">Bergabung</span>
                  <p className="font-medium text-sm">{userData.join_date}</p>
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
                    <span className="font-medium text-gray-800">{userData.name}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-500">Email</span>
                    <span className="font-medium text-gray-800">{userData.email}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-500">No. Telepon</span>
                    <span className="font-medium text-gray-800">{userData.phone}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-gray-500">Tanggal Bergabung</span>
                    <span className="font-medium text-gray-800">{userData.join_date}</span>
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
                    <span className="font-medium text-gray-800">{userData.role}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-500">Shift</span>
                    <span className="font-medium text-gray-800">{userData.shift}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-500">Unit</span>
                    <span className="font-medium text-gray-800">{userData.unit}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-gray-500">Gedung</span>
                    <span className="font-medium text-gray-800">{userData.building}</span>
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
                    className="w-full md:w-auto px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium"
                  >
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
              showActions={false}
            />
          </Tabs.Tab>

          <Tabs.Tab id="activity" label="Activity" icon={FiActivity}>
            <DataTable
              columns={activityColumns}
              data={activityData}
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
                      <h4 className="font-bold text-xl text-gray-800">{userData.shift}</h4>
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
                    <p className="font-bold text-2xl text-primary">{currentShift?.start || '07:00'}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                    <span className="text-sm text-gray-500 block mb-1">Jam Keluar</span>
                    <p className="font-bold text-2xl text-primary">{currentShift?.end || '15:00'}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                    <span className="text-sm text-gray-500 block mb-1">Durasi</span>
                    <p className="font-bold text-2xl text-primary">8 Jam</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-primary/20">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiClock className="w-4 h-4" />
                    <span className="text-sm">Waktu Istirahat: <strong>{currentShift?.break || '12:00 - 13:00'}</strong> (60 menit)</span>
                  </div>
                </div>
              </div>
            </div>
          </Tabs.Tab>

          <Tabs.Tab id="cuti" label="Cuti" icon={FiCalendar}>
            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-5 text-center">
                <span className="text-sm text-gray-500">Sisa Cuti</span>
                <p className="font-bold text-3xl text-primary mt-1">8</p>
                <span className="text-xs text-gray-400">hari</span>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 text-center">
                <span className="text-sm text-gray-500">Terpakai</span>
                <p className="font-bold text-3xl text-orange-500 mt-1">4</p>
                <span className="text-xs text-gray-400">hari</span>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 text-center">
                <span className="text-sm text-gray-500">Total Tahun Ini</span>
                <p className="font-bold text-3xl text-gray-700 mt-1">12</p>
                <span className="text-xs text-gray-400">hari</span>
              </div>
            </div>
            <DataTable
              columns={leaveColumns}
              data={leaveData}
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
      >
        <p className="text-sm text-gray-500 mb-4">
          Pilih shift baru untuk {userData.name}
        </p>
        <FormInput
          label="Shift"
          name="shift_id"
          type="select"
          value={shiftForm.shift_id}
          onChange={(e) => setShiftForm({ shift_id: e.target.value })}
          options={shifts}
          required
        />
      </Modal>

      {/* Evaluation Modal - Monthly */}
      <Modal
        isOpen={isEvalModalOpen}
        onClose={() => setIsEvalModalOpen(false)}
        title={selectedEval ? 'Edit Penilaian' : 'Tambah Penilaian'}
        onSubmit={handleEvalSubmit}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Bulan"
            name="month"
            type="select"
            value={evalFormData.month}
            onChange={handleEvalInputChange}
            options={months}
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

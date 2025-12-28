import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  FiPhone,
  FiPlus,
  FiZap,
  FiDroplet,
  FiWifi,
  FiTrendingUp,
  FiFilter,
} from 'react-icons/fi';

const UnitDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('gedung');
  const [activeBillingType, setActiveBillingType] = useState('pln');

  // Export modal
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportData, setExportData] = useState({ start_date: '', end_date: '' });

  // Activity date filter
  const [activityDateFilter, setActivityDateFilter] = useState({ start_date: '', end_date: '' });

  // Building CRUD states
  const [buildingsData, setBuildingsData] = useState([
    { id: 1, name: 'Gedung Rektorat', floors_count: 5, description: 'Gedung pusat administrasi', status: 'active' },
    { id: 2, name: 'Gedung FKIP', floors_count: 4, description: 'Fakultas Keguruan', status: 'active' },
    { id: 3, name: 'Gedung Perpustakaan', floors_count: 3, description: 'Perpustakaan Pusat', status: 'active' },
    { id: 4, name: 'Gedung Aula', floors_count: 2, description: 'Aula Utama', status: 'active' },
    { id: 5, name: 'Gedung Pascasarjana', floors_count: 5, description: 'Program Pascasarjana', status: 'active' },
  ]);
  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);
  const [isBuildingDeleteOpen, setIsBuildingDeleteOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [buildingForm, setBuildingForm] = useState({ name: '', floors_count: '', description: '', status: 'active' });

  // Account CRUD states
  const [accountsData, setAccountsData] = useState([
    { id: 1, name: 'Ahmad Fauzi', email: 'ahmad@uhamka.ac.id', phone: '08123456789', role: 'Admin', shift: 'Pagi', status: 'active' },
    { id: 2, name: 'Siti Nurhaliza', email: 'siti@uhamka.ac.id', phone: '08234567890', role: 'Staff', shift: 'Pagi', status: 'active' },
    { id: 3, name: 'Budi Santoso', email: 'budi@uhamka.ac.id', phone: '08345678901', role: 'Security', shift: 'Malam', status: 'active' },
    { id: 4, name: 'Dewi Lestari', email: 'dewi@uhamka.ac.id', phone: '08456789012', role: 'Cleaning', shift: 'Pagi', status: 'inactive' },
  ]);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isAccountDeleteOpen, setIsAccountDeleteOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountForm, setAccountForm] = useState({ name: '', email: '', phone: '', role: '', shift: '', status: 'active' });

  // Event CRUD states
  const [eventsData, setEventsData] = useState([
    { id: 1, name: 'Wisuda Semester Ganjil', category: 'Akademik', date: '2025-02-15', location: 'Aula', status: 'upcoming' },
    { id: 2, name: 'Seminar Nasional', category: 'Seminar', date: '2025-01-20', location: 'Gedung FKIP', status: 'completed' },
    { id: 3, name: 'Workshop IT', category: 'Workshop', date: '2025-02-01', location: 'Lab Komputer', status: 'upcoming' },
  ]);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isEventDeleteOpen, setIsEventDeleteOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventForm, setEventForm] = useState({ name: '', category: '', date: '', location: '', status: 'upcoming' });

  // Billing detail modal
  const [isBillingDetailOpen, setIsBillingDetailOpen] = useState(false);
  const [selectedBillingType, setSelectedBillingType] = useState(null);

  // Dummy unit data
  const unitData = {
    id: parseInt(id),
    name: 'Unit A - Limau',
    code: 'UA',
    address: 'Jl. Limau II, Jakarta',
    phone: '021-1234567',
    status: 'active',
  };

  // Billing data by type
  const billingTypes = [
    { id: 'pln', name: 'PLN', icon: FiZap, color: 'bg-amber-500', total: '4,200 kWh', trend: '+5%' },
    { id: 'pdam', name: 'PDAM', icon: FiDroplet, color: 'bg-blue-500', total: '850 m³', trend: '+2%' },
    { id: 'internet', name: 'Internet', icon: FiWifi, color: 'bg-purple-500', total: '100 Mbps', trend: '0%' },
  ];

  const billingHistory = {
    pln: [
      { id: 1, date: '04 Jan 2025', value: '4,200 kWh', meteran: 'Meteran 1' },
      { id: 2, date: '03 Jan 2025', value: '3,900 kWh', meteran: 'Meteran 1' },
      { id: 3, date: '02 Jan 2025', value: '6,880 kWh', meteran: 'Meteran 2' },
      { id: 4, date: '01 Jan 2025', value: '5,600 kWh', meteran: 'Meteran 1' },
    ],
    pdam: [
      { id: 1, date: '04 Jan 2025', value: '850 m³', meteran: 'Meteran Utama' },
      { id: 2, date: '03 Jan 2025', value: '780 m³', meteran: 'Meteran Utama' },
      { id: 3, date: '02 Jan 2025', value: '920 m³', meteran: 'Meteran Cadangan' },
    ],
    internet: [
      { id: 1, date: '04 Jan 2025', value: '100 Mbps', meteran: 'ISP Utama' },
      { id: 2, date: '03 Jan 2025', value: '100 Mbps', meteran: 'ISP Utama' },
    ],
  };

  // Dummy activity data
  const allActivityData = [
    { id: 1, user: 'Ahmad Fauzi', action: 'Check-in', location: 'Gedung Rektorat', time: '07:30', date: '2025-01-15' },
    { id: 2, user: 'Budi Santoso', action: 'Patrol', location: 'Gedung FKIP', time: '22:00', date: '2025-01-15' },
    { id: 3, user: 'Siti Nurhaliza', action: 'Check-out', location: 'Gedung Rektorat', time: '16:00', date: '2025-01-15' },
    { id: 4, user: 'Ahmad Fauzi', action: 'Meeting', location: 'Gedung Aula', time: '10:00', date: '2025-01-14' },
    { id: 5, user: 'Dewi Lestari', action: 'Cleaning', location: 'Gedung FKIP', time: '08:00', date: '2025-01-13' },
    { id: 6, user: 'Budi Santoso', action: 'Check-in', location: 'Gedung Rektorat', time: '21:45', date: '2025-01-12' },
  ];

  // Filter activity data by date
  const filteredActivityData = useMemo(() => {
    if (!activityDateFilter.start_date && !activityDateFilter.end_date) {
      return allActivityData;
    }
    return allActivityData.filter(item => {
      const itemDate = new Date(item.date);
      const start = activityDateFilter.start_date ? new Date(activityDateFilter.start_date) : null;
      const end = activityDateFilter.end_date ? new Date(activityDateFilter.end_date) : null;

      if (start && end) {
        return itemDate >= start && itemDate <= end;
      } else if (start) {
        return itemDate >= start;
      } else if (end) {
        return itemDate <= end;
      }
      return true;
    });
  }, [allActivityData, activityDateFilter]);

  // Role and shift options
  const roles = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Staff', label: 'Staff' },
    { value: 'Security', label: 'Security' },
    { value: 'Cleaning', label: 'Cleaning Service' },
    { value: 'Technician', label: 'Technician' },
  ];

  const shifts = [
    { value: 'Pagi', label: 'Shift Pagi (07:00 - 15:00)' },
    { value: 'Siang', label: 'Shift Siang (14:00 - 22:00)' },
    { value: 'Malam', label: 'Shift Malam (22:00 - 07:00)' },
  ];

  const eventCategories = [
    { value: 'Akademik', label: 'Akademik' },
    { value: 'Seminar', label: 'Seminar' },
    { value: 'Workshop', label: 'Workshop' },
    { value: 'Rapat', label: 'Rapat' },
    { value: 'Lainnya', label: 'Lainnya' },
  ];

  // Column definitions
  const buildingColumns = [
    { key: 'name', label: 'Nama Gedung' },
    { key: 'floors_count', label: 'Lantai', width: '80px' },
    { key: 'description', label: 'Deskripsi' },
    { key: 'status', label: 'Status', width: '100px', render: (v) => <StatusBadge status={v} /> },
  ];

  const accountColumns = [
    { key: 'name', label: 'Nama' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', width: '100px' },
    { key: 'shift', label: 'Shift', width: '80px' },
    { key: 'status', label: 'Status', width: '100px', render: (v) => <StatusBadge status={v} /> },
  ];

  const activityColumns = [
    { key: 'user', label: 'User' },
    { key: 'action', label: 'Aktivitas' },
    { key: 'location', label: 'Lokasi' },
    { key: 'time', label: 'Waktu', width: '80px' },
    { key: 'date', label: 'Tanggal', width: '120px' },
  ];

  const eventColumns = [
    { key: 'name', label: 'Nama Event' },
    { key: 'category', label: 'Kategori', width: '120px' },
    { key: 'date', label: 'Tanggal', width: '120px' },
    { key: 'location', label: 'Lokasi' },
    { key: 'status', label: 'Status', width: '120px', render: (v) => <StatusBadge status={v} /> },
  ];

  // Export handlers
  const handleExportSubmit = () => {
    console.log('Export with date range:', exportData);
    setIsExportOpen(false);
    setExportData({ start_date: '', end_date: '' });
  };

  // Building handlers
  const handleAddBuilding = () => {
    setSelectedBuilding(null);
    setBuildingForm({ name: '', floors_count: '', description: '', status: 'active' });
    setIsBuildingModalOpen(true);
  };

  const handleEditBuilding = (item) => {
    setSelectedBuilding(item);
    setBuildingForm({
      name: item.name,
      floors_count: item.floors_count,
      description: item.description,
      status: item.status,
    });
    setIsBuildingModalOpen(true);
  };

  const handleDeleteBuilding = (item) => {
    setSelectedBuilding(item);
    setIsBuildingDeleteOpen(true);
  };

  const handleBuildingSubmit = () => {
    if (selectedBuilding) {
      setBuildingsData((prev) =>
        prev.map((item) => (item.id === selectedBuilding.id ? { ...item, ...buildingForm } : item))
      );
    } else {
      setBuildingsData((prev) => [...prev, { id: Date.now(), ...buildingForm }]);
    }
    setIsBuildingModalOpen(false);
  };

  const handleConfirmDeleteBuilding = () => {
    setBuildingsData((prev) => prev.filter((item) => item.id !== selectedBuilding.id));
    setIsBuildingDeleteOpen(false);
  };

  // Account handlers
  const handleAddAccount = () => {
    setSelectedAccount(null);
    setAccountForm({ name: '', email: '', phone: '', role: '', shift: '', status: 'active' });
    setIsAccountModalOpen(true);
  };

  const handleEditAccount = (item) => {
    setSelectedAccount(item);
    setAccountForm({
      name: item.name,
      email: item.email,
      phone: item.phone,
      role: item.role,
      shift: item.shift,
      status: item.status,
    });
    setIsAccountModalOpen(true);
  };

  const handleDeleteAccount = (item) => {
    setSelectedAccount(item);
    setIsAccountDeleteOpen(true);
  };

  const handleAccountSubmit = () => {
    if (selectedAccount) {
      setAccountsData((prev) =>
        prev.map((item) => (item.id === selectedAccount.id ? { ...item, ...accountForm } : item))
      );
    } else {
      setAccountsData((prev) => [...prev, { id: Date.now(), ...accountForm }]);
    }
    setIsAccountModalOpen(false);
  };

  const handleConfirmDeleteAccount = () => {
    setAccountsData((prev) => prev.filter((item) => item.id !== selectedAccount.id));
    setIsAccountDeleteOpen(false);
  };

  // Event handlers
  const handleAddEvent = () => {
    setSelectedEvent(null);
    setEventForm({ name: '', category: '', date: '', location: '', status: 'upcoming' });
    setIsEventModalOpen(true);
  };

  const handleEditEvent = (item) => {
    setSelectedEvent(item);
    setEventForm({
      name: item.name,
      category: item.category,
      date: item.date,
      location: item.location,
      status: item.status,
    });
    setIsEventModalOpen(true);
  };

  const handleDeleteEvent = (item) => {
    setSelectedEvent(item);
    setIsEventDeleteOpen(true);
  };

  const handleEventSubmit = () => {
    if (selectedEvent) {
      setEventsData((prev) =>
        prev.map((item) => (item.id === selectedEvent.id ? { ...item, ...eventForm } : item))
      );
    } else {
      setEventsData((prev) => [...prev, { id: Date.now(), ...eventForm }]);
    }
    setIsEventModalOpen(false);
  };

  const handleConfirmDeleteEvent = () => {
    setEventsData((prev) => prev.filter((item) => item.id !== selectedEvent.id));
    setIsEventDeleteOpen(false);
  };

  // Billing detail handler
  const handleViewBillingDetail = (type) => {
    setSelectedBillingType(type);
    setIsBillingDetailOpen(true);
  };

  return (
    <MainLayout>
      <PageHeader
        title={unitData.name}
        subtitle="Detail informasi unit"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Unit', path: '/master/units' },
          { label: unitData.name },
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <span className="text-sm text-gray-500">Kode Unit</span>
            <p className="font-semibold text-lg">{unitData.code}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Status</span>
            <div className="mt-1">
              <StatusBadge status={unitData.status} />
            </div>
          </div>
          <div className="flex items-start gap-2">
            <FiMapPin className="w-4 h-4 text-gray-400 mt-1" />
            <div>
              <span className="text-sm text-gray-500">Alamat</span>
              <p className="font-medium">{unitData.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <FiPhone className="w-4 h-4 text-gray-400 mt-1" />
            <div>
              <span className="text-sm text-gray-500">Telepon</span>
              <p className="font-medium">{unitData.phone}</p>
            </div>
          </div>
        </div>
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
            <DataTable
              columns={buildingColumns}
              data={buildingsData}
              onView={(item) => navigate(`/master/buildings/${item.id}`)}
              onEdit={handleEditBuilding}
              onDelete={handleDeleteBuilding}
              showActions={true}
              actionColumn={{ view: true, edit: true, delete: true }}
            />
          </Tabs.Tab>

          <Tabs.Tab id="billing" label="Billing" icon={FiFileText}>
            {/* Billing Type Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
              <div className="space-y-3">
                {billingHistory[activeBillingType]?.slice(0, 4).map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className={`${billingTypes.find(t => t.id === activeBillingType)?.color} p-2 rounded-lg`}>
                        {activeBillingType === 'pln' && <FiZap className="w-4 h-4 text-white" />}
                        {activeBillingType === 'pdam' && <FiDroplet className="w-4 h-4 text-white" />}
                        {activeBillingType === 'internet' && <FiWifi className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{item.meteran}</p>
                        <p className="text-xs text-gray-500">{item.date}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-800">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Tabs.Tab>

          <Tabs.Tab id="account" label="Account" icon={FiUsers}>
            <div className="mb-4 flex justify-end">
              <button
                onClick={handleAddAccount}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                <FiPlus className="w-4 h-4" />
                Tambah Account
              </button>
            </div>
            <DataTable
              columns={accountColumns}
              data={accountsData}
              onView={(item) => navigate(`/account/${item.id}`)}
              onEdit={handleEditAccount}
              onDelete={handleDeleteAccount}
              showActions={true}
              actionColumn={{ view: true, edit: true, delete: true }}
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
            <DataTable
              columns={activityColumns}
              data={filteredActivityData}
              showActions={false}
            />
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
            <DataTable
              columns={eventColumns}
              data={eventsData}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
              showActions={true}
              actionColumn={{ view: false, edit: true, delete: true }}
            />
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
          Pilih rentang tanggal untuk export laporan unit {unitData.name}
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
                {billingHistory[selectedBillingType.id]?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-800">{item.meteran}</p>
                      <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                    <p className="font-semibold text-gray-800">{item.value}</p>
                  </div>
                ))}
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
      >
        <FormInput
          label="Nama Gedung"
          name="name"
          value={buildingForm.name}
          onChange={(e) => setBuildingForm({ ...buildingForm, name: e.target.value })}
          placeholder="Contoh: Gedung Rektorat"
          required
        />
        <FormInput
          label="Jumlah Lantai"
          name="floors_count"
          type="number"
          value={buildingForm.floors_count}
          onChange={(e) => setBuildingForm({ ...buildingForm, floors_count: e.target.value })}
          placeholder="Contoh: 5"
          required
        />
        <FormInput
          label="Deskripsi"
          name="description"
          type="textarea"
          value={buildingForm.description}
          onChange={(e) => setBuildingForm({ ...buildingForm, description: e.target.value })}
          placeholder="Deskripsi gedung"
        />
        <FormInput
          label="Status"
          name="status"
          type="select"
          value={buildingForm.status}
          onChange={(e) => setBuildingForm({ ...buildingForm, status: e.target.value })}
          options={[
            { value: 'active', label: 'Aktif' },
            { value: 'inactive', label: 'Nonaktif' },
          ]}
        />
      </Modal>

      {/* Building Delete Confirmation */}
      <ConfirmDialog
        isOpen={isBuildingDeleteOpen}
        onClose={() => setIsBuildingDeleteOpen(false)}
        onConfirm={handleConfirmDeleteBuilding}
        title="Hapus Gedung"
        message={`Apakah Anda yakin ingin menghapus "${selectedBuilding?.name}"?`}
        confirmText="Ya, Hapus"
        type="danger"
      />

      {/* Account Modal */}
      <Modal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        title={selectedAccount ? 'Edit Account' : 'Tambah Account'}
        onSubmit={handleAccountSubmit}
      >
        <FormInput
          label="Nama Lengkap"
          name="name"
          value={accountForm.name}
          onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
          placeholder="Contoh: Ahmad Fauzi"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={accountForm.email}
            onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
            placeholder="email@uhamka.ac.id"
            required
          />
          <FormInput
            label="No. Telepon"
            name="phone"
            value={accountForm.phone}
            onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
            placeholder="08xxxxxxxxxx"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Role"
            name="role"
            type="select"
            value={accountForm.role}
            onChange={(e) => setAccountForm({ ...accountForm, role: e.target.value })}
            options={roles}
            required
          />
          <FormInput
            label="Shift"
            name="shift"
            type="select"
            value={accountForm.shift}
            onChange={(e) => setAccountForm({ ...accountForm, shift: e.target.value })}
            options={shifts}
            required
          />
        </div>
        <FormInput
          label="Status"
          name="status"
          type="select"
          value={accountForm.status}
          onChange={(e) => setAccountForm({ ...accountForm, status: e.target.value })}
          options={[
            { value: 'active', label: 'Aktif' },
            { value: 'inactive', label: 'Nonaktif' },
          ]}
        />
      </Modal>

      {/* Account Delete Confirmation */}
      <ConfirmDialog
        isOpen={isAccountDeleteOpen}
        onClose={() => setIsAccountDeleteOpen(false)}
        onConfirm={handleConfirmDeleteAccount}
        title="Hapus Account"
        message={`Apakah Anda yakin ingin menghapus "${selectedAccount?.name}"?`}
        confirmText="Ya, Hapus"
        type="danger"
      />

      {/* Event Modal */}
      <Modal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        title={selectedEvent ? 'Edit Event' : 'Tambah Event'}
        onSubmit={handleEventSubmit}
      >
        <FormInput
          label="Nama Event"
          name="name"
          value={eventForm.name}
          onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
          placeholder="Contoh: Seminar Nasional"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Kategori"
            name="category"
            type="select"
            value={eventForm.category}
            onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
            options={eventCategories}
            required
          />
          <FormInput
            label="Tanggal"
            name="date"
            type="date"
            value={eventForm.date}
            onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
            required
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
      </Modal>

      {/* Event Delete Confirmation */}
      <ConfirmDialog
        isOpen={isEventDeleteOpen}
        onClose={() => setIsEventDeleteOpen(false)}
        onConfirm={handleConfirmDeleteEvent}
        title="Hapus Event"
        message={`Apakah Anda yakin ingin menghapus "${selectedEvent?.name}"?`}
        confirmText="Ya, Hapus"
        type="danger"
      />
    </MainLayout>
  );
};

export default UnitDetail;

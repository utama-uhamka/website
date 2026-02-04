import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import {
  DataTable,
  Modal,
  SearchFilter,
  FormInput,
  StatusBadge,
  ConfirmDialog,
  PageHeader,
} from '../components/ui';
import { FiBell, FiSend, FiUsers, FiMapPin, FiLoader, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import { pushNotificationsAPI, rolesAPI, campusesAPI, usersAPI } from '../services/api';

const PushNotification = () => {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Master data for form
  const [roles, setRoles] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [users, setUsers] = useState([]);
  const [masterLoading, setMasterLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_type: 'all',
    target_ids: [],
  });

  const itemsPerPage = 10;

  // Load push notification logs
  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchValue,
        ...filterValues,
      };
      const response = await pushNotificationsAPI.getAll(params);
      if (response.data.success) {
        setLogs(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchValue, filterValues]);

  // Load stats
  const loadStats = useCallback(async () => {
    try {
      const response = await pushNotificationsAPI.getStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }, []);

  // Load master data
  const loadMasterData = useCallback(async () => {
    setMasterLoading(true);
    try {
      const [rolesRes, campusesRes, usersRes] = await Promise.all([
        rolesAPI.getAll({ limit: 100 }),
        campusesAPI.getAll({ limit: 100 }),
        usersAPI.getAll({ limit: 100, is_active: 1 }),
      ]);

      if (rolesRes.data.success) {
        setRoles(rolesRes.data.data);
      }
      if (campusesRes.data.success) {
        setCampuses(campusesRes.data.data);
      }
      if (usersRes.data.success) {
        setUsers(usersRes.data.data);
      }
    } catch (error) {
      console.error('Failed to load master data:', error);
    } finally {
      setMasterLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  useEffect(() => {
    loadStats();
    loadMasterData();
  }, [loadStats, loadMasterData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, filterValues]);

  const columns = [
    {
      key: 'title',
      label: 'Notifikasi',
      render: (value, item) => (
        <div>
          <p className="font-medium text-gray-800">{value}</p>
          <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
        </div>
      ),
    },
    {
      key: 'target_type',
      label: 'Target',
      width: '130px',
      render: (value) => {
        const targetLabels = {
          all: { label: 'Semua User', icon: FiUsers, color: 'bg-blue-100 text-blue-700' },
          roles: { label: 'Role', icon: FiUsers, color: 'bg-purple-100 text-purple-700' },
          units: { label: 'Unit', icon: FiMapPin, color: 'bg-green-100 text-green-700' },
          users: { label: 'User', icon: FiUsers, color: 'bg-orange-100 text-orange-700' },
        };
        const target = targetLabels[value] || targetLabels.all;
        const Icon = target.icon;
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${target.color}`}>
            <Icon size={12} />
            {target.label}
          </span>
        );
      },
    },
    {
      key: 'total_recipients',
      label: 'Penerima',
      width: '100px',
      render: (value, item) => (
        <div className="text-center">
          <p className="font-semibold text-gray-800">{value}</p>
          <p className="text-xs text-gray-500">
            <span className="text-green-600">{item.success_count}</span>
            {' / '}
            <span className="text-red-600">{item.failure_count}</span>
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '100px',
      render: (value) => {
        const statusConfig = {
          sent: { label: 'Terkirim', variant: 'success' },
          pending: { label: 'Menunggu', variant: 'warning' },
          failed: { label: 'Gagal', variant: 'danger' },
          partial: { label: 'Sebagian', variant: 'warning' },
        };
        const config = statusConfig[value] || statusConfig.pending;
        return <StatusBadge status={config.variant} label={config.label} />;
      },
    },
    {
      key: 'sender',
      label: 'Pengirim',
      width: '150px',
      render: (value) => value?.full_name || '-',
    },
    {
      key: 'createdAt',
      label: 'Tanggal',
      width: '130px',
      render: (value) => {
        const date = new Date(value);
        return (
          <div>
            <p className="text-sm">{date.toLocaleDateString('id-ID')}</p>
            <p className="text-xs text-gray-500">{date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        );
      },
    },
  ];

  const filters = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'sent', label: 'Terkirim' },
        { value: 'pending', label: 'Menunggu' },
        { value: 'failed', label: 'Gagal' },
        { value: 'partial', label: 'Sebagian' },
      ],
    },
    {
      key: 'target_type',
      label: 'Target',
      options: [
        { value: 'all', label: 'Semua User' },
        { value: 'roles', label: 'Role' },
        { value: 'units', label: 'Unit' },
        { value: 'users', label: 'User' },
      ],
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleAdd = () => {
    setFormData({
      title: '',
      description: '',
      target_type: 'all',
      target_ids: [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.error('Judul notifikasi harus diisi');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Deskripsi notifikasi harus diisi');
      return;
    }
    if (formData.target_type !== 'all' && formData.target_ids.length === 0) {
      toast.error('Pilih minimal 1 target');
      return;
    }

    setFormLoading(true);
    try {
      const response = await pushNotificationsAPI.send(formData);
      if (response.data.success) {
        toast.success(response.data.message || 'Notifikasi berhasil dikirim');
        setIsModalOpen(false);
        loadLogs();
        loadStats();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengirim notifikasi');
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await pushNotificationsAPI.delete(selectedItem.log_id);
      if (response.data.success) {
        toast.success('Log notifikasi berhasil dihapus');
        setIsDeleteOpen(false);
        loadLogs();
        loadStats();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus log');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Reset target_ids when target_type changes
    if (name === 'target_type') {
      setFormData((prev) => ({ ...prev, target_ids: [] }));
    }
  };

  const handleTargetSelect = (id) => {
    setFormData((prev) => {
      const isSelected = prev.target_ids.includes(id);
      if (isSelected) {
        return { ...prev, target_ids: prev.target_ids.filter((i) => i !== id) };
      } else {
        return { ...prev, target_ids: [...prev.target_ids, id] };
      }
    });
  };

  // Get options based on target type
  const getTargetOptions = () => {
    switch (formData.target_type) {
      case 'roles':
        return roles.map((r) => ({ id: r.role_id, label: r.role_name }));
      case 'units':
        return campuses.map((c) => ({ id: c.campus_id, label: c.campus_name }));
      case 'users':
        return users.map((u) => ({ id: u.user_id, label: `${u.full_name} (${u.email})` }));
      default:
        return [];
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Push Notification"
        subtitle="Kirim notifikasi ke pengguna mobile"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Push Notification' },
        ]}
      />

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FiSend className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalSent}</p>
                <p className="text-xs text-gray-500">Total Terkirim</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <FiCheckCircle className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalSuccess}</p>
                <p className="text-xs text-gray-500">Berhasil</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <FiXCircle className="text-red-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalFailed}</p>
                <p className="text-xs text-gray-500">Gagal</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <FiClock className="text-yellow-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalPending}</p>
                <p className="text-xs text-gray-500">Menunggu</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari judul notifikasi..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onAdd={handleAdd}
        addLabel="Kirim Notifikasi"
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={logs}
          onDelete={handleDelete}
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          actionColumn={{ edit: false, delete: true, view: false }}
        />
      )}

      {/* Send Notification Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Kirim Push Notification"
        onSubmit={handleSubmit}
        size="lg"
        loading={formLoading}
        submitLabel="Kirim Notifikasi"
      >
        <div className="space-y-4">
          <FormInput
            label="Judul Notifikasi"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Masukkan judul notifikasi"
            required
          />

          <FormInput
            label="Deskripsi"
            name="description"
            type="textarea"
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Masukkan deskripsi notifikasi"
            required
          />

          <FormInput
            label="Target Penerima"
            name="target_type"
            type="select"
            value={formData.target_type}
            onChange={handleInputChange}
            options={[
              { value: 'all', label: 'Semua User' },
              { value: 'roles', label: 'Berdasarkan Role' },
              { value: 'units', label: 'Berdasarkan Unit' },
              { value: 'users', label: 'User Tertentu' },
            ]}
            required
          />

          {formData.target_type !== 'all' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih {formData.target_type === 'roles' ? 'Role' : formData.target_type === 'units' ? 'Unit' : 'User'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              {masterLoading ? (
                <div className="flex items-center justify-center py-4">
                  <FiLoader className="w-5 h-5 animate-spin text-primary" />
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
                  {getTargetOptions().map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                        formData.target_ids.includes(option.id)
                          ? 'bg-primary/10 border border-primary/30'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.target_ids.includes(option.id)}
                        onChange={() => handleTargetSelect(option.id)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              )}
              {formData.target_ids.length > 0 && (
                <p className="mt-2 text-xs text-gray-500">
                  {formData.target_ids.length} {formData.target_type === 'roles' ? 'role' : formData.target_type === 'units' ? 'unit' : 'user'} dipilih
                </p>
              )}
            </div>
          )}

          {formData.target_type === 'all' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                <FiBell className="inline-block mr-1" />
                Notifikasi akan dikirim ke semua pengguna yang memiliki token FCM aktif.
              </p>
            </div>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Log Notifikasi"
        message={`Apakah Anda yakin ingin menghapus log notifikasi "${selectedItem?.title}"?`}
        confirmText="Ya, Hapus"
        type="danger"
      />
    </MainLayout>
  );
};

export default PushNotification;

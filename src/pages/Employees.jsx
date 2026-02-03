import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
  AvatarWithFallback,
} from '../components/ui';
import { FiUsers, FiMapPin, FiLoader } from 'react-icons/fi';
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

const Employees = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: users, pagination, loading, error, success, stats } = useSelector((state) => state.users);
  const { data: campuses } = useSelector((state) => state.campuses);
  const { roles } = useSelector((state) => state.master);

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
    phone: '',
    role_id: '',
    campus_id: '',
    password: '',
    is_active: 1,
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
            <p className="text-xs text-gray-500">{row.email || '-'}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone', label: 'Telepon', width: '140px', render: (value) => value || '-' },
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
      phone: '',
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
      phone: item.phone || '',
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
        phone: formData.phone,
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

  // Stats from API or count from current data
  const totalEmployees = stats?.total || pagination.total || 0;
  const activeEmployees = stats?.active || users.filter((e) => e.is_active === 1).length;
  const unitCount = stats?.unitCount || [...new Set(users.map((e) => e.campus_id).filter(Boolean))].length;

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
              <FiUsers className="w-6 h-6 text-green-600" />
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

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari nama atau email karyawan..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onAdd={handleAdd}
        addLabel="Tambah Karyawan"
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
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Karyawan' : 'Tambah Karyawan'}
        onSubmit={handleSubmit}
        loading={formLoading}
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
            placeholder="email@uhamka.ac.id"
            required
          />
          <FormInput
            label="No. Telepon"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="08xxxxxxxxxx"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Role"
            name="role_id"
            type="select"
            value={formData.role_id}
            onChange={handleInputChange}
            options={roleOptions}
            required
          />
          <FormInput
            label="Unit"
            name="campus_id"
            type="select"
            value={formData.campus_id}
            onChange={handleInputChange}
            options={campusOptions}
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
            placeholder="********"
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

import { useState, useEffect, useCallback } from 'react';
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
import { FiUser, FiLoader } from 'react-icons/fi';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  clearUsersError,
  clearUsersSuccess,
} from '../store/usersSlice';
import { fetchCampuses } from '../store/campusesSlice';
import { fetchRoles, fetchShifts } from '../store/masterSlice';

const Users = () => {
  const dispatch = useDispatch();
  const { data: users, pagination, loading, error, success } = useSelector((state) => state.users);
  const { data: campuses } = useSelector((state) => state.campuses);
  const { roles, shifts } = useSelector((state) => state.master);

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
    shift_id: '',
    campus_id: '',
    password: '',
    position: '',
    is_active: 1,
  });

  const itemsPerPage = 10;

  // Load data on mount and when filters change
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

  // Load master data
  useEffect(() => {
    dispatch(fetchCampuses({ limit: 100 }));
    dispatch(fetchRoles({ limit: 100 }));
    dispatch(fetchShifts({ limit: 100 }));
  }, [dispatch]);

  // Handle success/error messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearUsersError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearUsersSuccess());
      loadUsers();
    }
  }, [success, dispatch, loadUsers]);

  // Reset page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, filterValues]);

  // Convert master data to options format
  const roleOptions = roles.data.map((r) => ({
    value: r.role_id?.toString(),
    label: r.role_name,
  }));

  const shiftOptions = shifts.data.map((s) => ({
    value: s.shift_id?.toString(),
    label: s.shift_name,
  }));

  const campusOptions = campuses.map((c) => ({
    value: c.campus_id?.toString(),
    label: c.campus_name,
  }));

  const columns = [
    {
      key: 'full_name',
      label: 'User',
      render: (value, item) => (
        <div className="flex items-center gap-3">
          <AvatarWithFallback src={item.photo_1} alt={value} size={40} />
          <div>
            <p className="font-medium text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">{item.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone', label: 'Telepon', width: '130px' },
    {
      key: 'role',
      label: 'Role',
      width: '130px',
      render: (value, item) => (
        <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full whitespace-nowrap">
          {item.role?.role_name || '-'}
        </span>
      ),
    },
    {
      key: 'shift',
      label: 'Shift',
      width: '120px',
      render: (value, item) => item.shift?.shift_name || '-',
    },
    {
      key: 'campus',
      label: 'Unit',
      width: '130px',
      render: (value, item) => item.campus?.campus_name || '-',
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
      key: 'role_id',
      label: 'Role',
      options: roleOptions,
    },
    {
      key: 'campus_id',
      label: 'Unit',
      options: campusOptions,
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
      shift_id: '',
      campus_id: '',
      password: '',
      position: '',
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
      shift_id: item.shift_id?.toString() || '',
      campus_id: item.campus_id?.toString() || '',
      password: '',
      position: item.position || '',
      is_active: item.is_active,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async () => {
    setFormLoading(true);
    try {
      const submitData = { ...formData };

      // Convert to numbers
      if (submitData.role_id) submitData.role_id = parseInt(submitData.role_id);
      if (submitData.shift_id) submitData.shift_id = parseInt(submitData.shift_id);
      if (submitData.campus_id) submitData.campus_id = parseInt(submitData.campus_id);

      // Remove password if empty on update
      if (selectedItem && !submitData.password) {
        delete submitData.password;
      }

      if (selectedItem) {
        await dispatch(updateUser({ id: selectedItem.user_id, data: submitData })).unwrap();
      } else {
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

  return (
    <MainLayout>
      <PageHeader
        title="Manajemen User"
        subtitle="Kelola pengguna sistem"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'User Management', path: null },
          { label: 'Users' },
        ]}
      />

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari nama atau email..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onAdd={handleAdd}
        addLabel="Tambah User"
        showExport={true}
        onExport={() => console.log('Export users')}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit User' : 'Tambah User'}
        onSubmit={handleSubmit}
        size="lg"
        loading={formLoading}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Nama Lengkap"
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
            placeholder="Masukkan nama lengkap"
            required
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="email@uhamka.ac.id"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="No. Telepon"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="08xxxxxxxxxx"
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder={selectedItem ? 'Kosongkan jika tidak diubah' : 'Masukkan password'}
            required={!selectedItem}
            helperText={selectedItem ? 'Kosongkan jika tidak ingin mengubah password' : ''}
          />
        </div>
        <FormInput
          label="Jabatan/Posisi"
          name="position"
          value={formData.position}
          onChange={handleInputChange}
          placeholder="Masukkan jabatan/posisi"
        />
        <div className="grid grid-cols-3 gap-4">
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
            label="Shift"
            name="shift_id"
            type="select"
            value={formData.shift_id}
            onChange={handleInputChange}
            options={shiftOptions}
          />
          <FormInput
            label="Unit"
            name="campus_id"
            type="select"
            value={formData.campus_id}
            onChange={handleInputChange}
            options={campusOptions}
          />
        </div>
        <FormInput
          label="Status"
          name="is_active"
          type="select"
          value={formData.is_active?.toString()}
          onChange={(e) => setFormData(prev => ({ ...prev, is_active: parseInt(e.target.value) }))}
          options={[
            { value: '1', label: 'Aktif' },
            { value: '0', label: 'Nonaktif' },
          ]}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus User"
        message={`Apakah Anda yakin ingin menghapus user "${selectedItem?.full_name}"? Semua data terkait user ini akan ikut terhapus.`}
        confirmText="Ya, Hapus"
        type="danger"
        loading={loading}
      />
    </MainLayout>
  );
};

export default Users;

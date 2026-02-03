import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import MainLayout from '../../layouts/MainLayout';
import {
  DataTable,
  Modal,
  SearchFilter,
  FormInput,
  StatusBadge,
  ConfirmDialog,
  PageHeader,
} from '../../components/ui';
import { FiLoader } from 'react-icons/fi';
import {
  fetchRoles,
  createRole,
  updateRole,
  deleteRole,
  clearMasterError,
  clearMasterSuccess,
} from '../../store/masterSlice';

const Roles = () => {
  const dispatch = useDispatch();
  const { roles, loading, error, success } = useSelector((state) => state.master);

  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    role_name: '',
    description: '',
    is_active: 1,
  });

  const itemsPerPage = 10;

  // Load roles
  const loadRoles = useCallback(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchValue,
      ...filterValues,
    };
    dispatch(fetchRoles(params));
  }, [dispatch, currentPage, itemsPerPage, searchValue, filterValues]);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearMasterError());
    }
  }, [error, dispatch]);

  // Handle success
  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearMasterSuccess());
      loadRoles();
    }
  }, [success, dispatch, loadRoles]);

  // Reset page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, filterValues]);

  const columns = [
    { key: 'role_name', label: 'Nama Role' },
    { key: 'description', label: 'Deskripsi' },
    {
      key: 'user_count',
      label: 'Jumlah User',
      width: '120px',
      render: (value) => value || 0,
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
    setFormData({ role_name: '', description: '', is_active: 1 });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      role_name: item.role_name || '',
      description: item.description || '',
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
      const submitData = {
        ...formData,
        is_active: parseInt(formData.is_active),
      };

      if (selectedItem) {
        await dispatch(updateRole({ id: selectedItem.role_id, data: submitData })).unwrap();
      } else {
        await dispatch(createRole(submitData)).unwrap();
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
      await dispatch(deleteRole(selectedItem.role_id)).unwrap();
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
        title="Roles"
        subtitle="Kelola role dan hak akses pengguna"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Master Data', path: null },
          { label: 'Roles' },
        ]}
      />

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari nama role..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onAdd={handleAdd}
        addLabel="Tambah Role"
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={roles.data}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentPage={roles.pagination.page}
          totalPages={roles.pagination.totalPages}
          totalItems={roles.pagination.total}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Role' : 'Tambah Role'}
        onSubmit={handleSubmit}
        loading={formLoading}
        size="md"
      >
        <FormInput
          label="Nama Role"
          name="role_name"
          value={formData.role_name}
          onChange={handleInputChange}
          placeholder="Contoh: Admin"
          required
        />
        <FormInput
          label="Deskripsi"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Deskripsi role dan tanggung jawabnya"
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
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Role"
        message={`Apakah Anda yakin ingin menghapus role "${selectedItem?.role_name}"? User dengan role ini akan kehilangan aksesnya.`}
        confirmText="Ya, Hapus"
        type="danger"
        loading={loading}
      />
    </MainLayout>
  );
};

export default Roles;

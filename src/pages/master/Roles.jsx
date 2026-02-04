import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import MainLayout from '../../layouts/MainLayout';
import {
  DataTable,
  Modal,
  SearchFilter,
  FormInput,
  ConfirmDialog,
  PageHeader,
} from '../../components/ui';
import { FiLoader, FiLock } from 'react-icons/fi';
import {
  fetchRoles,
  createRole,
  updateRole,
  deleteRole,
  clearMasterError,
  clearMasterSuccess,
} from '../../store/masterSlice';

// Protected role IDs that cannot be deleted
const PROTECTED_ROLE_IDS = [1, 2, 3, 4];

const Roles = () => {
  const dispatch = useDispatch();
  const { roles, loading, error, success } = useSelector((state) => state.master);

  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    role_name: '',
    description: '',
  });

  const itemsPerPage = 10;

  // Load roles
  const loadRoles = useCallback(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchValue,
    };
    dispatch(fetchRoles(params));
  }, [dispatch, currentPage, itemsPerPage, searchValue]);

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

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  const columns = [
    {
      key: 'role_id',
      label: 'ID',
      width: '80px',
      render: (value) => (
        <div className="flex items-center gap-2">
          <span className="font-mono">{value}</span>
          {PROTECTED_ROLE_IDS.includes(value) && (
            <FiLock className="w-3.5 h-3.5 text-gray-400" title="Role ini tidak dapat dihapus" />
          )}
        </div>
      ),
    },
    { key: 'role_name', label: 'Nama Role' },
    { key: 'description', label: 'Deskripsi', render: (value) => value || '-' },
    {
      key: 'userCount',
      label: 'Jumlah User',
      width: '120px',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
          {value || 0} User
        </span>
      ),
    },
  ];

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({ role_name: '', description: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      role_name: item.role_name || '',
      description: item.description || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    // Check if role is protected
    if (PROTECTED_ROLE_IDS.includes(item.role_id)) {
      toast.error('Role ini tidak dapat dihapus karena merupakan role default sistem');
      return;
    }
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.role_name.trim()) {
      toast.error('Nama role wajib diisi');
      return;
    }

    setFormLoading(true);
    try {
      if (selectedItem) {
        await dispatch(updateRole({ id: selectedItem.role_id, data: formData })).unwrap();
      } else {
        await dispatch(createRole(formData)).unwrap();
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

  // Custom check for delete button visibility
  const canDelete = (item) => !PROTECTED_ROLE_IDS.includes(item.role_id);

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
          canDelete={canDelete}
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
          placeholder="Contoh: Manager"
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

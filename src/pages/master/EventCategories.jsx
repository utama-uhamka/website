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
  fetchEventCategories,
  createEventCategory,
  updateEventCategory,
  deleteEventCategory,
  clearMasterError,
  clearMasterSuccess,
} from '../../store/masterSlice';

const EventCategories = () => {
  const dispatch = useDispatch();
  const { eventCategories, loading, error, success } = useSelector((state) => state.master);

  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    category_name: '',
    color: '#4A22AD',
    description: '',
    is_active: 1,
  });

  const itemsPerPage = 10;

  // Predefined colors
  const colorOptions = [
    { value: '#4A22AD', label: 'Ungu' },
    { value: '#2563EB', label: 'Biru' },
    { value: '#059669', label: 'Hijau' },
    { value: '#DC2626', label: 'Merah' },
    { value: '#D97706', label: 'Orange' },
    { value: '#7C3AED', label: 'Violet' },
    { value: '#0891B2', label: 'Cyan' },
    { value: '#6B7280', label: 'Abu-abu' },
  ];

  // Load event categories
  const loadEventCategories = useCallback(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchValue,
      ...filterValues,
    };
    dispatch(fetchEventCategories(params));
  }, [dispatch, currentPage, itemsPerPage, searchValue, filterValues]);

  useEffect(() => {
    loadEventCategories();
  }, [loadEventCategories]);

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
      loadEventCategories();
    }
  }, [success, dispatch, loadEventCategories]);

  // Reset page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, filterValues]);

  const columns = [
    {
      key: 'color',
      label: 'Warna',
      width: '80px',
      render: (value) => (
        <div className="flex items-center justify-center">
          <div
            className="w-6 h-6 rounded-full border-2 border-white shadow"
            style={{ backgroundColor: value || '#6B7280' }}
          ></div>
        </div>
      ),
    },
    { key: 'category_name', label: 'Nama Kategori' },
    { key: 'description', label: 'Deskripsi' },
    {
      key: 'event_count',
      label: 'Jumlah Event',
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
    setFormData({ category_name: '', color: '#4A22AD', description: '', is_active: 1 });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      category_name: item.category_name || '',
      color: item.color || '#4A22AD',
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
        await dispatch(updateEventCategory({ id: selectedItem.event_category_id, data: submitData })).unwrap();
      } else {
        await dispatch(createEventCategory(submitData)).unwrap();
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
      await dispatch(deleteEventCategory(selectedItem.event_category_id)).unwrap();
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
        title="Kategori Event"
        subtitle="Kelola kategori untuk event dan kegiatan"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Master Data', path: null },
          { label: 'Kategori Event' },
        ]}
      />

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari nama kategori..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onAdd={handleAdd}
        addLabel="Tambah Kategori"
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={eventCategories.data}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentPage={eventCategories.pagination.page}
          totalPages={eventCategories.pagination.totalPages}
          totalItems={eventCategories.pagination.total}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Kategori' : 'Tambah Kategori'}
        onSubmit={handleSubmit}
        loading={formLoading}
      >
        <FormInput
          label="Nama Kategori"
          name="category_name"
          value={formData.category_name}
          onChange={handleInputChange}
          placeholder="Contoh: Seminar"
          required
        />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Warna <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg border-2 border-gray-200"
              style={{ backgroundColor: formData.color }}
            ></div>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, color: color.value }))}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${
                    formData.color === color.value
                      ? 'border-gray-800 scale-110'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                ></button>
              ))}
            </div>
          </div>
        </div>
        <FormInput
          label="Deskripsi"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Deskripsi kategori event"
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
        title="Hapus Kategori"
        message={`Apakah Anda yakin ingin menghapus "${selectedItem?.category_name}"? Event dengan kategori ini akan perlu dipindahkan.`}
        confirmText="Ya, Hapus"
        type="danger"
        loading={loading}
      />
    </MainLayout>
  );
};

export default EventCategories;

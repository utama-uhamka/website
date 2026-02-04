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
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    category_name: '',
    description: '',
  });

  const itemsPerPage = 10;

  // Load event categories
  const loadEventCategories = useCallback(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchValue,
    };
    dispatch(fetchEventCategories(params));
  }, [dispatch, currentPage, itemsPerPage, searchValue]);

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

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  const columns = [
    {
      key: 'event_category_id',
      label: 'ID',
      width: '80px',
      render: (value) => <span className="font-mono">{value}</span>,
    },
    { key: 'category_name', label: 'Nama Kategori' },
    { key: 'description', label: 'Deskripsi', render: (value) => value || '-' },
    {
      key: 'eventCount',
      label: 'Jumlah Event',
      width: '120px',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
          {value || 0} Event
        </span>
      ),
    },
  ];

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({ category_name: '', description: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      category_name: item.category_name || '',
      description: item.description || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.category_name.trim()) {
      toast.error('Nama kategori wajib diisi');
      return;
    }

    setFormLoading(true);
    try {
      if (selectedItem) {
        await dispatch(updateEventCategory({ id: selectedItem.event_category_id, data: formData })).unwrap();
      } else {
        await dispatch(createEventCategory(formData)).unwrap();
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
          currentPage={eventCategories.pagination?.page || 1}
          totalPages={eventCategories.pagination?.totalPages || 1}
          totalItems={eventCategories.pagination?.total || 0}
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
        <FormInput
          label="Deskripsi"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Deskripsi kategori event"
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

import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import {
  DataTable,
  Modal,
  SearchFilter,
  FormInput,
  ConfirmDialog,
  PageHeader,
  StatusBadge,
} from '../components/ui';
import { FiLoader, FiImage } from 'react-icons/fi';
import {
  fetchBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerActive,
  clearMasterError,
  clearMasterSuccess,
} from '../store/masterSlice';

const Banners = () => {
  const dispatch = useDispatch();
  const { banners, loading, error, success } = useSelector((state) => state.master);

  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    link_url: '',
    sort_order: 0,
  });

  const itemsPerPage = 10;

  const loadBanners = useCallback(() => {
    dispatch(fetchBanners({
      page: currentPage,
      limit: itemsPerPage,
      search: searchValue,
    }));
  }, [dispatch, currentPage, itemsPerPage, searchValue]);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearMasterError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearMasterSuccess());
      loadBanners();
    }
  }, [success, dispatch, loadBanners]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  const columns = [
    {
      key: 'image',
      label: 'Gambar',
      width: '120px',
      render: (value) => value ? (
        <img src={value} alt="Banner" className="w-24 h-14 object-cover rounded-lg border" onError={(e) => { e.target.style.display = 'none'; }} />
      ) : (
        <div className="w-24 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
          <FiImage className="text-gray-400" size={20} />
        </div>
      ),
    },
    { key: 'title', label: 'Judul' },
    {
      key: 'link_url',
      label: 'Link URL',
      render: (value) => value ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm truncate block max-w-[200px]">
          {value}
        </a>
      ) : '-',
    },
    {
      key: 'sort_order',
      label: 'Urutan',
      width: '80px',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          {value}
        </span>
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      width: '100px',
      render: (value, row) => (
        <button
          onClick={(e) => { e.stopPropagation(); handleToggleActive(row); }}
          className="cursor-pointer"
        >
          <StatusBadge status={value === 1 ? 'active' : 'inactive'} label={value === 1 ? 'Aktif' : 'Nonaktif'} />
        </button>
      ),
    },
  ];

  const handleToggleActive = async (item) => {
    try {
      await dispatch(toggleBannerActive(item.banner_id)).unwrap();
    } catch (err) {
      // Error handled by slice
    }
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({ title: '', link_url: '', sort_order: 0 });
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      title: item.title || '',
      link_url: item.link_url || '',
      sort_order: item.sort_order || 0,
    });
    setImagePreview(item.image || null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.error('Judul banner wajib diisi');
      return;
    }

    const file = fileInputRef.current?.files?.[0];
    if (!selectedItem && !file) {
      toast.error('Gambar banner wajib diupload');
      return;
    }

    setFormLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('link_url', formData.link_url || '');
      fd.append('sort_order', formData.sort_order);
      if (file) fd.append('image', file);

      if (selectedItem) {
        await dispatch(updateBanner({ id: selectedItem.banner_id, data: fd })).unwrap();
      } else {
        await dispatch(createBanner(fd)).unwrap();
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
      await dispatch(deleteBanner(selectedItem.banner_id)).unwrap();
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
        title="Banner"
        subtitle="Kelola banner yang ditampilkan di aplikasi mobile"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Banner' },
        ]}
      />

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari judul banner..."
        onAdd={handleAdd}
        addLabel="Tambah Banner"
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={banners.data}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentPage={banners.pagination?.page || 1}
          totalPages={banners.pagination?.totalPages || 1}
          totalItems={banners.pagination?.total || 0}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Banner' : 'Tambah Banner'}
        onSubmit={handleSubmit}
        loading={formLoading}
      >
        <FormInput
          label="Judul Banner"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Masukkan judul banner"
          required
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gambar Banner {!selectedItem && <span className="text-red-500">*</span>}
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleImageChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
          />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="mt-2 w-full h-40 object-cover rounded-lg border" />
          )}
        </div>

        <FormInput
          label="Link URL (opsional)"
          name="link_url"
          type="url"
          value={formData.link_url}
          onChange={handleInputChange}
          placeholder="https://contoh.com"
        />

        <FormInput
          label="Urutan Tampil"
          name="sort_order"
          type="number"
          value={formData.sort_order}
          onChange={handleInputChange}
          placeholder="0"
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Banner"
        message={`Apakah Anda yakin ingin menghapus banner "${selectedItem?.title}"?`}
        confirmText="Ya, Hapus"
        type="danger"
        loading={loading}
      />
    </MainLayout>
  );
};

export default Banners;

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { FiLoader, FiUpload, FiX, FiImage } from 'react-icons/fi';
import { convertToWebP, validateImageFile } from '../../utils/imageUtils';
import {
  fetchCategoryItems,
  createCategoryItem,
  updateCategoryItem,
  deleteCategoryItem,
  clearMasterError,
  clearMasterSuccess,
} from '../../store/masterSlice';

const CategoryItems = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categoryItems, loading, error, success } = useSelector((state) => state.master);

  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    category_item_name: '',
    type: 'Item',
  });

  // Image states
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const photoInputRef = useRef(null);

  const itemsPerPage = 10;

  const typeOptions = [
    { value: 'Item', label: 'Item' },
    { value: 'Billing', label: 'Billing' },
  ];

  // Load category items
  const loadCategoryItems = useCallback(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchValue,
      ...filterValues,
    };
    dispatch(fetchCategoryItems(params));
  }, [dispatch, currentPage, itemsPerPage, searchValue, filterValues]);

  useEffect(() => {
    loadCategoryItems();
  }, [loadCategoryItems]);

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
      loadCategoryItems();
    }
  }, [success, dispatch, loadCategoryItems]);

  // Reset page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, filterValues]);

  const columns = [
    { key: 'category_item_id', label: 'ID', width: '120px' },
    { key: 'category_item_name', label: 'Nama Kategori' },
    {
      key: 'type',
      label: 'Tipe',
      width: '100px',
      render: (value) => (
        <StatusBadge
          status={value === 'Item' ? 'info' : 'warning'}
          label={value}
        />
      ),
    },
    {
      key: 'itemCount',
      label: 'Jumlah Item',
      width: '120px',
      render: (value) => value || 0,
    },
  ];

  const filters = [
    {
      key: 'type',
      label: 'Tipe',
      options: typeOptions,
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setFormData({
      category_item_name: '',
      type: 'Item',
    });
    setPhotoFile(null);
    setPhotoPreview('');
  };

  const handleAdd = () => {
    setSelectedItem(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      category_item_name: item.category_item_name || '',
      type: item.type || 'Item',
    });
    setPhotoPreview(item.photo_1 || '');
    setPhotoFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleView = (item) => {
    navigate(`/master/category-items/${item.category_item_id}`);
  };

  // Handle file selection and convert to WebP
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file, 5);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setImageLoading(true);
    try {
      const webpBlob = await convertToWebP(file, 0.8);
      const webpFile = new File([webpBlob], `photo_${Date.now()}.webp`, { type: 'image/webp' });
      const previewUrl = URL.createObjectURL(webpBlob);

      setPhotoFile(webpFile);
      setPhotoPreview(previewUrl);
      toast.success('Gambar berhasil dikonversi ke WebP');
    } catch (err) {
      toast.error(err.message || 'Gagal memproses gambar');
    } finally {
      setImageLoading(false);
    }
  };

  const removeImage = () => {
    setPhotoFile(null);
    setPhotoPreview('');
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const validateForm = () => {
    if (!formData.category_item_name.trim()) {
      toast.error('Nama kategori wajib diisi');
      return false;
    }
    if (!formData.type) {
      toast.error('Tipe kategori wajib dipilih');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setFormLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('category_item_name', formData.category_item_name);
      submitData.append('type', formData.type);

      if (photoFile) {
        submitData.append('photo_1', photoFile);
      }

      if (selectedItem) {
        await dispatch(updateCategoryItem({ id: selectedItem.category_item_id, data: submitData })).unwrap();
      } else {
        await dispatch(createCategoryItem(submitData)).unwrap();
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      // Error handled by slice
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteCategoryItem(selectedItem.category_item_id)).unwrap();
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
        title="Kategori Item"
        subtitle="Kelola kategori untuk inventaris"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Master Data', path: null },
          { label: 'Kategori Item' },
        ]}
      />

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari nama atau kode kategori..."
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
          data={categoryItems.data}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentPage={categoryItems.pagination.page}
          totalPages={categoryItems.pagination.totalPages}
          totalItems={categoryItems.pagination.total}
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
        title={selectedItem ? 'Edit Kategori' : 'Tambah Kategori'}
        onSubmit={handleSubmit}
        loading={formLoading}
      >
        <FormInput
          label="Nama Kategori"
          name="category_item_name"
          value={formData.category_item_name}
          onChange={handleInputChange}
          placeholder="Contoh: Elektronik"
          required
        />
        <FormInput
          label="Tipe"
          name="type"
          type="select"
          value={formData.type}
          onChange={handleInputChange}
          options={typeOptions}
          required
        />
        {/* Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Foto Kategori
          </label>
          <div className="relative">
            {photoPreview ? (
              <div className="relative group">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg border border-gray-200"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                  >
                    <FiUpload size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => photoInputRef.current?.click()}
                className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
              >
                {imageLoading ? (
                  <FiLoader className="w-8 h-8 animate-spin text-primary" />
                ) : (
                  <>
                    <FiImage className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Klik untuk upload</p>
                    <p className="text-xs text-gray-400">JPG, PNG, GIF (max 5MB)</p>
                  </>
                )}
              </div>
            )}
            <input
              ref={photoInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <p className="text-xs text-gray-500">Gambar akan otomatis dikonversi ke format WebP</p>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Kategori"
        message={`Apakah Anda yakin ingin menghapus "${selectedItem?.category_item_name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        type="danger"
        loading={loading}
      />
    </MainLayout>
  );
};

export default CategoryItems;

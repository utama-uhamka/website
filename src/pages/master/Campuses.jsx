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
  ConfirmDialog,
  PageHeader,
} from '../../components/ui';
import { FiLoader, FiUpload, FiX, FiImage } from 'react-icons/fi';
import {
  fetchCampuses,
  createCampus,
  updateCampus,
  deleteCampus,
  clearCampusesError,
  clearCampusesSuccess,
} from '../../store/campusesSlice';
import { convertToWebP, validateImageFile } from '../../utils/imageUtils';
import logoDefault from '/logo.png';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper function to get image URL
const getImageUrl = (photo) => {
  if (!photo) return logoDefault;
  if (photo.startsWith('http://') || photo.startsWith('https://')) return photo;
  return `${API_BASE_URL.replace('/api/dashboard', '')}/uploads/campuses/${photo}`;
};

const Campuses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: campuses, pagination, loading, error, success } = useSelector((state) => state.campuses);

  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    campus_name: '',
    alamat: '',
    kata_pengantar: '',
  });

  // Image states
  const [photoFile, setPhotoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [coverPreview, setCoverPreview] = useState('');
  const [imageLoading, setImageLoading] = useState({ photo: false, cover: false });

  // File input refs
  const photoInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const itemsPerPage = 10;

  // Load data on mount and when filters change
  const loadCampuses = useCallback(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchValue,
      ...filterValues,
    };
    dispatch(fetchCampuses(params));
  }, [dispatch, currentPage, itemsPerPage, searchValue, filterValues]);

  useEffect(() => {
    loadCampuses();
  }, [loadCampuses]);

  // Handle success/error messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearCampusesError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearCampusesSuccess());
      loadCampuses();
    }
  }, [success, dispatch, loadCampuses]);

  // Reset page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, filterValues]);

  const columns = [
    {
      key: 'photo_1',
      label: 'Foto',
      width: '80px',
      render: (value) => (
        <img
          src={getImageUrl(value)}
          alt="Foto Unit"
          className="w-12 h-12 rounded-lg object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = logoDefault;
          }}
        />
      ),
    },
    { key: 'campus_id', label: 'ID', width: '120px' },
    { key: 'campus_name', label: 'Nama Unit' },
    { key: 'alamat', label: 'Alamat' },
  ];

  const filters = [];

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setFormData({
      campus_name: '',
      alamat: '',
      kata_pengantar: '',
    });
    setPhotoFile(null);
    setCoverFile(null);
    setPhotoPreview('');
    setCoverPreview('');
  };

  const handleAdd = () => {
    setSelectedItem(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      campus_name: item.campus_name || '',
      alamat: item.alamat || '',
      kata_pengantar: item.kata_pengantar || '',
    });
    // Set existing images as preview with full URL
    setPhotoPreview(item.photo_1 ? getImageUrl(item.photo_1) : '');
    setCoverPreview(item.cover ? getImageUrl(item.cover) : '');
    setPhotoFile(null);
    setCoverFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleView = (item) => {
    navigate(`/master/units/${item.campus_id}`);
  };

  // Handle file selection and convert to WebP
  const handleFileChange = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file, 5);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setImageLoading((prev) => ({ ...prev, [type]: true }));

    try {
      // Convert to WebP
      const webpBlob = await convertToWebP(file, 0.8);
      const webpFile = new File([webpBlob], `${type}_${Date.now()}.webp`, { type: 'image/webp' });

      // Create preview URL
      const previewUrl = URL.createObjectURL(webpBlob);

      if (type === 'photo') {
        setPhotoFile(webpFile);
        setPhotoPreview(previewUrl);
      } else {
        setCoverFile(webpFile);
        setCoverPreview(previewUrl);
      }

      toast.success(`Gambar berhasil dikonversi ke WebP`);
    } catch (err) {
      toast.error(err.message || 'Gagal memproses gambar');
    } finally {
      setImageLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const removeImage = (type) => {
    if (type === 'photo') {
      setPhotoFile(null);
      setPhotoPreview('');
      if (photoInputRef.current) photoInputRef.current.value = '';
    } else {
      setCoverFile(null);
      setCoverPreview('');
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  // Validation before submit
  const validateForm = () => {
    if (!formData.campus_name.trim()) {
      toast.error('Nama unit wajib diisi');
      return false;
    }
    if (!formData.alamat.trim()) {
      toast.error('Alamat wajib diisi');
      return false;
    }
    if (!formData.kata_pengantar.trim()) {
      toast.error('Kata pengantar wajib diisi');
      return false;
    }
    // For new entry, both images are required
    if (!selectedItem) {
      if (!photoFile) {
        toast.error('Foto unit wajib diupload');
        return false;
      }
      if (!coverFile) {
        toast.error('Cover unit wajib diupload');
        return false;
      }
    }
    // For edit, check if either new file or existing preview
    if (selectedItem) {
      if (!photoFile && !photoPreview) {
        toast.error('Foto unit wajib diupload');
        return false;
      }
      if (!coverFile && !coverPreview) {
        toast.error('Cover unit wajib diupload');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setFormLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('campus_name', formData.campus_name);
      submitData.append('alamat', formData.alamat);
      submitData.append('kata_pengantar', formData.kata_pengantar);

      // Append image files if new ones are uploaded
      if (photoFile) {
        submitData.append('photo_1', photoFile);
      }
      if (coverFile) {
        submitData.append('cover', coverFile);
      }

      if (selectedItem) {
        await dispatch(updateCampus({ id: selectedItem.campus_id, data: submitData })).unwrap();
      } else {
        await dispatch(createCampus(submitData)).unwrap();
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
      await dispatch(deleteCampus(selectedItem.campus_id)).unwrap();
      setIsDeleteOpen(false);
    } catch (err) {
      // Error handled by slice
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Image Upload Component
  const ImageUpload = ({ label, type, preview, loading: isLoading, inputRef, required }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {preview ? (
          <div className="relative group">
            <img
              src={preview}
              alt={`Preview ${type}`}
              className="w-full h-32 object-cover rounded-lg border border-gray-200"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
              >
                <FiUpload size={16} />
              </button>
              <button
                type="button"
                onClick={() => removeImage(type)}
                className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600"
              >
                <FiX size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => inputRef.current?.click()}
            className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
          >
            {isLoading ? (
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
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={(e) => handleFileChange(e, type)}
          className="hidden"
        />
      </div>
      <p className="text-xs text-gray-500">Gambar akan otomatis dikonversi ke format WebP</p>
    </div>
  );

  return (
    <MainLayout>
      <PageHeader
        title="Unit"
        subtitle="Kelola data unit/kampus universitas"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Master Data', path: null },
          { label: 'Unit' },
        ]}
      />

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari nama atau kode unit..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onAdd={handleAdd}
        addLabel="Tambah Unit"
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={campuses}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          actionColumn={{ view: true, edit: true, delete: true }}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Unit' : 'Tambah Unit'}
        onSubmit={handleSubmit}
        loading={formLoading}
        size="lg"
      >
        <FormInput
          label="Nama Unit"
          name="campus_name"
          value={formData.campus_name}
          onChange={handleInputChange}
          placeholder="Contoh: Unit A - Limau"
          required
        />
        <FormInput
          label="Alamat"
          name="alamat"
          type="textarea"
          value={formData.alamat}
          onChange={handleInputChange}
          placeholder="Masukkan alamat lengkap unit"
          required
        />

        {/* Image Upload Section */}
        <div className="grid grid-cols-2 gap-4">
          <ImageUpload
            label="Foto Unit"
            type="photo"
            preview={photoPreview}
            loading={imageLoading.photo}
            inputRef={photoInputRef}
            required
          />
          <ImageUpload
            label="Cover Unit"
            type="cover"
            preview={coverPreview}
            loading={imageLoading.cover}
            inputRef={coverInputRef}
            required
          />
        </div>

        <FormInput
          label="Kata Pengantar"
          name="kata_pengantar"
          type="textarea"
          value={formData.kata_pengantar}
          onChange={handleInputChange}
          placeholder="Masukkan kata pengantar/deskripsi unit"
          rows={4}
          required
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Unit"
        message={`Apakah Anda yakin ingin menghapus "${selectedItem?.campus_name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        type="danger"
        loading={loading}
      />
    </MainLayout>
  );
};

export default Campuses;

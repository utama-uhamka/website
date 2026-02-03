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
  fetchBuildings,
  createBuilding,
  updateBuilding,
  deleteBuilding,
  clearMasterError,
  clearMasterSuccess,
} from '../../store/masterSlice';
import { fetchCampuses } from '../../store/campusesSlice';
import { convertToWebP, validateImageFile } from '../../utils/imageUtils';

const Buildings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { buildings } = useSelector((state) => state.master);
  const { data: campuses } = useSelector((state) => state.campuses);

  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    building_name: '',
    campus_id: '',
    longitude: '',
    latitude: '',
    radius: '100',
  });

  // Image states
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const photoInputRef = useRef(null);

  const itemsPerPage = 10;

  // Load buildings
  const loadBuildings = useCallback(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchValue,
      ...filterValues,
    };
    dispatch(fetchBuildings(params));
  }, [dispatch, currentPage, itemsPerPage, searchValue, filterValues]);

  useEffect(() => {
    loadBuildings();
  }, [loadBuildings]);

  // Load campuses for dropdown
  useEffect(() => {
    dispatch(fetchCampuses({ limit: 100 }));
  }, [dispatch]);

  // Handle success/error messages
  useEffect(() => {
    if (buildings.error) {
      toast.error(buildings.error);
      dispatch(clearMasterError());
    }
  }, [buildings.error, dispatch]);

  useEffect(() => {
    if (buildings.success) {
      toast.success(buildings.success);
      dispatch(clearMasterSuccess());
      loadBuildings();
    }
  }, [buildings.success, dispatch, loadBuildings]);

  // Reset page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, filterValues]);

  // Convert campuses to options
  const campusOptions = campuses.map((c) => ({
    value: c.campus_id?.toString(),
    label: c.campus_name,
  }));

  const columns = [
    { key: 'building_id', label: 'ID', width: '120px' },
    { key: 'building_name', label: 'Nama Gedung' },
    {
      key: 'campus',
      label: 'Unit',
      render: (value, item) => item.campus?.campus_name || '-',
    },
  ];

  const filters = [
    {
      key: 'campus_id',
      label: 'Unit',
      options: campusOptions,
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setFormData({
      building_name: '',
      campus_id: '',
      longitude: '',
      latitude: '',
      radius: '100',
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
      building_name: item.building_name || '',
      campus_id: item.campus_id?.toString() || '',
      longitude: item.longitude?.toString() || '',
      latitude: item.latitude?.toString() || '',
      radius: item.radius?.toString() || '100',
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
    navigate(`/master/buildings/${item.building_id}`);
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
    if (!formData.campus_id) {
      toast.error('Unit wajib dipilih');
      return false;
    }
    if (!formData.building_name.trim()) {
      toast.error('Nama gedung wajib diisi');
      return false;
    }
    if (!selectedItem && !photoFile) {
      toast.error('Foto gedung wajib diupload');
      return false;
    }
    if (selectedItem && !photoFile && !photoPreview) {
      toast.error('Foto gedung wajib diupload');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setFormLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('building_name', formData.building_name);
      submitData.append('campus_id', formData.campus_id);
      if (formData.longitude) submitData.append('longitude', formData.longitude);
      if (formData.latitude) submitData.append('latitude', formData.latitude);
      if (formData.radius) submitData.append('radius', formData.radius);

      if (photoFile) {
        submitData.append('photo_1', photoFile);
      }

      if (selectedItem) {
        await dispatch(updateBuilding({ id: selectedItem.building_id, data: submitData })).unwrap();
      } else {
        await dispatch(createBuilding(submitData)).unwrap();
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
      await dispatch(deleteBuilding(selectedItem.building_id)).unwrap();
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
  const ImageUpload = () => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Foto Gedung <span className="text-red-500">*</span>
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
  );

  return (
    <MainLayout>
      <PageHeader
        title="Gedung"
        subtitle="Kelola data gedung di setiap unit"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Master Data', path: null },
          { label: 'Gedung' },
        ]}
      />

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari nama gedung..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onAdd={handleAdd}
        addLabel="Tambah Gedung"
      />

      {buildings.loading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={buildings.data}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentPage={buildings.pagination.page}
          totalPages={buildings.pagination.totalPages}
          totalItems={buildings.pagination.total}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          actionColumn={{ view: true, edit: true, delete: true }}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Gedung' : 'Tambah Gedung'}
        onSubmit={handleSubmit}
        loading={formLoading}
      >
        <FormInput
          label="Unit"
          name="campus_id"
          type="select"
          value={formData.campus_id}
          onChange={handleInputChange}
          options={campusOptions}
          required
        />
        <FormInput
          label="Nama Gedung"
          name="building_name"
          value={formData.building_name}
          onChange={handleInputChange}
          placeholder="Contoh: Gedung Rektorat"
          required
        />
        <div className="grid grid-cols-3 gap-4">
          <FormInput
            label="Longitude"
            name="longitude"
            type="number"
            step="0.000000001"
            value={formData.longitude}
            onChange={handleInputChange}
            placeholder="Contoh: 106.845599"
          />
          <FormInput
            label="Latitude"
            name="latitude"
            type="number"
            step="0.000000001"
            value={formData.latitude}
            onChange={handleInputChange}
            placeholder="Contoh: -6.208763"
          />
          <FormInput
            label="Radius (meter)"
            name="radius"
            type="number"
            value={formData.radius}
            onChange={handleInputChange}
            placeholder="Contoh: 100"
          />
        </div>
        <ImageUpload />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Gedung"
        message={`Apakah Anda yakin ingin menghapus "${selectedItem?.building_name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        type="danger"
        loading={buildings.loading}
      />
    </MainLayout>
  );
};

export default Buildings;

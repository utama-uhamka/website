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
  fetchRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  clearMasterError,
  clearMasterSuccess,
  fetchFloors,
} from '../../store/masterSlice';
import { convertToWebP, validateImageFile } from '../../utils/imageUtils';

const Rooms = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { rooms, floors } = useSelector((state) => state.master);

  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    room_name: '',
    floor_id: '',
  });

  // Image states
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const photoInputRef = useRef(null);

  const itemsPerPage = 10;

  // Load rooms
  const loadRooms = useCallback(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchValue,
      ...filterValues,
    };
    dispatch(fetchRooms(params));
  }, [dispatch, currentPage, itemsPerPage, searchValue, filterValues]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  // Load floors for dropdown
  useEffect(() => {
    dispatch(fetchFloors({ limit: 100 }));
  }, [dispatch]);

  // Handle success/error messages
  useEffect(() => {
    if (rooms.error) {
      toast.error(rooms.error);
      dispatch(clearMasterError());
    }
  }, [rooms.error, dispatch]);

  useEffect(() => {
    if (rooms.success) {
      toast.success(rooms.success);
      dispatch(clearMasterSuccess());
      loadRooms();
    }
  }, [rooms.success, dispatch, loadRooms]);

  // Reset page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, filterValues]);

  // Convert floors to options
  const floorOptions = floors.data.map((f) => ({
    value: f.floor_id?.toString(),
    label: `${f.floor_name} - ${f.building?.building_name || ''}`,
  }));

  const columns = [
    { key: 'room_id', label: 'ID', width: '120px' },
    { key: 'room_name', label: 'Nama Ruangan' },
    {
      key: 'floor',
      label: 'Lantai',
      render: (value, item) => item.floor?.floor_name || '-',
    },
  ];

  const filters = [
    {
      key: 'floor_id',
      label: 'Lantai',
      options: floorOptions,
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setFormData({
      room_name: '',
      floor_id: '',
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
      room_name: item.room_name || '',
      floor_id: item.floor_id?.toString() || '',
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
    navigate(`/master/rooms/${item.room_id}`);
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
    if (!formData.floor_id) {
      toast.error('Lantai wajib dipilih');
      return false;
    }
    if (!formData.room_name.trim()) {
      toast.error('Nama ruangan wajib diisi');
      return false;
    }
    if (!selectedItem && !photoFile) {
      toast.error('Foto ruangan wajib diupload');
      return false;
    }
    if (selectedItem && !photoFile && !photoPreview) {
      toast.error('Foto ruangan wajib diupload');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setFormLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('room_name', formData.room_name);
      submitData.append('floor_id', formData.floor_id);

      if (photoFile) {
        submitData.append('photo_1', photoFile);
      }

      if (selectedItem) {
        await dispatch(updateRoom({ id: selectedItem.room_id, data: submitData })).unwrap();
      } else {
        await dispatch(createRoom(submitData)).unwrap();
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
      await dispatch(deleteRoom(selectedItem.room_id)).unwrap();
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
        Foto Ruangan <span className="text-red-500">*</span>
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
        title="Ruangan"
        subtitle="Kelola data ruangan di setiap lantai"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Master Data', path: null },
          { label: 'Ruangan' },
        ]}
      />

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari nama ruangan..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onAdd={handleAdd}
        addLabel="Tambah Ruangan"
      />

      {rooms.loading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={rooms.data}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentPage={rooms.pagination.page}
          totalPages={rooms.pagination.totalPages}
          totalItems={rooms.pagination.total}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          actionColumn={{ view: true, edit: true, delete: true }}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Ruangan' : 'Tambah Ruangan'}
        onSubmit={handleSubmit}
        loading={formLoading}
      >
        <FormInput
          label="Lantai"
          name="floor_id"
          type="select"
          value={formData.floor_id}
          onChange={handleInputChange}
          options={floorOptions}
          required
        />
        <FormInput
          label="Nama Ruangan"
          name="room_name"
          value={formData.room_name}
          onChange={handleInputChange}
          placeholder="Contoh: Ruang 101"
          required
        />
        <ImageUpload />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Ruangan"
        message={`Apakah Anda yakin ingin menghapus "${selectedItem?.room_name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        type="danger"
        loading={rooms.loading}
      />
    </MainLayout>
  );
};

export default Rooms;

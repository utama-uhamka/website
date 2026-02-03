import { useState, useEffect, useCallback } from 'react';
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
} from '../components/ui';
import { FiCalendar, FiClock, FiMapPin, FiAward, FiUsers, FiLoader } from 'react-icons/fi';
import {
  fetchTrainings,
  createTraining,
  updateTraining,
  deleteTraining,
  clearDataError,
  clearDataSuccess,
} from '../store/dataSlice';

const Trainings = () => {
  const dispatch = useDispatch();
  const { trainings, loading, error, success } = useSelector((state) => state.data);

  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    training_name: '',
    description: '',
    trainer: '',
    location: '',
    date: '',
    start_time: '',
    end_time: '',
    max_participants: '',
    status: 'upcoming',
  });

  const itemsPerPage = 10;

  const statuses = [
    { value: 'upcoming', label: 'Akan Datang' },
    { value: 'ongoing', label: 'Berlangsung' },
    { value: 'completed', label: 'Selesai' },
    { value: 'cancelled', label: 'Dibatalkan' },
  ];

  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-700',
    ongoing: 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  const statusLabels = {
    upcoming: 'Akan Datang',
    ongoing: 'Berlangsung',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
  };

  // Load trainings
  const loadTrainings = useCallback(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchValue,
      ...filterValues,
    };
    dispatch(fetchTrainings(params));
  }, [dispatch, currentPage, itemsPerPage, searchValue, filterValues]);

  useEffect(() => {
    loadTrainings();
  }, [loadTrainings]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearDataError());
    }
  }, [error, dispatch]);

  // Handle success
  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearDataSuccess());
      loadTrainings();
    }
  }, [success, dispatch, loadTrainings]);

  // Reset page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, filterValues]);

  const columns = [
    {
      key: 'training_name',
      label: 'Pelatihan',
      render: (value, item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FiAward size={18} className="text-primary" />
          </div>
          <div>
            <p className="font-medium text-gray-800">{value || item.title}</p>
            <p className="text-xs text-gray-500">Trainer: {item.trainer || '-'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Jadwal',
      width: '150px',
      render: (value, item) => (
        <div>
          <div className="flex items-center gap-1.5 text-gray-700">
            <FiCalendar size={14} />
            <span className="text-sm">
              {value ? new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 mt-0.5">
            <FiClock size={14} />
            <span className="text-xs">{item.start_time || '-'} - {item.end_time || '-'}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Lokasi',
      width: '180px',
      render: (value) => (
        <div className="flex items-center gap-1.5 text-gray-600">
          <FiMapPin size={14} className="flex-shrink-0" />
          <span className="text-sm">{value || '-'}</span>
        </div>
      ),
    },
    {
      key: 'participants_count',
      label: 'Peserta',
      width: '100px',
      render: (value, item) => (
        <div className="flex items-center gap-1.5">
          <FiUsers size={14} className="text-gray-400" />
          <span className="text-sm">{value || 0}/{item.max_participants || '-'}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '120px',
      render: (value) => (
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap ${statusColors[value] || 'bg-gray-100 text-gray-700'}`}>
          {statusLabels[value] || value}
        </span>
      ),
    },
  ];

  const filters = [
    {
      key: 'status',
      label: 'Status',
      options: statuses,
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({
      training_name: '',
      description: '',
      trainer: '',
      location: '',
      date: '',
      start_time: '',
      end_time: '',
      max_participants: '',
      status: 'upcoming',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      training_name: item.training_name || item.title || '',
      description: item.description || '',
      trainer: item.trainer || '',
      location: item.location || '',
      date: item.date ? item.date.split('T')[0] : '',
      start_time: item.start_time || '',
      end_time: item.end_time || '',
      max_participants: item.max_participants?.toString() || '',
      status: item.status || 'upcoming',
    });
    setIsModalOpen(true);
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setIsViewOpen(true);
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
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
      };

      if (selectedItem) {
        await dispatch(updateTraining({ id: selectedItem.training_id, data: submitData })).unwrap();
      } else {
        await dispatch(createTraining(submitData)).unwrap();
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
      await dispatch(deleteTraining(selectedItem.training_id)).unwrap();
      setIsDeleteOpen(false);
    } catch (err) {
      // Error handled by slice
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Calculate stats
  const upcomingCount = trainings.data.filter(d => d.status === 'upcoming').length;
  const completedCount = trainings.data.filter(d => d.status === 'completed').length;

  return (
    <MainLayout>
      <PageHeader
        title="Pelatihan"
        subtitle="Kelola jadwal dan informasi pelatihan"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'User Management', path: null },
          { label: 'Pelatihan' },
        ]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Pelatihan</p>
          <p className="text-2xl font-bold text-gray-800">{trainings.pagination.total || 0}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-blue-600 mb-1">Akan Datang</p>
          <p className="text-2xl font-bold text-blue-700">{upcomingCount}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-green-600 mb-1">Selesai</p>
          <p className="text-2xl font-bold text-green-700">{completedCount}</p>
        </div>
      </div>

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari judul atau trainer..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onAdd={handleAdd}
        addLabel="Tambah Pelatihan"
        showExport={true}
        onExport={() => console.log('Export trainings')}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={trainings.data}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          actionColumn={{ edit: true, delete: true, view: true }}
          currentPage={trainings.pagination.page}
          totalPages={trainings.pagination.totalPages}
          totalItems={trainings.pagination.total}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Pelatihan' : 'Tambah Pelatihan'}
        onSubmit={handleSubmit}
        loading={formLoading}
        size="lg"
      >
        <FormInput
          label="Nama Pelatihan"
          name="training_name"
          value={formData.training_name}
          onChange={handleInputChange}
          placeholder="Masukkan nama pelatihan"
          required
        />
        <FormInput
          label="Deskripsi"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Masukkan deskripsi pelatihan"
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Trainer"
            name="trainer"
            value={formData.trainer}
            onChange={handleInputChange}
            placeholder="Nama trainer"
          />
          <FormInput
            label="Lokasi"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Lokasi pelatihan"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormInput
            label="Tanggal"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
          <FormInput
            label="Waktu Mulai"
            name="start_time"
            type="time"
            value={formData.start_time}
            onChange={handleInputChange}
          />
          <FormInput
            label="Waktu Selesai"
            name="end_time"
            type="time"
            value={formData.end_time}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Maks. Peserta"
            name="max_participants"
            type="number"
            value={formData.max_participants}
            onChange={handleInputChange}
            placeholder="Jumlah maksimal peserta"
          />
          <FormInput
            label="Status"
            name="status"
            type="select"
            value={formData.status}
            onChange={handleInputChange}
            options={statuses}
            required
          />
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Detail Pelatihan"
        showFooter={false}
        size="lg"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FiAward size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{selectedItem.training_name || selectedItem.title}</h3>
                <p className="text-sm text-gray-500">Trainer: {selectedItem.trainer || '-'}</p>
              </div>
            </div>

            {selectedItem.description && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">{selectedItem.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Tanggal</p>
                <div className="flex items-center gap-2">
                  <FiCalendar size={14} className="text-gray-400" />
                  <span className="text-sm font-medium">
                    {selectedItem.date
                      ? new Date(selectedItem.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                      : '-'}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Waktu</p>
                <div className="flex items-center gap-2">
                  <FiClock size={14} className="text-gray-400" />
                  <span className="text-sm font-medium">{selectedItem.start_time || '-'} - {selectedItem.end_time || '-'}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Lokasi</p>
                <div className="flex items-center gap-2">
                  <FiMapPin size={14} className="text-gray-400" />
                  <span className="text-sm font-medium">{selectedItem.location || '-'}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Peserta</p>
                <div className="flex items-center gap-2">
                  <FiUsers size={14} className="text-gray-400" />
                  <span className="text-sm font-medium">{selectedItem.participants_count || 0} dari {selectedItem.max_participants || '-'} orang</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2">Status</p>
              <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${statusColors[selectedItem.status] || 'bg-gray-100 text-gray-700'}`}>
                {statusLabels[selectedItem.status] || selectedItem.status}
              </span>
            </div>

            {/* Progress bar for participants */}
            {selectedItem.max_participants && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Kapasitas Terisi</span>
                  <span className="font-medium">{Math.round(((selectedItem.participants_count || 0) / selectedItem.max_participants) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2 transition-all"
                    style={{ width: `${((selectedItem.participants_count || 0) / selectedItem.max_participants) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Pelatihan"
        message={`Apakah Anda yakin ingin menghapus pelatihan "${selectedItem?.training_name || selectedItem?.title}"?`}
        confirmText="Ya, Hapus"
        type="danger"
        loading={loading}
      />
    </MainLayout>
  );
};

export default Trainings;

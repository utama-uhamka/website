import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import MainLayout from '../layouts/MainLayout';
import {
  DataTable,
  Modal,
  SearchFilter,
  FormInput,
  ConfirmDialog,
  PageHeader,
} from '../components/ui';
import { FiCalendar, FiClock, FiMapPin, FiImage, FiUsers, FiLoader } from 'react-icons/fi';
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  clearDataError,
  clearDataSuccess,
} from '../store/dataSlice';
import { fetchEventCategories } from '../store/masterSlice';
import { fetchCampuses } from '../store/campusesSlice';

const Event = () => {
  const dispatch = useDispatch();
  const { events } = useSelector((state) => state.data);
  const { eventCategories } = useSelector((state) => state.master);
  const { data: campuses } = useSelector((state) => state.campuses);

  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    event_name: '',
    event_description: '',
    event_category_id: '',
    campus_id: '',
    location: '',
    date: '',
    start_time: '',
    end_time: '',
    capacity: '',
    organizer: '',
    event_type: '',
    is_active: 1,
  });

  const itemsPerPage = 10;

  const eventTypes = [
    { value: 'Seminar', label: 'Seminar' },
    { value: 'Rapat', label: 'Rapat' },
    { value: 'Wisuda', label: 'Wisuda' },
    { value: 'Pelatihan', label: 'Pelatihan' },
    { value: 'Lomba', label: 'Lomba' },
    { value: 'Kegiatan Mahasiswa', label: 'Kegiatan Mahasiswa' },
  ];

  // Load events
  const loadEvents = useCallback(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchValue,
      ...filterValues,
    };
    dispatch(fetchEvents(params));
  }, [dispatch, currentPage, itemsPerPage, searchValue, filterValues]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Load master data
  useEffect(() => {
    dispatch(fetchEventCategories({ limit: 100 }));
    dispatch(fetchCampuses({ limit: 100 }));
  }, [dispatch]);

  // Handle success/error
  useEffect(() => {
    if (events.error) {
      toast.error(events.error);
      dispatch(clearDataError());
    }
  }, [events.error, dispatch]);

  useEffect(() => {
    if (events.success) {
      toast.success(events.success);
      dispatch(clearDataSuccess());
      loadEvents();
    }
  }, [events.success, dispatch, loadEvents]);

  // Reset page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, filterValues]);

  // Options for dropdowns
  const categoryOptions = eventCategories.data.map((c) => ({
    value: c.event_category_id?.toString(),
    label: c.event_category_name,
  }));

  const campusOptions = campuses.map((c) => ({
    value: c.campus_id?.toString(),
    label: c.campus_name,
  }));

  const getEventColor = (type) => {
    const colors = {
      Seminar: '#4A22AD',
      Rapat: '#2563EB',
      Wisuda: '#059669',
      Pelatihan: '#D97706',
      Lomba: '#7C3AED',
      'Kegiatan Mahasiswa': '#0891B2',
    };
    return colors[type] || '#6B7280';
  };

  const columns = [
    {
      key: 'event_name',
      label: 'Event',
      render: (value, item) => (
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-12 rounded-full"
            style={{ backgroundColor: getEventColor(item.event_type) }}
          ></div>
          <div>
            <p className="font-medium text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">{item.event_type || '-'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Tanggal',
      width: '130px',
      render: (value, item) => (
        <div>
          <div className="flex items-center gap-1.5 text-gray-700">
            <FiCalendar size={14} />
            <span className="text-sm">
              {value
                ? new Date(value).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : '-'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 mt-1">
            <FiClock size={14} />
            <span className="text-xs">
              {item.start_time || '-'} - {item.end_time || '-'}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Lokasi',
      width: '180px',
      render: (value, item) => (
        <div className="flex items-center gap-1.5 text-gray-600">
          <FiMapPin size={14} />
          <span className="text-sm">{value || item.campus?.campus_name || '-'}</span>
        </div>
      ),
    },
    {
      key: 'capacity',
      label: 'Kapasitas',
      width: '100px',
      render: (value) => (
        <div className="flex items-center gap-1.5">
          <FiUsers size={14} className="text-gray-400" />
          <span className="text-sm">{value || '-'}</span>
        </div>
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      width: '100px',
      render: (value) => (
        <span
          className={`px-2.5 py-1 text-xs font-medium rounded-full ${
            value === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
          }`}
        >
          {value === 1 ? 'Aktif' : 'Nonaktif'}
        </span>
      ),
    },
  ];

  const filters = [
    {
      key: 'event_category_id',
      label: 'Kategori',
      options: categoryOptions,
    },
    {
      key: 'event_type',
      label: 'Tipe',
      options: eventTypes,
    },
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
    setFormData({
      event_name: '',
      event_description: '',
      event_category_id: '',
      campus_id: '',
      location: '',
      date: '',
      start_time: '',
      end_time: '',
      capacity: '',
      organizer: '',
      event_type: '',
      is_active: 1,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      event_name: item.event_name || '',
      event_description: item.event_description || '',
      event_category_id: item.event_category_id?.toString() || '',
      campus_id: item.campus_id?.toString() || '',
      location: item.location || '',
      date: item.date ? item.date.split('T')[0] : '',
      start_time: item.start_time || '',
      end_time: item.end_time || '',
      capacity: item.capacity?.toString() || '',
      organizer: item.organizer || '',
      event_type: item.event_type || '',
      is_active: item.is_active,
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
        event_category_id: formData.event_category_id
          ? parseInt(formData.event_category_id)
          : null,
        campus_id: formData.campus_id ? parseInt(formData.campus_id) : null,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
      };

      if (selectedItem) {
        await dispatch(updateEvent({ id: selectedItem.event_id, data: submitData })).unwrap();
      } else {
        await dispatch(createEvent(submitData)).unwrap();
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
      await dispatch(deleteEvent(selectedItem.event_id)).unwrap();
      setIsDeleteOpen(false);
    } catch (err) {
      // Error handled by slice
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Stats
  const totalEvents = events.pagination.total || 0;
  const activeCount = events.data.filter((d) => d.is_active === 1).length;

  return (
    <MainLayout>
      <PageHeader
        title="Event Management"
        subtitle="Kelola event dan kegiatan universitas"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Event' },
        ]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Event</p>
          <p className="text-2xl font-bold text-gray-800">{totalEvents}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-green-600 mb-1">Event Aktif</p>
          <p className="text-2xl font-bold text-green-700">{activeCount}</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-purple-600 mb-1">Kategori</p>
          <p className="text-2xl font-bold text-purple-700">{eventCategories.data.length}</p>
        </div>
      </div>

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari judul atau lokasi..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onAdd={handleAdd}
        addLabel="Tambah Event"
        showExport={true}
        onExport={() => console.log('Export events')}
      />

      {events.loading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={events.data}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          actionColumn={{ edit: true, delete: true, view: true }}
          currentPage={events.pagination.page}
          totalPages={events.pagination.totalPages}
          totalItems={events.pagination.total}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Event' : 'Tambah Event'}
        onSubmit={handleSubmit}
        size="lg"
        loading={formLoading}
      >
        <FormInput
          label="Judul Event"
          name="event_name"
          value={formData.event_name}
          onChange={handleInputChange}
          placeholder="Masukkan judul event"
          required
        />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deskripsi <span className="text-red-500">*</span>
          </label>
          <ReactQuill
            theme="snow"
            value={formData.event_description}
            onChange={(value) => setFormData((prev) => ({ ...prev, event_description: value }))}
            placeholder="Deskripsi event"
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ align: [] }],
                ['link'],
                ['clean'],
              ],
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Kategori"
            name="event_category_id"
            type="select"
            value={formData.event_category_id}
            onChange={handleInputChange}
            options={categoryOptions}
          />
          <FormInput
            label="Tipe Event"
            name="event_type"
            type="select"
            value={formData.event_type}
            onChange={handleInputChange}
            options={eventTypes}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Unit/Kampus"
            name="campus_id"
            type="select"
            value={formData.campus_id}
            onChange={handleInputChange}
            options={campusOptions}
          />
          <FormInput
            label="Lokasi"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Contoh: Aula Gedung Rektorat"
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
            label="Jam Mulai"
            name="start_time"
            type="time"
            value={formData.start_time}
            onChange={handleInputChange}
          />
          <FormInput
            label="Jam Selesai"
            name="end_time"
            type="time"
            value={formData.end_time}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Kapasitas"
            name="capacity"
            type="number"
            value={formData.capacity}
            onChange={handleInputChange}
            placeholder="Jumlah maksimal peserta"
          />
          <FormInput
            label="Penyelenggara"
            name="organizer"
            value={formData.organizer}
            onChange={handleInputChange}
            placeholder="Contoh: Fakultas Teknik"
          />
        </div>
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

      {/* View Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Detail Event"
        showFooter={false}
        size="lg"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div
                className="w-3 h-3 rounded-full mt-1.5"
                style={{ backgroundColor: getEventColor(selectedItem.event_type) }}
              ></div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{selectedItem.event_name}</h3>
                <p className="text-sm text-gray-500">{selectedItem.event_type || '-'}</p>
              </div>
            </div>
            {selectedItem.event_description && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 prose prose-sm max-w-none break-words overflow-hidden" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedItem.event_description) }} />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-gray-400" />
                <span className="text-sm">
                  {selectedItem.date
                    ? new Date(selectedItem.date).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : '-'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock className="text-gray-400" />
                <span className="text-sm">
                  {selectedItem.start_time || '-'} - {selectedItem.end_time || '-'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiMapPin className="text-gray-400" />
                <span className="text-sm">
                  {selectedItem.location || selectedItem.campus?.campus_name || '-'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiUsers className="text-gray-400" />
                <span className="text-sm">Kapasitas: {selectedItem.capacity || '-'}</span>
              </div>
            </div>
            {selectedItem.organizer && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Penyelenggara</p>
                <p className="text-sm font-medium">{selectedItem.organizer}</p>
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
        title="Hapus Event"
        message={`Apakah Anda yakin ingin menghapus event "${selectedItem?.event_name}"?`}
        confirmText="Ya, Hapus"
        type="danger"
        loading={events.loading}
      />
    </MainLayout>
  );
};

export default Event;

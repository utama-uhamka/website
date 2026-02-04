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
import { FiLoader, FiClock } from 'react-icons/fi';
import {
  fetchShifts,
  createShift,
  updateShift,
  deleteShift,
  clearMasterError,
  clearMasterSuccess,
} from '../../store/masterSlice';

// Helper to format time for display
const formatTime = (time) => {
  if (!time) return '-';
  // If already in HH:mm format, return as is
  if (time.length === 5) return time;
  // If in HH:mm:ss format, trim seconds
  return time.substring(0, 5);
};

// Helper to calculate duration between two times
const calculateDuration = (start, end) => {
  if (!start || !end) return '-';
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);

  let totalMinutes = (endH * 60 + endM) - (startH * 60 + startM);
  // Handle overnight shifts
  if (totalMinutes < 0) totalMinutes += 24 * 60;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) return `${hours}j ${minutes}m`;
  if (hours > 0) return `${hours} jam`;
  return `${minutes} menit`;
};

const Shifts = () => {
  const dispatch = useDispatch();
  const { shifts, loading, error, success } = useSelector((state) => state.master);

  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    timeStart: '',
    timeEnd: '',
  });

  const itemsPerPage = 10;

  // Load shifts
  const loadShifts = useCallback(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchValue,
    };
    dispatch(fetchShifts(params));
  }, [dispatch, currentPage, itemsPerPage, searchValue]);

  useEffect(() => {
    loadShifts();
  }, [loadShifts]);

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
      loadShifts();
    }
  }, [success, dispatch, loadShifts]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  const columns = [
    {
      key: 'shift_id',
      label: 'ID',
      width: '120px',
      render: (value) => <span className="font-mono text-xs">{value}</span>,
    },
    {
      key: 'name',
      label: 'Nama Shift',
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <FiClock className="w-4 h-4 text-primary" />
          </div>
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'timeStart',
      label: 'Jam Mulai',
      width: '120px',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium bg-green-50 text-green-700">
          {formatTime(value)}
        </span>
      ),
    },
    {
      key: 'timeEnd',
      label: 'Jam Selesai',
      width: '120px',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium bg-red-50 text-red-700">
          {formatTime(value)}
        </span>
      ),
    },
    {
      key: 'duration',
      label: 'Durasi',
      width: '100px',
      render: (_, row) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium bg-blue-50 text-blue-700">
          {calculateDuration(row.timeStart, row.timeEnd)}
        </span>
      ),
    },
  ];

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({
      name: '',
      timeStart: '',
      timeEnd: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name || '',
      timeStart: formatTime(item.timeStart) || '',
      timeEnd: formatTime(item.timeEnd) || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Nama shift wajib diisi');
      return;
    }
    if (!formData.timeStart || !formData.timeEnd) {
      toast.error('Jam mulai dan jam selesai wajib diisi');
      return;
    }

    setFormLoading(true);
    try {
      const submitData = {
        name: formData.name,
        timeStart: formData.timeStart,
        timeEnd: formData.timeEnd,
      };

      if (selectedItem) {
        await dispatch(updateShift({ id: selectedItem.shift_id, data: submitData })).unwrap();
      } else {
        await dispatch(createShift(submitData)).unwrap();
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
      await dispatch(deleteShift(selectedItem.shift_id)).unwrap();
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
        title="Shift Kerja"
        subtitle="Kelola jadwal shift karyawan"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Master Data', path: null },
          { label: 'Shift' },
        ]}
      />

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari nama shift..."
        onAdd={handleAdd}
        addLabel="Tambah Shift"
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={shifts.data}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentPage={shifts.pagination?.page || 1}
          totalPages={shifts.pagination?.totalPages || 1}
          totalItems={shifts.pagination?.total || 0}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Shift' : 'Tambah Shift'}
        onSubmit={handleSubmit}
        loading={formLoading}
      >
        <FormInput
          label="Nama Shift"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Contoh: Shift Pagi"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Jam Mulai"
            name="timeStart"
            type="time"
            value={formData.timeStart}
            onChange={handleInputChange}
            required
          />
          <FormInput
            label="Jam Selesai"
            name="timeEnd"
            type="time"
            value={formData.timeEnd}
            onChange={handleInputChange}
            required
          />
        </div>
        {formData.timeStart && formData.timeEnd && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <span className="font-medium">Durasi Shift:</span> {calculateDuration(formData.timeStart, formData.timeEnd)}
            </p>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Shift"
        message={`Apakah Anda yakin ingin menghapus shift "${selectedItem?.name}"?`}
        confirmText="Ya, Hapus"
        type="danger"
        loading={loading}
      />
    </MainLayout>
  );
};

export default Shifts;

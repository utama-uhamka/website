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
  fetchShifts,
  createShift,
  updateShift,
  deleteShift,
  clearMasterError,
  clearMasterSuccess,
} from '../../store/masterSlice';

const Shifts = () => {
  const dispatch = useDispatch();
  const { shifts, loading, error, success } = useSelector((state) => state.master);

  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    shift_name: '',
    start_time: '',
    end_time: '',
    break_duration: '',
    description: '',
    is_active: 1,
  });

  const itemsPerPage = 10;

  // Load shifts
  const loadShifts = useCallback(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchValue,
      ...filterValues,
    };
    dispatch(fetchShifts(params));
  }, [dispatch, currentPage, itemsPerPage, searchValue, filterValues]);

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

  // Reset page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, filterValues]);

  const columns = [
    { key: 'shift_name', label: 'Nama Shift' },
    {
      key: 'start_time',
      label: 'Jam Mulai',
      width: '100px',
      render: (value) => <span className="font-medium">{value || '-'}</span>,
    },
    {
      key: 'end_time',
      label: 'Jam Selesai',
      width: '100px',
      render: (value) => <span className="font-medium">{value || '-'}</span>,
    },
    {
      key: 'break_duration',
      label: 'Istirahat',
      width: '100px',
      render: (value) => value ? `${value} menit` : '-',
    },
    {
      key: 'user_count',
      label: 'Jumlah User',
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
    setFormData({
      shift_name: '',
      start_time: '',
      end_time: '',
      break_duration: '',
      description: '',
      is_active: 1,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      shift_name: item.shift_name || '',
      start_time: item.start_time || '',
      end_time: item.end_time || '',
      break_duration: item.break_duration?.toString() || '',
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
        break_duration: formData.break_duration ? parseInt(formData.break_duration) : null,
        is_active: parseInt(formData.is_active),
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
          { label: 'User Management', path: null },
          { label: 'Shift' },
        ]}
      />

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari nama shift..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
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
          currentPage={shifts.pagination.page}
          totalPages={shifts.pagination.totalPages}
          totalItems={shifts.pagination.total}
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
          name="shift_name"
          value={formData.shift_name}
          onChange={handleInputChange}
          placeholder="Contoh: Shift Pagi"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Jam Mulai"
            name="start_time"
            type="time"
            value={formData.start_time}
            onChange={handleInputChange}
            required
          />
          <FormInput
            label="Jam Selesai"
            name="end_time"
            type="time"
            value={formData.end_time}
            onChange={handleInputChange}
            required
          />
        </div>
        <FormInput
          label="Durasi Istirahat (menit)"
          name="break_duration"
          type="number"
          value={formData.break_duration}
          onChange={handleInputChange}
          placeholder="Contoh: 60"
        />
        <FormInput
          label="Deskripsi"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Deskripsi shift"
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
        title="Hapus Shift"
        message={`Apakah Anda yakin ingin menghapus "${selectedItem?.shift_name}"? User yang terdaftar di shift ini akan perlu dipindahkan.`}
        confirmText="Ya, Hapus"
        type="danger"
        loading={loading}
      />
    </MainLayout>
  );
};

export default Shifts;

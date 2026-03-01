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
import { FiUser, FiCalendar, FiLoader } from 'react-icons/fi';
import {
  fetchEvaluations,
  createEvaluation,
  updateEvaluation,
  deleteEvaluation,
  clearDataError,
  clearDataSuccess,
} from '../store/dataSlice';
import { fetchUsers } from '../store/usersSlice';

const Evaluations = () => {
  const dispatch = useDispatch();
  const { evaluations, loading, error, success } = useSelector((state) => state.data);
  const { data: users } = useSelector((state) => state.users);

  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_id: '',
    period: '',
    attendance_score: '',
    performance_score: '',
    attitude_score: '',
    teamwork_score: '',
    notes: '',
  });

  const itemsPerPage = 10;

  const periods = [
    { value: '2024-Q4', label: 'Q4 2024' },
    { value: '2024-Q3', label: 'Q3 2024' },
    { value: '2024-Q2', label: 'Q2 2024' },
    { value: '2024-Q1', label: 'Q1 2024' },
    { value: '2025-Q1', label: 'Q1 2025' },
  ];

  // Load evaluations
  const loadEvaluations = useCallback(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchValue,
      ...filterValues,
    };
    dispatch(fetchEvaluations(params));
  }, [dispatch, currentPage, itemsPerPage, searchValue, filterValues]);

  useEffect(() => {
    loadEvaluations();
  }, [loadEvaluations]);

  // Load users for filter and form
  useEffect(() => {
    dispatch(fetchUsers({ limit: 100 }));
  }, [dispatch]);

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
      loadEvaluations();
    }
  }, [success, dispatch, loadEvaluations]);

  // Reset page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, filterValues]);

  // User options
  const userOptions = users.map((u) => ({
    value: u.user_id?.toString(),
    label: u.full_name,
  }));

  const getRatingColor = (rating) => {
    const colors = {
      'A': 'bg-green-100 text-green-700',
      'B': 'bg-blue-100 text-blue-700',
      'C': 'bg-yellow-100 text-yellow-700',
      'D': 'bg-orange-100 text-orange-700',
      'E': 'bg-red-100 text-red-700',
    };
    return colors[rating] || 'bg-gray-100 text-gray-700';
  };

  const calculateRating = (totalScore) => {
    if (totalScore >= 90) return 'A';
    if (totalScore >= 80) return 'B';
    if (totalScore >= 70) return 'C';
    if (totalScore >= 60) return 'D';
    return 'E';
  };

  const columns = [
    {
      key: 'user',
      label: 'Karyawan',
      render: (value, item) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            {item.user?.photo_1 ? (
              <img src={item.user.photo_1} alt={item.user?.full_name} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <FiUser size={14} className="text-primary" />
            )}
          </div>
          <span className="font-medium text-gray-800">{item.user?.full_name || '-'}</span>
        </div>
      ),
    },
    {
      key: 'period',
      label: 'Periode',
      width: '100px',
    },
    {
      key: 'attendance_score',
      label: 'Kehadiran',
      width: '90px',
      render: (value) => <span className="font-medium">{value || 0}</span>,
    },
    {
      key: 'performance_score',
      label: 'Kinerja',
      width: '80px',
      render: (value) => <span className="font-medium">{value || 0}</span>,
    },
    {
      key: 'attitude_score',
      label: 'Sikap',
      width: '70px',
      render: (value) => <span className="font-medium">{value || 0}</span>,
    },
    {
      key: 'teamwork_score',
      label: 'Teamwork',
      width: '90px',
      render: (value) => <span className="font-medium">{value || 0}</span>,
    },
    {
      key: 'total_score',
      label: 'Total',
      width: '80px',
      render: (value, item) => {
        const total = value || (((item.attendance_score || 0) + (item.performance_score || 0) + (item.attitude_score || 0) + (item.teamwork_score || 0)) / 4);
        return <span className="font-bold text-primary">{total?.toFixed(2) || 0}</span>;
      },
    },
    {
      key: 'rating',
      label: 'Rating',
      width: '80px',
      render: (value, item) => {
        const total = item.total_score || (((item.attendance_score || 0) + (item.performance_score || 0) + (item.attitude_score || 0) + (item.teamwork_score || 0)) / 4);
        const rating = value || calculateRating(total);
        return (
          <span className={`px-3 py-1 text-sm font-bold rounded-full ${getRatingColor(rating)}`}>
            {rating}
          </span>
        );
      },
    },
  ];

  const filters = [
    {
      key: 'user_id',
      label: 'Karyawan',
      options: userOptions,
    },
    {
      key: 'period',
      label: 'Periode',
      options: periods,
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({
      user_id: '',
      period: '',
      attendance_score: '',
      performance_score: '',
      attitude_score: '',
      teamwork_score: '',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      user_id: item.user_id?.toString() || '',
      period: item.period || '',
      attendance_score: item.attendance_score?.toString() || '',
      performance_score: item.performance_score?.toString() || '',
      attitude_score: item.attitude_score?.toString() || '',
      teamwork_score: item.teamwork_score?.toString() || '',
      notes: item.notes || '',
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
        user_id: parseInt(formData.user_id),
        period: formData.period,
        attendance_score: parseInt(formData.attendance_score) || 0,
        performance_score: parseInt(formData.performance_score) || 0,
        attitude_score: parseInt(formData.attitude_score) || 0,
        teamwork_score: parseInt(formData.teamwork_score) || 0,
        notes: formData.notes,
      };

      // Calculate total and rating
      const total = (submitData.attendance_score + submitData.performance_score + submitData.attitude_score + submitData.teamwork_score) / 4;
      submitData.total_score = total;
      submitData.rating = calculateRating(total);

      if (selectedItem) {
        await dispatch(updateEvaluation({ id: selectedItem.evaluation_id, data: submitData })).unwrap();
      } else {
        await dispatch(createEvaluation(submitData)).unwrap();
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
      await dispatch(deleteEvaluation(selectedItem.evaluation_id)).unwrap();
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
        title="Penilaian Kinerja"
        subtitle="Evaluasi dan penilaian kinerja karyawan"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Penilaian' },
        ]}
      />

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari nama karyawan..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onAdd={handleAdd}
        addLabel="Tambah Penilaian"
        showExport={true}
        onExport={() => console.log('Export evaluations')}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={evaluations.data}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          actionColumn={{ edit: true, delete: true, view: true }}
          currentPage={evaluations.pagination.page}
          totalPages={evaluations.pagination.totalPages}
          totalItems={evaluations.pagination.total}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Penilaian' : 'Tambah Penilaian'}
        onSubmit={handleSubmit}
        loading={formLoading}
        size="lg"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Karyawan"
            name="user_id"
            type="select"
            value={formData.user_id}
            onChange={handleInputChange}
            options={userOptions}
            required
          />
          <FormInput
            label="Periode"
            name="period"
            type="select"
            value={formData.period}
            onChange={handleInputChange}
            options={periods}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Skor Kehadiran (0-100)"
            name="attendance_score"
            type="number"
            value={formData.attendance_score}
            onChange={handleInputChange}
            placeholder="0-100"
            required
          />
          <FormInput
            label="Skor Kinerja (0-100)"
            name="performance_score"
            type="number"
            value={formData.performance_score}
            onChange={handleInputChange}
            placeholder="0-100"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Skor Sikap (0-100)"
            name="attitude_score"
            type="number"
            value={formData.attitude_score}
            onChange={handleInputChange}
            placeholder="0-100"
            required
          />
          <FormInput
            label="Skor Teamwork (0-100)"
            name="teamwork_score"
            type="number"
            value={formData.teamwork_score}
            onChange={handleInputChange}
            placeholder="0-100"
            required
          />
        </div>
        <FormInput
          label="Catatan"
          name="notes"
          type="textarea"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Catatan penilaian"
        />
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Detail Penilaian"
        showFooter={false}
        size="md"
      >
        {selectedItem && (() => {
          const totalScore = selectedItem.total_score ||
            (((selectedItem.attendance_score || 0) + (selectedItem.performance_score || 0) + (selectedItem.attitude_score || 0) + (selectedItem.teamwork_score || 0)) / 4);
          const rating = selectedItem.rating || calculateRating(totalScore);

          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {selectedItem.user?.photo_1 ? (
                      <img src={selectedItem.user.photo_1} alt={selectedItem.user?.full_name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <FiUser size={24} className="text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{selectedItem.user?.full_name || '-'}</h3>
                    <p className="text-sm text-gray-500">{selectedItem.period}</p>
                  </div>
                </div>
                <div className={`px-4 py-2 text-2xl font-bold rounded-xl ${getRatingColor(rating)}`}>
                  {rating}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Kehadiran</span>
                    <span className="text-lg font-bold text-gray-800">{selectedItem.attendance_score || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary rounded-full h-2" style={{ width: `${selectedItem.attendance_score || 0}%` }}></div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Kinerja</span>
                    <span className="text-lg font-bold text-gray-800">{selectedItem.performance_score || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary rounded-full h-2" style={{ width: `${selectedItem.performance_score || 0}%` }}></div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Sikap</span>
                    <span className="text-lg font-bold text-gray-800">{selectedItem.attitude_score || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary rounded-full h-2" style={{ width: `${selectedItem.attitude_score || 0}%` }}></div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Teamwork</span>
                    <span className="text-lg font-bold text-gray-800">{selectedItem.teamwork_score || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary rounded-full h-2" style={{ width: `${selectedItem.teamwork_score || 0}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 rounded-lg p-4 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Total Skor</span>
                <span className="text-2xl font-bold text-primary">{totalScore?.toFixed(2) || 0}</span>
              </div>

              {selectedItem.notes && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Catatan</p>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedItem.notes}</p>
                </div>
              )}

              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <FiCalendar size={14} />
                <span>
                  Dinilai pada: {selectedItem.createdAt
                    ? new Date(selectedItem.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                    : '-'}
                </span>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Penilaian"
        message={`Apakah Anda yakin ingin menghapus penilaian untuk "${selectedItem?.user?.full_name}" periode ${selectedItem?.period}?`}
        confirmText="Ya, Hapus"
        type="danger"
        loading={loading}
      />
    </MainLayout>
  );
};

export default Evaluations;

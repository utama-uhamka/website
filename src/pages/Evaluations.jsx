import { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import {
  DataTable,
  Modal,
  SearchFilter,
  FormInput,
  ConfirmDialog,
  PageHeader,
} from '../components/ui';
import { FiUser, FiCalendar, FiStar } from 'react-icons/fi';

const Evaluations = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    user_id: '',
    period: '',
    attendance_score: '',
    performance_score: '',
    attitude_score: '',
    teamwork_score: '',
    notes: '',
  });

  // Dummy data
  const users = [
    { value: '1', label: 'Ahmad Fauzi' },
    { value: '2', label: 'Budi Santoso' },
    { value: '3', label: 'Citra Dewi' },
    { value: '4', label: 'Dani Pratama' },
  ];

  const periods = [
    { value: '2024-Q4', label: 'Q4 2024' },
    { value: '2024-Q3', label: 'Q3 2024' },
    { value: '2024-Q2', label: 'Q2 2024' },
    { value: '2024-Q1', label: 'Q1 2024' },
  ];

  const data = [
    { id: 1, user: 'Ahmad Fauzi', user_id: '1', period: 'Q4 2024', period_value: '2024-Q4', attendance_score: 95, performance_score: 88, attitude_score: 90, teamwork_score: 85, total_score: 89.5, rating: 'A', notes: 'Kinerja sangat baik, perlu tingkatkan teamwork', evaluated_at: '2024-12-20' },
    { id: 2, user: 'Budi Santoso', user_id: '2', period: 'Q4 2024', period_value: '2024-Q4', attendance_score: 85, performance_score: 82, attitude_score: 88, teamwork_score: 90, total_score: 86.25, rating: 'B', notes: 'Perlu tingkatkan kehadiran', evaluated_at: '2024-12-20' },
    { id: 3, user: 'Citra Dewi', user_id: '3', period: 'Q4 2024', period_value: '2024-Q4', attendance_score: 92, performance_score: 90, attitude_score: 95, teamwork_score: 92, total_score: 92.25, rating: 'A', notes: 'Excellent performance', evaluated_at: '2024-12-21' },
    { id: 4, user: 'Dani Pratama', user_id: '4', period: 'Q4 2024', period_value: '2024-Q4', attendance_score: 78, performance_score: 75, attitude_score: 80, teamwork_score: 82, total_score: 78.75, rating: 'C', notes: 'Perlu perbaikan signifikan', evaluated_at: '2024-12-21' },
    { id: 5, user: 'Ahmad Fauzi', user_id: '1', period: 'Q3 2024', period_value: '2024-Q3', attendance_score: 90, performance_score: 85, attitude_score: 88, teamwork_score: 82, total_score: 86.25, rating: 'B', notes: 'Menunjukkan peningkatan', evaluated_at: '2024-09-20' },
    { id: 6, user: 'Budi Santoso', user_id: '2', period: 'Q3 2024', period_value: '2024-Q3', attendance_score: 88, performance_score: 80, attitude_score: 85, teamwork_score: 88, total_score: 85.25, rating: 'B', notes: 'Konsisten', evaluated_at: '2024-09-20' },
  ];

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

  const columns = [
    {
      key: 'user',
      label: 'Karyawan',
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <FiUser size={14} className="text-primary" />
          </div>
          <span className="font-medium text-gray-800">{value}</span>
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
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'performance_score',
      label: 'Kinerja',
      width: '80px',
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'attitude_score',
      label: 'Sikap',
      width: '70px',
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'teamwork_score',
      label: 'Teamwork',
      width: '90px',
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'total_score',
      label: 'Total',
      width: '80px',
      render: (value) => <span className="font-bold text-primary">{value}</span>,
    },
    {
      key: 'rating',
      label: 'Rating',
      width: '80px',
      render: (value) => (
        <span className={`px-3 py-1 text-sm font-bold rounded-full ${getRatingColor(value)}`}>
          {value}
        </span>
      ),
    },
  ];

  const filters = [
    {
      key: 'user_id',
      label: 'Karyawan',
      options: users,
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
      user_id: item.user_id,
      period: item.period_value,
      attendance_score: item.attendance_score,
      performance_score: item.performance_score,
      attitude_score: item.attitude_score,
      teamwork_score: item.teamwork_score,
      notes: item.notes,
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

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    console.log('Deleted:', selectedItem);
    setIsDeleteOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Filter data
  const filteredData = data.filter((item) => {
    const matchSearch = item.user.toLowerCase().includes(searchValue.toLowerCase());
    const matchUser = !filterValues.user_id || item.user_id === filterValues.user_id;
    const matchPeriod = !filterValues.period || item.period_value === filterValues.period;
    return matchSearch && matchUser && matchPeriod;
  });

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

      <DataTable
        columns={columns}
        data={filteredData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        actionColumn={{ edit: true, delete: true, view: true }}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredData.length / 10)}
        onPageChange={setCurrentPage}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Penilaian' : 'Tambah Penilaian'}
        onSubmit={handleSubmit}
        size="lg"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Karyawan"
            name="user_id"
            type="select"
            value={formData.user_id}
            onChange={handleInputChange}
            options={users}
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
        {selectedItem && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FiUser size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{selectedItem.user}</h3>
                  <p className="text-sm text-gray-500">{selectedItem.period}</p>
                </div>
              </div>
              <div className={`px-4 py-2 text-2xl font-bold rounded-xl ${getRatingColor(selectedItem.rating)}`}>
                {selectedItem.rating}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Kehadiran</span>
                  <span className="text-lg font-bold text-gray-800">{selectedItem.attendance_score}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary rounded-full h-2" style={{ width: `${selectedItem.attendance_score}%` }}></div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Kinerja</span>
                  <span className="text-lg font-bold text-gray-800">{selectedItem.performance_score}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary rounded-full h-2" style={{ width: `${selectedItem.performance_score}%` }}></div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Sikap</span>
                  <span className="text-lg font-bold text-gray-800">{selectedItem.attitude_score}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary rounded-full h-2" style={{ width: `${selectedItem.attitude_score}%` }}></div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Teamwork</span>
                  <span className="text-lg font-bold text-gray-800">{selectedItem.teamwork_score}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary rounded-full h-2" style={{ width: `${selectedItem.teamwork_score}%` }}></div>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 rounded-lg p-4 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Total Skor</span>
              <span className="text-2xl font-bold text-primary">{selectedItem.total_score}</span>
            </div>

            {selectedItem.notes && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Catatan</p>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedItem.notes}</p>
              </div>
            )}

            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <FiCalendar size={14} />
              <span>Dinilai pada: {new Date(selectedItem.evaluated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Penilaian"
        message={`Apakah Anda yakin ingin menghapus penilaian untuk "${selectedItem?.user}" periode ${selectedItem?.period}?`}
        confirmText="Ya, Hapus"
        type="danger"
      />
    </MainLayout>
  );
};

export default Evaluations;

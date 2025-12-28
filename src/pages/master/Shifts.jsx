import { useState, useEffect, useMemo } from 'react';
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

const Shifts = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('start_time');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    start_time: '',
    end_time: '',
    break_duration: '',
    description: '',
    status: 'active',
  });

  const itemsPerPage = 10;

  // Dummy data
  const allData = [
    { id: 1, name: 'Shift Pagi', start_time: '07:00', end_time: '15:00', break_duration: 60, description: 'Shift pagi reguler', user_count: 25, status: 'active' },
    { id: 2, name: 'Shift Siang', start_time: '14:00', end_time: '22:00', break_duration: 60, description: 'Shift siang reguler', user_count: 18, status: 'active' },
    { id: 3, name: 'Shift Malam', start_time: '22:00', end_time: '07:00', break_duration: 60, description: 'Shift malam untuk security', user_count: 8, status: 'active' },
    { id: 4, name: 'Shift Office', start_time: '08:00', end_time: '17:00', break_duration: 60, description: 'Jam kerja kantor standar', user_count: 40, status: 'active' },
    { id: 5, name: 'Shift Fleksibel', start_time: '09:00', end_time: '18:00', break_duration: 60, description: 'Jam kerja fleksibel', user_count: 15, status: 'active' },
    { id: 6, name: 'Shift Weekend', start_time: '08:00', end_time: '14:00', break_duration: 30, description: 'Shift akhir pekan', user_count: 5, status: 'inactive' },
  ];

  const columns = [
    { key: 'name', label: 'Nama Shift' },
    {
      key: 'start_time',
      label: 'Jam Mulai',
      width: '100px',
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'end_time',
      label: 'Jam Selesai',
      width: '100px',
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'break_duration',
      label: 'Istirahat',
      width: '100px',
      render: (value) => `${value} menit`,
    },
    { key: 'user_count', label: 'Jumlah User', width: '120px' },
    {
      key: 'status',
      label: 'Status',
      width: '100px',
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  const filters = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'active', label: 'Aktif' },
        { value: 'inactive', label: 'Nonaktif' },
      ],
    },
  ];

  // Filter, sort, and paginate data
  const { paginatedData, totalItems, totalPages } = useMemo(() => {
    let filtered = allData.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(searchValue.toLowerCase());
      const matchStatus = !filterValues.status || item.status === filterValues.status;
      return matchSearch && matchStatus;
    });

    filtered.sort((a, b) => {
      const aVal = a[sortColumn] || '';
      const bVal = b[sortColumn] || '';
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDirection === 'asc'
        ? aVal.toString().localeCompare(bVal.toString())
        : bVal.toString().localeCompare(aVal.toString());
    });

    const total = filtered.length;
    const pages = Math.ceil(total / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(start, start + itemsPerPage);

    return { paginatedData: paginated, totalItems: total, totalPages: pages };
  }, [allData, searchValue, filterValues, sortColumn, sortDirection, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, filterValues]);

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSort = (column, direction) => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({ name: '', start_time: '', end_time: '', break_duration: '', description: '', status: 'active' });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      start_time: item.start_time,
      end_time: item.end_time,
      break_duration: item.break_duration,
      description: item.description,
      status: item.status,
    });
    setIsModalOpen(true);
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

      <DataTable
        columns={columns}
        data={paginatedData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onSort={handleSort}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Shift' : 'Tambah Shift'}
        onSubmit={handleSubmit}
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
          name="status"
          type="select"
          value={formData.status}
          onChange={handleInputChange}
          options={[
            { value: 'active', label: 'Aktif' },
            { value: 'inactive', label: 'Nonaktif' },
          ]}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Shift"
        message={`Apakah Anda yakin ingin menghapus "${selectedItem?.name}"? User yang terdaftar di shift ini akan perlu dipindahkan.`}
        confirmText="Ya, Hapus"
        type="danger"
      />
    </MainLayout>
  );
};

export default Shifts;

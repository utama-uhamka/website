import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import {
  DataTable,
  Modal,
  SearchFilter,
  FormInput,
  StatusBadge,
  ConfirmDialog,
  PageHeader,
} from '../components/ui';
import { FiUsers, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Employees = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    unit: '',
    status: 'active',
  });

  const itemsPerPage = 10;

  // Dummy data
  const units = [
    { value: '1', label: 'Unit A - Limau' },
    { value: '2', label: 'Unit B - Ciracas' },
    { value: '3', label: 'Unit C - Ciledug' },
  ];

  const roles = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Staff', label: 'Staff' },
    { value: 'Security', label: 'Security' },
    { value: 'Cleaning', label: 'Cleaning Service' },
    { value: 'Technician', label: 'Technician' },
  ];

  const allData = [
    { id: 1, name: 'Ahmad Fauzi', email: 'ahmad@uhamka.ac.id', phone: '08123456789', role: 'Admin', unit: 'Unit A - Limau', unit_id: '1', status: 'active' },
    { id: 2, name: 'Siti Nurhaliza', email: 'siti@uhamka.ac.id', phone: '08234567890', role: 'Staff', unit: 'Unit A - Limau', unit_id: '1', status: 'active' },
    { id: 3, name: 'Budi Santoso', email: 'budi@uhamka.ac.id', phone: '08345678901', role: 'Security', unit: 'Unit A - Limau', unit_id: '1', status: 'active' },
    { id: 4, name: 'Dewi Lestari', email: 'dewi@uhamka.ac.id', phone: '08456789012', role: 'Cleaning', unit: 'Unit B - Ciracas', unit_id: '2', status: 'inactive' },
    { id: 5, name: 'Eko Prasetyo', email: 'eko@uhamka.ac.id', phone: '08567890123', role: 'Technician', unit: 'Unit B - Ciracas', unit_id: '2', status: 'active' },
    { id: 6, name: 'Fitri Handayani', email: 'fitri@uhamka.ac.id', phone: '08678901234', role: 'Staff', unit: 'Unit C - Ciledug', unit_id: '3', status: 'active' },
    { id: 7, name: 'Gunawan Wijaya', email: 'gunawan@uhamka.ac.id', phone: '08789012345', role: 'Security', unit: 'Unit C - Ciledug', unit_id: '3', status: 'active' },
    { id: 8, name: 'Hani Rahmawati', email: 'hani@uhamka.ac.id', phone: '08890123456', role: 'Admin', unit: 'Unit B - Ciracas', unit_id: '2', status: 'active' },
    { id: 9, name: 'Irfan Hakim', email: 'irfan@uhamka.ac.id', phone: '08901234567', role: 'Staff', unit: 'Unit A - Limau', unit_id: '1', status: 'active' },
    { id: 10, name: 'Julia Perez', email: 'julia@uhamka.ac.id', phone: '08012345678', role: 'Cleaning', unit: 'Unit A - Limau', unit_id: '1', status: 'active' },
  ];

  const columns = [
    {
      key: 'name',
      label: 'Nama Karyawan',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-primary font-semibold">{value.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone', label: 'Telepon', width: '140px' },
    { key: 'role', label: 'Role', width: '120px' },
    { key: 'unit', label: 'Unit' },
    {
      key: 'status',
      label: 'Status',
      width: '100px',
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  const filters = [
    {
      key: 'unit_id',
      label: 'Unit',
      options: units,
    },
    {
      key: 'role',
      label: 'Role',
      options: roles,
    },
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
      const matchSearch =
        item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.email.toLowerCase().includes(searchValue.toLowerCase());
      const matchUnit = !filterValues.unit_id || item.unit_id === filterValues.unit_id;
      const matchRole = !filterValues.role || item.role === filterValues.role;
      const matchStatus = !filterValues.status || item.status === filterValues.status;
      return matchSearch && matchUnit && matchRole && matchStatus;
    });

    filtered.sort((a, b) => {
      const aVal = a[sortColumn] || '';
      const bVal = b[sortColumn] || '';
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
    setFormData({ name: '', email: '', phone: '', role: '', unit: '', status: 'active' });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      email: item.email,
      phone: item.phone,
      role: item.role,
      unit: item.unit_id,
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleView = (item) => {
    navigate(`/account/${item.id}`);
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

  // Stats
  const totalEmployees = allData.length;
  const activeEmployees = allData.filter(e => e.status === 'active').length;
  const unitCount = [...new Set(allData.map(e => e.unit))].length;

  return (
    <MainLayout>
      <PageHeader
        title="Karyawan"
        subtitle="Kelola data karyawan"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Kepegawaian', path: null },
          { label: 'Karyawan' },
        ]}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-xl">
              <FiUsers className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{totalEmployees}</p>
              <p className="text-sm text-gray-500">Total Karyawan</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <FiUsers className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{activeEmployees}</p>
              <p className="text-sm text-gray-500">Karyawan Aktif</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <FiMapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{unitCount}</p>
              <p className="text-sm text-gray-500">Unit Penempatan</p>
            </div>
          </div>
        </div>
      </div>

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari nama atau email karyawan..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onAdd={handleAdd}
        addLabel="Tambah Karyawan"
      />

      <DataTable
        columns={columns}
        data={paginatedData}
        onView={handleView}
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
        showActions={true}
        actionColumn={{ view: true, edit: true, delete: true }}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Karyawan' : 'Tambah Karyawan'}
        onSubmit={handleSubmit}
      >
        <FormInput
          label="Nama Lengkap"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Contoh: Ahmad Fauzi"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="email@uhamka.ac.id"
            required
          />
          <FormInput
            label="No. Telepon"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="08xxxxxxxxxx"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Role"
            name="role"
            type="select"
            value={formData.role}
            onChange={handleInputChange}
            options={roles}
            required
          />
          <FormInput
            label="Unit"
            name="unit"
            type="select"
            value={formData.unit}
            onChange={handleInputChange}
            options={units}
            required
          />
        </div>
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
        title="Hapus Karyawan"
        message={`Apakah Anda yakin ingin menghapus "${selectedItem?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        type="danger"
      />
    </MainLayout>
  );
};

export default Employees;

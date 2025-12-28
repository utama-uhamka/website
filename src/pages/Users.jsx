import { useState, useEffect, useMemo } from 'react';
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
import { FiUser } from 'react-icons/fi';

const Users = () => {
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
    role_id: '',
    shift_id: '',
    campus_id: '',
    password: '',
    status: 'active',
  });

  const itemsPerPage = 10;

  // Dummy data
  const roles = [
    { value: '1', label: 'Super Admin' },
    { value: '2', label: 'Admin' },
    { value: '3', label: 'Supervisor' },
    { value: '4', label: 'Staff' },
    { value: '5', label: 'Security' },
    { value: '6', label: 'Cleaning Service' },
  ];

  const shifts = [
    { value: '1', label: 'Shift Pagi' },
    { value: '2', label: 'Shift Siang' },
    { value: '3', label: 'Shift Malam' },
    { value: '4', label: 'Shift Office' },
  ];

  const units = [
    { value: '1', label: 'Unit A - Limau' },
    { value: '2', label: 'Unit B - Ciracas' },
    { value: '3', label: 'Unit C - Ciledug' },
  ];

  const allData = [
    { id: 1, name: 'Ahmad Fauzi', email: 'ahmad.fauzi@uhamka.ac.id', phone: '08123456789', role: 'Super Admin', role_id: '1', shift: 'Shift Office', shift_id: '4', campus: 'Unit A', campus_id: '1', avatar: null, status: 'active' },
    { id: 2, name: 'Budi Santoso', email: 'budi.santoso@uhamka.ac.id', phone: '08234567890', role: 'Admin', role_id: '2', shift: 'Shift Office', shift_id: '4', campus: 'Unit A', campus_id: '1', avatar: null, status: 'active' },
    { id: 3, name: 'Citra Dewi', email: 'citra.dewi@uhamka.ac.id', phone: '08345678901', role: 'Supervisor', role_id: '3', shift: 'Shift Pagi', shift_id: '1', campus: 'Unit B', campus_id: '2', avatar: null, status: 'active' },
    { id: 4, name: 'Dani Pratama', email: 'dani.pratama@uhamka.ac.id', phone: '08456789012', role: 'Staff', role_id: '4', shift: 'Shift Pagi', shift_id: '1', campus: 'Unit A', campus_id: '1', avatar: null, status: 'active' },
    { id: 5, name: 'Eko Wijaya', email: 'eko.wijaya@uhamka.ac.id', phone: '08567890123', role: 'Security', role_id: '5', shift: 'Shift Malam', shift_id: '3', campus: 'Unit C', campus_id: '3', avatar: null, status: 'active' },
    { id: 6, name: 'Fitri Rahayu', email: 'fitri.rahayu@uhamka.ac.id', phone: '08678901234', role: 'Cleaning Service', role_id: '6', shift: 'Shift Pagi', shift_id: '1', campus: 'Unit B', campus_id: '2', avatar: null, status: 'inactive' },
    { id: 7, name: 'Gunawan Hidayat', email: 'gunawan.h@uhamka.ac.id', phone: '08789012345', role: 'Staff', role_id: '4', shift: 'Shift Siang', shift_id: '2', campus: 'Unit A', campus_id: '1', avatar: null, status: 'active' },
    { id: 8, name: 'Hendra Kusuma', email: 'hendra.k@uhamka.ac.id', phone: '08890123456', role: 'Security', role_id: '5', shift: 'Shift Malam', shift_id: '3', campus: 'Unit A', campus_id: '1', avatar: null, status: 'active' },
    { id: 9, name: 'Indah Permata', email: 'indah.p@uhamka.ac.id', phone: '08901234567', role: 'Cleaning Service', role_id: '6', shift: 'Shift Siang', shift_id: '2', campus: 'Unit C', campus_id: '3', avatar: null, status: 'active' },
    { id: 10, name: 'Joko Widodo', email: 'joko.w@uhamka.ac.id', phone: '08012345678', role: 'Supervisor', role_id: '3', shift: 'Shift Pagi', shift_id: '1', campus: 'Unit A', campus_id: '1', avatar: null, status: 'active' },
    { id: 11, name: 'Kartini Sari', email: 'kartini.s@uhamka.ac.id', phone: '08112233445', role: 'Staff', role_id: '4', shift: 'Shift Pagi', shift_id: '1', campus: 'Unit B', campus_id: '2', avatar: null, status: 'inactive' },
    { id: 12, name: 'Lukman Hakim', email: 'lukman.h@uhamka.ac.id', phone: '08223344556', role: 'Admin', role_id: '2', shift: 'Shift Office', shift_id: '4', campus: 'Unit B', campus_id: '2', avatar: null, status: 'active' },
  ];

  const columns = [
    {
      key: 'name',
      label: 'User',
      render: (value, item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            {item.avatar ? (
              <img src={item.avatar} alt={value} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <FiUser className="text-primary" size={18} />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">{item.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone', label: 'Telepon', width: '130px' },
    {
      key: 'role',
      label: 'Role',
      width: '130px',
      render: (value) => (
        <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full whitespace-nowrap">
          {value}
        </span>
      ),
    },
    { key: 'shift', label: 'Shift', width: '120px' },
    { key: 'campus', label: 'Unit', width: '130px' },
    {
      key: 'status',
      label: 'Status',
      width: '100px',
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  const filters = [
    {
      key: 'role_id',
      label: 'Role',
      options: roles,
    },
    {
      key: 'campus_id',
      label: 'Unit',
      options: units,
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
      const matchRole = !filterValues.role_id || item.role_id === filterValues.role_id;
      const matchCampus = !filterValues.campus_id || item.campus_id === filterValues.campus_id;
      const matchStatus = !filterValues.status || item.status === filterValues.status;
      return matchSearch && matchRole && matchCampus && matchStatus;
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
    setFormData({
      name: '',
      email: '',
      phone: '',
      role_id: '',
      shift_id: '',
      campus_id: '',
      password: '',
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      email: item.email,
      phone: item.phone,
      role_id: item.role_id,
      shift_id: item.shift_id,
      campus_id: item.campus_id,
      password: '',
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
        title="Manajemen User"
        subtitle="Kelola pengguna sistem"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'User Management', path: null },
          { label: 'Users' },
        ]}
      />

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari nama atau email..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onAdd={handleAdd}
        addLabel="Tambah User"
        showExport={true}
        onExport={() => console.log('Export users')}
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
        title={selectedItem ? 'Edit User' : 'Tambah User'}
        onSubmit={handleSubmit}
        size="lg"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Nama Lengkap"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Masukkan nama lengkap"
            required
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="email@uhamka.ac.id"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="No. Telepon"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="08xxxxxxxxxx"
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder={selectedItem ? 'Kosongkan jika tidak diubah' : 'Masukkan password'}
            required={!selectedItem}
            helperText={selectedItem ? 'Kosongkan jika tidak ingin mengubah password' : ''}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormInput
            label="Role"
            name="role_id"
            type="select"
            value={formData.role_id}
            onChange={handleInputChange}
            options={roles}
            required
          />
          <FormInput
            label="Shift"
            name="shift_id"
            type="select"
            value={formData.shift_id}
            onChange={handleInputChange}
            options={shifts}
            required
          />
          <FormInput
            label="Unit"
            name="campus_id"
            type="select"
            value={formData.campus_id}
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
        title="Hapus User"
        message={`Apakah Anda yakin ingin menghapus user "${selectedItem?.name}"? Semua data terkait user ini akan ikut terhapus.`}
        confirmText="Ya, Hapus"
        type="danger"
      />
    </MainLayout>
  );
};

export default Users;

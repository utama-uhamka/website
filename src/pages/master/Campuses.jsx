import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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

const Campuses = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('code');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    phone: '',
    status: 'active',
  });

  const itemsPerPage = 10;

  // Dummy data
  const allData = [
    { id: 1, name: 'Unit A - Limau', code: 'UA', address: 'Jl. Limau II, Jakarta', phone: '021-1234567', status: 'active' },
    { id: 2, name: 'Unit B - Ciracas', code: 'UB', address: 'Jl. Raya Bogor, Jakarta Timur', phone: '021-2345678', status: 'active' },
    { id: 3, name: 'Unit C - Ciledug', code: 'UC', address: 'Jl. Ciledug Raya, Tangerang', phone: '021-3456789', status: 'active' },
    { id: 4, name: 'Unit D - Pasar Rebo', code: 'UD', address: 'Jl. Pasar Rebo, Jakarta Timur', phone: '021-4567890', status: 'inactive' },
    { id: 5, name: 'Unit E - Condet', code: 'UE', address: 'Jl. Raya Condet, Jakarta Timur', phone: '021-5678901', status: 'active' },
    { id: 6, name: 'Unit F - Bekasi', code: 'UF', address: 'Jl. Ahmad Yani, Bekasi', phone: '021-6789012', status: 'active' },
    { id: 7, name: 'Unit G - Depok', code: 'UG', address: 'Jl. Margonda Raya, Depok', phone: '021-7890123', status: 'inactive' },
    { id: 8, name: 'Unit H - Tangerang', code: 'UH', address: 'Jl. MH Thamrin, Tangerang', phone: '021-8901234', status: 'active' },
    { id: 9, name: 'Unit I - Bogor', code: 'UI', address: 'Jl. Pajajaran, Bogor', phone: '0251-1234567', status: 'active' },
    { id: 10, name: 'Unit J - Cibubur', code: 'UJ', address: 'Jl. Alternatif Cibubur', phone: '021-9012345', status: 'inactive' },
    { id: 11, name: 'Unit K - Serpong', code: 'UK', address: 'Jl. BSD Raya, Serpong', phone: '021-0123456', status: 'active' },
    { id: 12, name: 'Unit L - Cinere', code: 'UL', address: 'Jl. Cinere Raya, Depok', phone: '021-1122334', status: 'active' },
  ];

  const columns = [
    { key: 'code', label: 'Kode', width: '80px' },
    { key: 'name', label: 'Nama Unit' },
    { key: 'address', label: 'Alamat' },
    { key: 'phone', label: 'Telepon', width: '140px' },
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
    // Filter
    let filtered = allData.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.code.toLowerCase().includes(searchValue.toLowerCase());
      const matchStatus = !filterValues.status || item.status === filterValues.status;
      return matchSearch && matchStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      const aVal = a[sortColumn] || '';
      const bVal = b[sortColumn] || '';
      if (sortDirection === 'asc') {
        return aVal.toString().localeCompare(bVal.toString());
      }
      return bVal.toString().localeCompare(aVal.toString());
    });

    const total = filtered.length;
    const pages = Math.ceil(total / itemsPerPage);

    // Paginate
    const start = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(start, start + itemsPerPage);

    return { paginatedData: paginated, totalItems: total, totalPages: pages };
  }, [allData, searchValue, filterValues, sortColumn, sortDirection, currentPage]);

  // Reset to page 1 when filters change
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
    setFormData({ name: '', code: '', address: '', phone: '', status: 'active' });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      code: item.code,
      address: item.address,
      phone: item.phone,
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleView = (item) => {
    navigate(`/master/units/${item.id}`);
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
        title="Unit"
        subtitle="Kelola data unit/kampus universitas"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Master Data', path: null },
          { label: 'Unit' },
        ]}
      />

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari nama atau kode unit..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onAdd={handleAdd}
        addLabel="Tambah Unit"
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
        actionColumn={{ view: true, edit: true, delete: true }}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Unit' : 'Tambah Unit'}
        onSubmit={handleSubmit}
      >
        <FormInput
          label="Kode Unit"
          name="code"
          value={formData.code}
          onChange={handleInputChange}
          placeholder="Contoh: UA"
          required
        />
        <FormInput
          label="Nama Unit"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Contoh: Unit A - Limau"
          required
        />
        <FormInput
          label="Alamat"
          name="address"
          type="textarea"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Masukkan alamat lengkap unit"
          required
        />
        <FormInput
          label="Telepon"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Contoh: 021-1234567"
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
        title="Hapus Unit"
        message={`Apakah Anda yakin ingin menghapus "${selectedItem?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        type="danger"
      />
    </MainLayout>
  );
};

export default Campuses;

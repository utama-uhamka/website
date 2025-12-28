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

const Floors = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('floor_number');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    building_id: '',
    floor_number: '',
    description: '',
    status: 'active',
  });

  const itemsPerPage = 10;

  // Dummy data
  const buildings = [
    { value: '1', label: 'Gedung Rektorat - Unit A' },
    { value: '2', label: 'Gedung FKIP - Unit A' },
    { value: '3', label: 'Gedung FEB - Unit B' },
    { value: '4', label: 'Gedung FT - Unit B' },
  ];

  const allData = [
    { id: 1, name: 'Lantai 1', building: 'Gedung Rektorat', building_id: '1', floor_number: 1, description: 'Lobby dan Administrasi', status: 'active' },
    { id: 2, name: 'Lantai 2', building: 'Gedung Rektorat', building_id: '1', floor_number: 2, description: 'Ruang Rektorat', status: 'active' },
    { id: 3, name: 'Lantai 3', building: 'Gedung Rektorat', building_id: '1', floor_number: 3, description: 'Ruang Rapat', status: 'active' },
    { id: 4, name: 'Lantai 4', building: 'Gedung Rektorat', building_id: '1', floor_number: 4, description: 'Ruang Server', status: 'active' },
    { id: 5, name: 'Lantai 5', building: 'Gedung Rektorat', building_id: '1', floor_number: 5, description: 'Rooftop', status: 'inactive' },
    { id: 6, name: 'Lantai 1', building: 'Gedung FKIP', building_id: '2', floor_number: 1, description: 'Ruang Dosen', status: 'active' },
    { id: 7, name: 'Lantai 2', building: 'Gedung FKIP', building_id: '2', floor_number: 2, description: 'Ruang Kuliah', status: 'active' },
    { id: 8, name: 'Lantai 3', building: 'Gedung FKIP', building_id: '2', floor_number: 3, description: 'Laboratorium', status: 'active' },
    { id: 9, name: 'Lantai 1', building: 'Gedung FEB', building_id: '3', floor_number: 1, description: 'Lobby', status: 'active' },
    { id: 10, name: 'Lantai 2', building: 'Gedung FEB', building_id: '3', floor_number: 2, description: 'Ruang Kuliah', status: 'active' },
    { id: 11, name: 'Basement', building: 'Gedung FT', building_id: '4', floor_number: 0, description: 'Parkir', status: 'inactive' },
    { id: 12, name: 'Lantai 1', building: 'Gedung FT', building_id: '4', floor_number: 1, description: 'Workshop', status: 'active' },
  ];

  const columns = [
    { key: 'name', label: 'Nama Lantai' },
    { key: 'building', label: 'Gedung' },
    { key: 'floor_number', label: 'Nomor Lantai', width: '120px' },
    { key: 'description', label: 'Deskripsi' },
    {
      key: 'status',
      label: 'Status',
      width: '100px',
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  const filters = [
    {
      key: 'building_id',
      label: 'Gedung',
      options: buildings,
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
      const matchSearch = item.name.toLowerCase().includes(searchValue.toLowerCase());
      const matchBuilding = !filterValues.building_id || item.building_id === filterValues.building_id;
      const matchStatus = !filterValues.status || item.status === filterValues.status;
      return matchSearch && matchBuilding && matchStatus;
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
    setFormData({ name: '', building_id: '', floor_number: '', description: '', status: 'active' });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      building_id: item.building_id,
      floor_number: item.floor_number,
      description: item.description,
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleView = (item) => {
    navigate(`/master/floors/${item.id}`);
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
        title="Lantai"
        subtitle="Kelola data lantai di setiap gedung"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Master Data', path: null },
          { label: 'Lantai' },
        ]}
      />

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari nama lantai..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onAdd={handleAdd}
        addLabel="Tambah Lantai"
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
        title={selectedItem ? 'Edit Lantai' : 'Tambah Lantai'}
        onSubmit={handleSubmit}
      >
        <FormInput
          label="Gedung"
          name="building_id"
          type="select"
          value={formData.building_id}
          onChange={handleInputChange}
          options={buildings}
          required
        />
        <FormInput
          label="Nama Lantai"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Contoh: Lantai 1"
          required
        />
        <FormInput
          label="Nomor Lantai"
          name="floor_number"
          type="number"
          value={formData.floor_number}
          onChange={handleInputChange}
          placeholder="Contoh: 1"
          required
        />
        <FormInput
          label="Deskripsi"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Deskripsi lantai"
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
        title="Hapus Lantai"
        message={`Apakah Anda yakin ingin menghapus "${selectedItem?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        type="danger"
      />
    </MainLayout>
  );
};

export default Floors;

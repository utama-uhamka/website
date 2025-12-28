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

const Buildings = () => {
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
    campus_id: '',
    floors_count: '',
    description: '',
    status: 'active',
  });

  const itemsPerPage = 10;

  // Dummy data
  const units = [
    { value: '1', label: 'Unit A - Limau' },
    { value: '2', label: 'Unit B - Ciracas' },
    { value: '3', label: 'Unit C - Ciledug' },
    { value: '4', label: 'Unit D - Pasar Rebo' },
  ];

  const allData = [
    { id: 1, name: 'Gedung Rektorat', campus: 'Unit A - Limau', campus_id: '1', floors_count: 5, description: 'Gedung pusat administrasi', status: 'active' },
    { id: 2, name: 'Gedung FKIP', campus: 'Unit A - Limau', campus_id: '1', floors_count: 4, description: 'Fakultas Keguruan', status: 'active' },
    { id: 3, name: 'Gedung FEB', campus: 'Unit B - Ciracas', campus_id: '2', floors_count: 6, description: 'Fakultas Ekonomi', status: 'active' },
    { id: 4, name: 'Gedung FT', campus: 'Unit B - Ciracas', campus_id: '2', floors_count: 5, description: 'Fakultas Teknik', status: 'active' },
    { id: 5, name: 'Gedung FK', campus: 'Unit C - Ciledug', campus_id: '3', floors_count: 7, description: 'Fakultas Kedokteran', status: 'active' },
    { id: 6, name: 'Gedung Farmasi', campus: 'Unit C - Ciledug', campus_id: '3', floors_count: 4, description: 'Fakultas Farmasi', status: 'inactive' },
    { id: 7, name: 'Gedung Perpustakaan', campus: 'Unit A - Limau', campus_id: '1', floors_count: 3, description: 'Perpustakaan Pusat', status: 'active' },
    { id: 8, name: 'Gedung Lab Terpadu', campus: 'Unit B - Ciracas', campus_id: '2', floors_count: 4, description: 'Laboratorium Terpadu', status: 'active' },
    { id: 9, name: 'Gedung Aula', campus: 'Unit A - Limau', campus_id: '1', floors_count: 2, description: 'Aula Utama', status: 'active' },
    { id: 10, name: 'Gedung Olahraga', campus: 'Unit D - Pasar Rebo', campus_id: '4', floors_count: 2, description: 'Gedung Olahraga', status: 'active' },
    { id: 11, name: 'Gedung Pascasarjana', campus: 'Unit A - Limau', campus_id: '1', floors_count: 5, description: 'Program Pascasarjana', status: 'active' },
    { id: 12, name: 'Gedung Asrama', campus: 'Unit C - Ciledug', campus_id: '3', floors_count: 6, description: 'Asrama Mahasiswa', status: 'inactive' },
  ];

  const columns = [
    { key: 'name', label: 'Nama Gedung' },
    { key: 'campus', label: 'Unit' },
    { key: 'floors_count', label: 'Jumlah Lantai', width: '120px' },
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
      const matchSearch = item.name.toLowerCase().includes(searchValue.toLowerCase());
      const matchCampus = !filterValues.campus_id || item.campus_id === filterValues.campus_id;
      const matchStatus = !filterValues.status || item.status === filterValues.status;
      return matchSearch && matchCampus && matchStatus;
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
    setFormData({ name: '', campus_id: '', floors_count: '', description: '', status: 'active' });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      campus_id: item.campus_id,
      floors_count: item.floors_count,
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
    navigate(`/master/buildings/${item.id}`);
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
        title="Gedung"
        subtitle="Kelola data gedung di setiap unit"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Master Data', path: null },
          { label: 'Gedung' },
        ]}
      />

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari nama gedung..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onAdd={handleAdd}
        addLabel="Tambah Gedung"
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
        title={selectedItem ? 'Edit Gedung' : 'Tambah Gedung'}
        onSubmit={handleSubmit}
      >
        <FormInput
          label="Unit"
          name="campus_id"
          type="select"
          value={formData.campus_id}
          onChange={handleInputChange}
          options={units}
          required
        />
        <FormInput
          label="Nama Gedung"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Contoh: Gedung Rektorat"
          required
        />
        <FormInput
          label="Jumlah Lantai"
          name="floors_count"
          type="number"
          value={formData.floors_count}
          onChange={handleInputChange}
          placeholder="Contoh: 5"
          required
        />
        <FormInput
          label="Deskripsi"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Deskripsi gedung"
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
        title="Hapus Gedung"
        message={`Apakah Anda yakin ingin menghapus "${selectedItem?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        type="danger"
      />
    </MainLayout>
  );
};

export default Buildings;

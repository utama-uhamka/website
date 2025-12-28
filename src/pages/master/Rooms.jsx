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

const Rooms = () => {
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
    floor_id: '',
    capacity: '',
    type: '',
    status: 'active',
  });

  const itemsPerPage = 10;

  // Dummy data
  const floors = [
    { value: '1', label: 'Lantai 1 - Gedung Rektorat' },
    { value: '2', label: 'Lantai 2 - Gedung Rektorat' },
    { value: '3', label: 'Lantai 1 - Gedung FKIP' },
    { value: '4', label: 'Lantai 2 - Gedung FKIP' },
  ];

  const roomTypes = [
    { value: 'classroom', label: 'Ruang Kelas' },
    { value: 'lab', label: 'Laboratorium' },
    { value: 'office', label: 'Kantor' },
    { value: 'meeting', label: 'Ruang Rapat' },
    { value: 'other', label: 'Lainnya' },
  ];

  const allData = [
    { id: 1, name: 'Ruang 101', code: 'R-101', floor: 'Lt. 1 - Ged. Rektorat', floor_id: '1', capacity: 40, type: 'classroom', type_label: 'Ruang Kelas', status: 'active' },
    { id: 2, name: 'Ruang 102', code: 'R-102', floor: 'Lt. 1 - Ged. Rektorat', floor_id: '1', capacity: 30, type: 'classroom', type_label: 'Ruang Kelas', status: 'active' },
    { id: 3, name: 'Lab Komputer', code: 'LAB-01', floor: 'Lt. 2 - Ged. Rektorat', floor_id: '2', capacity: 50, type: 'lab', type_label: 'Laboratorium', status: 'active' },
    { id: 4, name: 'Ruang Rapat A', code: 'MTG-A', floor: 'Lt. 2 - Ged. Rektorat', floor_id: '2', capacity: 20, type: 'meeting', type_label: 'Ruang Rapat', status: 'active' },
    { id: 5, name: 'Kantor Dosen', code: 'OFF-01', floor: 'Lt. 1 - Ged. FKIP', floor_id: '3', capacity: 10, type: 'office', type_label: 'Kantor', status: 'active' },
    { id: 6, name: 'Ruang 201', code: 'R-201', floor: 'Lt. 2 - Ged. FKIP', floor_id: '4', capacity: 45, type: 'classroom', type_label: 'Ruang Kelas', status: 'active' },
    { id: 7, name: 'Gudang', code: 'GDG-01', floor: 'Lt. 1 - Ged. Rektorat', floor_id: '1', capacity: 0, type: 'other', type_label: 'Lainnya', status: 'inactive' },
    { id: 8, name: 'Lab Bahasa', code: 'LAB-02', floor: 'Lt. 2 - Ged. FKIP', floor_id: '4', capacity: 35, type: 'lab', type_label: 'Laboratorium', status: 'active' },
    { id: 9, name: 'Ruang 103', code: 'R-103', floor: 'Lt. 1 - Ged. Rektorat', floor_id: '1', capacity: 35, type: 'classroom', type_label: 'Ruang Kelas', status: 'active' },
    { id: 10, name: 'Ruang Rapat B', code: 'MTG-B', floor: 'Lt. 2 - Ged. Rektorat', floor_id: '2', capacity: 15, type: 'meeting', type_label: 'Ruang Rapat', status: 'active' },
    { id: 11, name: 'Kantor Admin', code: 'OFF-02', floor: 'Lt. 1 - Ged. Rektorat', floor_id: '1', capacity: 8, type: 'office', type_label: 'Kantor', status: 'active' },
    { id: 12, name: 'Ruang Server', code: 'SRV-01', floor: 'Lt. 2 - Ged. Rektorat', floor_id: '2', capacity: 5, type: 'other', type_label: 'Lainnya', status: 'active' },
  ];

  const columns = [
    { key: 'code', label: 'Kode', width: '100px' },
    { key: 'name', label: 'Nama Ruangan' },
    { key: 'floor', label: 'Lantai' },
    { key: 'type_label', label: 'Tipe', width: '120px' },
    { key: 'capacity', label: 'Kapasitas', width: '100px' },
    {
      key: 'status',
      label: 'Status',
      width: '100px',
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  const filters = [
    {
      key: 'floor_id',
      label: 'Lantai',
      options: floors,
    },
    {
      key: 'type',
      label: 'Tipe',
      options: roomTypes,
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
        item.code.toLowerCase().includes(searchValue.toLowerCase());
      const matchFloor = !filterValues.floor_id || item.floor_id === filterValues.floor_id;
      const matchType = !filterValues.type || item.type === filterValues.type;
      const matchStatus = !filterValues.status || item.status === filterValues.status;
      return matchSearch && matchFloor && matchType && matchStatus;
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
    setFormData({ name: '', code: '', floor_id: '', capacity: '', type: '', status: 'active' });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      code: item.code,
      floor_id: item.floor_id,
      capacity: item.capacity,
      type: item.type,
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleView = (item) => {
    navigate(`/master/rooms/${item.id}`);
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
        title="Ruangan"
        subtitle="Kelola data ruangan di setiap lantai"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Master Data', path: null },
          { label: 'Ruangan' },
        ]}
      />

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari nama atau kode ruangan..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onAdd={handleAdd}
        addLabel="Tambah Ruangan"
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
        title={selectedItem ? 'Edit Ruangan' : 'Tambah Ruangan'}
        onSubmit={handleSubmit}
      >
        <FormInput
          label="Lantai"
          name="floor_id"
          type="select"
          value={formData.floor_id}
          onChange={handleInputChange}
          options={floors}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Kode Ruangan"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            placeholder="Contoh: R-101"
            required
          />
          <FormInput
            label="Nama Ruangan"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Contoh: Ruang 101"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Tipe Ruangan"
            name="type"
            type="select"
            value={formData.type}
            onChange={handleInputChange}
            options={roomTypes}
            required
          />
          <FormInput
            label="Kapasitas"
            name="capacity"
            type="number"
            value={formData.capacity}
            onChange={handleInputChange}
            placeholder="Contoh: 40"
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
        title="Hapus Ruangan"
        message={`Apakah Anda yakin ingin menghapus "${selectedItem?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        type="danger"
      />
    </MainLayout>
  );
};

export default Rooms;

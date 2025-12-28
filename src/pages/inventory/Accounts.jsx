import { useState } from 'react';
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
import { FiCreditCard } from 'react-icons/fi';

const Accounts = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    account_number: '',
    type: '',
    provider: '',
    campus_id: '',
    building_id: '',
    balance: '',
    description: '',
    status: 'active',
  });

  // Dummy data
  const campuses = [
    { value: '1', label: 'Kampus A - Limau' },
    { value: '2', label: 'Kampus B - Ciracas' },
    { value: '3', label: 'Kampus C - Ciledug' },
  ];

  const buildings = [
    { value: '1', label: 'Gedung Rektorat' },
    { value: '2', label: 'Gedung FKIP' },
    { value: '3', label: 'Gedung FEB' },
  ];

  const accountTypes = [
    { value: 'pln', label: 'PLN' },
    { value: 'pdam', label: 'PDAM' },
    { value: 'internet', label: 'Internet' },
    { value: 'phone', label: 'Telepon' },
    { value: 'gas', label: 'Gas' },
  ];

  const data = [
    { id: 1, name: 'PLN Gedung Rektorat', account_number: '541234567890', type: 'pln', type_label: 'PLN', provider: 'PLN', campus: 'Kampus A', campus_id: '1', building: 'Gedung Rektorat', building_id: '1', balance: 5000000, status: 'active' },
    { id: 2, name: 'PDAM Gedung Rektorat', account_number: '12345678', type: 'pdam', type_label: 'PDAM', provider: 'PAM Jaya', campus: 'Kampus A', campus_id: '1', building: 'Gedung Rektorat', building_id: '1', balance: 2500000, status: 'active' },
    { id: 3, name: 'PLN Gedung FKIP', account_number: '541234567891', type: 'pln', type_label: 'PLN', provider: 'PLN', campus: 'Kampus A', campus_id: '1', building: 'Gedung FKIP', building_id: '2', balance: 4500000, status: 'active' },
    { id: 4, name: 'Internet Kampus A', account_number: 'INT-001-KA', type: 'internet', type_label: 'Internet', provider: 'Telkom', campus: 'Kampus A', campus_id: '1', building: '-', building_id: '', balance: 10000000, status: 'active' },
    { id: 5, name: 'PLN Gedung FEB', account_number: '541234567892', type: 'pln', type_label: 'PLN', provider: 'PLN', campus: 'Kampus B', campus_id: '2', building: 'Gedung FEB', building_id: '3', balance: 3800000, status: 'active' },
    { id: 6, name: 'Telepon Kampus A', account_number: 'TEL-001-KA', type: 'phone', type_label: 'Telepon', provider: 'Telkom', campus: 'Kampus A', campus_id: '1', building: '-', building_id: '', balance: 1500000, status: 'inactive' },
  ];

  const columns = [
    {
      key: 'name',
      label: 'Akun',
      render: (value, item) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            item.type === 'pln' ? 'bg-yellow-100' :
            item.type === 'pdam' ? 'bg-blue-100' :
            item.type === 'internet' ? 'bg-purple-100' :
            'bg-gray-100'
          }`}>
            <FiCreditCard className={`${
              item.type === 'pln' ? 'text-yellow-600' :
              item.type === 'pdam' ? 'text-blue-600' :
              item.type === 'internet' ? 'text-purple-600' :
              'text-gray-600'
            }`} size={18} />
          </div>
          <div>
            <p className="font-medium text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">{item.account_number}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'type_label',
      label: 'Tipe',
      width: '100px',
      render: (value, item) => {
        const typeColors = {
          pln: 'bg-yellow-100 text-yellow-700',
          pdam: 'bg-blue-100 text-blue-700',
          internet: 'bg-purple-100 text-purple-700',
          phone: 'bg-green-100 text-green-700',
          gas: 'bg-orange-100 text-orange-700',
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeColors[item.type] || 'bg-gray-100 text-gray-700'}`}>
            {value}
          </span>
        );
      },
    },
    { key: 'provider', label: 'Provider', width: '100px' },
    { key: 'campus', label: 'Kampus', width: '120px' },
    { key: 'building', label: 'Gedung', width: '130px' },
    {
      key: 'balance',
      label: 'Saldo/Tagihan',
      width: '140px',
      render: (value) => (
        <span className="font-medium">Rp {value.toLocaleString('id-ID')}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '100px',
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  const filters = [
    {
      key: 'type',
      label: 'Tipe',
      options: accountTypes,
    },
    {
      key: 'campus_id',
      label: 'Kampus',
      options: campuses,
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

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({
      name: '',
      account_number: '',
      type: '',
      provider: '',
      campus_id: '',
      building_id: '',
      balance: '',
      description: '',
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      account_number: item.account_number,
      type: item.type,
      provider: item.provider,
      campus_id: item.campus_id,
      building_id: item.building_id,
      balance: item.balance,
      description: item.description || '',
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

  // Filter data
  const filteredData = data.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.account_number.toLowerCase().includes(searchValue.toLowerCase());
    const matchType = !filterValues.type || item.type === filterValues.type;
    const matchCampus = !filterValues.campus_id || item.campus_id === filterValues.campus_id;
    const matchStatus = !filterValues.status || item.status === filterValues.status;
    return matchSearch && matchType && matchCampus && matchStatus;
  });

  return (
    <MainLayout>
      <PageHeader
        title="Akun Utility"
        subtitle="Kelola akun PLN, PDAM, Internet, dan lainnya"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Inventaris', path: null },
          { label: 'Accounts' },
        ]}
      />

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari nama atau nomor akun..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onAdd={handleAdd}
        addLabel="Tambah Akun"
      />

      <DataTable
        columns={columns}
        data={filteredData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredData.length / 10)}
        onPageChange={setCurrentPage}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Akun' : 'Tambah Akun'}
        onSubmit={handleSubmit}
        size="lg"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Nama Akun"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Contoh: PLN Gedung Rektorat"
            required
          />
          <FormInput
            label="Nomor Akun"
            name="account_number"
            value={formData.account_number}
            onChange={handleInputChange}
            placeholder="Nomor rekening/pelanggan"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Tipe Akun"
            name="type"
            type="select"
            value={formData.type}
            onChange={handleInputChange}
            options={accountTypes}
            required
          />
          <FormInput
            label="Provider"
            name="provider"
            value={formData.provider}
            onChange={handleInputChange}
            placeholder="Contoh: PLN, PAM Jaya"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Kampus"
            name="campus_id"
            type="select"
            value={formData.campus_id}
            onChange={handleInputChange}
            options={campuses}
            required
          />
          <FormInput
            label="Gedung"
            name="building_id"
            type="select"
            value={formData.building_id}
            onChange={handleInputChange}
            options={buildings}
            placeholder="Pilih gedung (opsional)"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Saldo / Tagihan Awal"
            name="balance"
            type="number"
            value={formData.balance}
            onChange={handleInputChange}
            placeholder="0"
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
        </div>
        <FormInput
          label="Deskripsi"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Catatan tambahan"
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Akun"
        message={`Apakah Anda yakin ingin menghapus "${selectedItem?.name}"? Data billing terkait akan tetap tersimpan.`}
        confirmText="Ya, Hapus"
        type="danger"
      />
    </MainLayout>
  );
};

export default Accounts;

import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
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
import { FiCreditCard, FiLoader } from 'react-icons/fi';
import {
  fetchAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
  clearMasterError,
  clearMasterSuccess,
} from '../../store/masterSlice';
import { fetchCampuses } from '../../store/campusesSlice';
import { fetchBuildings } from '../../store/masterSlice';

const Accounts = () => {
  const dispatch = useDispatch();
  const { accounts, buildings, loading, error, success } = useSelector((state) => state.master);
  const { data: campuses } = useSelector((state) => state.campuses);

  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    account_name: '',
    account_number: '',
    account_type: '',
    provider: '',
    campus_id: '',
    building_id: '',
    balance: '',
    description: '',
    is_active: 1,
  });

  const itemsPerPage = 10;

  const accountTypes = [
    { value: 'pln', label: 'PLN' },
    { value: 'pdam', label: 'PDAM' },
    { value: 'internet', label: 'Internet' },
    { value: 'phone', label: 'Telepon' },
    { value: 'gas', label: 'Gas' },
  ];

  // Load accounts
  const loadAccounts = useCallback(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchValue,
      ...filterValues,
    };
    dispatch(fetchAccounts(params));
  }, [dispatch, currentPage, itemsPerPage, searchValue, filterValues]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  // Load campuses and buildings for filters
  useEffect(() => {
    dispatch(fetchCampuses({ limit: 100 }));
    dispatch(fetchBuildings({ limit: 100 }));
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearMasterError());
    }
  }, [error, dispatch]);

  // Handle success
  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearMasterSuccess());
      loadAccounts();
    }
  }, [success, dispatch, loadAccounts]);

  // Reset page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, filterValues]);

  // Campus options
  const campusOptions = campuses.map((c) => ({
    value: c.campus_id?.toString(),
    label: c.campus_name,
  }));

  // Building options (filtered by campus if selected)
  const buildingOptions = buildings.data
    .filter((b) => !formData.campus_id || b.campus_id?.toString() === formData.campus_id)
    .map((b) => ({
      value: b.building_id?.toString(),
      label: b.building_name,
    }));

  const columns = [
    {
      key: 'account_name',
      label: 'Akun',
      render: (value, item) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              item.account_type === 'pln'
                ? 'bg-yellow-100'
                : item.account_type === 'pdam'
                ? 'bg-blue-100'
                : item.account_type === 'internet'
                ? 'bg-purple-100'
                : 'bg-gray-100'
            }`}
          >
            <FiCreditCard
              className={`${
                item.account_type === 'pln'
                  ? 'text-yellow-600'
                  : item.account_type === 'pdam'
                  ? 'text-blue-600'
                  : item.account_type === 'internet'
                  ? 'text-purple-600'
                  : 'text-gray-600'
              }`}
              size={18}
            />
          </div>
          <div>
            <p className="font-medium text-gray-800">{value || '-'}</p>
            <p className="text-xs text-gray-500">{item.account_number || '-'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'account_type',
      label: 'Tipe',
      width: '100px',
      render: (value) => {
        const typeColors = {
          pln: 'bg-yellow-100 text-yellow-700',
          pdam: 'bg-blue-100 text-blue-700',
          internet: 'bg-purple-100 text-purple-700',
          phone: 'bg-green-100 text-green-700',
          gas: 'bg-orange-100 text-orange-700',
        };
        const typeLabels = {
          pln: 'PLN',
          pdam: 'PDAM',
          internet: 'Internet',
          phone: 'Telepon',
          gas: 'Gas',
        };
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${typeColors[value] || 'bg-gray-100 text-gray-700'}`}
          >
            {typeLabels[value] || value || '-'}
          </span>
        );
      },
    },
    { key: 'provider', label: 'Provider', width: '100px', render: (value) => value || '-' },
    {
      key: 'campus',
      label: 'Kampus',
      width: '120px',
      render: (value, item) => item.campus?.campus_name || '-',
    },
    {
      key: 'building',
      label: 'Gedung',
      width: '130px',
      render: (value, item) => item.building?.building_name || '-',
    },
    {
      key: 'balance',
      label: 'Saldo/Tagihan',
      width: '140px',
      render: (value) => (
        <span className="font-medium">
          {value ? `Rp ${Number(value).toLocaleString('id-ID')}` : 'Rp 0'}
        </span>
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      width: '100px',
      render: (value) => <StatusBadge status={value === 1 ? 'active' : 'inactive'} />,
    },
  ];

  const filters = [
    {
      key: 'account_type',
      label: 'Tipe',
      options: accountTypes,
    },
    {
      key: 'campus_id',
      label: 'Kampus',
      options: campusOptions,
    },
    {
      key: 'is_active',
      label: 'Status',
      options: [
        { value: '1', label: 'Aktif' },
        { value: '0', label: 'Nonaktif' },
      ],
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({
      account_name: '',
      account_number: '',
      account_type: '',
      provider: '',
      campus_id: '',
      building_id: '',
      balance: '',
      description: '',
      is_active: 1,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      account_name: item.account_name || '',
      account_number: item.account_number || '',
      account_type: item.account_type || '',
      provider: item.provider || '',
      campus_id: item.campus_id?.toString() || '',
      building_id: item.building_id?.toString() || '',
      balance: item.balance?.toString() || '',
      description: item.description || '',
      is_active: item.is_active,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async () => {
    setFormLoading(true);
    try {
      const submitData = {
        account_name: formData.account_name,
        account_number: formData.account_number,
        account_type: formData.account_type,
        provider: formData.provider,
        campus_id: formData.campus_id ? parseInt(formData.campus_id) : null,
        building_id: formData.building_id ? parseInt(formData.building_id) : null,
        balance: formData.balance ? parseFloat(formData.balance) : 0,
        description: formData.description,
        is_active: parseInt(formData.is_active),
      };

      if (selectedItem) {
        await dispatch(updateAccount({ id: selectedItem.account_id, data: submitData })).unwrap();
      } else {
        await dispatch(createAccount(submitData)).unwrap();
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
      await dispatch(deleteAccount(selectedItem.account_id)).unwrap();
      setIsDeleteOpen(false);
    } catch (err) {
      // Error handled by slice
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Reset building when campus changes
    if (name === 'campus_id') {
      setFormData((prev) => ({ ...prev, building_id: '' }));
    }
  };

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

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={accounts.data}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentPage={accounts.pagination.page}
          totalPages={accounts.pagination.totalPages}
          totalItems={accounts.pagination.total}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Akun' : 'Tambah Akun'}
        onSubmit={handleSubmit}
        loading={formLoading}
        size="lg"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Nama Akun"
            name="account_name"
            value={formData.account_name}
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
            name="account_type"
            type="select"
            value={formData.account_type}
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
            options={campusOptions}
            required
          />
          <FormInput
            label="Gedung"
            name="building_id"
            type="select"
            value={formData.building_id}
            onChange={handleInputChange}
            options={buildingOptions}
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
            name="is_active"
            type="select"
            value={formData.is_active?.toString()}
            onChange={(e) => setFormData((prev) => ({ ...prev, is_active: parseInt(e.target.value) }))}
            options={[
              { value: '1', label: 'Aktif' },
              { value: '0', label: 'Nonaktif' },
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
        message={`Apakah Anda yakin ingin menghapus "${selectedItem?.account_name}"? Data billing terkait akan tetap tersimpan.`}
        confirmText="Ya, Hapus"
        type="danger"
        loading={loading}
      />
    </MainLayout>
  );
};

export default Accounts;

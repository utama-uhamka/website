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
  ThumbnailWithFallback,
} from '../../components/ui';
import { FiPackage, FiImage, FiLoader } from 'react-icons/fi';
import {
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
  clearDataError,
  clearDataSuccess,
} from '../../store/dataSlice';
import { fetchCategoryItems, fetchRooms } from '../../store/masterSlice';

const Items = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.data);
  const { categoryItems, rooms } = useSelector((state) => state.master);

  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    item_name: '',
    item_code: '',
    category_item_id: '',
    room_id: '',
    item_quantity: '',
    item_condition: '',
    purchase_date: '',
    purchase_price: '',
    item_description: '',
    is_active: 1,
  });

  const itemsPerPage = 10;

  const conditions = [
    { value: 'Rusak', label: 'Rusak' },
    { value: 'Menunggu Diperbaiki', label: 'Menunggu Diperbaiki' },
    { value: 'Diperbaiki', label: 'Diperbaiki' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Baik', label: 'Baik' },
  ];

  // Load items
  const loadItems = useCallback(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchValue,
      ...filterValues,
    };
    dispatch(fetchItems(params));
  }, [dispatch, currentPage, itemsPerPage, searchValue, filterValues]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Load master data for dropdowns
  useEffect(() => {
    dispatch(fetchCategoryItems({ limit: 100 }));
    dispatch(fetchRooms({ limit: 100 }));
  }, [dispatch]);

  // Handle success/error messages
  useEffect(() => {
    if (items.error) {
      toast.error(items.error);
      dispatch(clearDataError());
    }
  }, [items.error, dispatch]);

  useEffect(() => {
    if (items.success) {
      toast.success(items.success);
      dispatch(clearDataSuccess());
      loadItems();
    }
  }, [items.success, dispatch, loadItems]);

  // Reset page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, filterValues]);

  // Convert master data to options
  const categoryOptions = categoryItems.data.map((c) => ({
    value: c.category_item_id?.toString(),
    label: c.category_item_name,
  }));

  const roomOptions = rooms.data.map((r) => ({
    value: r.room_id?.toString(),
    label: `${r.room_name} - ${r.floor?.floor_name || ''}`,
  }));

  const columns = [
    {
      key: 'item_name',
      label: 'Item',
      render: (value, item) => (
        <div className="flex items-center gap-3">
          <ThumbnailWithFallback src={item.photo_1} alt={value} width={48} height={48} />
          <div>
            <p className="font-medium text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">{item.item_code}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Kategori',
      width: '120px',
      render: (value, item) => item.category_item?.category_item_name || '-',
    },
    {
      key: 'room',
      label: 'Lokasi',
      width: '150px',
      render: (value, item) => item.room?.room_name || '-',
    },
    { key: 'item_quantity', label: 'Qty', width: '60px' },
    {
      key: 'item_condition',
      label: 'Kondisi',
      width: '100px',
      render: (value) => {
        const conditionColors = {
          Rusak: 'bg-red-100 text-red-700',
          'Menunggu Diperbaiki': 'bg-yellow-100 text-yellow-700',
          Diperbaiki: 'bg-green-100 text-green-700',
          Maintenance: 'bg-blue-100 text-blue-700',
          Baik: 'bg-emerald-100 text-emerald-700',
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${conditionColors[value] || 'bg-gray-100 text-gray-700'}`}>
            {value || '-'}
          </span>
        );
      },
    },
    {
      key: 'purchase_price',
      label: 'Harga',
      width: '120px',
      render: (value) => value ? `Rp ${parseInt(value).toLocaleString('id-ID')}` : '-',
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
      key: 'category_item_id',
      label: 'Kategori',
      options: categoryOptions,
    },
    {
      key: 'item_condition',
      label: 'Kondisi',
      options: conditions,
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
      item_name: '',
      item_code: '',
      category_item_id: '',
      room_id: '',
      item_quantity: '',
      item_condition: '',
      purchase_date: '',
      purchase_price: '',
      item_description: '',
      is_active: 1,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      item_name: item.item_name || '',
      item_code: item.item_code || '',
      category_item_id: item.category_item_id?.toString() || '',
      room_id: item.room_id?.toString() || '',
      item_quantity: item.item_quantity?.toString() || '',
      item_condition: item.item_condition || '',
      purchase_date: item.purchase_date ? item.purchase_date.split('T')[0] : '',
      purchase_price: item.purchase_price?.toString() || '',
      item_description: item.item_description || '',
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
        ...formData,
        category_item_id: formData.category_item_id ? parseInt(formData.category_item_id) : null,
        room_id: formData.room_id ? parseInt(formData.room_id) : null,
        item_quantity: formData.item_quantity ? parseInt(formData.item_quantity) : 0,
        purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
      };

      if (selectedItem) {
        await dispatch(updateItem({ id: selectedItem.item_id, data: submitData })).unwrap();
      } else {
        await dispatch(createItem(submitData)).unwrap();
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
      await dispatch(deleteItem(selectedItem.item_id)).unwrap();
      setIsDeleteOpen(false);
    } catch (err) {
      // Error handled by slice
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <MainLayout>
      <PageHeader
        title="Inventaris Item"
        subtitle="Kelola data barang inventaris"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Inventaris', path: null },
          { label: 'Items' },
        ]}
      />

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari nama atau kode item..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onAdd={handleAdd}
        addLabel="Tambah Item"
        showExport={true}
        onExport={() => console.log('Export items')}
      />

      {items.loading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={items.data}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentPage={items.pagination.page}
          totalPages={items.pagination.totalPages}
          totalItems={items.pagination.total}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Item' : 'Tambah Item'}
        onSubmit={handleSubmit}
        size="lg"
        loading={formLoading}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Kode Item"
            name="item_code"
            value={formData.item_code}
            onChange={handleInputChange}
            placeholder="Contoh: ELK-001"
            required
          />
          <FormInput
            label="Nama Item"
            name="item_name"
            value={formData.item_name}
            onChange={handleInputChange}
            placeholder="Masukkan nama item"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Kategori"
            name="category_item_id"
            type="select"
            value={formData.category_item_id}
            onChange={handleInputChange}
            options={categoryOptions}
            required
          />
          <FormInput
            label="Lokasi"
            name="room_id"
            type="select"
            value={formData.room_id}
            onChange={handleInputChange}
            options={roomOptions}
            required
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormInput
            label="Jumlah"
            name="item_quantity"
            type="number"
            value={formData.item_quantity}
            onChange={handleInputChange}
            placeholder="0"
            required
          />
          <FormInput
            label="Kondisi"
            name="item_condition"
            type="select"
            value={formData.item_condition}
            onChange={handleInputChange}
            options={conditions}
            required
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
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Tanggal Pembelian"
            name="purchase_date"
            type="date"
            value={formData.purchase_date}
            onChange={handleInputChange}
          />
          <FormInput
            label="Harga Pembelian"
            name="purchase_price"
            type="number"
            value={formData.purchase_price}
            onChange={handleInputChange}
            placeholder="0"
          />
        </div>
        <FormInput
          label="Deskripsi"
          name="item_description"
          type="textarea"
          value={formData.item_description}
          onChange={handleInputChange}
          placeholder="Deskripsi item"
        />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Foto Item
          </label>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <FiImage className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-sm text-gray-500">Klik untuk upload foto</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Item"
        message={`Apakah Anda yakin ingin menghapus "${selectedItem?.item_name}"?`}
        confirmText="Ya, Hapus"
        type="danger"
        loading={items.loading}
      />
    </MainLayout>
  );
};

export default Items;

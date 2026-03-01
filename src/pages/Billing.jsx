import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import {
  DataTable,
  Modal,
  SearchFilter,
  StatusBadge,
  PageHeader,
} from '../components/ui';
import { FiFileText, FiDownload, FiLoader } from 'react-icons/fi';
import { fetchBillings, clearDataError } from '../store/dataSlice';
import { fetchCampuses } from '../store/campusesSlice';

const Billing = () => {
  const dispatch = useDispatch();
  const { billings } = useSelector((state) => state.data);
  const { data: campuses } = useSelector((state) => state.campuses);

  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const itemsPerPage = 10;

  // Load billings
  const loadBillings = useCallback(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchValue,
      ...filterValues,
    };
    dispatch(fetchBillings(params));
  }, [dispatch, currentPage, itemsPerPage, searchValue, filterValues]);

  useEffect(() => {
    loadBillings();
  }, [loadBillings]);

  // Load campuses for filter
  useEffect(() => {
    dispatch(fetchCampuses({ limit: 100 }));
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (billings.error) {
      toast.error(billings.error);
      dispatch(clearDataError());
    }
  }, [billings.error, dispatch]);

  // Reset page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, filterValues]);

  // Campus options for filter
  const campusOptions = campuses.map((c) => ({
    value: c.campus_id?.toString(),
    label: c.campus_name,
  }));

  const columns = [
    {
      key: 'account',
      label: 'Akun',
      render: (value, item) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            item.billing_type === 'pln' ? 'bg-yellow-100' : 'bg-blue-100'
          }`}>
            <FiFileText className={`${
              item.billing_type === 'pln' ? 'text-yellow-600' : 'text-blue-600'
            }`} size={18} />
          </div>
          <div>
            <p className="font-medium text-gray-800">{item.account?.account_name || '-'}</p>
            <p className="text-xs text-gray-500">{item.campus?.campus_name || '-'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'period',
      label: 'Periode',
      width: '130px',
      render: (value, item) => {
        const date = item.date ? new Date(item.date) : null;
        return date ? date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : '-';
      },
    },
    {
      key: 'usage',
      label: 'Pemakaian',
      width: '120px',
      render: (value, item) => {
        if (!item.meter_end || !item.meter_start) return '-';
        const usage = item.meter_end - item.meter_start;
        const unit = item.billing_type === 'pln' ? 'kWh' : item.billing_type === 'pdam' ? 'm³' : '';
        return `${usage.toLocaleString('id-ID')} ${unit}`;
      },
    },
    {
      key: 'total_billing',
      label: 'Tagihan',
      width: '140px',
      render: (value) => (
        <span className="font-semibold text-gray-800">
          Rp {value ? parseInt(value).toLocaleString('id-ID') : '0'}
        </span>
      ),
    },
    {
      key: 'due_date',
      label: 'Jatuh Tempo',
      width: '120px',
      render: (value) => {
        if (!value) return '-';
        const date = new Date(value);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      },
    },
    {
      key: 'status',
      label: 'Status',
      width: '100px',
      render: (value) => <StatusBadge status={value === 1 ? 'paid' : 'unpaid'} />,
    },
  ];

  const filters = [
    {
      key: 'campus_id',
      label: 'Unit',
      options: campusOptions,
    },
    {
      key: 'billing_type',
      label: 'Tipe',
      options: [
        { value: 'pln', label: 'PLN' },
        { value: 'pdam', label: 'PDAM' },
      ],
    },
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: '1', label: 'Lunas' },
        { value: '0', label: 'Belum Bayar' },
      ],
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  // Calculate summary
  const totalUnpaid = billings.data
    .filter((d) => d.status === 0)
    .reduce((sum, d) => sum + (parseFloat(d.total_billing) || 0), 0);
  const totalPaid = billings.data
    .filter((d) => d.status === 1)
    .reduce((sum, d) => sum + (parseFloat(d.total_billing) || 0), 0);

  return (
    <MainLayout>
      <PageHeader
        title="Billing"
        subtitle="Lihat tagihan PLN dan PDAM"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Billing' },
        ]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Tagihan</p>
          <p className="text-2xl font-bold text-gray-800">
            Rp {(totalPaid + totalUnpaid).toLocaleString('id-ID')}
          </p>
        </div>
        <div className="bg-green-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-green-600 mb-1">Sudah Dibayar</p>
          <p className="text-2xl font-bold text-green-700">Rp {totalPaid.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-red-600 mb-1">Belum Dibayar</p>
          <p className="text-2xl font-bold text-red-700">Rp {totalUnpaid.toLocaleString('id-ID')}</p>
        </div>
      </div>

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari akun atau periode..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        showExport={true}
        onExport={() => console.log('Export billing')}
      />

      {billings.loading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={billings.data}
          onView={handleView}
          actionColumn={{ edit: false, delete: false, view: true }}
          currentPage={billings.pagination.page}
          totalPages={billings.pagination.totalPages}
          totalItems={billings.pagination.total}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* View Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Detail Tagihan"
        showFooter={false}
        size="md"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                selectedItem.billing_type === 'pln' ? 'bg-yellow-100' : 'bg-blue-100'
              }`}>
                <FiFileText className={`${
                  selectedItem.billing_type === 'pln' ? 'text-yellow-600' : 'text-blue-600'
                }`} size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{selectedItem.account?.account_name || '-'}</h3>
                <p className="text-sm text-gray-500">{selectedItem.campus?.campus_name || '-'}</p>
              </div>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Periode</span>
              <span className="font-medium">
                {selectedItem.date
                  ? new Date(selectedItem.date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
                  : '-'}
              </span>
            </div>
            {selectedItem.meter_start && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Meter Awal</span>
                <span className="font-medium">{parseInt(selectedItem.meter_start).toLocaleString('id-ID')}</span>
              </div>
            )}
            {selectedItem.meter_end && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Meter Akhir</span>
                <span className="font-medium">{parseInt(selectedItem.meter_end).toLocaleString('id-ID')}</span>
              </div>
            )}
            {selectedItem.meter_start && selectedItem.meter_end && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Pemakaian</span>
                <span className="font-medium">
                  {(selectedItem.meter_end - selectedItem.meter_start).toLocaleString('id-ID')}{' '}
                  {selectedItem.billing_type === 'pln' ? 'kWh' : 'm³'}
                </span>
              </div>
            )}
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Jumlah Tagihan</span>
              <span className="font-bold text-lg">
                Rp {parseInt(selectedItem.total_billing || 0).toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Jatuh Tempo</span>
              <span className="font-medium">
                {selectedItem.due_date
                  ? new Date(selectedItem.due_date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : '-'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Tanggal Bayar</span>
              <span className="font-medium">
                {selectedItem.payment_date
                  ? new Date(selectedItem.payment_date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : '-'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Status</span>
              <StatusBadge status={selectedItem.status === 1 ? 'paid' : 'unpaid'} />
            </div>
            <div className="pt-4 flex justify-end gap-3">
              <button
                onClick={() => console.log('Download invoice')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <FiDownload size={16} />
                Download
              </button>
            </div>
          </div>
        )}
      </Modal>
    </MainLayout>
  );
};

export default Billing;

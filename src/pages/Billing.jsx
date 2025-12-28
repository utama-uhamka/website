import { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import {
  DataTable,
  Modal,
  SearchFilter,
  StatusBadge,
  PageHeader,
} from '../components/ui';
import { FiFileText, FiDownload, FiCalendar } from 'react-icons/fi';

const Billing = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Dummy data
  const accounts = [
    { value: '1', label: 'PLN Gedung Rektorat' },
    { value: '2', label: 'PDAM Gedung Rektorat' },
    { value: '3', label: 'PLN Gedung FKIP' },
    { value: '4', label: 'Internet Kampus A' },
  ];

  const campuses = [
    { value: '1', label: 'Kampus A - Limau' },
    { value: '2', label: 'Kampus B - Ciracas' },
  ];

  const data = [
    { id: 1, account: 'PLN Gedung Rektorat', account_id: '1', campus: 'Kampus A - Limau', campus_id: '1', type: 'pln', period: 'Desember 2024', meter_start: 45230, meter_end: 47850, usage: 2620, amount: 3540000, due_date: '2025-01-10', payment_date: '2025-01-05', status: 'paid' },
    { id: 2, account: 'PDAM Gedung Rektorat', account_id: '2', campus: 'Kampus A - Limau', campus_id: '1', type: 'pdam', period: 'Desember 2024', meter_start: 1250, meter_end: 1380, usage: 130, amount: 520000, due_date: '2025-01-15', payment_date: null, status: 'unpaid' },
    { id: 3, account: 'PLN Gedung FKIP', account_id: '3', campus: 'Kampus B - Ciracas', campus_id: '2', type: 'pln', period: 'Desember 2024', meter_start: 32100, meter_end: 34500, usage: 2400, amount: 3240000, due_date: '2025-01-10', payment_date: '2025-01-08', status: 'paid' },
    { id: 4, account: 'Internet Kampus A', account_id: '4', campus: 'Kampus A - Limau', campus_id: '1', type: 'internet', period: 'Desember 2024', meter_start: null, meter_end: null, usage: null, amount: 5000000, due_date: '2025-01-05', payment_date: '2025-01-03', status: 'paid' },
    { id: 5, account: 'PLN Gedung Rektorat', account_id: '1', campus: 'Kampus A - Limau', campus_id: '1', type: 'pln', period: 'November 2024', meter_start: 42600, meter_end: 45230, usage: 2630, amount: 3553500, due_date: '2024-12-10', payment_date: '2024-12-08', status: 'paid' },
    { id: 6, account: 'PDAM Gedung Rektorat', account_id: '2', campus: 'Kampus A - Limau', campus_id: '1', type: 'pdam', period: 'November 2024', meter_start: 1120, meter_end: 1250, usage: 130, amount: 520000, due_date: '2024-12-15', payment_date: '2024-12-12', status: 'paid' },
  ];

  const columns = [
    {
      key: 'account',
      label: 'Akun',
      render: (value, item) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            item.type === 'pln' ? 'bg-yellow-100' :
            item.type === 'pdam' ? 'bg-blue-100' :
            'bg-purple-100'
          }`}>
            <FiFileText className={`${
              item.type === 'pln' ? 'text-yellow-600' :
              item.type === 'pdam' ? 'text-blue-600' :
              'text-purple-600'
            }`} size={18} />
          </div>
          <div>
            <p className="font-medium text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">{item.campus}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'period',
      label: 'Periode',
      width: '130px',
    },
    {
      key: 'usage',
      label: 'Pemakaian',
      width: '120px',
      render: (value, item) => {
        if (!value) return '-';
        const unit = item.type === 'pln' ? 'kWh' : item.type === 'pdam' ? 'm³' : '';
        return `${value.toLocaleString('id-ID')} ${unit}`;
      },
    },
    {
      key: 'amount',
      label: 'Tagihan',
      width: '140px',
      render: (value) => (
        <span className="font-semibold text-gray-800">Rp {value.toLocaleString('id-ID')}</span>
      ),
    },
    {
      key: 'due_date',
      label: 'Jatuh Tempo',
      width: '120px',
      render: (value) => {
        const date = new Date(value);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      },
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
      key: 'campus_id',
      label: 'Kampus',
      options: campuses,
    },
    {
      key: 'type',
      label: 'Tipe',
      options: [
        { value: 'pln', label: 'PLN' },
        { value: 'pdam', label: 'PDAM' },
        { value: 'internet', label: 'Internet' },
      ],
    },
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'paid', label: 'Lunas' },
        { value: 'unpaid', label: 'Belum Bayar' },
        { value: 'partial', label: 'Sebagian' },
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

  // Filter data
  const filteredData = data.filter((item) => {
    const matchSearch =
      item.account.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.period.toLowerCase().includes(searchValue.toLowerCase());
    const matchCampus = !filterValues.campus_id || item.campus_id === filterValues.campus_id;
    const matchType = !filterValues.type || item.type === filterValues.type;
    const matchStatus = !filterValues.status || item.status === filterValues.status;
    return matchSearch && matchCampus && matchType && matchStatus;
  });

  // Summary stats
  const totalUnpaid = data.filter(d => d.status === 'unpaid').reduce((sum, d) => sum + d.amount, 0);
  const totalPaid = data.filter(d => d.status === 'paid').reduce((sum, d) => sum + d.amount, 0);

  return (
    <MainLayout>
      <PageHeader
        title="Billing"
        subtitle="Lihat tagihan PLN, PDAM, dan utilitas lainnya"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Billing' },
        ]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Tagihan</p>
          <p className="text-2xl font-bold text-gray-800">Rp {(totalPaid + totalUnpaid).toLocaleString('id-ID')}</p>
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

      <DataTable
        columns={columns}
        data={filteredData}
        onView={handleView}
        actionColumn={{ edit: false, delete: false, view: true }}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredData.length / 10)}
        onPageChange={setCurrentPage}
      />

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
                selectedItem.type === 'pln' ? 'bg-yellow-100' :
                selectedItem.type === 'pdam' ? 'bg-blue-100' :
                'bg-purple-100'
              }`}>
                <FiFileText className={`${
                  selectedItem.type === 'pln' ? 'text-yellow-600' :
                  selectedItem.type === 'pdam' ? 'text-blue-600' :
                  'text-purple-600'
                }`} size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{selectedItem.account}</h3>
                <p className="text-sm text-gray-500">{selectedItem.campus}</p>
              </div>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Periode</span>
              <span className="font-medium">{selectedItem.period}</span>
            </div>
            {selectedItem.meter_start && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Meter Awal</span>
                <span className="font-medium">{selectedItem.meter_start.toLocaleString('id-ID')}</span>
              </div>
            )}
            {selectedItem.meter_end && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Meter Akhir</span>
                <span className="font-medium">{selectedItem.meter_end.toLocaleString('id-ID')}</span>
              </div>
            )}
            {selectedItem.usage && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Pemakaian</span>
                <span className="font-medium">{selectedItem.usage.toLocaleString('id-ID')} {selectedItem.type === 'pln' ? 'kWh' : 'm³'}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Jumlah Tagihan</span>
              <span className="font-bold text-lg">Rp {selectedItem.amount.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Jatuh Tempo</span>
              <span className="font-medium">{new Date(selectedItem.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Tanggal Bayar</span>
              <span className="font-medium">{selectedItem.payment_date ? new Date(selectedItem.payment_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Status</span>
              <StatusBadge status={selectedItem.status} />
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
